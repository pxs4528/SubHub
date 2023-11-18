const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('./sample.pdf');

pdf(dataBuffer).then((data) => {
    const text = data.text;
    // console.log(text);

    // Define an array of subscription names
    const subscriptionNames = ['Kansas', 'Panda', 'Braums', 'Netflix', 'Prime', 'HBO']; // Add more subscription names as needed

    // Create a regular expression to match the price (in dollars and cents format)
    const priceRegex = /(?:\$\d+\.\d{2})|(?:-(\d+\.\d{2}))/i;
    const dateRegex = /\b(\d{2}\/\d{2})\b/;
    // Loop through each subscription name
    for (const subscriptionName of subscriptionNames) {
        const searchRegex = new RegExp(`${dateRegex.source}[^-]*${subscriptionName}[^-]*(${priceRegex.source})`, 'i');
        const match = text.match(searchRegex);

        if (match) {
            const date = match[1];
            const price = match[2] || match[3];
            console.log(`Date: ${date}`);
            console.log(`Subscription: ${subscriptionName}`);
            console.log(`Price: ${price}`);
        }
    }
});
