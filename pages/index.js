import Link from "next/link"

function Home() {
    return (
        <div className="flex h-screen bg-gray-100 justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <ul className="text-center">
                    <li className="mt-2">
                        <Link href="/insurer" className="text-blue-500 hover:underline">
                            Insurer
                        </Link>
                    </li>
                    <li className="mt-2">
                        <Link href="/insured" className="text-blue-500 hover:underline">
                            Insured
                        </Link>
                    </li>
                    <li className="mt-2">
                        <Link href="/validator" className="text-blue-500 hover:underline">
                            Validator
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Home
