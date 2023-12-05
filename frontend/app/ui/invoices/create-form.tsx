"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CustomerField, SubscriptionsField } from "@/app/lib/definitions";
import Link from "next/link";
import { createInvoice } from "@/app/lib/actions";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  CakeIcon,
  CloudIcon
} from "@heroicons/react/24/outline";
import { Button } from "../button";
import { number } from "zod";
import { lusitana } from "../fonts";





export default function Form({ customers }: { customers: SubscriptionsField[] | null }) {
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [subscriptionName, setSubscriptionName] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState("Pending");
  const [month, setMonth] = useState(0);







  const handleSubscriptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setIsOtherSelected(selectedValue === "Other");

    if (selectedValue === "Other") {
      setSubscriptionName("");
      setSubscriptionId(uuidv4());
    } else {
      const selectedCustomer = customers?.find((customer) => customer.id === selectedValue);
      if (selectedCustomer) {
        setSubscriptionName(selectedCustomer.subscription_name);
        setSubscriptionId(selectedCustomer.id);
      }
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(Number(e.target.value));
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value));
  }
  const handleStatusChange = (status: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(status);
  };
  const handleSubscriptionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubscriptionName(e.target.value);
  };



  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(subscriptionId, subscriptionName, amount, status, month);
    // Use subscriptionId and subscriptionName as needed, e.g., pass them to createInvoice function
    // createInvoice(subscriptionId, subscriptionName, amount, status, isOtherSelected);
    try {
      const response = await fetch(
        "http://localhost:8080/insert-subscription",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Name: subscriptionName, Amount: amount, Status: status, Month: month })
        }
      );
      if (!response.ok)
        console.log(response)
      else
        window.location.href = 'http://localhost:3000/dashboard/invoices'
    }
    catch
    {
      window.location.href = 'https://www.google.com/search?q=how+to+not+be+a+bozo&rlz=1C1UEAD_enUS1017US1020&oq=how+to+not+be+a+bozo&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDYyOThqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8'
    }
  }


  return (
    <form onSubmit={handleFormSubmit}>
      <div className="rounded-md dark:bg-slate-800 bg-slate-200 p-4 md:p-6 shadow-lg dark:shadow-slate-200/50 shadow-slate-900/50">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className={`${lusitana.className} mb-2 block font-medium text-lg text-slate-950 dark:text-slate-200`}>
            Choose Subscription
          </label>
          <div className="relative">

            <select
              id="customer"
              name="customerId"
              className={`${lusitana.className} peer block w-full rounded-md border border-slate-500 py-2 pl-10 text-sm outline-2 dark:bg-slate-700 text-slate-700 dark:text-slate-300`}
              defaultValue=""
              onChange={handleSubscriptionChange}
            >

              <option value="" disabled>
                Select a Subscription
              </option>

              {customers?.map((customer) => (
                <>
                  <option key={customer.id} value={customer.id}>
                    {customer.subscription_name}
                  </option>

                </>
              ))}
              <option key="Other" value="Other">
                Other
              </option>

            </select>

            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-700 dark:text-slate-300" />
          </div>
        </div>
        {/* Other Subscription Name */}
        {isOtherSelected && (
          <div className="mb-4 relative">
            <label htmlFor="otherSubscription" className={`${lusitana.className} mb-2 block font-medium text-lg text-slate-950 dark:text-slate-200`}>
              Enter Subscription Name
            </label>
            <input
              id="otherSubscription"
              name="otherSubscription"
              type="text"
              placeholder="Enter subscription name"
              value={subscriptionName}
              onChange={handleSubscriptionNameChange}
              className={`${lusitana.className} peer block w-full rounded-md border border-slate-500 py-2 pl-10 text-sm outline-2 placeholder-slate-700 dark:placeholder-slate-300 dark:bg-slate-700 text-slate-950 dark:text-slate-100`}
            />
            <CloudIcon className="pointer-events-none absolute left-3 top-[calc(60%)] h-[18px] w-[18px] text-slate-700 dark:text-slate-300" />
          </div>
        )}


        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className={`${lusitana.className} mb-2 block font-medium text-lg text-slate-950 dark:text-slate-200`}>
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="Enter USD amount"
                className={`${lusitana.className} peer block w-full rounded-md border border-slate-500 py-2 pl-10 text-sm outline-2 dark:bg-slate-700 placeholder-slate-700 dark:placeholder-slate-300 text-slate-950 dark:text-slate-100`}
                onChange={handleAmountChange}
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-700 dark:text-slate-300" />
            </div>
          </div>
        </div>

        {/* Invoice Status */}
        <div>
          <label htmlFor="status" className={`${lusitana.className} mb-2 block font-medium text-lg text-slate-950 dark:text-slate-200`}>
            Set the subscription status
          </label>
          <div className="rounded-md border border-slate-500 bg-slate-100 dark:bg-slate-700 px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="Pending"
                  name="status"
                  type="radio"
                  value="Pending"
                  className="h-4 w-4 border-slate-500 bg-slate-800 dark:text-slate-900 focus:ring-2 focus:ring-slate-500 dark:border-slate-300 dark:bg-slate-300 dark:ring-offset-slate-800 dark:focus:ring-slate-800"
                  onChange={handleStatusChange("Pending")}
                />
                <label
                  htmlFor="Pending"
                  className="ml-2 flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1.5 text-xs font-medium text-slate-950"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="Paid"
                  name="status"
                  type="radio"
                  value="Paid"
                  className="h-4 w-4 border-slate-500 bg-slate-800 dark:text-slate-900 focus:ring-2 focus:ring-slate-500 dark:border-slate-300 dark:bg-slate-300 dark:ring-offset-slate-800 dark:focus:ring-slate-800"
                  onChange={handleStatusChange("Paid")}
                />
                <label
                  htmlFor="Paid"
                  className="ml-2 flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-slate-950"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* start code for months omegalul */}
        <div className="mt-4">
          <label htmlFor="amount" className={`${lusitana.className} mb-2 block font-medium text-lg text-slate-950 dark:text-slate-200`}>
            Enter number of months
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="1"
                placeholder="Enter amount of months"
                className={`${lusitana.className} peer block w-full rounded-md border border-slate-500 py-2 pl-10 text-sm outline-2 dark:bg-slate-700 placeholder-slate-700 dark:placeholder-slate-300 text-slate-950 dark:text-slate-100`}
                onChange={handleMonthChange}
              />
              <CakeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-700 dark:text-slate-300" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors text-slate-950 bg-slate-300 dark:bg-slate-700 dark:text-slate-100 hover:text-slate-100 dark:hover:bg-slate-600 hover:bg-slate-700"
        >
          Cancel
        </Link>
        <Button type="submit">Insert Subscription</Button>
      </div>
    </form >
  );
}
