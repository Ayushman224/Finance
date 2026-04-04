import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const tipStyle = {
  backgroundColor: '#18181b',
  border: '1px solid #3f3f46',
  borderRadius: '12px',
  color: '#e4e4e7',
}

export function SavingsRatePie({ income, expenses }) {
  const saved = Math.max(income - expenses, 0)
  const spent = expenses || 1
  const total = saved + spent
  const pct = total > 0 ? Math.round((saved / total) * 100) : 0

  return (
    <div className="mt-6 h-44">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[
              { name: 'saved', value: saved },
              { name: 'spent', value: spent },
            ]}
            dataKey="value"
            innerRadius={48}
            outerRadius={70}
            startAngle={90}
            endAngle={-270}
            stroke="#18181b"
            strokeWidth={2}
          >
            <Cell fill="#a855f7" />
            <Cell fill="#3f3f46" />
          </Pie>
          <Tooltip contentStyle={tipStyle} />
        </PieChart>
      </ResponsiveContainer>
      <p className="mt-1 text-center text-lg font-bold text-violet-300">{pct}% stability</p>
    </div>
  )
}
