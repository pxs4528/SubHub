import { CheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function InvoiceStatus({ status }: { status: string }) {
  console.log(status);
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs",
        {
          "bg-amber-300 text-slate-950": status === "Pending",
          "bg-green-500 text-slate-950": status === "Paid",
        },
      )}
    >
      {status === "Pending" ? (
        <>
          Pending
          <ClockIcon className="ml-1 w-4 text-slate-950" />
        </>
      ) : null}
      {status === "Paid" ? (
        <>
          Paid
          <CheckIcon className="ml-1 w-4 text-slate-950" />
        </>
      ) : null}
    </span>
  );
}
