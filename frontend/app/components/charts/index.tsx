'use client'
import React, { useEffect, useRef } from "react";
import Chart, { ChartConfiguration } from "chart.js/auto";
import { fetchRevenue } from "@/app/lib/data";

export default function chart() {
  const rev_data: number[] = [];

async function fetchData() {
    try {
        const data = await fetchRevenue();
        data.forEach((item) => {
            rev_data.push(item.revenue);
        });
    } catch (error) {
        console.error(error);
    }
}

fetchData();

  const canvasEl = useRef(null);

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
    const ctx = canvasEl.current.getContext("2d");
    // const ctx = document.getElementById("myChart");

    const gradient = ctx.createLinearGradient(0, 16, 0, 600);
    gradient.addColorStop(0, colors.purple.half);
    gradient.addColorStop(0.65, colors.purple.quarter);
    gradient.addColorStop(1, colors.purple.zero);

    const weight = [2000.0, 1800.0, 2800.0,
      4800.0, 3200.0, 3500.0,
      3700.0, 2500.0, 2300.0,
      2200.0, 2500.0, 3000.0];

    const labels = [
      "Jan",
      "Feb",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec"
    ];
    const data = {
      labels: labels,
      datasets: [
        {
          backgroundColor: gradient,
          label: "Expenses",
          data: weight,
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

    return function cleanup() {
      myLineChart.destroy();
    };
  });

  return (
    <div className="App">
      <canvas id="myChart" ref={canvasEl} height="50" />
    </div>
  );
}
