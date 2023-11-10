// Import required modules
import { NextRequest, NextResponse } from "next/server";
// @ts-expect-error: https://gitlab.com/autokent/pdf-parse/-/issues/30
import pdf from "pdf-parse/lib/pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const file = (await req.formData()).get("file");
    if (!file || typeof file === "string") {
      throw new Error("Wrong file");
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const { text } = (await pdf(buffer)) as { text: string };

    // Define an array of subscription names
    const subscriptionNames = ["Kansas", "Netflix", "Prime", "HBO"]; // Add more subscription names as needed

    // Create a regular expression to match the price (in dollars and cents format)
    const priceRegex = /\$(?:\d{,3},)*\d+\.\d{2}/i;

    // Prepare an object to store subscription details
    const subscriptions: Record<string, number> = {};

    // Loop through each subscription name
    for (const subscriptionName of subscriptionNames) {
      const searchRegex = new RegExp(
        `${subscriptionName}[^\$\n]*(${priceRegex.source})`,
        "i"
      );
      const priceMatch = text.match(searchRegex);

      if (priceMatch) {
        // If multiple matches are found for the subscription, store them all in an array
        const price = priceMatch[1].replace(/[\$,]/g, "");
        subscriptions[subscriptionName] = parseFloat(price);
      }
    }

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while processing the PDF: " },
      { status: 500 }
    );
  }
}
