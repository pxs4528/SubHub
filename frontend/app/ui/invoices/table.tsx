"use client";

import { SubscriptionsTable } from "@/app/lib/definitions";
import { SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import EditIcon from "@/public/assets/PencilSquare.svg";
import DeleteIcon from "@/public/assets/Trash.svg";
import RightArrowIcon from "@/public/assets/RightArrow.svg";
import LeftArrowIcon from "@/public/assets/LeftArrow.svg";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { CreateInvoice, DeleteInvoice, UpdateInvoice } from "./buttons";
import InvoiceStatus from "./status";
import { formatCurrency, formatDateToLocal } from "@/app/lib/utils";


function addLeadingZero(number: number) {
  return number < 10 ? '0' + number : number.toString();

}


export default function UserSubscriptions() {
  const [allSubscriptions, setAllUserSubscription] = useState<SubscriptionsTable[] | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchParam, setSearchParam] = useState('');
  const rowsPerPage = 5;

  function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
    let debounceTimer: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }



  useEffect(() => {
    const getAllUsersubscriptionData = async () => {
      try {
        const response = await fetch("http://localhost:8080/search-subscription", {
          method: "Post",
          credentials: "include",
          body: JSON.stringify({ search: searchParam }),
        });
        if (response.ok) {

          const data = await response.json();
          setAllUserSubscription(data.body);
        }
        else {
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Error fetching subscription data: ", err);
      }
    };
    getAllUsersubscriptionData();
  }, [searchParam]);


  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = allSubscriptions ? Math.ceil(allSubscriptions.length / rowsPerPage) : 0;

  const currentSubscriptions = allSubscriptions
    ? allSubscriptions.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)
    : [];

  const handleDelete = async (name: string) => {

    try {
      const response = await fetch(
        "http://localhost:8080/delete-subscription",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Name: name })
        }
      );
      if (!response.ok)
        console.log(response)
      else {
        try {
          const response = await fetch("http://localhost:8080/search-subscription", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({ search: searchParam }),

          });
          if (response.ok) {

            const data = await response.json();
            setAllUserSubscription(data.body || []); // Put's the new data in the hook, so react regenerates the table
          }
        }
        catch
        {
          console.log("error getting subscriptions")
        }
      }
    }
    catch
    {
      console.log("error deleting subscription")
    }
  }

  return (
    <div>
      <div className="flex">
        <div className="relative flex flex-1 flex-shrink-0 pb-10 pr-5">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <input
            className="peer block w-full rounded-md border text-slate-900 border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 py-[9px] pl-10 text-sm outline-2 placeholder:text-slate-600 dark:placeholder:text-slate-300 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={'Search Subscription'}
            onChange={debounce((e: { target: { value: SetStateAction<string>; }; }) => {
              setSearchParam(e.target.value);
            }, 100)}
          />
          <MagnifyingGlassIcon className="absolute left-2.5 top-[14%] h-[20px] w-[20px] text-slate-600 dark:text-slate-300 dark:peer-focus:text-slate-300" />
        </div>
        <CreateInvoice />
      </div>
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
        <div className="md:hidden">
            {currentSubscriptions && currentSubscriptions.map((invoice) => (
              <div
                key={invoice.subscription_id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex text-xl items-center">
                      <p>{invoice.name}</p>
                    </div>
                  </div>
                  <InvoiceStatus status={invoice.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-lg font-medium">
                      {(invoice.amount)} $
                    </p>
                    <p>{formatDateToLocal(invoice.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                  <div className="flex-1 sm:rounded-md p-2  hover:bg-blue-600 flex justify-center items-center" onClick={() => handleDelete(invoice.name)}>
                      <Image
                        className="h-5 w-auto dark:invert"
                        src={DeleteIcon}
                        alt="Delete Icon"
                        
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentSubscriptions && currentSubscriptions.map((invoice) => (
                <tr
                  key={invoice.subscription_id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{invoice.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.amount} $
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(invoice.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <InvoiceStatus status={invoice.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                  <div className="flex-1 sm:rounded-md p-2  hover:bg-blue-600 flex justify-center items-center" onClick={() => handleDelete(invoice.name)}>
                      <Image
                        className="h-5 w-auto dark:invert"
                        src={DeleteIcon}
                        alt="Delete Icon"
                        
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
      <div className="flex justify-center items-center py-3 space-x-1">
        <button
          disabled={currentPage === 0}
          onClick={() => handlePageChange(currentPage - 1)}
          className="py-2 px-4 sm:rounded-md dark:bg-slate-700 bg-slate-300 hover:bg-slate-400 cursor-pointer"
        >
          <Image
            className="mx-auto h-5 w-auto dark:invert"
            src={LeftArrowIcon}
            alt="Left Arrow Icon"
          />
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <span key={index} className={`py-2 px-4 text-sm font-medium ${index === currentPage ? 'text-slate-100 bg-blue-600 sm:rounded-md' : 'text-slate-950 dark:text-slate-100'}`}>
            {index + 1}
          </span>
        ))}

        <button
          disabled={currentPage >= totalPages - 1}
          onClick={() => handlePageChange(currentPage + 1)}
          className="py-2 px-4 sm:rounded-md dark:bg-slate-700 hover:bg-gray-500 bg-slate-300 hover:bg-slate-400 cursor-pointer"
        >
          <Image
            className="mx-auto h-5 w-auto dark:invert"
            src={RightArrowIcon}
            alt="Right Arrow Icon"
          />
        </button>
      </div>
    </div>

  )
}

