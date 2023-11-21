"use client";

import { Card } from "@/app/ui/dashboard/cards";
import { lusitana } from "@/app/ui/fonts";



export default async function Page() {

  const getSubscription = async () => {
    try {
      const response = await fetch("http://localhost:8080/get-subscription-count", {
        method: "GET",
        credentials: "include",
      });

      return response.json();

    } catch (error) {
      console.error("Error:", error);
    }
  }

  const getMonthlyCost = async () => {
    try {
      const response = await fetch("http://localhost:8080/get-monthly-cost", {
        method: "GET",
        credentials: "include",
      });

      return response.json();

    } catch (error) {
      console.error("Error:", error);
    }
  }

  const subscription = await getSubscription();
  const monthlyCost = await getMonthlyCost();



  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Paid Subscriptions" value={subscription.body.paidtotal} type="collected" />
        <Card title="Pending Subscriptions" value={subscription.body.pendingtotal} type="pending" />
        <Card title="Total Amount" value={subscription.body.totalamount} type="customers" />
        <Card title="Total Subscriptions" value={subscription.body.count} type="invoices" />
      </div>
    </main >
  );
}