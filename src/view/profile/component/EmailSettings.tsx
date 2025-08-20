"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { userService } from "../../../service/userService";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";

interface EmailSettingsProps {
  user: any;
}

export default function EmailSettings({ user }: EmailSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const { refreshUserData } = useAuth();

  const handleReverifyEmail = async () => {
    if (!newEmail || newEmail === user?.email) {
      toast.error("Please enter a different email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);

      const response = await userService.reverifyEmail({ newEmail });

      if (response.success) {
        toast.success("Verification email sent successfully");
        setNewEmail("");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send verification email";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setIsLoading(true);

      const response = await userService.reverifyEmail({
        newEmail: user?.email,
      });

      if (response.success) {
        toast.success("Verification email sent to your current email");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send verification email";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Email Status */}
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-500" />
            <div>
              <h3 className="font-medium">Current Email</h3>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>

          {user?.isVerified ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="mr-1 h-3 w-3" />
              Verified
            </Badge>
          ) : (
            <Badge variant="destructive">
              <XCircle className="mr-1 h-3 w-3" />
              Not Verified
            </Badge>
          )}
        </div>

        {!user?.isVerified && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <div className="flex-1">
              <p className="text-sm text-orange-800">
                Your email is not verified. Please check your inbox or resend
                the verification email.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendVerification}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
              Resend
            </Button>
          </div>
        )}
      </div>

      {/* Change Email */}
      <div className="p-4 border rounded-lg">
        <h3 className="font-medium mb-3">Change Email Address</h3>
        <p className="text-sm text-gray-600 mb-4">
          Enter a new email address to receive a verification email. Your email
          will be updated after verification.
        </p>

        <div className="space-y-4">
          <div>
            <Label htmlFor="newEmail">New Email Address</Label>
            <Input
              id="newEmail"
              type="email"
              placeholder="Enter new email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>

          <Button
            onClick={handleReverifyEmail}
            disabled={isLoading || !newEmail}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Send className="mr-2 h-4 w-4" />
            Send Verification Email
          </Button>
        </div>
      </div>

      {/* Email Preferences */}
      <div className="p-4 border rounded-lg">
        <h3 className="font-medium mb-3">Email Preferences</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing emails</p>
              <p className="text-sm text-gray-600">
                Receive updates about new features and promotions
              </p>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Booking notifications</p>
              <p className="text-sm text-gray-600">
                Get notified about booking confirmations and updates
              </p>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Security alerts</p>
              <p className="text-sm text-gray-600">
                Important notifications about your account security
              </p>
            </div>
            <Badge variant="secondary">Always On</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
