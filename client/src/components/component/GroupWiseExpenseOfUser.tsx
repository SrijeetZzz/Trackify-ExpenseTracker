import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { api } from "@/utils/axiosInstance"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Spinner } from "../ui/shadcn-io/spinner"

interface GroupExpense {
  groupId: string
  groupName: string
  totalExpense: number
  userPaid: number
}

const ExpenseOfUserInEachGrp = () => {
  const [data, setData] = useState<GroupExpense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true)
      try {
        const { data: expenseData } = await api.get<GroupExpense[]>(
          "/splitwise/get-user-group-expense-summary"
        )
        setData(expenseData)
      } catch (err) {
        console.error("Failed to fetch group expenses:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchExpenses()
  }, [])

  if (loading)
      return (
        <div className="flex items-center justify-center h-screen">
          <Spinner />
        </div>
      );

  const chartConfig = {
    totalExpense: { label: "Total Expense", color: "var(--gray-600)" },
    userPaid: { label: "You Paid", color: "var(--gray-400)" },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-7 items-center">
        <CardTitle>Group Expenses</CardTitle>
        <CardDescription>
          Showing total group expenses and your payments
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto "
        >
          <RadarChart data={data}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />

            <PolarAngleAxis
              dataKey="groupName"
              tick={{ fontSize: 11 }}
              tickLine={false}
              dy={5}
              tickFormatter={(name) =>
                name.length > 8 ? name.slice(0, 8) + "…" : name
              }
            />

            <PolarGrid radialLines={false} />

            <Radar
              dataKey="totalExpense"
              fill="transparent"
              stroke="#4B5563"
              strokeWidth={3}
            />
            <Radar
              dataKey="userPaid"
              fill="transparent"
              stroke="#9CA3AF"
              strokeWidth={3}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
          Showing group expenses
        </div>
      </CardFooter>
    </Card>
  )
}

export default ExpenseOfUserInEachGrp
