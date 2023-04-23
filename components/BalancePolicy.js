import { abi, contractAddresses } from "../constants/index.cjs"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import {
    usePrepareContractWrite,
    useBalance,
    useWaitForTransaction,
    useContractRead,
    useContractWrite,
} from "wagmi"
import { useNotification } from "web3uikit"
export default function BalancePolicy() {
    const [_insured, setPolicyholderAddress] = useState("")
    const [policyInfo, setPolicyInfo] = useState({
        policyId: 0,
        premium: 0,
        maxClaimAmount: 0,
        totalClaimAmount: 0,
        expiryDate: 0,
        isActive: false,
        lastPaymentDate: 0,
        missedPayments: 0,
    })
    //const [contractBalance, setContractBalance] = useState(0)
    const [_validator, setValidatorAddress] = useState("")
    // const [signedValidator, setSignedValidator] = useState(false)
    const dispatch = useNotification()

    const { data, isError, isLoading } = useBalance({
        address: contractAddresses["31337"][0],
        formatUnits: "ether",
    })
    const { data: getPolicy } = useContractRead({
        address: contractAddresses["31337"][0],
        abi: abi,
        overrides: {
            from: "0x018f81ab40CFA5a22713E57F5474a04cC5bF344c",
        },
        functionName: "policies",
        args: [_insured],
    })
    const handleAddressChange = (e) => {
        setPolicyholderAddress(e.target.value)
    }

    //const [getPolicy, getBalance] = useContractReads(abi, contractAddresses["11155111"][0])

    const handleGetPolicy = async (e) => {
        e.preventDefault()
        const policy = getPolicy.toString()
        setPolicyInfo(policy)
    }

    const { data: isValidator } = useContractRead({
        address: contractAddresses["31337"][0],
        abi: abi,
        functionName: "validators",
        args: [_validator],
    })

    const { config } = usePrepareContractWrite({
        address: contractAddresses["31337"][0],
        abi: abi,
        functionName: "addValidator",
        args: [_validator],
    })

    const { data: useContractWriteData, write } = useContractWrite(config)

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

            console.log("__________________________")

            console.log("useWaitForTransactionData:", useWaitForTransactionData)
            console.log("__________________________")
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
        <div className="p-6 space-y-6">
            <label htmlFor="policyholder-address" className="block font-medium text-gray-700">
                Policyholder Address:
            </label>
            <input
                type="text"
                id="policyholder-address"
                value={_insured}
                onChange={handleAddressChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-400 rounded-md"
            />

            <button
                className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleGetPolicy}
            >
                Get Policy
            </button>

            {/* <button onClick={handleGetBalance}>Get Balance</button> */}
            <div>
                <h2 className="text-lg font-medium leading-6 text-gray-900">Policy Info:</h2>
                <pre className="mt-2 text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(policyInfo, null, 2)}
                </pre>
                {/* <p>{policyInfo}</p> */}
            </div>
            <div className="flex">
                <label htmlFor="validator-address" className="block font-medium text-gray-700">
                    Enter New Validator:
                </label>
                <div className="relative rounded-md shadow-sm">
                    <input
                        onChange={(e) => setValidatorAddress(e.target.value)}
                        type="text"
                        id="validator-address"
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md pl-10"
                        placeholder="0x..."
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
                                clipRule="evenodd"
                            />
                            <path
                                fillRule="evenodd"
                                d="M10 11a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z"
                                clipRule="evenodd"
                            />
                            <circle cx="10" cy="6" r="1" />
                        </svg>
                    </div>
                </div>
                <button
                    className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={!write}
                    onClick={(e) => {
                        e.preventDefault()
                        write?.()
                    }}
                >
                    Add Validator{" "}
                </button>
                {error && (
                    <div className="ml-2 text-red-600">
                        An error occurred preparing the transaction: {error.message}
                    </div>
                )}
                {isSubmitted && <div>{isValidator}</div>}
            </div>
            <div className="p-4 m-4">
                <h2 className="text-2xl font-bold text-gray-600">Contract Balance:</h2>
                <p className="text-lg text-gray-600">
                    {data?.formatted} {data?.symbol}
                </p>
            </div>
        </div>
    )
}
