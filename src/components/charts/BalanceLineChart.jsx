import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCurrency } from '../../utils/finance'

const tipStyle = {
  backgroundColor: '#18181b',
  border: '1px solid #3f3f46',
  borderRadius: '12px',
  color: '#e4e4e7',
}

export function BalanceLineChart({ data }) {
  return (
    <div className="mt-4 h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
          <defs>
            <linearGradient id="neonLineBalance" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="label" stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 11 }} interval={0} height={36} />
          <YAxis
            stroke="#71717a"
            tick={{ fill: '#a1a1aa', fontSize: 11 }}
            tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : `${v}`)}
          />
          <Tooltip
            contentStyle={tipStyle}
            formatter={(value) => [formatCurrency(value), 'Balance']}
            labelFormatter={(_, payload) => (payload?.[0]?.payload?.label ? `Period: ${payload[0].payload.label}` : '')}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="url(#neonLineBalance)"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: '#09090b', stroke: '#a855f7' }}
            activeDot={{ r: 7, fill: '#3b82f6', stroke: '#fff' }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
