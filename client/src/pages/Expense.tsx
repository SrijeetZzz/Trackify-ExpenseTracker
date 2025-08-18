// import AddExpense from "@/components/component/AddExpense";
// import AddMultipleExpenses from "@/components/component/AddMultipleExpenses";
// import { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { api } from "../utils/axiosInstance";

// interface Expense {
//   _id: string;
//   amount: number;
//   date: string;
//   status: string;
//   paymentMode: string;
//   category: string;
//   subcategory: string;
// }

// const Expense = () => {
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchExpenses = async () => {
//     try {
//       const res = await api.get("/expense/get-expenses");
//       setExpenses(res.data);
//       console.log(res.data);
//     } catch (err) {
//       console.error("Failed to fetch expenses:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   const handleRefresh = () => {
//     fetchExpenses();
//   };
//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="space-y-6 p-4">
//       <div>
//         <AddExpense onSuccess={handleRefresh} />
//         <AddMultipleExpenses onSuccess={handleRefresh} />
//       </div>
//       <div className="w-full overflow-x-auto">
//         <Table className="w-full">
//           <TableCaption>A list of your recent expenses.</TableCaption>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Date</TableHead>
//               <TableHead>Category</TableHead>
//               <TableHead>Subcategory</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Payment Method</TableHead>
//               <TableHead className="text-right">Amount</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {expenses.map((expense) => (
//               <TableRow key={expense._id}>
//                 <TableCell>
//                   {new Date(expense.date).toLocaleDateString()}
//                 </TableCell>
//                 <TableCell>{expense.category}</TableCell>
//                 <TableCell>{expense.subcategory}</TableCell>
//                 <TableCell>{expense.status}</TableCell>
//                 <TableCell>{expense.paymentMode}</TableCell>
//                 <TableCell className="text-right">
//                   ${expense.amount.toFixed(2)}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//           <TableFooter>
//             <TableRow>
//               <TableCell colSpan={5}>Total</TableCell>
//               <TableCell className="text-right">
//                 ${expenses.reduce((acc, exp) => acc + exp.amount, 0).toFixed(2)}
//               </TableCell>
//             </TableRow>
//           </TableFooter>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default Expense;

import AddExpense from "@/components/component/AddExpense";
import AddMultipleExpenses from "@/components/component/AddMultipleExpenses";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { api } from "../utils/axiosInstance";

interface Expense {
  _id: string;
  amount: number;
  date: string;
  status: string;
  paymentMode: string;
  category: string;
  subcategory: string;
}

const Expense = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);

  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expense/get-expenses");
      setExpenses(res.data);
      console.log(res.data)
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleRefresh = () => {
    fetchExpenses();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 p-4">
      <div className="flex gap-2">
        <AddExpense onSuccess={handleRefresh} />
        <AddMultipleExpenses onSuccess={handleRefresh} />
      </div>

      {/* Edit Expense Dialog */}
      {editExpense && (
        <AddExpense
          onSuccess={() => {
            handleRefresh();
            setEditExpense(null);
          }}
          selectedExpense={editExpense}
          onClose={() => setEditExpense(null)}
        />
      )}

      <div className="w-[1100px] overflow-x-auto">
        <Table className="w-full">
          <TableCaption>A list of your recent expenses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Subcategory</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense._id}>
                <TableCell>
                  {new Date(expense.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.subcategory}</TableCell>
                <TableCell>{expense.status}</TableCell>
                <TableCell>{expense.paymentMode}</TableCell>
                <TableCell className="text-right">
                  ${expense.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditExpense(expense)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>Total</TableCell>
              <TableCell className="text-right">
                ${expenses.reduce((acc, exp) => acc + exp.amount, 0).toFixed(2)}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default Expense;
