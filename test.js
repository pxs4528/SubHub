const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('./sample.pdf');

pdf(dataBuffer).then((data) => {
    const text = data.text;

    // Define an array of subscription names
    const subscriptionNames = ['Kansas', 'Netflix', 'Prime', 'HBO']; // Add more subscription names as needed

    // Create a regular expression to match the price (in dollars and cents format)
    const priceRegex = /\$\d+\.\d{2}/i;

    // Loop through each subscription name
    for (const subscriptionName of subscriptionNames) {
        const searchRegex = new RegExp(`${subscriptionName}[^$]*(${priceRegex.source})`, 'i');
        const priceMatch = text.match(searchRegex);

        if (priceMatch) {
            const price = priceMatch[1];
            console.log(`Subscription: ${subscriptionName}`);
            console.log(`Price: ${price}`);
        }
    }
});