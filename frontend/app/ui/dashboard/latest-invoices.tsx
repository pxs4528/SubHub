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
      <h2 className={`${lusitana.className} text-slate-950 dark:text-slate-100 mb-4 text-xl md:text-2xl`}>
        Latest Subscriptions
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-slate-200 dark:bg-slate-800 p-4">

        <div className="bg-slate-100 dark:bg-slate-700 px-6">
          {latestInvoices?.map((invoice, i) => {
            return (
              <div
                className={clsx(
                  "bg-slate-100 dark:bg-slate-700 flex flex-row items-center justify-between py-4",
                  {
                    "border-t": i !== 0,
                  },
                )}
              >
                <div className="flex items-center">

                  <div className="min-w-0">
                    <p className="text-slate-950 dark:text-slate-100 truncate text-sm font-semibold md:text-base">
                      {invoice.name}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {invoice.month} months
                    </p>
                  </div>
                </div>
                <p
                  className={`${lusitana.className} text-slate-950 dark:text-slate-100 truncate text-sm font-medium md:text-base`}
                >
                  {invoice.amount} $
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          <h3 className="ml-2 text-sm text-slate-700 dark:text-slate-300">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}

export default LatestInvoices;

