import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

export function SavingsRatePie({ income, expenses }) {
  return (
    <div className="mt-8 h-44">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[
              { name: 'saved', value: Math.max(income - expenses, 0) },
              { name: 'spent', value: expenses || 1 },
            ]}
            dataKey="value"
            innerRadius={48}
            outerRadius={70}
            startAngle={90}
            endAngle={-270}
          >
            <Cell fill="#10b981" />
            <Cell fill="#e2e8f0" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
