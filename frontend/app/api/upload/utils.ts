export async function parser(data: string) {
    const text = data;

    // Define regex patterns for transaction names, dates, and amounts
    const transactionNameRegex = /[A-Za-z\s]+(?=\s+\$[\d,]+\.\d{2})/g;
    const transactionDateRegex = /\d{2}-\d{2}(?=\s+\$[\d,]+\.\d{2})/g;
    const transactionAmountRegex = /\$[\d,]+\.\d{2}/g;

    // Extract transaction names, dates, and amounts using regex
    const transactionNames = text.match(transactionNameRegex);
    const transactionDates = text.match(transactionDateRegex);
    const transactionAmounts = text.match(transactionAmountRegex);

    if (transactionNames && transactionDates && transactionAmounts) {
        // Display extracted transaction details
        for (let i = 0; i < transactionNames.length; i++) {
            console.log(`Transaction Name: ${transactionNames[i]}`);
            console.log(`Date: ${transactionDates[i]}`);
            console.log(`Amount: ${transactionAmounts[i]}`);
            console.log('-------------------------');
        }
    }
}
