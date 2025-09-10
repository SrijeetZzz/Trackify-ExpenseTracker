import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/utils/axiosInstance";
import { Spinner } from "../ui/shadcn-io/spinner";

interface Balance {
  userId: string;
  username: string;
  balance: number;
}

interface Settlement {
  from: { userId: string; username: string };
  to: { userId: string; username: string };
  amount: number;
}

interface GroupSettlementsProps {
  grpId: string;
}

const GroupSettlementsTable = ({ grpId }: GroupSettlementsProps) => {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading,setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const fetchGroupSettlements=async()=> {
      try {
        const response = await api.get(`/splitwise/settlement/${grpId}`);
        const data = response.data;
        setBalances(data.balances || []);
        setSettlements(data.settlements || []);
      } catch (error) {
        console.error("Error fetching group settlements:", error);
      }finally{
        setLoading(false)
      }
    }

    fetchGroupSettlements();
  }, [grpId]);
    if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <div className="flex space-x-4 max-h-[200px] overflow-y-auto">
      <div className="w-1/2 border rounded-lg overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {balances.map((b) => (
              <TableRow key={b.userId}>
                <TableCell>{b.username}</TableCell>
                <TableCell className={b.balance >= 0 ? "text-green-600" : "text-red-600"}>
                  {b.balance.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="w-1/2 border rounded-lg overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settlements.map((s, i) => (
              <TableRow key={i}>
                <TableCell>{s.from.username}</TableCell>
                <TableCell>{s.to.username}</TableCell>
                <TableCell className="text-black">{s.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GroupSettlementsTable;
