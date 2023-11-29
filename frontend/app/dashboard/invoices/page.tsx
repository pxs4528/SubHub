"use client";
import { lusitana } from "@/app/ui/fonts";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import UserSubscriptions from "@/app/ui/invoices/table";
import Search from "@/app/ui/search";



export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-slate-950 dark:text-slate-100 text-3xl md:text-3xl py-5`}>Manage Subscriptions</h1>
      </div>
      <UserSubscriptions />
    </div>
  )
}
