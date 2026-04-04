import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { CHART_COLORS } from '../../constants/finance'
import { formatCurrency } from '../../utils/finance'

const tipStyle = {
  backgroundColor: '#18181b',
  border: '1px solid #3f3f46',
  borderRadius: '12px',
  color: '#e4e4e7',
}

export function CategoryExpensePie({ categoryData }) {
  if (!categoryData.length) {
    return <p className="mt-4 text-sm text-zinc-500">No expense data for this period.</p>
  }
  const total = categoryData.reduce((s, c) => s + c.value, 0)
  const top = categoryData[0]
  const pct = total > 0 && top ? Math.round((top.value / total) * 100) : 0

  return (
    <div className="mt-4 h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={56} outerRadius={88} stroke="#18181b" strokeWidth={2}>
            {categoryData.map((entry, index) => (
              <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tipStyle} formatter={(value) => formatCurrency(value)} />
        </PieChart>
      </ResponsiveContainer>
      {top && (
        <p className="mt-2 text-center text-sm font-semibold text-violet-300/90">
          {pct}% · {top.name}
        </p>
      )}
    </div>
  )
}
