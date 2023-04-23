import { abi, contractAddresses } from "../constants/index.cjs"
import { useEffect, useState } from "react"
import useInput from "../UseInput.js"
import { useNotification } from "web3uikit"
import useEtherInput from "@/WeiToEther.js"
import {
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi"
import { ethers } from "ethers"

export default function CreatePolicy() {
    const [_insured, setInsured] = useState("")
    // const [premium, setPremium] = useState(0)
    // const [maxClaimAmount, setMaxClaimAmount] = useState(0)
    const [premiumInWei, handlePremiumChange, convertToEther] = useEtherInput()
    const [maxClaimAmountInWei, handleMaxClaimAmountChange, convertMeEther] = useEtherInput()

    const premium = convertToEther()
    const maxClaimAmount = convertMeEther()

    // const [expiryDate, setExpiryDate] = useState(0)
    const { expiryDate, handleInputChange, convertToUnixEpoch } = useInput()
    const expirationDateUnixEpoch = convertToUnixEpoch()
    const dispatch = useNotification()

    //const contractOwner = "0x018f81ab40CFA5a22713E57F5474a04cC5bF344c"

    const { config } = usePrepareContractWrite({
        address: contractAddresses["31337"][0],
        abi: abi,
        functionName: "createPolicy",
        args: [_insured, premium, maxClaimAmount, expirationDateUnixEpoch],

        // overrides: {
        //     from: "0x018f81ab40CFA5a22713E57F5474a04cC5bF344c",
        // },
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

            console.log("useContractWriteData:", useContractWriteData)
            console.log("useWaitForTransactionData:", useWaitForTransactionData)

            console.log(contractAddresses["31337"][0])
            // console.log("Policy ID:", useContractWriteData?.events[0]?.args[0])
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
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col">
                <label className="font-bold mb-2">Insured Address</label>
                <input
                    className="border border-gray-400 rounded py-2 px-3"
                    type="text"
                    onChange={(e) => setInsured(e.target.value)}
                    value={_insured}
                />
            </div>
            <div className="flex flex-col">
                <label className="font-bold mb-2">Premium</label>
                <input
                    className="border border-gray-400 rounded py-2 px-3"
                    type="text"
                    // onChange={(e) => setPremium(e.target.value)}
                    onChange={handlePremiumChange}
                    // value={premium.toString()}
                    value={premiumInWei}
                />
            </div>
            <div className="flex flex-col">
                <label className="font-bold mb-2">Max Claim Amount</label>
                <input
                    className="border border-gray-400 rounded py-2 px-3"
                    type="text"
                    // onChange={(e) => setMaxClaimAmount(e.target.value)}
                    onChange={handleMaxClaimAmountChange}
                    // value={maxClaimAmount.toString()}
                    value={maxClaimAmountInWei}
                />
            </div>
            <div className="flex flex-col">
                <label className="font-bold mb-2"> Expiry Date</label>
                <input
                    className="border border-gray-400 rounded py-2 px-3"
                    type="date"
                    // onChange={(e) => setExpiryDate(e.target.value)}
                    onChange={handleInputChange}
                    value={expiryDate}
                />
            </div>
            <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                disabled={!write}
                onClick={() => write?.()}
            >
                Create Policy
            </button>
            {/* <div>{policyId && <p>Policy created with ID: {policyId}</p>}</div> */}
            {error && (
                <div className="text-red-600 mt-2">
                    An error occurred preparing the transaction: {error.message}
                </div>
            )}
        </div>
    )
}
