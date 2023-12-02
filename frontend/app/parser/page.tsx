'use client'
import { CurrencyDollarIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { FormEventHandler, JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useEffect, useRef, useState } from "react";
import { lusitana } from "../ui/fonts";
import { set } from "zod";
export default function Home() {
  const router = useRouter();
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState<string>('');

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && currentKeyword.trim() !== '') {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentKeyword(event.target.value);
  };

  const handleRemoveKeyword = (index: number) => {
    const updatedKeywords = [...keywords];
    updatedKeywords.splice(index, 1);
    setKeywords(updatedKeywords);
  };


  const handleFormSubmission: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    //set this data to susbscriptions
    Object.keys(data).forEach(key => {
      const [type, id] = key.split('-');
      if (type === 'subscription') {
        //@ts-ignore
        subscriptions[id].subscriptionName = data[key];
      } else if (type === 'date') {
        //@ts-ignore
        subscriptions[id].formattedDate = data[key];
      } else if (type === 'amount') {
        //@ts-ignore
        subscriptions[id].price = Number(data[key]);
      }
    });
    setAmazingData(subscriptions);
  };

  const [subscriptions, setSubscriptions] = useState<Record<string, { formattedDate: string; price: number }> | null>(null);
  const [allSubs, setAllSubs] = useState<
    { subscriptionName: string; amount: number; status: string; month: number; }[]
  >([]);


  const SendtoDB = async (data: { subscriptionName: string; amount: number; status: string; month: number; }[]) => {
    const formattedData = data.map(({ subscriptionName, amount, status, month }) => ({
      Name: subscriptionName,
      Amount: amount,
      Status: status,
      Month: month,
    }));
    
    for( let i = 0; i < formattedData.length; i++)
    {
      console.log(JSON.stringify(formattedData[i]));
      const response = await fetch('http://localhost:8080/insert-subscription', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData[i]),
      });
      if (response.ok) {
        console.log("success");
        router.push('/dashboard');
      } else {
        console.error('Error uploading file:', response.statusText);
      }
    }
  }


  const setAmazingData = (data: Record<string, { formattedDate: string; price: number }> | null) => {
    console.log("amazing", data);
    if (data === null) {
      return;
    }

    const today = new Date();

    const calculateMonths = (formattedDate: string) => {
      const startDate = new Date(formattedDate);
      const diffInMonths = (today.getFullYear() - startDate.getFullYear()) * 12 + (today.getMonth() - startDate.getMonth());
      return diffInMonths;
    }

    const allSubsArray = Object.keys(data).map(subscriptionKey => {
      const subscription = data[subscriptionKey];
      //@ts-ignore
      const subName = data[subscriptionKey].subscriptionName;
      return {
        subscriptionName: subName,
        amount: subscription.price,
        status: "Paid",
        month: calculateMonths(subscription.formattedDate),
      };
    });
    setAllSubs(allSubsArray);
    SendtoDB(allSubsArray);
  }


  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileUpload: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      keywords.forEach((keyword, index) => {
        formData.append(`keywords[${index}]`, keyword);
      });
      console.log(formData);
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setSubscriptions(data);
        } else {
          console.error('Error uploading file:', response.statusText);
        }
      } catch (error: any) {
        console.error('Error uploading file:', error.message);
      }
    }
  };
  return subscriptions ?
    <>
      <div>
        <h1 className={`${lusitana.className} text-xl text-center m-3 text-slate-950 dark:text-slate-100 md:text-3xl md:leading-normal`}>
          Parsed Subscriptions
        </h1>
      </div>
      <form onSubmit={handleFormSubmission}>
        <div className="mt-6 flow-root ">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg dark:bg-slate-800 bg-slate-200 p-2 md:py-0">
              {/* bg-slate-50 text-slate-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-slate-100 dark:focus:ring-blue-500 dark:focus:border-blue-500 */}
              {Object.entries(subscriptions).map(([key, value]) => (
                <div key={key} className="border-b border-gray-200 p-2 sm:p-4">
                  {/* Choose Subscription */}
                  <div className="mb-4">
                    <label htmlFor={`subscription-${key}`} className="mb-2 block text-sm font-medium text-slate-950 dark:text-slate-100">
                      Choose Subscription
                    </label>
                    <input
                      id={`subscription-${key}`}
                      name={`subscription-${key}`}
                      className="w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 bg-slate-50 text-slate-900 focus:ring-primary-600 focus:border-primary-600 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-slate-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      defaultValue={key}
                    />
                  </div>

                  {/* Choose Date */}
                  <div className="mb-4">
                    <label htmlFor={`date-${key}`} className="mb-2 block text-sm font-medium text-slate-950 dark:text-slate-100">
                      Choose Date
                    </label>
                    <input
                      id={`date-${key}`}
                      name={`date-${key}`}
                      type="date"
                      className="w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 bg-slate-50 text-slate-900 focus:ring-primary-600 focus:border-primary-600 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-slate-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      defaultValue={value.formattedDate}
                    // onSubmit={
                    //   //number of months from current data
                    //   // (e) => setMonth(Math.round((new Date(e.target.value).getTime() - new Date().getTime()) / (1000 * 3600 * 24 * 30)))
                    // }
                    />
                  </div>

                  {/* Choose Amount */}
                  <div className="mb-4">
                    <label htmlFor={`amount-${key}`} className="mb-2 block text-sm font-medium text-slate-950 dark:text-slate-100">
                      Choose an amount
                    </label>
                    <input
                      id={`amount-${key}`}
                      name={`amount-${key}`}
                      type="number"
                      step="any" defaultValue={value.price}
                      placeholder="Enter USD amount"
                      // onSubmit={(e) => setAmount(Number(e.target.value))}
                      className="w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 bg-slate-50 text-slate-900 focus:ring-primary-600 focus:border-primary-600 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-slate-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-1/3 m-6 box-content inline-flex items-center justify-center px-3 py-2 bg-blue-600 border border-transparent transition-transform hover:scale-105 rounded-md font-semibold capitalize text-white hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 disabled:opacity-25 cursor-pointer"
        >
          Submit
        </button>
      </form>
    </>

    : (
      <main className='flex min-h-screen flex-col items-center justify-between p-24 text-slate-950 dark:text-slate-100'>
        <div>
          <h2>You can enter keywords here to search for in your PDF:</h2>
          <ul>
            {keywords.map((keyword, index) => (
              <li key={index} >
                {keyword}
                <button className='m-3' onClick={() => handleRemoveKeyword(index)}>❌</button>
              </li>
            ))}
          </ul>

          <input
            type="text"
            placeholder="Keyword"
            value={currentKeyword}
            onKeyPress={handleKeyPress}
            onChange={handleChange}
            className="my-5 bg-slate-50 text-slate-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-slate-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div className='w-96'>
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-10 h-10 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF Files only
                  </p>
                </div>
                <form onSubmit={handleFileUpload}
                >
                  <input title="file" type="file" name="file" ref={inputRef} />
                  <button type="submit"
                    className="w-1/2 box-content inline-flex items-center justify-center px-3 py-2 bg-blue-600 border border-transparent transition-transform hover:scale-105 rounded-md font-semibold capitalize text-white hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 disabled:opacity-25 cursor-pointer"
                  >
                    Upload
                  </button>            </form>{" "}
              </label>
            </div>
            <script src="https://unpkg.com/flowbite@1.4.0/dist/flowbite.js"></script>
          </div>      </div>
      </main>
    );
}