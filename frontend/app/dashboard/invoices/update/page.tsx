"use client";
import Form from "@/app/ui/invoices/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchCustomers } from "@/app/lib/data";
import React, { useEffect, useState } from 'react';
import { CustomerField, SubscriptionsField, SubscriptionsTable } from "@/app/lib/definitions";



export default function Page() {
  const [allSubscriptions, setAllSubscriptions] = useState<SubscriptionsTable[] | null>(null);
  useEffect(() => {
    const getAllsubscriptionData = async () => {
      try {
        const response = await fetch("http://localhost:8080/get-user-subscriptions", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {

          const data = await response.json();
          setAllSubscriptions(data.body);
        }
        else {
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Error fetching subscription data: ", err);
      }
    };
    getAllsubscriptionData(); // Need to work on update component in UI to fix error's but seems to be working decently right now
  }, []);
  return (
    <main>
      <Form subscriptions={allSubscriptions} /> 
    </main>
  );
}
