"use client";

import { CustomerField, InvoiceForm, SubscriptionsField, SubscriptionsTable } from "@/app/lib/definitions";
import { updateInvoice } from "@/app/lib/actions";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  CakeIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/ui/button";

import { useState } from "react";
import { UUID } from "crypto";
import { lusitana } from "../fonts";



export default function EditInvoiceForm({ subscriptions }: { subscriptions: SubscriptionsTable[] | null; }) {

  const [subscriptionName, setSubscriptionName] = useState("");
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState("");
  const [months, setMonths] = useState(0)


  const handleSubscriptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectSubscription = subscriptions?.find((customer) => customer.subscription_id === selectedValue);
    if (selectSubscription)
      setSubscriptionName(selectSubscription.name);
    setAmount(selectSubscription?.amount || 0);
    setStatus(selectSubscription?.status || "");
    setMonths(selectSubscription?.month || 0);
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonths(Number(e.target.value));
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value));
  }
  const handleStatusChange = (status: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(status);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(subscriptionName, amount, status, months)
    try {
      const response = await fetch(
        "http://localhost:8080/update-subscription",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Name: subscriptionName, Amount: amount, Status: status, Month: months })
        }
      );
      if (!response.ok)
        console.log("error with update")
      else
        window.location.href = "http://localhost:3000/dashboard/invoices"
    }
    catch
    {
      console.log("exception with update")
    }
  }

  // TODO: Handle Form submit, will add maybe tomorrow, or whenever, will need to change action on 53 to be this instead of the braces
  return (
    <form onSubmit={handleFormSubmit}>
      <div className={`${lusitana.className} rounded-md dark:bg-slate-800 bg-slate-200 p-4 md:p-6 shadow-lg dark:shadow-slate-200/50 shadow-slate-900/50`}>
        {/* Invoice ID */}
        {/* <input type="hidden" name="id" value={invoice.id} /> */}
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block font-medium text-lg text-slate-950 dark:text-slate-200">
            Choose subscription
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full rounded-md border border-slate-500 py-2 pl-10 text-sm outline-2 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              defaultValue=""
              onChange={handleSubscriptionChange}
            >
              <option value="" disabled>
                Select a subscription
              </option>
              {subscriptions?.map((customer) => (
                <option key={customer.subscription_id} value={customer.subscription_id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block font-medium text-lg text-slate-950 dark:text-slate-200">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={amount}
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-slate-500 py-2 pl-10 text-sm outline-2 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                onChange={handleAmountChange}
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-700 dark:text-slate-300" />
            </div>
          </div>
        </div>

        {/* Invoice Status */}
        <div>
          <label htmlFor="status" className="mb-2 block font-medium text-lg text-slate-950 dark:text-slate-200">
            Set the subscription status
          </label>
          <div className="rounded-md border border-slate-500 bg-slate-100 dark:bg-slate-700 px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="Pending"
                  checked={status === "Pending"}
                  className="h-4 w-4 border-slate-500 bg-slate-800 dark:text-slate-900 focus:ring-2 focus:ring-slate-500 dark:border-slate-300 dark:bg-slate-300 dark:ring-offset-slate-800 dark:focus:ring-slate-800"
                  onChange={handleStatusChange("Pending")}
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1.5 text-xs font-medium text-slate-950"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="Paid"
                  checked={status === "Paid"}
                  className="h-4 w-4 border-slate-500 bg-slate-800 dark:text-slate-900 focus:ring-2 focus:ring-slate-500 dark:border-slate-300 dark:bg-slate-300 dark:ring-offset-slate-800 dark:focus:ring-slate-800"
                  onChange={handleStatusChange("Paid")}
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-slate-950"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="amount" className="mb-2 block font-medium text-lg text-slate-950 dark:text-slate-200">
            Enter number of months
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0"
                value={months}
                placeholder="Enter amount of months"
                className="peer block w-full rounded-md border border-slate-500 py-2 pl-10 text-sm outline-2 dark:bg-slate-700 placeholder-slate-700 dark:placeholder-slate-300 text-slate-950 dark:text-slate-100"
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
        <Button type="submit">Edit Subscription</Button>
      </div>
    </form>
  );
}
