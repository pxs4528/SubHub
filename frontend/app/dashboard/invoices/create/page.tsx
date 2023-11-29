"use client";
import Form from "@/app/ui/invoices/create-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchCustomers } from "@/app/lib/data";
import React, { useEffect, useState } from 'react';
import { SubscriptionsField } from "@/app/lib/definitions";



export default function Page() {
  const [allSubscriptions, setAllSubscriptions] = useState<SubscriptionsField[] | null>(null);
  useEffect(() => {
    const getAllsubscriptionData = async () => {
      try {
        const response = await fetch("http://localhost:8080/get-subscription-list", {
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
    getAllsubscriptionData();
  }, []);
  return (
    <main>
      {/* <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Create Invoice",
            href: "/dashboard/invoices/create",
            active: true,
          },
        ]}
      /> */}
      <Form customers={allSubscriptions} />
    </main>
  );
}
