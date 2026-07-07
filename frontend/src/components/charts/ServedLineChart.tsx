import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ServedLineChartProps {
  data: { hour: string; served: number }[];
}

export default function ServedLineChart({ data }: ServedLineChartProps) {
  // Trim to business-relevant hours (6am - 11pm) for readability
  const trimmed = data.filter((d) => {
    const hour = parseInt(d.hour.split(":")[0], 10);
    return hour >= 6 && hour <= 23;
  });

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={trimmed} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
        <XAxis dataKey="hour" tick={{ fontSize: 11 }} interval={2} stroke="currentColor" className="text-slate-500" />
        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} stroke="currentColor" className="text-slate-500" />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
        <Line
          type="monotone"
          dataKey="served"
          name="Served"
          stroke="#5B63E8"
          strokeWidth={2.5}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
