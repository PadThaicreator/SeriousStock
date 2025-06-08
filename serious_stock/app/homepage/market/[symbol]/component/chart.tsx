/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Line } from "react-chartjs-2";

export default function MyLineChart({
  labels,
  dataPoints,
}: {
  labels: string[];
  dataPoints: number[];
}) {
  const startPrice = dataPoints[0] || 0;
  const endPrice = dataPoints[dataPoints.length - 1] || 0;
  const isPositiveTrend = endPrice >= startPrice;
  const gradientColor = isPositiveTrend
    ? "rgba(16, 185, 129, 0.1)"
    : "rgba(239, 68, 68, 0.1)";
  const lineColor = isPositiveTrend
    ? "rgba(16, 185, 129)"
    : "rgba(239, 68, 68)";
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Stock Price",
        data: dataPoints,
        fill: true,
        borderColor: lineColor,
        backgroundColor: function (context: any) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, gradientColor);
          gradient.addColorStop(0.8, "rgba(255, 255, 255, 0.5)");

          return gradient;
        },
        pointRadius: 0,
        pointHoverRadius: 6,
        tension: 0.5,
        pointBorderWidth: 2,
        borderWidth: 3,
        pointHoverBackgroundColor: lineColor,
      },
    ],
  };

  return (
    <div className="w-full h-[400px]">
      <Line
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true, // เปิด/ปิด tooltip เวลา hover
              mode: "index",
              intersect: false,
            },
          },
          interaction: {
            mode: "nearest",
            intersect: false,
          },
        }}
      />
    </div>
  );
}
