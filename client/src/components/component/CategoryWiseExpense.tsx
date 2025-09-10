import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState, useEffect } from "react";
import { api } from "@/utils/axiosInstance";
import ChartExpensesBySubcategory from "./SubCategoryWiseExpense";
import { Spinner } from "../ui/shadcn-io/spinner";

export const description = "User expenses grouped by category";

export const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

interface ExpenseCategoryData {
  categoryId: string;
  category: string;
  amount: number;
  fill: string;
}

const DAYS_OPTIONS = {
  7: "Last 7 days",
  30: "Last 30 days",
  90: "Last 3 months",
};

const ChartExpensesByCategory = () => {
  const [chartData, setChartData] = useState<ExpenseCategoryData[]>([]);
  const [days, setDays] = useState<number>(30);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const getCategoryColor = (index: number, total: number) => {
    const lightness = 20 + (index * 60) / total; // spread from 20% to 80%
    return `hsl(0, 0%, ${lightness}%)`; // 0° hue and 0% saturation → greyscale
  };

  const fetchExpenses = async (selectedDays = 30) => {
    setLoading(true);
    try {
      const res = await api.get(`/expense/by-category`, {
        params: { days: selectedDays },
      });

      // Generate a dynamic color for each category
      const data = res.data.map((item: any, index: number) => ({
        categoryId: item.categoryId,
        category: item.categoryName,
        amount: item.total,
        fill: getCategoryColor(index, res.data.length), // generates different color for each category
      }));

      setChartData(data);

      // Set default selected category as the highest spending one
      if (data.length > 0) {
        const highestCategory = data.reduce((prev: any, curr: any) =>
          curr.amount > prev.amount ? curr : prev
        );
        setSelectedCategoryId(highestCategory.categoryId);
      }
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(days);
  }, [days]);

  const totalAmount = chartData.reduce((acc, curr) => acc + curr.amount, 0);

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      {/* Category Chart */}
      <div className="w-full md:w-1/2">
        <Card className="flex flex-col mb-4 h-full">
          <CardHeader className="items-center pb-0">
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>
              Showing categorywise expenses for the selected time range
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 pb-0 mt-4">
            <div className="mb-4 w-48">
              <Select
                value={String(days)}
                onValueChange={(value) => setDays(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select days" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DAYS_OPTIONS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ChartContainer config={{}} className="w-full h-[300px]">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={60}
                  strokeWidth={5}
                  onClick={(entry: any) =>
                    setSelectedCategoryId(entry.categoryId)
                  }
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalAmount.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Total
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>

          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
              Showing expenses grouped by category
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Subcategory Chart */}
      <div className="w-full md:w-1/2">
        {selectedCategoryId && (
          <ChartExpensesBySubcategory
            categoryId={selectedCategoryId}
            days={days}
          />
        )}
      </div>
    </div>
  );
};

export default ChartExpensesByCategory;
