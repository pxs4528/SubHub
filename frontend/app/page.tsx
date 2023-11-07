import Logo from "@/public/assets/subhub_logo.svg";
import Image from "next/image";
import { lusitana } from "@/app/ui/fonts";
import Chart from '@/app/components/charts/index';

import Link from "next/link";
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-red-900 p-4 md:h-52">
        <Image
          src={Logo}
          width={400}
          height={200}
          className="hidden md:block"
          alt="SubHub Logo"
        />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-black-500 px-6 py-10 md:w-2/5 md:px-20">
          <p
            className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
          >
            <strong>Welcome to SubHub.</strong>
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-green-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-400 md:text-base"
          >
            <span>Log in →</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-5 self-start rounded-lg bg-green-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-400 md:text-base"
          >
            <span>Go to Dashboard →</span>
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
        </div>
      </div>
      <div>
        <Chart />
      </div>
    </main>
  );
}
