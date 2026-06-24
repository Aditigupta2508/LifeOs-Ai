"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", value: 2 },
  { day: "Tue", value: 3 },
  { day: "Wed", value: 5 },
  { day: "Thu", value: 4 },
  { day: "Fri", value: 6 },
];

export default function HabitChart() {
  return (
    <div className="bg-slate-900 p-6 rounded-xl">

      <h2 className="text-2xl font-bold mb-4">
        Habit Progress
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}