import "@/styles/globals.css"
//import { MoralisProvider } from "react-moralis"
//import { MoralisProvider } from "react-moralis"
import "../styles/globals.css"
import "@rainbow-me/rainbowkit/styles.css"
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { configureChains, createClient, WagmiConfig } from "wagmi"
import { sepolia, hardhat } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"
import { alchemyProvider } from "wagmi/providers/alchemy"
import dynamic from "next/dynamic"
import { NotificationProvider } from "web3uikit"

const { chains, provider } = configureChains(
    [sepolia, hardhat],
    [
        alchemyProvider({
            apiKey: "https://eth-sepolia.g.alchemy.com/v2/09QbXJCq0URGyGF9-AIoPUv7mExKcP5H",
        }),
        publicProvider(),
    ]
)

const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
})

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
})

function App({ Component, pageProps }) {
    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
                <NotificationProvider>
                    <Component {...pageProps} />
                </NotificationProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    )
}
export default dynamic(() => Promise.resolve(App), { ssr: false })
