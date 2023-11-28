import React from 'react';
import clsx from "clsx";
import { lusitana } from "@/app/ui/fonts";
import { LatestInvoice } from "@/app/lib/definitions";
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface LatestInvoicesProps {
  latestInvoices: LatestInvoice[] | null;
}

const LatestInvoices: React.FC<LatestInvoicesProps> = ({ latestInvoices }) => {

  return (
    <div className="flex w-full flex-col md:col-span-4 lg:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Latest Subscriptions
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">

        <div className="bg-white px-6">
          {latestInvoices?.map((invoice, i) => {
            return (
              <div
                className={clsx(
                  "flex flex-row items-center justify-between py-4",
                  {
                    "border-t": i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {invoice.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {invoice.month} months
                    </p>
                  </div>
                </div>
                <p
                  className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                >
                  {invoice.amount} $
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}

export default LatestInvoices;

