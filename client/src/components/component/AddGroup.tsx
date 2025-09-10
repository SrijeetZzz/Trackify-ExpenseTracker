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
import { useToast } from "@/hooks/use-toast";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface CreateGroupDialogProps {
  onCreated?: () => void;
}

const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({ onCreated }) => {
  const [grpName, setGrpName] = useState("");
  const [desc, setDesc] = useState("");
  const [members, setMembers] = useState<string[]>([""]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get("/splitwise/get-users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle member selection change
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

    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
      toast({
        variant: "destructive",
        title: "User not logged in ",
        description: "Please log in to create a group.",
      });
      return;
    }


    if (!grpName.trim()) {
      toast({
        variant: "destructive",
        title: "Missing group name ",
        description: "Please enter a group name before saving.",
      });
      return;
    }

    const payload = {
      grpName,
      desc,
      members: [
        { userId: currentUserId },
        ...members.filter(Boolean).map((userId) => ({ userId })),
      ],
    };

    try {
      setLoading(true);

       await api.post("/splitwise/create-group", payload);

      toast({
        title: "Group created ",
        description: `"${grpName}" has been created successfully.`,
      });

      try {
        await api.post("/send-group-emails", {
          grpName,
          members: payload.members,
        });

        toast({
          title: "Emails sent ✉️",
          description:
            "Notification emails have been sent to all group members.",
        });
      } catch (emailErr: any) {
        console.error("Failed to send group emails:", emailErr);
        toast({
          variant: "destructive",
          title: "Email failed ",
          description:
            emailErr?.response?.data?.message ||
            "Group was created but failed to send emails.",
        });
      }

      if (onCreated) onCreated();


      setGrpName("");
      setDesc("");
      setMembers([""]);

      setOpen(false);
    } catch (err: any) {
      console.error("Failed to create group:", err);
      toast({
        variant: "destructive",
        title: "Error creating group ",
        description: err?.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Group</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new group.
            </DialogDescription>
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addMemberField}
            >
              + Add Member
            </Button>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
