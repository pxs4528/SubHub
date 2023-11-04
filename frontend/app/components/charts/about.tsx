import { useEffect, useRef } from "react";
import { Chart } from "chart.js";

export default function chart() {
  const canvasEl = useRef(null);

  useEffect(() => {
    const ctx = canvasEl.current;
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              "Red",
              "Blue",
              "Yellow",
              "Green",
              "Purple",
              "Orange"
            ],
            borderColor: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            borderWidth: 1
          }
        ]
      }
    });
  }, []);
  return (
    <div>
      <span>Chart.js Demo</span>
      <canvas ref={canvasEl} width="400" height="400" />
    </div>
  );
}
