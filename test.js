const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('./sample.pdf');

pdf(dataBuffer).then((data) => {
    const text = data.text;

    // Define an array of subscription names
    const subscriptionNames = ['Kansas', 'Panda', 'Braums', 'Netflix', 'Prime', 'HBO']; // Add more subscription names as needed

    // Create a regular expression to match the price (in dollars and cents format)
    const priceRegex = /(?:\$\d+\.\d{2})|(?:-(\d+\.\d{2}))/i;
    const dateRegex = /\b(\d{2}\/\d{2})\b/;
    const year = new Date().getFullYear(); 

    // Loop through each subscription name
    for (const subscriptionName of subscriptionNames) {
        const searchRegex = new RegExp(`${dateRegex.source}[^-]*${subscriptionName}[^-]*(${priceRegex.source})`, 'i');
        const match = text.match(searchRegex);

        if (match) {
            let date = match[1];
            // Replace "/" with "-"
            date = date.replace(/\//g, '-');
            // Append the current year
            date = date + "-" + year;

            // Format the date in "YYYY-MM-DD" using toISOString()
            const formattedDate = new Date(date).toISOString().split("T")[0];

            const price = match[2] || match[3];
            console.log(`Date: ${formattedDate}`);
            console.log(`Subscription: ${subscriptionName}`);
            console.log(`Price: ${price}`);
        }
    }
});
