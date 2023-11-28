"use client";
import React, { useEffect, useRef, useState } from "react";
import Chart, { ChartConfiguration } from "chart.js/auto";
import { lusitana } from "@/app/ui/fonts";




export default function ChartComponent() {
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const [monthlyData, setMonthlyData] = useState<number[]>([]);
  const colors = {
    purple: {
      default: "rgba(221, 160, 221, 1)",
      half: "rgba(221, 160, 221, 0.5)",
      quarter: "rgba(221, 160, 221, 0.25)",
      zero: "rgba(221, 160, 221, 0)"
    },
    indigo: {
      default: "rgba(173, 216, 230, 1)",
      quarter: "rgba(173, 216, 230, 0.25)"
    },
    text: "#FFF"
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
                color: 'rgba(255, 255, 255, 0.2)',
              },
              ticks: { color: colors.text },
            },
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.2)',
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
