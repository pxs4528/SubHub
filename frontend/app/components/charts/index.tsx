"use client";
import React, { useEffect, useRef, useState } from "react";
import Chart, { ChartConfiguration } from "chart.js/auto";

export default function ChartComponent() {
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  const colors = {
    purple: {
      default: "rgba(149, 76, 233, 1)",
      half: "rgba(149, 76, 233, 0.5)",
      quarter: "rgba(149, 76, 233, 0.25)",
      zero: "rgba(149, 76, 233, 0)"
    },
    indigo: {
      default: "rgba(80, 102, 120, 1)",
      quarter: "rgba(80, 102, 120, 0.25)"
    }
  };

  useEffect(() => {
    const getMonthlyCost = async () => {
      try {
        const response = await fetch("http://localhost:8080/get-monthly-cost", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setMonthlyExpenses(data.body.monthlyexpenses);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getMonthlyCost();

  }, []); // Empty dependency array to run only once after component mounts

  useEffect(() => {
    const ctx = canvasEl.current?.getContext('2d');

    if (ctx && monthlyExpenses && monthlyExpenses.length > 0) {
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
            data: monthlyExpenses,
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
        data: data
      };

      const myLineChart = new Chart(ctx, config);

      return () => {
        myLineChart.destroy();
      };
    }
  }, [monthlyExpenses, colors.purple, colors.indigo]); // Dependency array includes monthlyExpenses and colors

  return (
    <div className="App">
      <canvas id="myChart" ref={canvasEl} height="50" />
    </div>
  );
}
