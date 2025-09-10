import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Spinner } from "../ui/shadcn-io/spinner"

interface DailyExpense {
  day: string
  amount: number
}

const timeOptions = [
  { label: "Last 7 Days", value: 7 },
  { label: "Last 30 Days", value: 30 },
  { label: "Last 3 Months", value: 90 },
]

const DailyExpenseChart = () => {
  const [data, setData] = useState<DailyExpense[]>([])
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState<number>(30)

  const fetchData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await api.get(`/expense/daily-summary?days=${days}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const formattedData = res.data.map((item: any) => ({
        day: new Date(item._id).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        }),
        amount: item.total,
      }))

      setData(formattedData)
    } catch (err) {
      console.error("Failed to fetch daily expenses:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [days])

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen w-[1200px]">
        <Spinner />
      </div>
    );


  return (
    <Card>
      <CardHeader className="flex justify-between items-start">
        <div>
          <CardTitle>Daily Expenses</CardTitle>
          <CardDescription>
            Showing total expenses for the selected time range
          </CardDescription>
        </div>

        {/* Dropdown to select time range */}
        <Select value={String(days)} onValueChange={(val) => setDays(Number(val))}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <ChartContainer config={{ amount: { label: "Amount", color: "var(--chart-1)" } }} className="w-full h-80">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="amount" fill="var(--color-amount)" />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Last {days} days
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}


export default DailyExpenseChart;