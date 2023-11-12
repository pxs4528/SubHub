"use server";
import { headers } from 'next/headers';
import { Card } from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana } from "@/app/ui/fonts";
import { OnLoad } from "next/dist/shared/lib/get-img-props";
import {
  fetchRevenue,
  fetchLatestInvoices,
  fetchCardData,
} from "@/app/lib/data";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'
import { getCookie, getCookies, setCookie } from 'cookies-next';
import { NextPageContext } from 'next';



export default async function Page() {

    
    
    const JWTToken = cookies().get("Token")?.value
    const Access = cookies().get("Access")?.value
    const Validation = cookies().get("Validated")?.value
    if(Validation !== 'True' || JWTToken == undefined || Access == undefined)
      redirect("/login")
    
       
    const response = await fetch("http://localhost:8080/validate-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 'Token': JWTToken }),
    });
    

    // console.log(response.status)
        


  const headerList = headers();
  const referer = headerList.get('Access');
  // console.log(referer);
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();
  const latestInvoices = await fetchLatestInvoices();
  const revenue = await fetchRevenue();
  
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue} />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}