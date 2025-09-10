import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useEffect, useState } from "react";
import { api } from "@/utils/axiosInstance";
import { Spinner } from "../ui/shadcn-io/spinner";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  _id: string;
  amount: number;
  date: string;
  paid: string;
  paymentMode: string;
  category: string;
  subcategory: string;
  desc?: string;
}

interface AddExpenseProps {
  onSuccess?: () => void;
  selectedExpense?: Expense | null;
  onClose?: () => void;
}

const AddExpense: React.FC<AddExpenseProps> = ({
  onSuccess,
  selectedExpense = null,
  onClose,
}) => {
  const [open, setOpen] = useState<boolean>(!!selectedExpense);

  useEffect(() => {
    setOpen(!!selectedExpense);
  }, [selectedExpense]);

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        onClose?.();
      }}
    >
      {!selectedExpense && (
        <DialogTrigger asChild>
          <Button variant="outline">Add Single Expense</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {selectedExpense ? "Edit Expense" : "Add Expense"}
          </DialogTitle>
          <DialogDescription>
            Enter the details of your expense below. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <ExpenseForm
          setOpen={setOpen}
          onSuccess={onSuccess}
          selectedExpense={selectedExpense}
        />
      </DialogContent>
    </Dialog>
  );
};

interface ExpenseFormProps extends React.ComponentProps<"form"> {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
  selectedExpense?: Expense | null;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  className,
  setOpen,
  onSuccess,
  selectedExpense = null,
}) => {
  const formattedDate = selectedExpense?.date
    ? new Date(selectedExpense.date).toISOString().split("T")[0]
    : "";

  const paymentMethod = ["Cash", "Card", "UPI", "Other"];
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [amount, setAmount] = useState<number | "">(
    selectedExpense?.amount || ""
  );
  const [category, setCategory] = useState<string>(
    selectedExpense?.category || ""
  );
  const [subcategory, setSubcategory] = useState<string>(
    selectedExpense?.subcategory || ""
  );
  const [date, setDate] = useState(formattedDate || "");
  const [desc, setDesc] = useState(selectedExpense?.desc || "");
  const [paymentMode, setPaymentMode] = useState(
    selectedExpense?.paymentMode || ""
  );
  const [paid, setPaid] = useState(
    selectedExpense ? selectedExpense.paid === "Paid" : true
  );
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const { toast } = useToast();


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

  const fetchSubcategories = async () => {
     setLoading(true);
    if (!token || !category) return;
    try {
      const res = await api.get(
        `/subcategory/get-subcategories?categoryId=${category}`
      );
      setSubcategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch subcategories:", err);
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  useEffect(() => {
    fetchSubcategories();
  }, [category, token]);
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const expenseData = {
    amount,
    category,
    subcategory,
    date,
    desc,
    paid,
    paymentMode,
    userId,
  };

  try {
    if (!token) {
      toast({
        variant: "destructive",
        title: "Authentication error ❌",
        description: "No token found. Please log in again.",
      });
      throw new Error("No token found");
    }

    if (selectedExpense) {
      await api.put(
        `/expense/update-expense/${selectedExpense._id}`,
        expenseData
      );
      toast({
        title: "Expense updated ✅",
        description: "Your expense has been updated successfully.",
      });
    } else {
      await api.post("/expense/create-expense", expenseData);
      toast({
        title: "Expense created 🎉",
        description: "Your expense has been added successfully.",
      });
    }

    onSuccess?.();
    setOpen(false);
  } catch (err: any) {
    console.error("Failed to save expense:", err);
    toast({
      variant: "destructive",
      title: "Error saving expense ❌",
      description: err?.response?.data?.message || "Something went wrong.",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <form
      className={cn("grid items-start gap-6", className)}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-3">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          placeholder="E.g. 120"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />
      </div>

      {/* Category + Subcategory */}
      <div className="flex gap-3">
        <div className="flex-1 grid gap-2">
          <Label>Category</Label>
          <Select
            value={category}
            onValueChange={(val) => {
              setCategory(val);
              setSubcategory("");
            }}
            required
          >
            <SelectTrigger className="flex items-center justify-between">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {loading ? (
                <Spinner/>
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
            value={subcategory}
            onValueChange={setSubcategory}
            disabled={!category}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {loading ? (
                <Spinner/>
              ) : (
              category &&
                subcategories.map((sub) => (
                  <SelectItem key={sub._id} value={sub._id}>
                    {sub.name}
                  </SelectItem>
                ))
                )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Optional"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      {/* Payment Method */}
      <div className="grid gap-2">
        <Label>Payment Method</Label>
        <Select value={paymentMode} onValueChange={setPaymentMode} required>
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
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

      {/* Paid Checkbox */}
      <div className="flex items-center space-x-2">
        <input
          id="paid"
          type="checkbox"
          checked={paid}
          onChange={(e) => setPaid(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300"
        />
        <Label htmlFor="paid" className="cursor-pointer">
          Paid
        </Label>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? (
          <Spinner />
        ) : selectedExpense ? (
          "Update Expense"
        ) : (
          "Save Expense"
        )}
      </Button>
    </form>
  );
};

export default AddExpense;
