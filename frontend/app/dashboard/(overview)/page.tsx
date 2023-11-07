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
import { headers } from 'next/headers';
import router from "next/router";


export default async function Page() {

  const validate = async () => {
    try {
      const response = await fetch("http://localhost:8080/validate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        // Successful login (status code 200-299)
        console.log("JWT Validated");

        const data = await response.json(); // Assuming the response contains JSON data
        console.log(data)
        // sessionStorage.setItem('userID', JSON.stringify(data.body)); // Store the response data in sessionStorage
        // router.push("/dashboard");
      } else {
        // Handle other status codes
        const data = await response.json(); // Assuming the response contains JSON data
        console.log(data)
        console.log("JWT not found:", response.status);
        // router.push("/login");
        // You can add additional handling based on different response status codes if needed
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network errors or exceptions
    }
  };

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