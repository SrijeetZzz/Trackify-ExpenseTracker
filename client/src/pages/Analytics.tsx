import  ChartExpensesByCategory  from '@/components/component/CategoryWiseExpense'
import  DailyExpenseChart  from '@/components/component/DailyExpenseChart'

const Analytics = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="w-[1180px]">
        <DailyExpenseChart />
      </div>
      <div className="w-full">
        <ChartExpensesByCategory />
      </div>
    </div>
  )
}

export default Analytics


