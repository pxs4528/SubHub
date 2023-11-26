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



export default function EditInvoiceForm({
  subscriptions
}: {
  subscriptions: SubscriptionsTable[] | null;
}) {

  const [subscriptionName, setSubscriptionName] = useState("");
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState("");
  const [months, setMonths] = useState(0)

    const handleSubscriptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = e.target.value;
      const selectedCustomer = subscriptions?.find((customer) => customer.subscription_id === selectedValue);
      if(selectedCustomer)
        setSubscriptionName(selectedCustomer.name);
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
      console.log( subscriptionName, amount, status)
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
            body: JSON.stringify({Name: subscriptionName, Amount: amount, Status: status})
          }
        );
        if (!response.ok)
          console.log("error with update")
      }
      catch
      {
      
      }
    }

    // TODO: Handle Form submit, will add maybe tomorrow, or whenever, will need to change action on 53 to be this instead of the braces
  return (
    <form action={e => {console.log("submitted update :D"); console.log( subscriptionName, amount, status, months)}}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Invoice ID */}
        {/* <input type="hidden" name="id" value={invoice.id} /> */}
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose subscription
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
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-gray-600"
                  onChange={handleStatusChange("pending")}
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-gray-600"
                  onChange={handleStatusChange("paid")}
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white dark:text-gray-300"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </div>
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
        <Button type="submit">Edit Invoice</Button>
      </div>
    </form>
  );
}
