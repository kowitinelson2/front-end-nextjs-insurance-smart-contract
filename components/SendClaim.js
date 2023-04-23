import { abi, contractAddresses } from "../constants/index.cjs"
import { useState, useEffect } from "react"
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"
export default function SendClaim() {
    const [_insured, setInsuredAddress] = useState("")
    const [claimId, setClaimId] = useState(null)
    const dispatch = useNotification()

    const { config } = usePrepareContractWrite({
        address: contractAddresses["31337"][0],
        abi: abi,
        functionName: "sendClaim",
        args: [_insured, claimId],
    })
    const { data: submitClaimData, write } = useContractWrite(config)
    const {
        data: useWaitForTransactionData,
        error,
        isSuccess: isSubmitted,
    } = useWaitForTransaction({
        hash: submitClaimData?.hash,
    })

    useEffect(() => {
        if (isSubmitted) {
            handleNewNotification()
            console.log("submitClaimTransactionData :", useWaitForTransactionData)
        }
    }, [useWaitForTransactionData])

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
        <div className="max-w-md mx-auto py-4">
            <h1 className="text-2xl font-bold mb-4">Send Claim</h1>
            <form
                className="flex flex-col space-y-4"
                onSubmit={(e) => {
                    e.preventDefault()
                    write?.()
                }}
            >
                <label span className="block mb-1 font-medium">
                    Insured Address:
                    <input
                        className="block w-full border-gray-400 border-2 p-2 rounded-md focus:outline-none focus:border-blue-500"
                        type="text"
                        value={_insured}
                        onChange={(e) => setInsuredAddress(e.target.value)}
                    />
                </label>

                <label>
                    <span className="block mb-1 font-medium">Claim Id:</span>

                    <input
                        className="block w-full border-gray-400 border-2 p-2 rounded-md focus:outline-none focus:border-blue-500"
                        type="text"
                        value={claimId}
                        onChange={(e) => setClaimId(e.target.value)}
                    />
                </label>

                <button
                    className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
                    disabled={!write}
                    type="submit"
                >
                    Send Claim
                </button>
            </form>
            {error && (
                <div className="text-red-500">
                    An error occurred preparing the transaction: {error.message}
                </div>
            )}
        </div>
    )
}
