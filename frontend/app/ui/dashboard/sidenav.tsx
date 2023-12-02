"use client";
import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import Logo from "@/public/assets/subhub_logo.svg";
import { PowerIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Button } from "../button";
import { useRouter } from "next/navigation";
import { sign } from "crypto";


export default function SideNav() {
  const router = useRouter();
  const SignOut = async () => {
    try {
      const response = await fetch("http://localhost:8080/sign-out", {
          method: "GET",
          credentials: "include",
      });
      if (response.ok){
        router.push("/login");
      }
    } catch (err) {
      console.error("Error signing out: ", err);
    }
  }

  return (
    <div className="bg-slate-200 dark:bg-slate-900 flex h-full flex-col px-3 py-4 md:px-2">
      <a
        className="group dark:bg-slate-700 mb-2 flex h-20 items-end justify-start rounded-md bg-slate-100 p-4 md:h-40 hover:bg-slate-700 dark:hover:bg-slate-600"
        onClick={SignOut}
      >
        <div className="group-hover:invert dark:invert w-32 md:w-40">
          <Image src={Logo} alt="SubHub Logo" />
        </div>
      </a>
      <div className="dark:bg-slate-900 flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="dark:bg-slate-900 hidden h-auto w-full grow rounded-md bg-slate-100 md:block"></div>

        <form className="w-22">
          <a onClick={SignOut}>
            <button type="button" className="group dark:bg-slate-700 flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-slate-100 p-3 text-sm font-medium hover:bg-slate-700 dark:hover:bg-slate-600 md:flex-none md:justify-start md:p-2 md:px-3">

              <PowerIcon className="group-hover:text-slate-100 text-slate-950 dark:text-slate-100 w-6" />
              <div className="group-hover:text-slate-100 text-slate-950 dark:text-slate-100 md:inline">Sign Out</div>

            </button>
          </a>
        </form>

      </div>
    </div>
  );
}
