"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "sonner"
//import Link from "next/link"

const LoginPage = () => {
    const [formFields, setFormFields] = useState({
        email: "",
        password: "",
    })

    const router = useRouter()

    const formFieldHandler = (key, e) => {
        setFormFields({
            ...formFields,
            [key]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const result = await signIn("credentials", {
                email: formFields.email,
                password: formFields.password,
                redirect: false,
            })

            if (!result?.ok) {
                // console.error("Login Failed: ", result?.error)
                toast.error("Please enter correct credentials", {
                    className: "border-accent bg-accent",
                })
            }
            router.push("/")
        } catch (error) {
            console.error("Login Failed: ", error)
            toast.error("Failed to submit:", error)
        }
    }

    return (
        <>
            <Toaster />
            <section className="bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full  rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-accent">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight  md:text-2xl text-accent">
                                Sign in to your account
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-accent">
                                        Your email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="border outline-none focus:border-accent rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-accent placeholder:opacity-60 text-accent"
                                        placeholder="name@company.com"
                                        value={formFields.email}
                                        onChange={(e) => formFieldHandler("email", e)}
                                        required=""
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-accent">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        value={formFields.password}
                                        onChange={(e) => formFieldHandler("password", e)}
                                        className="border outline-none focus:border-accent rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-accent placeholder:opacity-60 text-accent"
                                        required=""
                                    />
                                </div>
                                {/* <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="remember"
                                            aria-describedby="remember"
                                            type="checkbox"
                                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                            required=""
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label
                                            htmlFor="remember"
                                            className="text-gray-500 dark:text-gray-300"
                                        >
                                            Remember me
                                        </label>
                                    </div>
                                </div>
                                <Link
                                    href="#"
                                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >
                                    Forgot password?
                                </Link>
                            </div> */}
                                <button
                                    type="submit"
                                    className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-accent hover:bg-accent/80  focus:ring-blue-500"
                                >
                                    Sign in
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default LoginPage
