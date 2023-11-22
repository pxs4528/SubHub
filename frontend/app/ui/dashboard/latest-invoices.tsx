import React from 'react';
import clsx from "clsx";
import { lusitana } from "@/app/ui/fonts";
import { LatestInvoice } from "@/app/lib/definitions";

interface LatestInvoicesProps {
  latestInvoices: LatestInvoice[] | null;
}

const LatestInvoices: React.FC<LatestInvoicesProps> = ({ latestInvoices }) => {

  return (
    <div className="flex w-full flex-col md:col-span-4 lg:col-span-4 py-5">

      <h2 className={`${lusitana.className} dark:invert mb-4 text-xl md:text-2xl`}>
        Latest Subscription
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-700 p-4">
        <div className={`${lusitana.className} dark:invert px-6`}>
          {latestInvoices?.map((invoice, i) => (
            <div
              key={invoice.subscription_id}
              className={clsx(
                "flex flex-row items-center justify-between py-4",
                { "border-t": i !== 0 },
              )}
            >
              <div className="flex items-center">
                <div className="min-w-0">
                  <p className="truncate text-ml font-semibold md:text-base">
                    {invoice.name}
                  </p>
                  <p className="hidden text-ml text-gray-700 sm:block">
                    Duration: {invoice.month} months
                  </p>
                </div>
              </div>
              <p
                className="truncate text-ml font-medium md:text-base"
              >
                {invoice.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LatestInvoices;

