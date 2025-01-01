"use client";

import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import userFormSchema from "../user-details/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

interface UpdateUserFormProps {
  form: UseFormReturn<z.infer<typeof userFormSchema>>;
  onSubmit: (values: z.infer<typeof userFormSchema>) => Promise<void>;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ form, onSubmit }) => {
  const isLoading = form.formState.isSubmitting;
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
        {/* HEADING */}
        <Label>Avatar</Label>
        <Avatar>
          <AvatarImage src={form.getValues().avatarUrl} />
          <AvatarFallback>{form.getValues().name}</AvatarFallback>
        </Avatar>
        </div>

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} required disabled />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : "Save Changes"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UpdateUserForm;