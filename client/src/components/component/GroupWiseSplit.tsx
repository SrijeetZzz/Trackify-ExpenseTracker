import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, Legend } from "recharts"
import { api } from "@/utils/axiosInstance"

import {
  Card,
  CardContent,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "../ui/shadcn-io/spinner"

interface Group {
  _id: string
  grpName: string
}

interface UserShare {
  userId: string
  username: string
  amount: number
}

interface ShareData {
  groupId: string
  groupName: string
  give: UserShare[]
  get: UserShare[]
}

const ChartRadarGroupShares = () => {
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string>("")
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch user groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data: groupData } = await api.get<Group[]>("splitwise/get-user-groups")
        const formattedGroups = groupData.map(g => ({ _id: g._id, grpName: g.grpName }))
        setGroups(formattedGroups)
        if (formattedGroups.length) setSelectedGroup(formattedGroups[0]._id)
      } catch (err) {
        console.error("Failed to fetch user groups:", err)
      }
    }
    fetchGroups()
  }, [])

  // Fetch share data for selected group
  useEffect(() => {
    if (!selectedGroup) return
    setLoading(true)
    const fetchShareData = async () => {
      try {
        const { data } = await api.get<ShareData>(`splitwise/get-share/${selectedGroup}`)

        // Merge give and get arrays by username
        const merged: Record<string, { user: string; give: number; get: number }> = {}

        data.give.forEach(u => {
          if (!merged[u.username]) merged[u.username] = { user: u.username, give: 0, get: 0 }
          merged[u.username].give += u.amount
        })

        data.get.forEach(u => {
          if (!merged[u.username]) merged[u.username] = { user: u.username, give: 0, get: 0 }
          merged[u.username].get += u.amount
        })

        setChartData(Object.values(merged))
      } catch (err) {
        console.error("Failed to fetch share data:", err)
        setChartData([])
      } finally {
        setLoading(false)
      }
    }
    fetchShareData()
  }, [selectedGroup])

  if (loading)
      return (
        <div className="flex items-center justify-center h-screen">
          <Spinner />
        </div>
      );

  const chartConfig = {
    give: { label: "Give", color: "hsl(0, 0%, 10%)" }, 
    get: { label: "Get", color: "hsl(0, 0%, 70%)" },   
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-4 items-center">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Group Settlement</CardTitle>
            <div className="text-muted-foreground text-sm">
              How much you owe others (Give) vs how much they owe you (Get)
            </div>
          </div>
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Group" />
            </SelectTrigger>
            <SelectContent>
              {groups.map(g => (
                <SelectItem key={g._id} value={g._id}>
                  {g.grpName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto">
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <PolarAngleAxis dataKey="user" tick={{ fontSize: 12 }} tickLine={false} />
            <PolarGrid radialLines={false} />

            <Radar
              name="Give"
              dataKey="give"
              fill={chartConfig.give.color}
              fillOpacity={0.4}
              stroke={chartConfig.give.color}
              strokeWidth={2}
            />
            <Radar
              name="Get"
              dataKey="get"
              fill={chartConfig.get.color}
              fillOpacity={0.4}
              stroke={chartConfig.get.color}
              strokeWidth={2}
            />

            <Legend />
          </RadarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
          Showing settlement balances
        </div>
      </CardFooter>
    </Card>
  )
}

export default ChartRadarGroupShares
