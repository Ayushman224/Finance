import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCurrency } from '../../utils/finance'

export function BalanceLineChart({ data }) {
  return (
    <div className="mt-4 h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="label"
            stroke="#64748b"
            tick={{ fontSize: 11 }}
            interval={0}
            height={36}
          />
          <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : `${v}`)} />
          <Tooltip
            formatter={(value) => [formatCurrency(value), 'Balance']}
            labelFormatter={(_, payload) => (payload?.[0]?.payload?.label ? `Period: ${payload[0].payload.label}` : '')}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#1d4ed8"
            strokeWidth={2.5}
            dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#1d4ed8' }}
            activeDot={{ r: 6 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
