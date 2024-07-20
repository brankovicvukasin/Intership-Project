"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/services/authenticationService";
import toast from "react-hot-toast";
import { inter } from "@/app/fonts";

export default function Example() {
  const [email, setAddEmail] = useState<string>("");
  const [password, setAddPassword] = useState<string>("");
  const router = useRouter();

  const handleClickGoogle = (e: any) => {
    e.preventDefault();
  };

  const handleClick = async (e: any) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email!");
      return;
    }

    if (!password) {
      toast.error("Please enter your password!");
      return;
    }

    try {
      const result = await login(email, password);

      if (result) {
        router.push("/app");
      } else {
        toast.error("Login failed, wrong username or password!");
      }
    } catch (error) {
      toast.error("Login failed, wrong username or password!");
      console.error("An error occurred during login:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative flex justify-center bg-slate-50 overflow-hidden">
        <div className="hidden md:flex fixed left-0 top-0 w-[470px] h-[470px] bg-gradient-to-r from-blue-500 to-teal-400 rounded-full opacity-25 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>{" "}
        <div className="hidden md:flex fixed left-[100%] top-[0%] w-[470px] h-[470px] bg-gradient-to-r from-teal-400 to-blue-400 rounded-full opacity-25 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative mx-auto max-w-4xl text-center overflow-y-auto sm:mt-24 mt-10">
          <h1
            className={`${inter.className} text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tighter tracking-tighter sm:mb-4`}
          >
            The best modern{" "}
            <span className="text-4xl sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
              KeywordDetector
            </span>{" "}
            is here!
          </h1>
          <p className="mt-6 leading-6 sm:leading-8 text-gray-600 text-base sm:text-lg mx-10">
            KeywordDetector is your ultimate tool for uncovering the most
            frequently used tech keywords on any website. Whether you`re a
            digital marketer, SEO expert, content creator, or simply curious
            about what technologies are mentioned on website, KeywordDetector
            provides you with the insights you need.
          </p>
        </div>
      </div>

      <div className="flex h-full flex-1 justify-center items-center bg-slate-50">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="flex flex-col items-center">
              <h2 className="mt-3 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-5">
              <div>
                <form action="#" method="POST" className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        onChange={(e) => setAddEmail(e.target.value)}
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        id="password"
                        onChange={(e) => setAddPassword(e.target.value)}
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-3 block text-sm leading-6 text-gray-700"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm leading-6">
                      <a
                        href="#"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  <div>
                    <Link
                      href={"/app"}
                      type="submit"
                      onClick={handleClick}
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Sign in
                    </Link>
                  </div>
                </form>
              </div>

              <div className="mt-4">
                <div className="relative">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="bg-white px-6 text-gray-900">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClickGoogle}
                  className="w-full py-3 mt-4 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                >
                  <svg
                    className="w-4 h-auto"
                    width="46"
                    height="47"
                    viewBox="0 0 46 47"
                    fill="none"
                  >
                    <path
                      d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                      fill="#34A853"
                    />
                    <path
                      d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                      fill="#EB4335"
                    />
                  </svg>
                  Sign in with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
