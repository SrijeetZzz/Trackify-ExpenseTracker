import AddExpense from "@/components/component/AddExpense";
import AddMultipleExpenses from "@/components/component/AddMultipleExpenses";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { api } from "../utils/axiosInstance";
import { Pencil } from "lucide-react";

interface Expense {
  _id: string;
  amount: number;
  date: string;
  paid: string;
  paymentMode: string;
  categoryName: string;
  subcategoryName: string;
  category: string;
  subcategory: string;
}

const Expense = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // filter state
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("all");

  // sort state
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [dateSort, setDateSort] = useState<"asc" | "desc">("asc");
  const [amountSort, setAmountSort] = useState<"asc" | "desc">("asc");

  // fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get(`/category/get-categories`);
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // fetch subcategories based on selected category
  const fetchSubcategories = async (category: string) => {
    try {
      if (!category || category === "all") {
        setSubcategories([]);
        return;
      }
      const res = await api.get(`/subcategory/get-subcategories?categoryId=${category}`);
      setSubcategories(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // fetch expenses
  const fetchExpenses = async (page = 1) => {
    try {
      setLoading(true);
      const params: any = {
        page,
        categoryId: selectedCategory === "all" ? undefined : selectedCategory,
        subcategoryId: selectedSubcategory === "all" ? undefined : selectedSubcategory,
        paymentMode: selectedPaymentMode === "all" ? undefined : selectedPaymentMode,
        sortField,
        sortOrder,
      };

      const res = await api.get(`/expense/get-expenses`, { params });
      setExpenses(res.data.expenses);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchExpenses(currentPage);
  }, []);

  useEffect(() => {
    fetchSubcategories(selectedCategory);
    setSelectedSubcategory("all");
  }, [selectedCategory]);

  useEffect(() => {
    fetchExpenses(1);
  }, [selectedCategory, selectedSubcategory, selectedPaymentMode, sortField, sortOrder]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between">
        <AddExpense onSuccess={() => fetchExpenses(currentPage)} />
        <AddMultipleExpenses onSuccess={() => fetchExpenses(currentPage)} />
      </div>

      {editExpense && (
        <AddExpense
          onSuccess={() => {
            fetchExpenses(currentPage);
            setEditExpense(null);
          }}
          selectedExpense={editExpense}
          onClose={() => setEditExpense(null)}
        />
      )}

      <div className="w-full lg:w-[1160px] overflow-x-auto">
        <Table className="w-full min-w-[800px]">
          <TableCaption>A list of your recent expenses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 text-center">Sl No.</TableHead>

              {/* Date column with sort */}
              <TableHead>
                <div className="flex items-center gap-2">
                  Date
                  <Select value={dateSort} onValueChange={(val) => {
                    setSortField("date");
                    setSortOrder(val as "asc" | "desc");
                    setDateSort(val as "asc" | "desc");
                  }}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Asc</SelectItem>
                      <SelectItem value="desc">Desc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>

              {/* Category filter */}
              <TableHead>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                    ))
                    }
                  </SelectContent>
                </Select>
              </TableHead>

              {/* Subcategory filter */}
              <TableHead>
                <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory} disabled={!selectedCategory || selectedCategory === "all"}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {subcategories.map(sub => (
                      <SelectItem key={sub._id} value={sub._id}>{sub.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableHead>

              {/* Payment Method filter */}
              <TableHead>
                <Select value={selectedPaymentMode} onValueChange={setSelectedPaymentMode}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Payment Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                  </SelectContent>
                </Select>
              </TableHead>

              {/* Amount column with sort */}
              <TableHead className="text-center">
                <div className="flex items-center gap-2 justify-center">
                  Amount
                  <Select value={amountSort} onValueChange={(val) => {
                    setSortField("amount");
                    setSortOrder(val as "asc" | "desc");
                    setAmountSort(val as "asc" | "desc");
                  }}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Asc</SelectItem>
                      <SelectItem value="desc">Desc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>

              <TableHead className="w-20 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {expenses.map((expense, index) => (
              <TableRow key={expense._id}>
                <TableCell className="text-center">{(currentPage - 1) * 10 + (index + 1)}</TableCell>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell>{expense.categoryName}</TableCell>
                <TableCell>{expense.subcategoryName}</TableCell>
                <TableCell>{expense.paymentMode}</TableCell>
                <TableCell className="text-center">₹{expense.amount.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <Button size="sm" variant="outline" onClick={() => setEditExpense(expense)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Prev
        </Button>

        <span>Page {currentPage} of {totalPages}</span>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Expense;
