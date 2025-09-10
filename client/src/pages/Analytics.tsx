import  ChartExpensesByCategory  from '@/components/component/CategoryWiseExpense'
import  DailyExpenseChart  from '@/components/component/DailyExpenseChart'
import ExpenseOfUserInEachGrp from '@/components/component/GroupWiseExpenseOfUser'
import ChartRadarGroupShares from '@/components/component/GroupWiseSplit'
import MonthlyExpenses from '@/components/component/MonthlyExpenses'

const Analytics = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="w-[1200px]">
        <DailyExpenseChart />
      </div>
      <div className="w-full">
        <ChartExpensesByCategory />
      </div>
      <div className="w-[1200px]">
          <MonthlyExpenses/>
      </div>
    
      <div className="flex gap-6 w-full">
        <div className="flex-1">
          <ExpenseOfUserInEachGrp />
        </div>
        <div className="flex-1">
          <ChartRadarGroupShares />
        </div>
      </div>
    </div>
  )
}

export default Analytics


