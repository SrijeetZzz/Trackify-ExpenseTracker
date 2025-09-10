import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { api } from "../../utils/axiosInstance";
import CreateGroupDialog from "./AddGroup";
import CreateUserDialog from "./AddUser";
import EditGroupDialog from "./EditGroup";
import GroupSettlementsTable from "./SettlemenrOfEachGroup";
import { Spinner } from "../ui/shadcn-io/spinner";

type Group = {
  _id: string;
  grpName: string;
  desc?: string;
  createdBy: string;
  members: any[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

const GroupsTable = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedGrpId, setSelectedGrpId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/splitwise/get-user-groups`);
      const data = res.data || [];
      setGroups(data);
      if (data.length > 0) {
        setSelectedGrpId(data[0]._id);
      }
    } catch (err) {
      console.error("Failed to fetch groups:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setShowEditDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/splitwise/delete-group/${id}`);
      setGroups((prev) => prev.filter((g) => g._id !== id));
      if (selectedGrpId === id && groups.length > 1) {
        setSelectedGrpId(groups[0]._id);
      }
    } catch (err) {
      console.error("Failed to delete group:", err);
    }
  };

  const handleUpdated = () => {
    setShowEditDialog(false);
    setEditingGroup(null);
    fetchGroups();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen w-[1200px]">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <div className="w-full text-center mb-6">
        <h2 className="text-2xl font-bold tracking-wide">Group Table</h2>
        <p className="text-sm text-gray-500">Manage and track your groups</p>
      </div>
      <div className="flex justify-between">
        <CreateGroupDialog onCreated={fetchGroups} />
        <CreateUserDialog onCreated={fetchGroups} />
      </div>
      {editingGroup && showEditDialog && (
        <EditGroupDialog
          group={editingGroup}
          onUpdated={handleUpdated}
          onClose={() => {
            setShowEditDialog(false);
            setEditingGroup(null);
          }}
        />
      )}

      <div className="flex space-x-4">
        <div className="w-1/3 max-h-[200px] overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Group Name</TableHead>
                <TableHead className="text-center w-[120px]">Members</TableHead>
                <TableHead className="text-right w-[160px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow
                  key={group._id}
                  className="cursor-pointer"
                  onClick={() => setSelectedGrpId(group._id)}
                >
                  <TableCell
                    className={`font-medium ${
                      selectedGrpId === group._id ? "bg-gray-100" : ""
                    }`}
                  >
                    {group.grpName}
                  </TableCell>
                  <TableCell className="text-center">
                    {group.members?.length || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(group)}
                        className="p-2"
                      >
                        <span className="material-symbols-outlined text-base">
                          edit
                        </span>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(group._id)}
                        className="p-2"
                      >
                        <span className="material-symbols-outlined text-base">
                          delete
                        </span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="w-2/3">
          {selectedGrpId && <GroupSettlementsTable grpId={selectedGrpId} />}
        </div>
      </div>
    </div>
  );
};

export default GroupsTable;
