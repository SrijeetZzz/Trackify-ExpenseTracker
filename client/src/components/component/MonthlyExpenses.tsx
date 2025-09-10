"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"
import { api } from "@/utils/axiosInstance"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Spinner } from "../ui/shadcn-io/spinner"

export const description = "A pie chart with a label list"

interface MonthlyExpense {
  month: string
  total: number
}

const chartConfig = {
  total: { label: "Expenses" },
} satisfies ChartConfig

const formatMonth = (monthStr: string) => {
  const [year, month] = monthStr.split("-").map(Number)
  return new Date(year, month - 1).toLocaleString("default", { month: "short" })
  
}
 const colors = ["#111111", "#333333", "#555555", "#777777", "#999999", "#BBBBBB"]

const ChartMonthlyExpensesLabelList = () => {
  const [data, setData] = useState<{ browser: string; visitors: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMonthlyExpenses = async () => {
      try {
        const { data: resData } = await api.get<MonthlyExpense[]>(
          "expense/get-expenses-monthwise"
        )

        const formattedData = resData.map((item,idx) => ({
          browser: formatMonth(item.month),
          visitors: item.total,
          fill: colors[idx % colors.length],
        }))

        setData(formattedData)
      } catch (err) {
        console.error("Failed to fetch monthly expenses:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMonthlyExpenses()
  }, [])

    if (loading)
    return (
      <div className="flex items-center justify-center h-screen w-[1200px]">
        <Spinner />
      </div>
    );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>Showing total expenses per month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie data={data} dataKey="visitors">
              <LabelList
                dataKey="browser"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label || value
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing months with expenses
        </div>
      </CardFooter>
    </Card>
  )
}

export default ChartMonthlyExpensesLabelList