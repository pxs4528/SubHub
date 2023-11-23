"use client";

import { SubscriptionsTable } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import Image from "next/image";
import EditIcon from "@/public/assets/PencilSquare.svg";
import DeleteIcon from "@/public/assets/Trash.svg";
import RightArrowIcon from "@/public/assets/RightArrow.svg";
import LeftArrowIcon from "@/public/assets/LeftArrow.svg";







function addLeadingZero(number: number) {
  return number < 10 ? '0' + number : number.toString();

}

export default function UserSubscriptions() {
  const [allSubscriptions, setAllUserSubscription] = useState<SubscriptionsTable[] | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;

  useEffect(() => {
    const getAllUsersubscriptionData = async () => {
      try {
        const response = await fetch("http://localhost:8080/get-user-subscriptions", {
          method: "GET",
          credentials: "include",
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
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = allSubscriptions ? Math.ceil(allSubscriptions.length / rowsPerPage) : 0;

  const currentSubscriptions = allSubscriptions
    ? allSubscriptions.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)
    : [];


  return (
    <div className="py-10">
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

