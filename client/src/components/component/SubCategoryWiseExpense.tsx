import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Sector, Label } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";

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

import { useState, useEffect } from "react";
import { api } from "@/utils/axiosInstance";

interface ExpenseSubcategoryData {
  subcategory: string;
  amount: number;
  fill: string;
}

interface Props {
  categoryId: string;
  days: number;
}

const ChartExpensesBySubcategory = ({ categoryId, days }: Props) => {
  const [chartData, setChartData] = useState<ExpenseSubcategoryData[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  
  const getCategoryColor = (index: number, total: number) => {
    const lightness = 20 + (index * 60) / total; // spread from 20% to 80%
    return `hsl(0, 0%, ${lightness}%)`; // 0° hue and 0% saturation → greyscale
  };

  const fetchSubcategoryExpenses = async () => {
    try {
      const res = await api.get(`/expense/by-subcategory`, {
        params: { categoryId, days },
      });

      const data = res.data.map((item: any, index: number) => ({
        subcategory: item.subcategoryName,
        amount: item.total,
        fill: getCategoryColor(index, res.data.length),
      }));
      setChartData(data);
      setTotalAmount(
        data.reduce((acc: any, curr: any) => acc + curr.amount, 0)
      );
    } catch (err) {
      console.error("Failed to fetch subcategory expenses:", err);
    }
  };

  useEffect(() => {
    if (categoryId) fetchSubcategoryExpenses();
  }, [categoryId, days]);

  return (
    <Card className="flex flex-col h-[520px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Subcategory Expenses</CardTitle>
        <CardDescription>
          Showing subcategory-wise expenses for selected category
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0 mt-20">
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="subcategory"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={0}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
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
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing expenses grouped by subcategory
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChartExpensesBySubcategory;
