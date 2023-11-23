"use client";
import { lusitana } from "@/app/ui/fonts";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import UserSubscriptions from "@/app/ui/invoices/table";
import Search from "@/app/ui/search";

// export default async function Page({ searchParams, }: {
//   searchParams?: { query?: string; page?: string; };
// }) {
//   const query = searchParams?.query || "";
//   const currentPage = Number(searchParams?.page) || 1;
//   const totalPages = await fetchInvoicesPages(query);

//   return (
//     <div className="w-full">
//       <div className="flex w-full items-center justify-between">
//         <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
//       </div>
//       <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
// <Search placeholder="Search subscriptions..." />
//         <CreateInvoice />
//       </div>
//       <Table query={query} currentPage={currentPage} />
//       <div className="mt-5 flex w-full justify-center">
//         <Pagination totalPages={totalPages} />
//       </div>
//     </div>
//   );
// }

export default async function pag() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} dark:invert text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search subscriptions..." />
        <CreateInvoice />
      </div>
      <UserSubscriptions />
      {/* <Table query={query} currentPage={currentPage} /> */}
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  )
}
