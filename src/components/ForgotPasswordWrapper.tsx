import { useState } from "react";
import ChangePassword from "./ChangePassword";
import ForgotPassword from "./ForgotPassword";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function ForgotPasswordWrapper() {
  const [open, setOpen] = useState<boolean>(false);
  const [showComponent, setShowComponent] = useState<
    "Forgot Password" | "Change Password"
  >("Forgot Password");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <p className="hover:underline">Forgot Password?</p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{showComponent}</DialogTitle>
        </DialogHeader>

        {showComponent === "Forgot Password" && (
          <ForgotPassword setShowComponent={setShowComponent} />
        )}
        {showComponent === "Change Password" && <ChangePassword />}
      </DialogContent>
    </Dialog>
  );
}
