import { abi, contractAddresses } from "../constants/index.cjs"
import { useState, useEffect } from "react"
import {
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction,
    useContractEvent,
    useTransaction,
    useContractRead,
} from "wagmi"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"
import useEtherInput from "@/WeiToEther.js"
export default function SubmitClaim() {
    const [_insured, setInsuredAddress] = useState("")
    // const [_claimAmount, setClaimAmount] = useState(0)
    const [claimId, setClaimId] = useState(0)
    const dispatch = useNotification()
    const [claim, setClaim] = useState(0)
    const [_claimAmountinWei, handleClaimChange, convertToEther] = useEtherInput()
    const _claimAmount = convertToEther()

    const { config } = usePrepareContractWrite({
        address: contractAddresses["31337"][0],
        abi: abi,
        functionName: "submitClaim",
        args: [_insured, _claimAmount],
    })
    const { data: submitClaimData, write } = useContractWrite(config)
    const {
        data: useWaitForTransactionData,
        error,
        isSuccess: isSubmitted,
    } = useWaitForTransaction({
        hash: submitClaimData?.hash,
    })

    // const handleSubmit = () => {
    //     const result = submitClaimData
    //     setClaimId(result)
    //     console.log("submitClaimTransactionData :", useWaitForTransactionData)
    // }

    // const handleSubmit = () => {
    //     const result = eventData
    //     setClaimId(result)
    //     console.log("submitClaimTransactionData :", useWaitForTransactionData)
    // }
    useContractEvent({
        address: contractAddresses["31337"][0],
        abi: abi,
        eventName: "ClaimSubmitted",
        listener(claimId, _insured, _claimAmount) {
            const response = claimId
            console.log(response)
            return <div>Claim id: {response}</div>
        },
    })

    const { data } = useTransaction({
        hash: "0x6864ee58fdf1fb2fe4062a1523ed3a4cf96c6c426783ff681fb47c2e58f4c0d4",
    })
    const { data: claimNo } = useContractRead({
        address: contractAddresses["31337"][0],
        abi: abi,
        functionName: "nextClaimId",
    })

    useEffect(() => {
        if (isSubmitted) {
            handleNewNotification()
            const result = data
            setClaimId(result)
            const response = claimNo
            setClaim(response)
        }
    }, [isSubmitted])

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Submit Claim</h1>
            <form
                className="flex flex-col space-y-4"
                onSubmit={(e) => {
                    e.preventDefault()
                    write?.()
                }}
            >
                <div className="flex flex-col">
                    <label className="text-lg font-semibold mb-2" htmlFor="_insured">
                        Insured Address
                    </label>
                    <input
                        className="border border-gray-300 px-4 py-2 rounded-lg"
                        type="text"
                        id="_insured"
                        value={_insured}
                        onChange={(e) => setInsuredAddress(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold mb-2" htmlFor="_claimAmount">
                        Claim Amount
                    </label>
                    <input
                        className="border border-gray-300 px-4 py-2 rounded-lg"
                        type="text"
                        id="_claimAmount"
                        value={_claimAmountinWei}
                        // onChange={(e) => setClaimAmount(e.target.value)}
                        onChange={handleClaimChange}
                    />
                </div>
                <button
                    disabled={!write}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg disabled:bg-gray-400"
                    type="submit"
                >
                    Submit Claim
                </button>
            </form>
            {claimId && (
                <pre className="mt-4 p-4 bg-gray-100 rounded-lg">
                    Claim submitted with Transaction Hash: {JSON.stringify(claimId)}
                </pre>
            )}
            <div>
                <p>Claim Id: {claim - 1}</p>
            </div>
            {error && (
                <div className="mt-4 text-red-600">
                    An error occurred preparing the transaction: {error.message}
                </div>
            )}
        </div>
    )
}
