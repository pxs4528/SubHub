"use client";
import React, { useEffect, useState } from 'react';
import { Card } from "@/app/ui/dashboard/cards";
import { lusitana } from "@/app/ui/fonts";
import ChartComponent from '@/app/components/charts/index';
import { LatestInvoice, Revenue } from '@/app/lib/definitions';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import { set } from 'zod';

interface SubscriptionData {
  paidtotal: number;
  pendingtotal: number;
  totalamount: number;
  count: number;
}


export default async function Page() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [latestSubsctiption, setLatestSubscription] = useState<LatestInvoice[] | null>(null);
  const [monthlyData, setMonthlyData] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [revenue, setRevenue] = useState<Revenue[]>([]);
  const getMonthName = (index: number): string => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return months[index];
  };
  const fetchMonthlyExpenses = async () => {
    try {
      const response = await fetch("http://localhost:8080/get-monthly-cost", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const expensesData = data.body.map((item: any) => item.monthlyexpenses);
        setMonthlyData(expensesData);
        const monthlyExpensesData = data.body.map((item: any, index: number) => ({
          month: getMonthName(index), // You need to implement getMonthName function
          revenue: item.monthlyexpenses,
        }));
        setRevenue(monthlyExpensesData);
      } else {
        setError("Failed to fetch monthly expenses. Please try again later.");
      }
    } catch (err) {
      console.error("Error fetching monthly expenses: ", err);
      setError("An error occurred while fetching monthly expenses.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMonthlyExpenses();
  }, []);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const response = await fetch("http://localhost:8080/get-subscription-count", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {

          const data = await response.json();
          setSubscription(data.body);
        }
        else {
          window.location.href = "/login";
        }
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
        if (response.ok) {

          const data = await response.json();
          setLatestSubscription(data.body);
        }
        else {
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Error fetching latest subscription: ", err);
      }
    };

    fetchSubscriptionData();
    fetchLatestSubscription();
  }, [200]);
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Paid Subscriptions" value={subscription?.paidtotal ?? 0} type="collected" />
        <Card title="Pending Subscriptions" value={subscription?.pendingtotal ?? 0} type="pending" />
        <Card title="Total Amount" value={subscription?.totalamount ?? 0} type="customers" />
        <Card title="Total Subscriptions" value={subscription?.count ?? 0} type="invoices" />
      </div>
      <div>
       <div className='hidden lg:block'>
        <ChartComponent />
       </div>
       <div className='md:hidden'>
        <RevenueChart revenue={revenue} />
       </div>
       
        <div>
          <LatestInvoices latestInvoices={latestSubsctiption} />
        </div>
      </div>
    </main >
  );
}