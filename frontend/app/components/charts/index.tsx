"use client";
import React, { useEffect, useRef, useState } from "react";
import Chart, { ChartConfiguration } from "chart.js/auto";
import { lusitana } from "@/app/ui/fonts";
import { Elsie_Swash_Caps } from "next/font/google";

function isDarkMode() {
  if (typeof window !== "undefined") {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  return false;

}

export default function ChartComponent() {
  function useDarkMode() {
    const [isDark, setIsDark] = useState(isDarkMode());

    useEffect(() => {
      const matcher = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = (e: any) => setIsDark(e.matches);

      matcher.addEventListener('change', onChange);
      return () => matcher.removeEventListener('change', onChange);
    }, []);

    return isDark;
  }

  const isDark = useDarkMode();

  function getGridColor() {
    return isDark ? 'rgba(241,245,249,0.5)' : 'rgba(0, 0, 0, 0.5)';
  }

  function getTextColor() {
    return isDark ? 'rgba(241,245,249)' : 'rgba(0, 0, 0)';
  }


  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const [monthlyData, setMonthlyData] = useState<number[]>([]);
  const colors = {
    purple: isDark ? {
      default: "rgba(165, 197, 233,1)",
      half: "rgba(165, 197, 233, 0.8)",
      quarter: "rgba(165, 197, 233, 0.5)",
      zero: "rgba(165, 197, 233, 0)"
    } : {
      default: "rgba(23,37,84,1)",
      half: "rgba(23,37,84,0.8)",
      quarter: "rgba(23,37,84,0.5)",
      zero: "rgba(23,37,84,0)"
    },
    text: getTextColor()
  };
  useEffect(() => {
    const monthlyExpenses = async () => {
      try {
        const response = await fetch("http://localhost:8080/get-monthly-cost", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        const expensesData = data.body.map((item: any) => item.monthlyexpenses);
        setMonthlyData(expensesData); // Update state with fetched data
      } catch (err) {
        console.log("Error: ", err);
      }
    }

    monthlyExpenses();
  }, []);
  useEffect(() => {
    const ctx = canvasEl.current?.getContext('2d');
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 16, 0, 600);
      gradient.addColorStop(0, colors.purple.half);
      gradient.addColorStop(0.65, colors.purple.quarter);
      gradient.addColorStop(1, colors.purple.zero);
      const labels = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
      const data = {
        labels: labels,
        datasets: [
          {
            backgroundColor: gradient,
            label: "Expenses",
            data: monthlyData,
            fill: true,
            borderWidth: 2,
            borderColor: colors.purple.default,
            lineTension: 0.2,
            pointBackgroundColor: colors.purple.default,
            pointRadius: 3
          }
        ]
      };

      const config: ChartConfiguration<'line', number[], string> = {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          animation: {
            duration: window.innerWidth > 600 ? 1000 : 0,
          },
          scales: {

            x: {
              grid: {
                color: getGridColor(),
              },
              ticks: { color: colors.text },
            },
            y: {
              grid: {
                color: getGridColor(),
              },
              ticks: { color: colors.text },
            }
          },
          plugins: {
            legend: {
              labels: { color: colors.text }
            }
          }

        }

      };

      const myLineChart = new Chart(ctx, config);

      return () => {
        myLineChart.destroy();
      };
    }
  }, [monthlyData, colors]); // Dependency array includes monthlyExpenses and colors

  return (

    <div className="App py-5">
      <h2 className={`${lusitana.className} dark:invert mb-4 text-xl md:text-2xl`}>
        Yearly Spending
      </h2>
      <canvas id="myChart" ref={canvasEl} height="50" />
    </div>
  );
}
