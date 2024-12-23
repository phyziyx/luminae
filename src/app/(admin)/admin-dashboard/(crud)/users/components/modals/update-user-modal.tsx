"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchUserDetails } from "@/lib/api/user"; // Custom server function to fetch user details
import { LoadingSpinner } from "@/components/site/loading-spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import formSchema from "../user-details/schema";
import { z } from "zod";
import onUserUpdate from "../actions/user-update";

type UpdateUserModalProps = {
  userId: string;
};

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    avatarUrl: "",
    email: "",
    stripeConnectAccountId: "",
    stripeCustomerId: "",
  });

  const { toast } = useToast();

  // Fetch user details
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await fetchUserDetails(userId);
        setUserData(data);
        setLoading(false);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user details.",
        });
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId, toast]); // Only run when userId changes

  // Initialize form with the fetched user data after it's loaded
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: userData,
  });

  useEffect(() => {
    form.reset(userData); // Reset form with new data after it's fetched
  }, [userData]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const response = await onUserUpdate(values);

      toast({
        title: response?.error || "User information saved successfully",
        variant: response?.error ? "destructive" : "default",
      });
    } catch {
      toast({
        title: "An error occurred while saving the user information",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="stripeConnectAccountId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stripe Connect Account ID</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="stripeCustomerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stripe Customer ID</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UpdateUserModal;