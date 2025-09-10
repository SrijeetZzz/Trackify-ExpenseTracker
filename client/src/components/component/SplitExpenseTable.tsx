import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { api } from "../../utils/axiosInstance";
import AddSplitWiseExpense from "./SplitwiseAddExpense";
import {
  HoverCardContent,
  HoverCard,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Spinner } from "../ui/shadcn-io/spinner";

interface Expense {
  _id: string;
  amount: number;
  date: string;
  paymentMode: string;
  categoryName: string;
  subcategoryName: string;
  userShare: number;
  settled: boolean;
  settledAmount: number;
  groupName: string;
  groupId: string;
}

interface Group {
  _id: string;
  grpName: string;
}

const ExpenseTable = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("all");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");

  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [cashflow, setCashflow] = useState<{
    inflow: number;
    outflow: number;
    net: number;
  } | null>(null);

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/category/get-categories`);
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subcategories for a category
  const fetchSubcategories = async (category: string) => {
    setLoading(true);
    try {
      if (!category || category === "all") {
        setSubcategories([]);
        return;
      }
      const res = await api.get(
        `/subcategory/get-subcategories?categoryId=${category}`
      );
      setSubcategories(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user groups for Group filter
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Group[]>("/splitwise/get-user-groups");
      const formattedGroups = data.map((g) => ({
        _id: g._id,
        grpName: g.grpName,
      }));
      setGroups(formattedGroups);
    } catch (err) {
      console.error("Failed to fetch groups:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch expenses with filters
  const fetchExpenses = async (page = 1) => {
    try {
      setLoading(true);
      const params: any = {
        page,
        categoryId: selectedCategory === "all" ? undefined : selectedCategory,
        subcategoryId:
          selectedSubcategory === "all" ? undefined : selectedSubcategory,
        paymentMode:
          selectedPaymentMode === "all" ? undefined : selectedPaymentMode,
        groupId: selectedGroup === "all" ? undefined : selectedGroup,
        sortField,
        sortOrder,
      };
      const res = await api.get(`/expense/get-split-expenses`, { params });
      setExpenses(res.data.expenses);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCashFlow = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/splitwise/cashflow`);
      setCashflow(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchGroups();
    fetchExpenses(currentPage);
    fetchCashFlow();
  }, []);

  useEffect(() => {
    fetchSubcategories(selectedCategory);
    setSelectedSubcategory("all");
  }, [selectedCategory]);

  useEffect(() => {
    fetchExpenses(1);
  }, [
    selectedCategory,
    selectedSubcategory,
    selectedPaymentMode,
    selectedGroup,
    sortField,
    sortOrder,
  ]);
  useEffect(() => {
    fetchExpenses(currentPage);
  }, [currentPage]);

  const getBgColor = () => {
    if (!cashflow) return "bg-gray-200";
    if (cashflow.net > 0) return "bg-green-500 text-white";
    if (cashflow.net < 0) return "bg-red-500 text-white";
    return "bg-blue-500 text-white";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen w-[1200px]">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      {/* Header */}
      <div className="w-full text-center mb-6">
        <h2 className="text-2xl font-bold tracking-wide">
          Split Expenses Table
        </h2>
        <p className="text-sm text-gray-500">
          Manage and track your shared expenses
        </p>
      </div>

      {/* Top Controls */}
      <div className="flex justify-between">
        <AddSplitWiseExpense onSuccess={() => fetchExpenses(currentPage)} />
        {cashflow && (
          <HoverCard>
            <HoverCardTrigger asChild>
              <span
                className={`px-4 py-2 rounded-lg shadow-md font-semibold cursor-pointer ${getBgColor()}`}
              >
                Net: {cashflow.net}
              </span>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 p-3 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Cash Inflow:</span>
                <span className="text-green-600 font-bold">
                  {cashflow.inflow}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Cash Outflow:</span>
                <span className="text-red-600 font-bold">
                  {cashflow.outflow}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Net:</span>
                <span className="font-bold">{cashflow.net}</span>
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-wrap gap-4 items-center my-4">
        {/* Category */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Subcategory */}
        <Select
          value={selectedSubcategory}
          onValueChange={setSelectedSubcategory}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Subcategory" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subcategories</SelectItem>
            {subcategories.map((sub) => (
              <SelectItem key={sub._id} value={sub._id}>
                {sub.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Payment Mode */}
        <Select
          value={selectedPaymentMode}
          onValueChange={setSelectedPaymentMode}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Payment Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment Modes</SelectItem>
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="Card">Card</SelectItem>
            <SelectItem value="UPI">UPI</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>

        {/* Group filter */}
        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            {groups.map((g) => (
              <SelectItem key={g._id} value={g._id}>
                {g.grpName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Field */}
        <Select
          value={sortField}
          onValueChange={(val) => setSortField(val as "date" | "amount")}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Order */}
        <Select
          value={sortOrder}
          onValueChange={(val) => setSortOrder(val as "asc" | "desc")}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="w-full lg:w-[1100px] overflow-x-auto">
        <Table className="w-full min-w-[800px]">
          <TableCaption>A list of your recent split expenses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 text-center">Sl No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Subcategory</TableHead>
              <TableHead>Payment Mode</TableHead>
              <TableHead>Group</TableHead>
              <TableHead className="text-center">Amount</TableHead>
              <TableHead className="text-center">Your Share</TableHead>
              <TableHead className="text-center">Settled Amount</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {expenses.map((expense, index) => (
              <TableRow key={expense._id}>
                <TableCell className="text-center">
                  {(currentPage - 1) * 10 + (index + 1)}
                </TableCell>
                <TableCell>
                  {new Date(expense.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{expense.categoryName}</TableCell>
                <TableCell>{expense.subcategoryName}</TableCell>
                <TableCell>{expense.paymentMode}</TableCell>
                <TableCell>{expense.groupName}</TableCell>
                <TableCell className="text-center">
                  ₹{(expense.amount ?? 0).toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  ₹{(expense.userShare ?? 0).toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  ₹{(expense.settledAmount ?? 0).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ExpenseTable;
