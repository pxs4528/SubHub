"use client";
import { lusitana } from "@/app/ui/fonts";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import UserSubscriptions from "@/app/ui/invoices/table";
import Search from "@/app/ui/search";



export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} dark:invert text-2xl`}>Manage Subscriptions</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* <Search placeholder="Search subscriptions..." /> */}
        {/* <CreateInvoice /> */}
      </div>
      <UserSubscriptions />
      {/* <Table query={query} currentPage={currentPage} /> */}
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  )
}
