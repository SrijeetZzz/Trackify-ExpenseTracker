import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/utils/axiosInstance";
import { useToast } from "@/hooks/use-toast";

interface CreateUserDialogProps {
  onCreated?: () => void;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ onCreated }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sendNotification, setSendNotification] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ validation
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim()
    ) {
      toast({
        variant: "destructive",
        title: "Missing fields ❌",
        description:
          "Please fill in all required fields before creating a user.",
      });
      return;
    }

    const password = `${firstName}${phone.slice(-5)}#`;
    const username = `${firstName} ${lastName}`;

    const payload = {
      username,
      email,
      phone,
      password,
      sendNotification,
    };

    try {
      // 1️⃣ Create the user
      const res = await api.post("/splitwise/create-user", payload);

      if (res.status === 200) {
        toast({
          title: "User created 🎉",
          description: `${username} has been added successfully.`,
        });

        // 2️⃣ Send email notification
        // Assuming you have the admin name from the token (req.user.user) in your backend
        const emailPayload = {
          recipientEmail: email,
          subject: "Your Trackify Account",
          message: `${
            res.data.adminName || "Admin"
          } has created your account in Trackify. Your dummy password is: ${password}`,
        };

        try {
          await api.post("/send-email", emailPayload);
          toast({
            title: "Email sent ✉️",
            description: `Notification email sent to ${email}.`,
          });
        } catch (emailErr) {
          console.error("Failed to send email:", emailErr);
          toast({
            variant: "destructive",
            title: "Email failed ❌",
            description: "User created but failed to send email notification.",
          });
        }

        // refresh parent data
        if (onCreated) onCreated();

        // reset form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setSendNotification(false);

        // close dialog
        setOpen(false);
      }
    } catch (err: any) {
      console.error("Failed to create user:", err);
      toast({
        variant: "destructive",
        title: "Error creating user ❌",
        description: err?.response?.data?.message || "Something went wrong.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new user account. You can
              choose to send them login credentials via email.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sendNotification"
              checked={sendNotification}
              onCheckedChange={(checked: any) =>
                setSendNotification(Boolean(checked))
              }
            />
            <Label htmlFor="sendNotification" className="cursor-pointer">
              Send notification & password via email
            </Label>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Create User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
