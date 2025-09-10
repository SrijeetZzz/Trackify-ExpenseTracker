import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/axiosInstance";

interface Transaction {
  expenseId: string;
  amount: number;
  paidBy: string;
  owedBy: string;
  type: "credit" | "debit";
  settled?: boolean;
  settledAmount?: number;
}

interface SettlementDialogProps {
  groupId: string;
  participantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettlementDialog = ({
  groupId,
  participantId,
  open,
  onOpenChange,
}: SettlementDialogProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settleAmount, setSettleAmount] = useState<number>(0);
  const [initialTickAmount, setInitialTickAmount] = useState<number>(0);

  useEffect(() => {
    if (open) {
      api
        .get(`/expense/get-expense/${groupId}/${participantId}`)
        .then((res) => {
          const { credits, debits } = res.data;

          const txs: Transaction[] = [
            ...credits.map((c: any) => ({
              ...c,
              type: "credit",
              settled: false,
              settledAmount: 0,
            })),
            ...debits.map((d: any) => ({
              ...d,
              type: "debit",
              settled: false,
              settledAmount: 0,
            })),
          ];

          const totalCredit = credits.reduce((sum: number, c: any) => sum + c.amount, 0);
          const totalDebit = debits.reduce((sum: number, d: any) => sum + d.amount, 0);

          // Initial tick
          if (totalDebit > totalCredit) {
            txs.forEach((tx) => {
              if (tx.type === "credit") {
                tx.settled = true;
                tx.settledAmount = tx.amount;
              }
            });
            setInitialTickAmount(totalCredit);
          } else if (totalCredit > totalDebit) {
            txs.forEach((tx) => {
              if (tx.type === "debit") {
                tx.settled = true;
                tx.settledAmount = tx.amount;
              }
            });
            setInitialTickAmount(totalDebit);
          } else {
            setInitialTickAmount(0);
          }

          setTransactions(txs);
          setSettleAmount(0);
        })
        .catch((err) => console.error(err));
    }
  }, [open, groupId, participantId]);

  const updateSettledStatus = (amount: number) => {
  const updatedTxs = [...transactions];

  const creditTxs = updatedTxs.filter((t) => t.type === "credit");
  const debitTxs = updatedTxs.filter((t) => t.type === "debit");

  const totalCredit = creditTxs.reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = debitTxs.reduce((sum, t) => sum + t.amount, 0);

  // Case: totalDebits > totalCredits
  if (totalDebit > totalCredit) {
    const sortedDebits = [...debitTxs].sort((a, b) => b.amount - a.amount); // largest first
    let remaining = amount + initialTickAmount;

    sortedDebits.forEach((tx) => {
      const applied = Math.min(tx.amount, remaining);
      tx.settledAmount = applied;
      tx.settled = applied === tx.amount;
      remaining -= applied;
    });
  }
  // Case: totalCredits > totalDebits
  else if (totalCredit > totalDebit) {
    const sortedCredits = [...creditTxs].sort((a, b) => b.amount - a.amount);
    let remaining = amount + initialTickAmount;

    sortedCredits.forEach((tx) => {
      const applied = Math.min(tx.amount, remaining);
      tx.settledAmount = applied;
      tx.settled = applied === tx.amount;
      remaining -= applied;
    });
  }
  // Only one side exists – sequential allocation
  else {
    let remaining = amount;
    updatedTxs.forEach((tx) => {
      const applied = Math.min(tx.amount, remaining);
      tx.settledAmount = applied;
      tx.settled = applied === tx.amount;
      remaining -= applied;
    });
  }

  setTransactions(updatedTxs);
};

  useEffect(() => {
    if (transactions.length > 0) {
      updateSettledStatus(settleAmount);
    }
  }, [settleAmount]);

  const handleSubmit = async () => {
    try {
      const payload = {
        transactions: transactions.map((tx) => ({
          expenseId: tx.expenseId,
          settled: tx.settled || false,
          settledAmount: tx.settledAmount || 0,
          type: tx.type,
        })),
      };

      await api.post(
        `/splitwise/settlements/${groupId}/${participantId}`,
        payload
      );

      onOpenChange(false);
      setTransactions([]);
      setSettleAmount(0);
      setInitialTickAmount(0);
    } catch (err) {
      console.error("Error submitting settlements:", err);
    }
  };

  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const netAmount = totalCredit - totalDebit;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Settle Expenses</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4 max-h-96 overflow-y-auto">
          {transactions.map((tx, idx) => (
            <div
              key={tx.expenseId}
              className={`flex items-center justify-between border p-3 rounded-md ${
                tx.type === "credit" ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div className="flex-1">
                <p className="font-semibold">{idx + 1}. Expense</p>
                <p className="text-sm text-gray-600">
                  {tx.type === "credit" ? "+" : "-"}₹{tx.amount} ({tx.type})
                </p>
              </div>
              <input
                type="checkbox"
                checked={tx.settled || false}
                readOnly
                className="w-5 h-5"
              />
            </div>
          ))}
        </div>

        <div className="border-t pt-3 mt-3 text-right">
          <p className="font-semibold">
            Total Credit: ₹{totalCredit} | Total Debit: ₹{totalDebit}
          </p>

          {netAmount > 0 && (
            <p className="font-bold text-green-600">
              You are owed ₹{netAmount - settleAmount > 0 ? netAmount - settleAmount : 0}
            </p>
          )}
          {netAmount < 0 && (
            <p className="font-bold text-red-600">
              You owe ₹{Math.abs(netAmount) - settleAmount > 0 ? Math.abs(netAmount) - settleAmount : 0}
            </p>
          )}
          {netAmount === 0 && (
            <p className="font-bold text-gray-600">All settled 🎉</p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <label className="font-medium">Settlement Amount:</label>
          <input
            type="number"
            min={0}
            value={settleAmount}
            onChange={(e) => setSettleAmount(Number(e.target.value))}
            className="border rounded px-2 py-1 w-32 text-center"
          />
        </div>

        <DialogFooter className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettlementDialog;
