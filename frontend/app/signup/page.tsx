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

      if (response.ok) {
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

          if (code_response.ok) {
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
      <div className="bg-slate-100 dark:bg-slate-950 min-h-screen flex sm:justify-center items-center pt-6 sm:pt-0">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm md:max-w-md lg:max-w-lg">
            <div className="flex items-center mb-6 text-2xl font-semibold">
              <Image
                className="dark:invert mx-auto h-10 w-auto"
                src={Icon}
                alt="SubHub Logo"
              />
            </div>
            <div className="w-full rounded-lg shadow-lg border bg-slate-200 border-slate-200 dark:border dark:bg-slate-800 dark:border-slate-700 shadow-slate-500/100">
              <h2 className="mt-10 text-center text-2xl font-bold leading-1 tracking-tight text-slate-950 dark:text-slate-100 ">
                Sign up for your account
              </h2>
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                  <form className="space-y-4 md:space-y-6" onSubmit={(e) => validate(e)}>
                    <div>
                      <label htmlFor="name" className="block text-lg font-medium leading-6 tracking-tight text-slate-750 dark:text-slate-100">
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
                          className="bg-slate-50 border border-slate-300 text-slate-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-slate-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-lg font-medium leading-6 tracking-tight text-slate-750 dark:text-slate-100">
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
                          className="bg-slate-50 border border-slate-300 text-slate-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-slate-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-lg font-medium leading-6 tracking-tight text-slate-750 dark:text-slate-100">
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
                          className="bg-slate-50 border border-slate-300 text-slate-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-slate-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"

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
                    <div className="mt-6 text-center text-slate-750 dark:text-slate-100">
                      Have an account? {' '}
                      <a href="/login" className="text-slate-750 dark:text-slate-100 underline ">
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