import Head from "next/head"
//import Image from "next/image"

//import styles from "@/styles/Home.module.css"

//import Header from "../components/Header"
import ManualHeader from "@/components/ManualHeader"
import CreatePolicy from "@/components/CreatePolicy"
import BalancePolicy from "@/components/BalancePolicy"
import SendClaim from "@/components/SendClaim"

export default function Home() {
    return (
        <div>
            <Head>
                <title>Insurance Smart Contract</title>
                <meta name="description" content="Our Insurance SMart Contract" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ManualHeader></ManualHeader>
            <CreatePolicy></CreatePolicy>
            <BalancePolicy></BalancePolicy>
            <SendClaim></SendClaim>
            Hello!
        </div>
    )
}
