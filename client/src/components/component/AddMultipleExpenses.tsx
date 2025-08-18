// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// type Expense = {
//   amount: number | "";
//   category: string;
//   subCategory: string;
//   paymentMethod: string;
//   paid: boolean;
//   description: string;
// };

// const categories = ["Food", "Transport", "Shopping", "Entertainment", "Other"];
// const subCategories: Record<string, string[]> = {
//   Food: ["Groceries", "Restaurants", "Snacks"],
//   Transport: ["Bus", "Taxi", "Fuel"],
//   Shopping: ["Clothes", "Electronics", "Other"],
//   Entertainment: ["Movies", "Games", "Other"],
//   Other: ["Miscellaneous"],
// };
// const paymentMode = ["Cash", "Card", "UPI", "Other"];

// const AddMultipleExpenses: React.FC = () => {
//   const [open, setOpen] = useState(false);
//   const [expenses, setExpenses] = useState<Expense[]>([
//     {
//       amount: "",
//       category: "",
//       subCategory: "",
//       paymentMethod: "",
//       paid: true,
//       description: "",
//     },
//   ]);
//   const [date, setDate] = useState("");

//   const handleChange = <K extends keyof Expense>(
//     index: number,
//     field: K,
//     value: Expense[K]
//   ) => {
//     const newExpenses = [...expenses];
//     newExpenses[index][field] = value;
//     setExpenses(newExpenses);
//   };

//   const addExpenseRow = () => {
//     setExpenses([
//       ...expenses,
//       {
//         amount: "",
//         category: "",
//         subCategory: "",
//         paymentMethod: "",
//         paid: true,
//         description: "",
//       },
//     ]);
//   };

//   const removeExpenseRow = (index: number) => {
//     setExpenses(expenses.filter((_, i) => i !== index));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const expenseData = expenses.map((exp) => ({ ...exp, date }));
//     console.log(expenseData);

//     setExpenses([
//       {
//         amount: "",
//         category: "",
//         subCategory: "",
//         paymentMethod: "",
//         paid: true,
//         description: "",
//       },
//     ]);
//     setDate("");
//     setOpen(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline">Add Multiple Expenses</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[900px]">
//         <DialogHeader>
//           <DialogTitle>Add Multiple Expenses</DialogTitle>
//         </DialogHeader>

//         <div className="grid gap-4 mb-4 w-20">
//           <Label htmlFor="date">Date</Label>
//           <Input
//             id="date"
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//           />
//         </div>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           {expenses.map((expense, index) => (
//             <div key={index} className="flex gap-2 items-end">
//               <div className="flex-1">
//                 <Label>Amount</Label>
//                 <Input
//                   type="number"
//                   placeholder="Amount"
//                   value={expense.amount}
//                   onChange={(e) =>
//                     handleChange(index, "amount", Number(e.target.value))
//                   }
//                 />
//               </div>

//               <div className="flex-1">
//                 <Label>Category</Label>
//                 <Select
//                   value={expense.category}
//                   onValueChange={(val) => handleChange(index, "category", val)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {categories.map((cat) => (
//                       <SelectItem key={cat} value={cat}>
//                         {cat}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="flex-1">
//                 <Label>Subcategory</Label>
//                 <Select
//                   value={expense.subCategory}
//                   onValueChange={(val) =>
//                     handleChange(index, "subCategory", val)
//                   }
//                   disabled={!expense.category}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Subcategory" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {expense.category &&
//                       subCategories[expense.category].map((sub) => (
//                         <SelectItem key={sub} value={sub}>
//                           {sub}
//                         </SelectItem>
//                       ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="flex-1">
//                 <Label>Payment Method</Label>
//                 <Select
//                   value={expense.paymentMethod}
//                   onValueChange={(val) =>
//                     handleChange(index, "paymentMethod", val)
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Payment" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {paymentMode.map((method) => (
//                       <SelectItem key={method} value={method}>
//                         {method}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="flex-1">
//                 <Label>Description</Label>
//                 <Input
//                   placeholder="Optional"
//                   value={expense.description}
//                   onChange={(e) =>
//                     handleChange(index, "description", e.target.value)
//                   }
//                 />
//               </div>

//               <div className="flex items-center space-x-2">
//                 <input
//                   id={`paid-${index}`}
//                   type="checkbox"
//                   checked={expense.paid}
//                   onChange={(e) =>
//                     handleChange(index, "paid", e.target.checked)
//                   }
//                   className="w-4 h-4 rounded border-gray-300"
//                 />
//                 <Label htmlFor={`paid-${index}`} className="cursor-pointer">
//                   Paid
//                 </Label>
//               </div>

//               <Button
//                 type="button"
//                 variant="destructive"
//                 onClick={() => removeExpenseRow(index)}
//               >
//                 X
//               </Button>
//             </div>
//           ))}

//           <div className="flex gap-2">
//             <Button type="button" onClick={addExpenseRow}>
//               + Add Row
//             </Button>
//             <Button type="submit">Save All Expenses</Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AddMultipleExpenses;

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
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
import { Trash2 } from "lucide-react"; // Import trash icon

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

  // Fetch categories
  const fetchCategories = async () => {
    if (!token) return;
    const res = await api.get("/category/get-categories");
    setCategories(res.data || []);
  };

  // Fetch subcategories for all categories
  const fetchSubcategories = async () => {
    if (!token) return;
    const map: Record<string, any[]> = {};
    for (let cat of categories) {
      const res = await api.get(
        `/subcategory/get-subcategories?categoryId=${cat._id}`
      );
      map[cat._id] = res.data || [];
    }
    setSubcategoriesMap(map);
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
    if (!token || !userId) return;

    try {
      // Apply single date to all expenses
      const expensesWithDate = expenses.map((exp) => ({ ...exp, date }));
      console.log(expensesWithDate);
      const res = await api.post("/expense/create-multiple-expenses", {
        expenses: expensesWithDate,
        userId,
      });
      console.log("Expenses added:", res.data);
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
    } catch (err) {
      console.error("Failed to add expenses:", err);
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
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
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
                  onChange={(e) => handleChange(index, "desc", e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
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

              {/* Trash icon instead of X */}
              <Button
                type="button"
                variant="destructive"
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
            <Button type="submit">Save All Expenses</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMultipleExpenses;
