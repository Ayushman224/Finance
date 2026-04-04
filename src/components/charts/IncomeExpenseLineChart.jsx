import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCurrency } from '../../utils/finance'

export function IncomeExpenseLineChart({ data }) {
  return (
    <div className="mt-4 h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} interval={0} height={36} />
          <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            labelFormatter={(_, payload) => (payload?.[0]?.payload?.label ? payload[0].payload.label : '')}
          />
          <Line type="monotone" dataKey="income" stroke="#1d4ed8" strokeWidth={3} />
          <Line type="monotone" dataKey="expenses" stroke="#cbd5e1" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
