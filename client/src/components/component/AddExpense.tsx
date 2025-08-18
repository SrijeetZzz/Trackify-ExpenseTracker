// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useEffect, useState } from "react";
// import { api } from "@/utils/axiosInstance";

// const AddExpense: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
//   const [open, setOpen] = useState<boolean>(false);
//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline">Add Single Expense</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add Expense</DialogTitle>
//           <DialogDescription>
//             Enter the details of your expense below. Click save when you're
//             done.
//           </DialogDescription>
//         </DialogHeader>
//         <ExpenseForm setOpen={setOpen} onSuccess={onSuccess} />
//       </DialogContent>
//     </Dialog>
//   );
// };

// interface ExpenseFormProps extends React.ComponentProps<"form"> {
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   onSuccess?: () => void;
// }
// const ExpenseForm: React.FC<ExpenseFormProps> = ({
//   className,
//   setOpen,
//   onSuccess,
// }) => {
//   const paymentMethod = ["Cash", "Card", "UPI", "Other"];

//   const [categories, setCategories] = useState<any[]>([]);
//   const [subcategories, setSubcategories] = useState<any[]>([]);
//   const [amount, setAmount] = useState<number | "">("");
//   const [category, setCategory] = useState<string>("");
//   const [subcategory, setSubcategory] = useState<string>("");
//   const [date, setDate] = useState("");
//   const [desc, setDesc] = useState("");
//   const [paymentMode, setPaymentMode] = useState("");
//   const [paid, setPaid] = useState(true);

//   const userId = localStorage.getItem("userId");
//   const token = localStorage.getItem("token");

//   const fetchCategories = async () => {
//     try {
//       if (!token || !userId) return;

//       const res = await api.get(`/category/get-categories`);
//       const newCategories = res.data.map((category: any) => ({
//         _id: category._id,
//         name: category.name,
//       }));
//       setCategories(newCategories || []);
//     } catch (err) {
//       console.error("Failed to fetch categories:", err);
//     }
//   };

//   const fetchSubcategories = async () => {
//     try {
//       if (!token || !category) return;
//       console.log(category);

//       const res = await api.get(
//         `/subcategory/get-subcategories?categoryId=${category}`
//       );

//       const newSubcategories = res.data.map((sub: any) => ({
//         _id: sub._id,
//         name: sub.name,
//       }));

//       setSubcategories(newSubcategories || []);
//     } catch (err) {
//       console.error("Failed to fetch subcategories:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchSubcategories();
//   }, [token, userId, category]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const expenseData = {
//       amount,
//       category,
//       subcategory,
//       date,
//       desc,
//       paid,
//       paymentMode,
//       userId: userId,
//     };

//     try {
//       if (!token) throw new Error("No token found");

//       const res = await api.post("/expense/create-expense", expenseData);
//       console.log("Expense added:", res.data);
//       // Reset form
//       setAmount("");
//       setCategory("");
//       setSubcategory("");
//       setDate("");
//       setDesc("");
//       setPaymentMode("");
//       setPaid(true);
//       setOpen(false);
//       onSuccess?.();
//     } catch (err) {
//       console.error("Failed to add expense:", err);
//     }
//   };

//   return (
//     <form
//       className={cn("grid items-start gap-6", className)}
//       onSubmit={handleSubmit}
//     >
//       <div className="grid gap-3">
//         <Label htmlFor="amount">Amount</Label>
//         <Input
//           id="amount"
//           type="number"
//           placeholder="E.g. 120"
//           value={amount}
//           onChange={(e) => setAmount(Number(e.target.value))}
//         />
//       </div>

//       {/* Category + Subcategory */}
//       <div className="flex gap-3">
//         <div className="flex-1 grid gap-2">
//           <Label>Category</Label>
//           <Select
//             value={category}
//             onValueChange={(val) => {
//               setCategory(val);
//               setSubcategory("");
//             }}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select category" />
//             </SelectTrigger>
//             <SelectContent>
//               {categories.map((cat) => (
//                 <SelectItem key={cat._id} value={cat._id}>
//                   {cat.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="flex-1 grid gap-2">
//           <Label>Subcategory</Label>
//           <Select
//             value={subcategory}
//             onValueChange={setSubcategory}
//             disabled={!category}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select subcategory" />
//             </SelectTrigger>
//             <SelectContent>
//               {category &&
//                 subcategories.map((sub) => (
//                   <SelectItem key={sub._id} value={sub._id}>
//                     {sub.name}
//                   </SelectItem>
//                 ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <div className="grid gap-3">
//         <Label htmlFor="date">Date</Label>
//         <Input
//           id="date"
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//         />
//       </div>

//       <div className="grid gap-3">
//         <Label htmlFor="description">Description</Label>
//         <Input
//           id="description"
//           placeholder="Optional"
//           value={desc}
//           onChange={(e) => setDesc(e.target.value)}
//         />
//       </div>

//       {/* Payment Method */}
//       <div className="grid gap-2">
//         <Label>Payment Method</Label>
//         <Select value={paymentMode} onValueChange={setPaymentMode}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select payment method" />
//           </SelectTrigger>
//           <SelectContent>
//             {paymentMethod.map((method) => (
//               <SelectItem key={method} value={method}>
//                 {method}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Paid Checkbox */}
//       <div className="flex items-center space-x-2">
//         <input
//           id="paid"
//           type="checkbox"
//           checked={paid}
//           onChange={(e) => setPaid(e.target.checked)}
//           className="w-4 h-4 rounded border-gray-300"
//         />
//         <Label htmlFor="paid" className="cursor-pointer">
//           Paid
//         </Label>
//       </div>

//       <Button type="submit">Save Expense</Button>
//     </form>
//   );
// };

// export default AddExpense;


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

interface Expense {
  _id: string;
  amount: number;
  date: string;
  status: string;
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
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); onClose?.(); }}>
      {!selectedExpense && (
        <DialogTrigger asChild>
          <Button variant="outline">Add Single Expense</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{selectedExpense ? "Edit Expense" : "Add Expense"}</DialogTitle>
          <DialogDescription>
            Enter the details of your expense below. Click save when you're done.
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
  const paymentMethod = ["Cash", "Card", "UPI", "Other"];
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [amount, setAmount] = useState<number | "">(selectedExpense?.amount || "");
  const [category, setCategory] = useState<string>(selectedExpense?.category || "");
  const [subcategory, setSubcategory] = useState<string>(selectedExpense?.subcategory || "");
  const [date, setDate] = useState(selectedExpense?.date || "");
  const [desc, setDesc] = useState(selectedExpense?.desc || "");
  const [paymentMode, setPaymentMode] = useState(selectedExpense?.paymentMode || "");
const [paid, setPaid] = useState(selectedExpense ? selectedExpense.status === "Paid" : true);


  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    if (!token) return;
    try {
      const res = await api.get(`/category/get-categories`);
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchSubcategories = async () => {
    if (!token || !category) return;
    try {
      const res = await api.get(`/subcategory/get-subcategories?categoryId=${category}`);
      setSubcategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch subcategories:", err);
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
      if (!token) throw new Error("No token found");

      if (selectedExpense) {
        // Update existing expense
        await api.put(`/expense/update-expense/${selectedExpense._id}`, expenseData);
      } else {
        // Create new expense
        await api.post("/expense/create-expense", expenseData);
      }

      onSuccess?.();
      setOpen(false);
    } catch (err) {
      console.error("Failed to save expense:", err);
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
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
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
            value={subcategory}
            onValueChange={setSubcategory}
            disabled={!category}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {category &&
                subcategories.map((sub) => (
                  <SelectItem key={sub._id} value={sub._id}>
                    {sub.name}
                  </SelectItem>
                ))}
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
        <Select value={paymentMode} onValueChange={setPaymentMode}>
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

      <Button type="submit">{selectedExpense ? "Update Expense" : "Save Expense"}</Button>
    </form>
  );
};

export default AddExpense;
