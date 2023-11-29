"use client";

import { SubscriptionsTable } from "@/app/lib/definitions";
import { SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import EditIcon from "@/public/assets/PencilSquare.svg";
import DeleteIcon from "@/public/assets/Trash.svg";
import RightArrowIcon from "@/public/assets/RightArrow.svg";
import LeftArrowIcon from "@/public/assets/LeftArrow.svg";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { CreateInvoice } from "./buttons";


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
      <div className="relative overflow-x-auto shadow-lg sm:rounded-lg shadow-lg dark:shadow-slate-200/20 shadow-slate-900/20">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs uppercase text-slate-950 dark:text-slate-200 bg-slate-400 dark:bg-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">
                Subscription name
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Duration
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                {""}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentSubscriptions && currentSubscriptions.map((subscription) => (
              <tr key={subscription.subscription_id} className="odd:bg-slate-200 even:bg-slate-300 odd:dark:bg-gray-800  even:dark:bg-slate-900">
                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-slate-950 dark:text-slate-100 text-center">
                  {subscription.name}
                </th>
                <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-slate-950 dark:text-slate-100 text-center">
                  <div className="mx-5">
                    {addLeadingZero(subscription.month)}
                  </div>
                </td>
                <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-slate-950 dark:text-slate-100 text-center">
                  {subscription.amount.toFixed(2)}
                </td>
                <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-slate-950 dark:text-slate-100 text-center">
                  {subscription.status}
                </td>
                <td scope="row" className="px-6 py-4 text-center">
                  <div className="flex justify-center cursor-pointer">
                    <div className="group flex-1 sm:rounded-md p-2  hover:bg-blue-600 flex justify-center items-center" onClick={() => handleDelete(subscription.name)}>
                      <Image
                        className="h-5 w-5 min-w-[20px] min-h-[20px] dark:invert group-hover:filter group-hover:invert"
                        src={DeleteIcon}
                        alt="Delete Icon"
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center py-3 space-x-1">
        <button
          disabled={currentPage === 0}
          onClick={() => handlePageChange(currentPage - 1)}
          className="py-2 px-4 sm:rounded-md dark:bg-slate-700 hover:bg-gray-500 bg-slate-300 hover:bg-slate-400 cursor-pointer"
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

