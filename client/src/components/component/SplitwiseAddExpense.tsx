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
  split?: boolean;
  splitType?: "pct" | "amnt" | "eql";
  grpId?: string;
  paidBy?: string;
  participants?: { userId: string; share: number; settled: boolean }[];
  status?: "settled" | "pending";
}

interface AddExpenseProps {
  onSuccess?: () => void;
  selectedExpense?: Expense | null;
  onClose?: () => void;
}

const AddSplitWiseExpense: React.FC<AddExpenseProps> = ({
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
          <Button variant="outline">Add Split</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
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
  const [groups, setGroups] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

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

  // Split-related state
  const [split, setSplit] = useState(selectedExpense?.split || false);
  const [splitType, setSplitType] = useState<"pct" | "amnt" | "eql">(
    selectedExpense?.splitType || "pct"
  );
  const [grpId, setGrpId] = useState(selectedExpense?.grpId || "");
  const [paidBy, setPaidBy] = useState(selectedExpense?.paidBy || "");
  const [participants, setParticipants] = useState<
    { userId: string; share: number; settled: boolean }[]
  >(selectedExpense?.participants || []);
  const [status, setStatus] = useState<"settled" | "pending">(
    selectedExpense?.status || "pending"
  );

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const { toast } = useToast();

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
      const res = await api.get(
        `/subcategory/get-subcategories?categoryId=${category}`
      );
      setSubcategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch subcategories:", err);
    }
  };

  const fetchGroups = async () => {
    if (!token) return;
    try {
      const res = await api.get(`/splitwise/get-user-groups`);
      const data = res.data || [];
      setGroups(data);
      if (grpId) {
        const selectedGroup = data.find((g: any) => g._id === grpId);
        setMembers(selectedGroup?.members || []);
      }
    } catch (err) {
      console.error("Failed to fetch groups:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchGroups();
  }, [token]);

  useEffect(() => {
    fetchSubcategories();
  }, [category, token]);

  const handleParticipantChange = (
    idx: number,
    field: "userId" | "share" | "settled",
    value: any
  ) => {
    const updated = [...participants];
    if (field === "share") {
      updated[idx][field] = Number(value);
    } else if (field === "settled") {
      updated[idx][field] = Boolean(value);
    } else {
      updated[idx][field] = value;
    }
    setParticipants(updated);
  };

  const addParticipant = () =>
    setParticipants([
      ...participants,
      { userId: "", share: 0, settled: false },
    ]);
  const removeParticipant = (idx: number) =>
    setParticipants(participants.filter((_, i) => i !== idx));

  const handleGroupChange = (val: string) => {
    setGrpId(val);
    setParticipants([]);
    const selectedGroup = groups.find((g) => g._id === val);
    setMembers(selectedGroup?.members || []);
  };

  // Handle split calculations
  useEffect(() => {
    if (!split || participants.length === 0 || !amount) return;

    if (splitType === "eql") {
      const share = Number((Number(amount) / participants.length).toFixed(2));
      const updated = participants.map((p) => ({ ...p, share }));
      setParticipants(updated);
    }

    if (splitType === "pct") {
      const updated = participants.map((p) => ({
        ...p,
        share: Math.min(p.share, 100),
      }));
      setParticipants(updated);
    }
    // "amnt" is user-defined, no auto calculation
  }, [splitType, participants.length, amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (split) {
      const totalAmount = typeof amount === "number" ? amount : 0;
      const totalShare = participants.reduce((sum, p) => sum + p.share, 0);

      if (splitType === "eql") {
        if (Number(totalShare.toFixed(2)) !== Number(totalAmount.toFixed(2))) {
          toast({
            variant: "destructive",
            title: "Invalid split ❌",
            description: "Equal split shares do not match total amount.",
          });
          return;
        }
      }

      if (splitType === "pct") {
        const totalPct = participants.reduce((sum, p) => sum + p.share, 0);
        if (totalPct > 100) {
          toast({
            variant: "destructive",
            title: "Invalid split ❌",
            description: "Total percentage cannot exceed 100%.",
          });
          return;
        }
        if (participants.some((p) => p.share > 100)) {
          toast({
            variant: "destructive",
            title: "Invalid split ❌",
            description: "Individual percentage cannot exceed 100%.",
          });
          return;
        }
        // calculate actual share amount for each participant
        participants.forEach((p, idx) => {
          participants[idx].share = Number(
            ((totalAmount * p.share) / 100).toFixed(2)
          );
        });
      }

      if (splitType === "amnt") {
        if (Number(totalShare.toFixed(2)) !== Number(totalAmount.toFixed(2))) {
          toast({
            variant: "destructive",
            title: "Invalid split ❌",
            description: "Sum of exact amounts must equal total expense.",
          });
          return;
        }
      }
    }

    // Ensure every participant has settledAmount: 0
    const participantsWithSettledAmount = participants.map((p) => ({
      ...p,
      settledAmount: 0,
    }));

    const expenseData = {
      amount,
      category,
      subcategory,
      date,
      desc,
      paid,
      paymentMode,
      userId,
      split,
      splitType,
      grpId,
      paidBy,
      participants: participantsWithSettledAmount,
      status,
    };

    try {
      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication error ❌",
          description: "No token found. Please log in again.",
        });
        return;
      }

      console.log(expenseData);

      if (selectedExpense) {
        await api.put(
          `/expense/update-expense/${selectedExpense._id}`,
          expenseData
        );
        toast({
          title: "Expense updated ✅",
          description: "Expense has been updated successfully.",
        });
      } else {
        await api.post("/splitwise/add-expense", expenseData);
        toast({
          title: "Expense added 🎉",
          description: "Expense has been added successfully.",
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
    }
  };

  return (
    <form className={"grid items-start gap-6"} onSubmit={handleSubmit}>
      {/* Amount */}
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
            required
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

      {/* Date */}
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

      {/* Description */}
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

      {/* Split Checkbox */}
      <div className="flex items-center space-x-2">
        <input
          id="split"
          type="checkbox"
          checked={split}
          onChange={(e) => setSplit(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300"
        />
        <Label htmlFor="split" className="cursor-pointer">
          Split Expense
        </Label>
      </div>

      {/* Split Section */}
      {split && (
        <div className="grid gap-6 border rounded-lg p-4">
          {/* Group + Split Type */}
          <div className="flex gap-3">
            <div className="flex-1 grid gap-2">
              <Label>Group</Label>
              <Select value={grpId} onValueChange={handleGroupChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((grp) => (
                    <SelectItem key={grp._id} value={grp._id}>
                      {grp.grpName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 grid gap-2">
              <Label>Split Type</Label>
              <Select
                value={splitType}
                onValueChange={(val: "pct" | "amnt" | "eql") =>
                  setSplitType(val)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select split type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pct">Percentage</SelectItem>
                  <SelectItem value="amnt">Exact Amount</SelectItem>
                  <SelectItem value="eql">Equal Split</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Participants */}
          <div className="grid gap-3">
            <Label>Participants</Label>
            {participants.map((p, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <Select
                  value={p.userId}
                  onValueChange={(val) =>
                    handleParticipantChange(idx, "userId", val)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem key={m.userId} value={m.userId}>
                        {m.username || "Unknown"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder={
                    splitType === "pct"
                      ? "Share (%)"
                      : splitType === "amnt"
                      ? `Amount (Remaining: ${Math.max(
                          0,
                          Number(amount) -
                            participants
                              .slice(0, idx)
                              .reduce((sum, p) => sum + p.share, 0)
                        )})`
                      : "Amount"
                  }
                  value={p.share}
                  onChange={(e) =>
                    handleParticipantChange(idx, "share", e.target.value)
                  }
                />
                <input
                  type="checkbox"
                  checked={p.settled}
                  onChange={(e) =>
                    handleParticipantChange(idx, "settled", e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeParticipant(idx)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addParticipant}>
              + Add Participant
            </Button>
          </div>

          {/* Paid By */}
          <div className="grid gap-3">
            <Label>Paid By</Label>
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger>
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.userId} value={m.userId}>
                    {m.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Overall Status */}
          <div className="flex items-center space-x-2">
            <input
              id="status"
              type="checkbox"
              checked={status === "settled"}
              onChange={(e) =>
                setStatus(e.target.checked ? "settled" : "pending")
              }
              className="w-4 h-4 rounded border-gray-300"
            />
            <Label htmlFor="status" className="cursor-pointer">
              Mark as Settled
            </Label>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit">
        {selectedExpense ? "Update Expense" : "Save Expense"}
      </Button>
    </form>
  );
};

export default AddSplitWiseExpense;
