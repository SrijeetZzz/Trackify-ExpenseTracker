import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useToast } from "@/hooks/use-toast";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface EditGroupDialogProps {
  group: {
    _id: string;
    grpName: string;
    desc?: string;
    members: { userId: string }[];
  } | null;
  onUpdated?: () => void; // callback to refresh table
  onClose?: () => void; // callback to close dialog
}

const EditGroupDialog: React.FC<EditGroupDialogProps> = ({ group, onUpdated, onClose }) => {
  const [grpName, setGrpName] = useState("");
  const [desc, setDesc] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const {toast} = useToast();

  // Update state whenever a new group is passed
  useEffect(() => {
    if (group) {
      setGrpName(group.grpName);
      setDesc(group.desc || "");
      setMembers(group.members.map((m) => m.userId));
    }
  }, [group]);

  // Fetch all users for selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/splitwise/get-users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleMemberChange = (index: number, userId: string) => {
    const updated = [...members];
    updated[index] = userId;
    setMembers(updated);
  };

  const addMemberField = () => setMembers([...members, ""]);
  const removeMemberField = (index: number) =>
    setMembers(members.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!group) {
    toast({
      variant: "destructive",
      title: "No group selected ❌",
      description: "Please select a group to edit.",
    });
    return;
  }

  const payload = {
    groupId: group._id,
    grpName,
    desc,
    members: members.filter(Boolean).map((userId) => ({ userId })),
  };

  try {
    setLoading(true);
    await api.put("/splitwise/edit-group", payload);

    toast({
      title: "Group updated ✅",
      description: `"${grpName}" has been updated successfully.`,
    });

    if (onUpdated) onUpdated(); // refresh table
    if (onClose) onClose(); // close dialog
  } catch (err: any) {
    console.error("Failed to edit group:", err);
    toast({
      variant: "destructive",
      title: "Error updating group ❌",
      description: err?.response?.data?.message || "Something went wrong.",
    });
  } finally {
    setLoading(false);
  }
};

  if (!group) return null; 

  return (
    <Dialog open={!!group} onOpenChange={(open) => !open && onClose && onClose()}>
      <DialogContent className="ssm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
            <DialogDescription>Update the group details below.</DialogDescription>
          </DialogHeader>

          {/* Group Name */}
          <div className="grid gap-3">
            <Label htmlFor="grpName">Group Name</Label>
            <Input
              id="grpName"
              value={grpName}
              onChange={(e) => setGrpName(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="grid gap-3">
            <Label htmlFor="desc">Description</Label>
            <Input
              id="desc"
              placeholder="Optional"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          {/* Members */}
          <div className="grid gap-3">
            <Label>Members</Label>
            {members.map((userId, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Select
                  value={userId}
                  onValueChange={(val) => handleMemberChange(idx, val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {members.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeMemberField(idx)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addMemberField}>
              + Add Member
            </Button>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditGroupDialog;

