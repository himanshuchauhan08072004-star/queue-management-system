import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface StatusPieChartProps {
  data: { name: string; value: number }[];
}

const COLORS: Record<string, string> = {
  Waiting: "#f59e0b",
  Completed: "#10b981",
  Cancelled: "#f43f5e",
};

export default function StatusPieChart({ data }: StatusPieChartProps) {
  const hasData = data.some((d) => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={hasData ? data : [{ name: "No data", value: 1 }]}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={hasData ? 3 : 0}
        >
          {(hasData ? data : [{ name: "No data", value: 1 }]).map((entry) => (
            <Cell
              key={entry.name}
              fill={hasData ? COLORS[entry.name] ?? "#94a3b8" : "#e2e8f0"}
            />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
