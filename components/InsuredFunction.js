import { abi, contractAddresses } from "../constants/index.cjs"
import { useState, useEffect } from "react"
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function InsuredFunction() {
    const [_insured, setInsured] = useState("")
    const [amount, setAmount] = useState(0)
    const dispatch = useNotification()

    const { config } = usePrepareContractWrite({
        address: contractAddresses["31337"][0],
        abi: abi,
        functionName: "makePayment",
        args: [_insured, { value: ethers.utils.parseEther(amount.toString()) }],
        enabled: true,
    })

    const { data: useContractWriteData, write, isError } = useContractWrite(config)

    const {
        data: useWaitForTransactionData,
        error,
        isSuccess: isSubmitted,
    } = useWaitForTransaction({
        hash: useContractWriteData?.hash,
    })
    useEffect(() => {
        if (isSubmitted) {
            handleNewNotification()
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
        <div className="w-full max-w-sm mx-auto">
            <form
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={(e) => {
                    e.preventDefault()
                    write?.()
                }}
            >
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="insured">
                        Policy Holder Address
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="Policy Holder Address"
                        value={_insured}
                        onChange={(e) => setInsured(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="amount">
                        Payment Amount
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="Payment Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        disabled={!write}
                    >
                        Submit
                    </button>
                </div>
            </form>
            {error && (
                <div className="text-red-500 text-xs italic">{`An error occurred preparing the transaction: ${error.message}`}</div>
            )}
        </div>
    )
}
