"use client";
import React, { useEffect, useState } from 'react';
import { Card } from "@/app/ui/dashboard/cards";
import { lusitana } from "@/app/ui/fonts";
import ChartComponent from '@/app/components/charts/index';
import { LatestInvoice } from '@/app/lib/definitions';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';


interface SubscriptionData {
  paidtotal: number;
  pendingtotal: number;
  totalamount: number;
  count: number;
}


export default async function Page() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [latestSubsctiption, setLatestSubscription] = useState<LatestInvoice[] | null>(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const response = await fetch("http://localhost:8080/get-subscription-count", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setSubscription(data.body);
      } catch (err) {
        console.error("Error fetching subscription data: ", err);
      }
    };

    const fetchLatestSubscription = async () => {
      try {
        const response = await fetch("http://localhost:8080/get-latest-subscription", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setLatestSubscription(data.body);
      } catch (err) {
        console.error("Error fetching latest subscription: ", err);
      }
    };

    fetchSubscriptionData();
    fetchLatestSubscription();
  }, []);
  return (
    <main>
      <h1 className={`${lusitana.className} dark:invert mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Paid Subscriptions" value={subscription?.paidtotal ?? 0} type="collected" />
        <Card title="Pending Subscriptions" value={subscription?.pendingtotal ?? 0} type="pending" />
        <Card title="Total Amount" value={subscription?.totalamount ?? 0} type="customers" />
        <Card title="Total Subscriptions" value={subscription?.count ?? 0} type="invoices" />
      </div>
      <div>
        <div>
          <LatestInvoices latestInvoices={latestSubsctiption} />
        </div>

        <ChartComponent />
      </div>
    </main >
  );
}