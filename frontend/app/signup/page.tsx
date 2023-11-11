"use client";
import React from "react";
import { useState } from "react";
import Icon from "@/public/assets/subhub_logo.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [name, setName] = useState("");



  const validate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(JSON.stringify({ name, email, password }));
    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      console.log(response.body);

      if (response.status == 201) {
        let Code = prompt("Enter 2FA Code Here Please");
        console.log(JSON.stringify({ Code: Number(Code) }));
        try {
          const code_response = await fetch(
            "http://localhost:8080/validate-twofa",
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ Code: Number(Code) }),
            }
          );
          const responseData = await code_response.json();

          console.log(responseData);

          if (code_response.status == 200) {
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        // Handle other status codes
        const data = await response.json(); // Assuming the response contains JSON data
        console.log(data)
        console.log("Login failed. Status:", response.status);
        // You can add additional handling based on different response status codes if needed
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network errors or exceptions
    }
  };

  // TODO: Add Redirection to home page after registration
  // Perhaps, figure whats going on.
  return (
    <div className="flex flex-col h-screen">
      <div className="dark:bg-gray-900 min-h-screen bg-gray-50 flex sm:justify-center items-center pt-6 sm:pt-0">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm md:max-w-md lg:max-w-lg">
            <div className="dark:invert flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
              <Image
                className="mx-auto h-10 w-auto"
                src={Icon}
                alt="SubHub Logo"
              />
            </div>
            <div className="w-full rounded-lg shadow-lg dark:border dark:bg-gray-800 dark:border-gray-700 shadow-gray-500/50">
              <h2 className="mt-10 text-center text-2xl font-bold leading-1 tracking-tight text-white">
                Sign up for your account
              </h2>
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                  <form className="space-y-4 md:space-y-6" onSubmit={(e) => validate(e)}>
                    <div>
                      <label htmlFor="name" className="block text-lg font-medium leading-6 tracking-tight text-white">
                        Name
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                          id="name"
                          name="name"
                          type="text"
                          required={true}
                          placeholder="John Doe"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-lg font-medium leading-6 tracking-tight text-white">
                        Email
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                          id="email"
                          name="email"
                          type="email"
                          required={true}
                          placeholder="johndoe@gmail.com"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-lg font-medium leading-6 tracking-tight text-white">
                        Password
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={(e) => {
                            setPass(e.target.value);
                          }}
                          id="password"
                          name="password"
                          type="password"
                          placeholder="•••••••••"
                          minLength={8}
                          maxLength={15}
                          required={true}
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-2">
                      <button
                        type="submit"
                        className="w-full text-white bg-blue-600 hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      >
                        Sign Up
                      </button>
                    </div>
                    <div className="mt-6 text-center dark:text-white">
                      Have an account? {' '}
                      <a href="/login" className="dark:text-white underline ">
                        Sign in!
                      </a>
                    </div>
                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/*
<div className="flex flex-col h-screen">
      <div className="dark:bg-stone-900 min-h-screen bg-gray-50 flex  sm:justify-center items-center pt-6 sm:pt-0">
        <div className="w-full sm:max-w-md p-5">
          <h2 className="dark:text-white mb-4 text-center md:text-5xl text-lg font-extrabold">
            Welcome to
          </h2>
          <div className="flex flex-auto items-center px-16">
            <Image
              className="dark:invert mb-4 w-full flex-col"
              src={Icon}
              alt="Icon of SubHub"
            />
          </div>
        </div>
        { <hr className="-mt-12 mb-12 border-t-2 border-gray-300"></hr> }

        <form>
          <div className="mb-8">
            {/* <label className="block mb-1" htmlFor="name">Name</label> }
            <input
              onChange={(e) => {
                setName(e.target.value);
              }}
              id="name"
              type="text"
              name="name"
              placeholder="Name"
              className="py-2 px-3 box-content border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
            />
          </div>
          <div className="mb-8">
            {/* <label className="block mb-1" htmlFor="email">Email Address</label> }
            <input
              id="email"
              type="text"
              name="email"
              placeholder="Email"
              className="py-2 px-3 box-content border border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
            />
          </div>
          <div className="mb-8">
            {/* <label className="block mb-1" htmlFor="emailC">Confirm Email Address</label> }
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              id="emailC"
              type="text"
              name="email"
              placeholder="Confirm Email"
              className="py-2 px-3 box-content border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
            />
          </div>

          <div className="mb-8">
            {/* <label className="block mb-1" htmlFor="password">Password</label> }
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              className="py-2 px-3 box-content border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
            />
          </div>
          <div className="mb-8">
            {/* <label className="block mb-1" htmlFor="passwordC">Confirm Password</label> }
            <input
              onChange={(e) => {
                setPass(e.target.value);
              }}
              id="passwordC"
              type="password"
              name="password"
              placeholder="Confirm Password"
              className="py-2 px-3 box-content border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
            />
          </div>
          <div className="mt-6">
            <a
              onClick={() => {
                validate();
              }}
              className="w-full box-content inline-flex items-center justify-center px-3 py-2 bg-blue-600 border border-transparent transition-transform hover:scale-105 rounded-md font-semibold capitalize text-white hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 disabled:opacity-25 cursor-pointer"
            >
              Sign Up
            </a>
          </div>
          <div className="py-3 px-3.5 pt-10">
            <a
              className="flex items-center rounded-md shadow-xl transition-transform hover:scale-105 cursor-pointer"
              onClick={() => redirectG()}
            >
              <svg
                width="52"
                height="51"
                viewBox="0 0 52 51"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="50.3924"
                  height="50.3924"
                  transform="translate(0.828979 0.255676)"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M49.2058 26.0002C49.2058 24.288 49.0521 22.6417 48.7668 21.0612H26.0253V30.4015H39.0204C38.4606 33.4198 36.7594 35.9771 34.2021 37.6893V43.7478H42.0058C46.5716 39.5442 49.2058 33.3539 49.2058 26.0002Z"
                  fill="#4285F4"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M26.025 49.5975C32.5445 49.5975 38.0103 47.4353 42.0055 43.7475L34.2018 37.6889C32.0396 39.1377 29.2738 39.9938 26.025 39.9938C19.7359 39.9938 14.4128 35.7463 12.514 30.0389H4.4469V36.295C8.42007 44.1865 16.5859 49.5975 26.025 49.5975Z"
                  fill="#34A853"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.5143 30.0396C12.0314 28.5908 11.757 27.0433 11.757 25.4518C11.757 23.8603 12.0314 22.3128 12.5143 20.864V14.6079H4.4472C2.81183 17.8676 1.87891 21.5554 1.87891 25.4518C1.87891 29.3481 2.81183 33.0359 4.4472 36.2957L12.5143 30.0396Z"
                  fill="#FBBC05"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M26.025 10.9088C29.5701 10.9088 32.753 12.1271 35.2555 14.5198L42.1811 7.59421C37.9994 3.69786 32.5335 1.30518 26.025 1.30518C16.5859 1.30518 8.42007 6.71616 4.4469 14.6076L12.514 20.8637C14.4128 15.1564 19.7359 10.9088 26.025 10.9088Z"
                  fill="#EA4335"
                />
              </svg>{" "}
              <span className="dark:text-white ml-2">Continue with Google</span>
            </a>
          </div>
          <div className="mt-6 text-center">
            <a href="/login" className="dark:text-white underline ">
              Have an account? Sign in instead!
            </a>
          </div>
        </form>
      </div>
    </div>
*/
