import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCurrency } from '../../utils/finance'

export function IncomeExpenseLineChart({ data }) {
  return (
    <div className="mt-4 h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Line type="monotone" dataKey="income" stroke="#1d4ed8" strokeWidth={3} />
          <Line type="monotone" dataKey="expenses" stroke="#cbd5e1" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
