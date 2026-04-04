import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCurrency } from '../../utils/finance'

const tipStyle = {
  backgroundColor: '#18181b',
  border: '1px solid #3f3f46',
  borderRadius: '12px',
  color: '#e4e4e7',
}

export function IncomeExpenseLineChart({ data }) {
  return (
    <div className="mt-4 h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="label" stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 11 }} interval={0} height={36} />
          <YAxis stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
          <Tooltip
            contentStyle={tipStyle}
            formatter={(value) => formatCurrency(value)}
            labelFormatter={(_, payload) => (payload?.[0]?.payload?.label ? payload[0].payload.label : '')}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#a855f7"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#a855f7', strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
