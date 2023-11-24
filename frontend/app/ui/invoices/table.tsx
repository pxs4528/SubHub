"use client";

import { SubscriptionsTable } from "@/app/lib/definitions";
import { SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import EditIcon from "@/public/assets/PencilSquare.svg";
import DeleteIcon from "@/public/assets/Trash.svg";
import RightArrowIcon from "@/public/assets/RightArrow.svg";
import LeftArrowIcon from "@/public/assets/LeftArrow.svg";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";


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


  return (
    <div >
      <div className="relative flex flex-1 flex-shrink-0 pb-10">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder={'Search Subscription'}
          onChange={debounce((e: { target: { value: SetStateAction<string>; }; }) => {
            setSearchParam(e.target.value);
          }, 100)}
        />
        <MagnifyingGlassIcon className="absolute left-2.5 top-[14%] h-[20px] w-[20px] text-gray-500 peer-focus:text-gray-900" />
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="text-white px-6 py-3">
                Subscription name
              </th>
              <th scope="col" className="text-white px-6 py-3">
                Duration
              </th>
              <th scope="col" className="text-white px-6 py-3">
                Amount
              </th>
              <th scope="col" className="text-white px-6 py-3">
                Status
              </th>
              <th scope="col" className="text-white px-6 py-3">
                {""}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentSubscriptions && currentSubscriptions.map((subscription) => (
              <tr key={subscription.subscription_id} className="odd:bg-white odd:dark:bg-gray-900  even:dark:bg-gray-600 border-b dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:invert">
                  {subscription.name}
                </th>
                <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:invert">
                  <div className="mx-5">
                    {addLeadingZero(subscription.month)}
                  </div>
                </td>
                <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:invert">
                  {subscription.amount.toFixed(2)}
                </td>
                <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:invert">
                  {subscription.status}
                </td>
                <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                  <div className="flex items-center cursor-pointer space-x-2 ">
                    <div className="flex-1 sm:rounded-md p-2  hover:bg-blue-600 flex justify-center items-center">
                      <Image
                        className="h-5 w-auto dark:invert"
                        src={EditIcon}
                        alt="Edit Icon"
                      />
                    </div>

                    <div className="flex-1 sm:rounded-md p-2  hover:bg-blue-600 flex justify-center items-center">
                      <Image
                        className="h-5 w-auto dark:invert"
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
          className="py-2 px-4 sm:rounded-md bg-gray-700 hover:bg-gray-500"
        >
          <Image
            className="mx-auto h-5 w-auto dark:invert"
            src={LeftArrowIcon}
            alt="Left Arrow Icon"
          />
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <span key={index} className={`py-2 px-4 text-sm font-medium ${index === currentPage ? 'text-white bg-blue-600 sm:rounded-md' : 'text-white'}`}>
            {index + 1}
          </span>
        ))}

        <button
          disabled={currentPage >= totalPages - 1}
          onClick={() => handlePageChange(currentPage + 1)}
          className="py-2 px-4 sm:rounded-md bg-gray-700 hover:bg-gray-500"
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

