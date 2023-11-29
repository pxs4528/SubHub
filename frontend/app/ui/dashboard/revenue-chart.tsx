import { generateYAxis } from "@/app/lib/utils";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { Revenue } from "@/app/lib/definitions";
// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default async function RevenueChart({
  revenue,
}: {
  revenue: Revenue[];
}) {
  const { yAxisLabels, topLabel } = generateYAxis(revenue);
  const chartHeight = 500;

  return (
    <div className="w-full md:col-span-4 py-5">
      <h2 className={`${lusitana.className} text-slate-950 dark:text-slate-100 mb-4 text-xl md:text-2xl`}>
        Yearly Spending
      </h2>
      {/* NOTE: comment in this code when you get to this point in the course */}

      <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-slate-200 dark:bg-slate-700 p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-slate-950 dark:text-slate-100 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {revenue.map((month) => (
            <div key={month.month} className="text-slate-950 dark:text-slate-100 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-sky-900 dark:bg-sky-300"
                style={{
                  height: `${(chartHeight / topLabel) * month.revenue}px`,
                }}
              ></div>
              <p className="-rotate-90 text-sm text-slate-950 dark:text-slate-100 sm:rotate-0">
                {month.month}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-slate-950 dark:text-slate-100" />
          <h3 className="ml-2 text-sm text-slate-950 dark:text-slate-100 ">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}
