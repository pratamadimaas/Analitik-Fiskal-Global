import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { css } from "../lib/data";

export function axis(opts = {}) {
  const { title, grid = true, ticks = {} } = opts;
  return {
    grid: { display: grid, color: css("--border"), drawTicks: false },
    border: { color: css("--border-strong") },
    ticks: { color: css("--text-muted"), font: { family: "JetBrains Mono", size: 10.5 }, ...ticks },
    title: title ? { display: true, text: title, color: css("--text-muted"), font: { family: "JetBrains Mono", size: 10 } } : undefined,
  };
}

export default function ChartBox({ make, height = 300, label, deps = [] }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const config = make();
    chartRef.current = new Chart(canvasRef.current, config);
    return () => chartRef.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return (
    <div style={{ height, position: "relative" }}>
      <canvas ref={canvasRef} role="img" aria-label={label}></canvas>
    </div>
  );
}
