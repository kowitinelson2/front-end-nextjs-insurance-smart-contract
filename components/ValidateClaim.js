import { abi, contractAddresses } from "../constants/index.cjs"
import { useState, useEffect } from "react"
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
export default function ValidateClaim() {
    const [_insured, setInsuredAddress] = useState("")
    const [claimId, setClaimId] = useState(null)

    const { config } = usePrepareContractWrite({
        address: contractAddresses["31337"][0],
        abi: abi,
        functionName: "validateClaim",
        args: [_insured, claimId],
        enanled: true,
    })
    const { data: submitClaimData, write } = useContractWrite(config)
    const {
        data: useWaitForTransactionData,
        error,
        isSuccess: isSubmitted,
    } = useWaitForTransaction({
        hash: submitClaimData?.hash,
    })
    const dispatch = useNotification()

    // const handleSubmit = () => {
    //     const result = submitClaimData
    //     setClaimId(result)
    // }
    useEffect(() => {
        if (isSubmitted) {
            handleNewNotification()
        }
        console.log("submitClaimTransactionData :", useWaitForTransactionData)
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
        <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-semibold mb-4">Validate Claim</h1>
            <form
                className="flex flex-col"
                onSubmit={(e) => {
                    e.preventDefault()
                    write?.()
                }}
            >
                <div className="mb-4">
                    <label className="block font-medium mb-2" htmlFor="insured-address">
                        Insured Address
                    </label>
                    <input
                        className="border border-gray-400 p-2 rounded w-full"
                        id="insured-address"
                        type="text"
                        value={_insured}
                        onChange={(e) => setInsuredAddress(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-medium mb-2" htmlFor="claim-id">
                        Claim Id
                    </label>
                    <input
                        className="border border-gray-400 p-2 rounded w-full"
                        id="claim-id"
                        type="text"
                        value={claimId}
                        onChange={(e) => setClaimId(e.target.value)}
                    />
                </div>
                <button
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
                    disabled={!write}
                    type="submit"
                >
                    Validate Claim
                </button>
            </form>
            {error && (
                <div className="text-red-500 mt-4">
                    An error occurred preparing the transaction: {error.message}
                </div>
            )}
        </div>
    )
}
