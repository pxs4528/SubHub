"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { client } from "@/app/lib/db/index";
const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const CreateInvoice = InvoiceSchema.omit({ id: true, date: true });
const UpdateInvoice = InvoiceSchema.omit({ date: true });
const DeleteInvoice = InvoiceSchema.pick({ id: true });
const db = client();

export async function createInvoice(subscriptionId: string, subscriptionName: string, Amount: number, Status: string, isOtherSelected : boolean) {
  console.log("actionsts", subscriptionId, subscriptionName, Amount, Status)
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: subscriptionId,
    amount: Amount,
    status: Status,
  });
  // try {
  //   const response = await db.query("SHOW TABLES");
  //   console.log(response);
  // } catch (error) {
  //   console.error(error);
  // }
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];
  const email = "test LOL"
  const image_url = "/customers/netflix.png"

  try {
    if (isOtherSelected) {
      await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${subscriptionId}, ${amountInCents}, ${status}, ${date})
      `;
      await sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${subscriptionId}, ${subscriptionName}, ${email}, ${image_url})
      `;
    }
    else {
      await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${subscriptionId}, ${amountInCents}, ${status}, ${date})
      `;
    }
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(formData: FormData) {
  const { id, customerId, amount, status } = UpdateInvoice.parse({
    id: formData.get("id"),
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
          UPDATE invoices
          SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
          WHERE id = ${id}
        `;
  } catch (error) {
    return { message: "Database Error: Failed to Update Invoice." };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(formData: FormData) {
  const { id } = DeleteInvoice.parse({
    id: formData.get("id"),
  });

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
    return { message: "Deleted Invoice." };
  } catch (error) {
    return { message: "Database Error: Failed to Delete Invoice." };
  }
}
