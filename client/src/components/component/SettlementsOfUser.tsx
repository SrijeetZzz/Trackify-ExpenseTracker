import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/utils/axiosInstance";
import SettlementDialog from "./SettlementDialog"; 
import { Spinner } from "../ui/shadcn-io/spinner";

interface SettlementRow {
  groupId: string;
  counterpartyId: string;
  groupName: string;
  counterparty: string;
  amount: number;
}


const SettlementsTable = () => {
  const userId = localStorage.getItem("userId");
  const [settlements, setSettlements] = useState<SettlementRow[]>([]);
  const [selectedRow, setSelectedRow] = useState<SettlementRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading,setLoading] = useState(false)

  useEffect(() => {
    const fetchSettlements=async()=> {
      setLoading(true)
      try {
        const response = await api.get(`/splitwise/settlements/${userId}`);
        const groups = response.data.groups || [];
        const data: SettlementRow[] = groups.flatMap((group: any) =>
          (group.settlements || [])
            .filter((s: any) => s.from.userId === userId || s.to.userId === userId)
            .map((s: any) => ({
              groupId: group.groupId,
              counterpartyId: s.from.userId === userId ? s.to.userId : s.from.userId,
              groupName: group.groupName,
              counterparty: s.from.userId === userId ? s.to.username : s.from.username,
              amount: s.to.userId === userId ? s.amount : -s.amount,
            }))
        );
        setSettlements(data);
      } catch (error) {
        console.error("Error fetching settlements:", error);
      }finally{
        setLoading(false)
      }
    }

    fetchSettlements();
  }, [userId]);

  const handleRowClick = (row: SettlementRow) => {
    setSelectedRow(row);
    setDialogOpen(true);
  };
  if (loading)
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  return (
    <>
      <div className="max-h-[400px] overflow-y-auto border rounded-lg space-y-6 p-4">
        <div className="w-full text-center mb-6">
        <h2 className="text-2xl font-bold tracking-wide">
          Group Settlement Table
        </h2>
        <p className="text-sm text-gray-500">
          Manage and settle your shared expenses across groups
        </p>
      </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group</TableHead>
              <TableHead>With</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settlements.length > 0 ? (
              settlements.map((s, i) => (
                <TableRow
                  key={i}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleRowClick(s)}
                >
                  <TableCell>{s.groupName}</TableCell>
                  <TableCell>{s.counterparty}</TableCell>
                  <TableCell className={s.amount > 0 ? "text-green-600" : "text-red-600"}>
                    {s.amount > 0 ? `+${s.amount.toFixed(2)}` : `${s.amount.toFixed(2)}`}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500">
                  No settlements found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Settlement Dialog */}
      {selectedRow && (
        <SettlementDialog
          groupId={selectedRow.groupId}
          participantId={selectedRow.counterpartyId}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
};

export default SettlementsTable;
