import { useState } from "react"

const useInput = () => {
    const [inputValue, setInputValue] = useState("")

    const handleInputChange = (event) => {
        setInputValue(event.target.value)
    }

    const convertToUnixEpoch = () => {
        // Perform the date conversion logic here
        // and return the Unix epoch value
        const date = new Date(inputValue)
        const unixEpoch = date.getTime()
        return unixEpoch
    }

    return {
        inputValue,
        handleInputChange,
        convertToUnixEpoch,
    }
}

export default useInput
