import { useState } from "react"
import { ethers } from "ethers"
const useEtherInput = () => {
    const [value, setValue] = useState("0")

    const handleEtherChange = (e) => {
        setValue(e.target.value)
    }
    const convertToEther = () => {
        const etherValue = value
        const weiValue = ethers.utils.parseEther(etherValue)
        return weiValue.toString()
    }

    // const handleWeiChange = (e) => {
    //     const weiValue = e.target.value
    //     const etherValue = ethers.utils.formatEther(weiValue)
    //     setValue(weiValue)
    // }

    return [value, handleEtherChange, convertToEther]
}

export default useEtherInput
