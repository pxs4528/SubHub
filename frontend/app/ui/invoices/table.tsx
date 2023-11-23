"use client";

import { SubscriptionsTable } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import Image from "next/image";
import EditIcon from "@/public/assets/PencilSquare.svg";
import DeleteIcon from "@/public/assets/Trash.svg";


function addLeadingZero(number: number) {
  return number < 10 ? '0' + number : number.toString();

}

export default function UserSubscriptions() {
  const [allSubscriptions, setAllUserSubscription] = useState<SubscriptionsTable[] | null>(null);
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

  console.log(allSubscriptions);
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
            {allSubscriptions && allSubscriptions.map((subscription) => (
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
                <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:invert">
                  <div className="cursor-pointer">
                    <Image
                      className="mx-auto h-5 w-auto"
                      src={EditIcon}
                      alt="Edit Icon"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  )
}

