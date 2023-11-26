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
} from "@heroicons/react/24/outline";
import { Button } from "../button";
import { number } from "zod";





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
    setMonth(Number(e.target.value)) ;
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
    try
    {
      const response = await fetch(
        "http://localhost:8080/insert-subscription",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({Name: subscriptionName, Amount: amount, Status: status, Month: month})
        }
      );
      if (!response.ok)
        console.log("error with insert")
    }
    catch
    {
      window.location.href = 'https://www.google.com/search?q=how+to+not+be+a+bozo&rlz=1C1UEAD_enUS1017US1020&oq=how+to+not+be+a+bozo&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDYyOThqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8'
    }
  }
  

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose Subscription
          </label>
          <div className="relative">
            
            <select
              id="customer"
              name="customerId"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              onChange={handleSubscriptionChange}
            >

              <option value="" disabled>
                Select a Subscription
              </option>
              
              {customers?.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.subscription_name}
                </option>
              ))}
              
            </select>
            
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
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
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                onChange={handleAmountChange}
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Invoice Status */}
        <div>
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            Set the subscription status
          </label>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="Pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-gray-600"
                  onChange={handleStatusChange("pending")}
                />
                <label
                  htmlFor="Pending"
                  className="ml-2 flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="Paid"
                  name="status"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-gray-600"
                  onChange={handleStatusChange("paid")}
                />
                <label
                  htmlFor="Paid"
                  className="ml-2 flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white dark:text-gray-300"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* start code for months omegalul */}
        <div className="mt-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
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
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                onChange={handleMonthChange}
              />
              <CakeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Invoice</Button>
      </div>
    </form>
  );
}
