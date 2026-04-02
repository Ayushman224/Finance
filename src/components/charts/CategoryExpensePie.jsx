import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { CHART_COLORS } from '../../constants/finance'
import { formatCurrency } from '../../utils/finance'

export function CategoryExpensePie({ categoryData }) {
  if (!categoryData.length) {
    return <p className="mt-4 text-sm text-slate-500">No data available</p>
  }
  return (
    <div className="mt-4 h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={96}>
            {categoryData.map((entry, index) => (
              <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value)} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
