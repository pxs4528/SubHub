// Import required modules
import fs from 'fs';
import pdf from 'pdf-parse';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const dataBuffer = fs.readFileSync('./sample.pdf');
      const data = await pdf(dataBuffer);
      const text = data.text;

      // Define an array of subscription names
      const subscriptionNames = ['Kansas', 'Netflix', 'Prime', 'HBO']; // Add more subscription names as needed

      // Create a regular expression to match the price (in dollars and cents format)
      const priceRegex = /\$\d+\.\d{2}/i;

      // Prepare an object to store subscription details
      const subscriptions = {};

      // Loop through each subscription name
      for (const subscriptionName of subscriptionNames) {
        const searchRegex = new RegExp(`${subscriptionName}[^$]*(${priceRegex.source})`, 'i');
        const priceMatches = text.match(searchRegex);

        if (priceMatches) {
          // If multiple matches are found for the subscription, store them all in an array
          //@ts-ignore}
          subscriptions[subscriptionName] = priceMatches.map((match) => ({
            Subscription: subscriptionName,
            Price: match[1]
          }));
        }
      }

      res.status(200).json(subscriptions);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while processing the PDF' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
