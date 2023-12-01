import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};


export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number;
  type: "invoices" | "customers" | "pending" | "collected";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-slate-200 dark:bg-slate-800 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="dark:text-slate-100 text-slate-950 h-5 w-5 text-gray-700" /> : null}
        <h3 className={`${lusitana.className} dark:text-slate-100 text-slate-950 ml-2 text-sm font-medium`}>{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
        truncate rounded-xl bg-slate-100 dark:bg-slate-700 dark:text-slate-100 px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
