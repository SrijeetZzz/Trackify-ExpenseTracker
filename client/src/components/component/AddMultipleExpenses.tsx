import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/utils/axiosInstance";
import { Trash2 } from "lucide-react";
import { Spinner } from "../ui/shadcn-io/spinner";
import { useToast } from "@/hooks/use-toast";

interface ExpenseRow {
  amount: number | "";
  category: string;
  subcategory: string;
  paymentMode: string;
  paid: boolean;
  desc: string;
}

const AddMultipleExpenses: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseRow[]>([
    {
      amount: "",
      category: "",
      subcategory: "",
      paymentMode: "",
      paid: true,
      desc: "",
    },
  ]);

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategoriesMap, setSubcategoriesMap] = useState<
    Record<string, any[]>
  >({});
  const [date, setDate] = useState(""); // Single date for all expenses

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const paymentMethod = ["Cash", "Card", "UPI", "Other"];
  const [loading, setLoading] = useState(false);
  const {toast} = useToast();

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    if (!token) return;
    try {
      const res = await api.get(`/category/get-categories`);
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subcategories for all categories
  const fetchSubcategories = async () => {
    setLoading(true);
    if (!token) return;
    try{
      const map: Record<string, any[]> = {};
    for (let cat of categories) {
      const res = await api.get(
        `/subcategory/get-subcategories?categoryId=${cat._id}`
      );
      map[cat._id] = res.data || [];
    }
    setSubcategoriesMap(map);
    }catch(err){
      console.log(err)
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  useEffect(() => {
    if (categories.length) fetchSubcategories();
  }, [categories]);

  const handleChange = <K extends keyof ExpenseRow>(
    index: number,
    field: K,
    value: ExpenseRow[K]
  ) => {
    const newExpenses = [...expenses];
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };

  const addExpenseRow = () => {
    setExpenses([
      ...expenses,
      {
        amount: "",
        category: "",
        subcategory: "",
        paymentMode: "",
        paid: true,
        desc: "",
      },
    ]);
  };

  const removeExpenseRow = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  if (!token || !userId) {
    toast({
      variant: "destructive",
      title: "Authentication error ❌",
      description: "Please log in to add expenses.",
    });
    setLoading(false);
    return;
  }

  if (!expenses.length || !date) {
    toast({
      variant: "destructive",
      title: "Missing data ❌",
      description: "Please fill in expenses and date before submitting.",
    });
    setLoading(false);
    return;
  }

  try {
    // Apply single date to all expenses
    const expensesWithDate = expenses.map((exp) => ({ ...exp, date }));

    await api.post("/expense/create-multiple-expenses", {
      expenses: expensesWithDate,
      userId,
    });

    toast({
      title: "Expenses added 🎉",
      description: `${expensesWithDate.length} expense(s) have been added successfully.`,
    });

    setExpenses([
      {
        amount: "",
        category: "",
        subcategory: "",
        paymentMode: "",
        paid: true,
        desc: "",
      },
    ]);
    setDate("");
    setOpen(false);
    onSuccess?.();
  } catch (err: any) {
    console.error("Failed to add expenses:", err);
    toast({
      variant: "destructive",
      title: "Error adding expenses ❌",
      description: err?.response?.data?.message || "Something went wrong.",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Multiple Expenses</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Add Multiple Expenses</DialogTitle>
        </DialogHeader>

        {/* Scrollable wrapper */}
        <div className="max-h-[600px] overflow-y-auto pr-2">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Single Date Field */}
            <div className="flex-1 grid gap-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {expenses.map((exp, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1 grid gap-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={exp.amount}
                    onChange={(e) =>
                      handleChange(index, "amount", Number(e.target.value))
                    }
                    placeholder="Amount"
                  />
                </div>

                <div className="flex-1 grid gap-2">
                  <Label>Category</Label>
                  <Select
                    value={exp.category}
                    onValueChange={(val) => {
                      handleChange(index, "category", val);
                      handleChange(index, "subcategory", "");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {loading ? (
                        <Spinner />
                      ) : (
                        categories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 grid gap-2">
                  <Label>Subcategory</Label>
                  <Select
                    value={exp.subcategory}
                    onValueChange={(val) =>
                      handleChange(index, "subcategory", val)
                    }
                    disabled={!exp.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {exp.category &&
                        subcategoriesMap[exp.category]?.map((sub) => (
                          <SelectItem key={sub._id} value={sub._id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 grid gap-2">
                  <Label>Payment Method</Label>
                  <Select
                    value={exp.paymentMode}
                    onValueChange={(val) =>
                      handleChange(index, "paymentMode", val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethod.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 grid gap-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="Optional"
                    value={exp.desc}
                    onChange={(e) =>
                      handleChange(index, "desc", e.target.value)
                    }
                  />
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={exp.paid}
                    onChange={(e) =>
                      handleChange(index, "paid", e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label className="cursor-pointer">Paid</Label>
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  disabled={index === 0}
                  onClick={() => removeExpenseRow(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <div className="flex gap-2">
              <Button type="button" onClick={addExpenseRow}>
                + Add Row
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Spinner /> : "Save Expense"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMultipleExpenses;
