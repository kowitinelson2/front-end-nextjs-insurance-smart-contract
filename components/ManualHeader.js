import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function ManualHeader() {
    return (
        <div className="bg-gray-100 px-8 py-12">
            <h1 className="text-4xl font-bold mb-8">INSURANCE SMART CONTRACT</h1>
            <div className="flex justify-center">
                <ConnectButton />
            </div>
        </div>
    )
}
