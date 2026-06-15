import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AXIS_TICK = { fontSize: 11, fill: "#6B6557", fontFamily: "Inter" };

export default function TrajectoryChart({
  actual,
  cohort,
  projection,
  xLabel = "Months since career start",
  yLabel = "Competency index",
  height = 240,
}) {
  const byM = {};
  const add = (points, key) => {
    (points || []).forEach((p) => {
      byM[p.m] = { ...byM[p.m], m: p.m, [key]: p.v };
    });
  };
  add(actual, "actual");
  add(cohort, "cohort");
  add(projection, "projection");
  const data = Object.values(byM).sort((a, b) => a.m - b.m);

  return (
    <div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
            <CartesianGrid stroke="#ddd8cc" vertical={false} />
            <XAxis
              dataKey="m"
              type="number"
              domain={[0, "dataMax"]}
              allowDecimals={false}
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ stroke: "#ddd8cc" }}
            />
            <YAxis
              domain={[0, 100]}
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#efece3",
                border: "1px solid rgba(255,255,255,0.4)",
                borderRadius: 12,
                boxShadow:
                  "4px 4px 8px rgba(0,0,0,0.06), -4px -4px 8px rgba(255,255,255,0.7)",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 12,
                color: "#1b1c19",
              }}
              labelStyle={{ color: "#6B6557" }}
              labelFormatter={(m) => `Month ${m}`}
            />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke="#112250"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="cohort"
              name="Cohort average"
              stroke="#9A937F"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
            />
            {projection && (
              <Line
                type="monotone"
                dataKey="projection"
                name="Projection"
                stroke="#1F7A5C"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5 font-body text-xs text-txt-dim">
            <span className="inline-block h-0.5 w-4 bg-secondary" /> Actual
          </span>
          <span className="flex items-center gap-1.5 font-body text-xs text-txt-dim">
            <span className="inline-block h-0.5 w-4 border-t border-dashed border-[#9A937F]" />{" "}
            Cohort average
          </span>
          {projection && (
            <span className="flex items-center gap-1.5 font-body text-xs text-txt-dim">
              <span className="inline-block h-0.5 w-4 border-t border-dashed border-accent" />{" "}
              Projection
            </span>
          )}
        </div>
        <p className="font-body text-xs text-txt-dim">
          {xLabel} · {yLabel}
        </p>
      </div>
    </div>
  );
}
