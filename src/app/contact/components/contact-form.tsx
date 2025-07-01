"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { submitVerification } from "../actions/submitVerification";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  file: z.any().optional(),
});

type ContactFormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [filePreview, setFilePreview] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      file: undefined,
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && selectedFile.size <= 5 * 1024 * 1024) {
      field.onChange(selectedFile);

      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => setFilePreview(reader.result as string);
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview("");
      }
    }
  };

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      if (data.subject === "agency_verification") {
        await submitVerification({
          name: data.name,
          email: data.email,
          message: data.message,
        });

        setShowSuccess(true);
        form.reset();
        setFilePreview("");
      } else {
        toast({
          title: "Your message was received. No further action needed.",
          variant: "default",
        });
        form.reset();
        setFilePreview("");
      }
    } catch (error: any) {
      const message = error?.message;

      if (message === "Unauthorized") {
        toast({
          title: "Please sign in to submit an agency verification request.",
          variant: "destructive",
        });
        router.push("/sign-in");
      } else if (message === "No agency found for user.") {
        toast({
          title:
            "You must first create or join an agency before submitting a request.",
          variant: "destructive",
        });
      } else if (
        message ===
        "A verification request is already pending or approved for this agency."
      ) {
        toast({
          title: "You already have an active verification request.",
          description:
            "You cannot submit another request until the current one is resolved.",
          variant: "destructive",
        });
      } else if (
        message ===
        "This agency has been rejected too many times and cannot submit again."
      ) {
        toast({
          title: "Submission Blocked",
          description:
            "This agency has been rejected 3 times and cannot submit another request.",
          variant: "destructive",
        });
      } else {
        toast({
          title: message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden bg-white dark:bg-muted-foreground/10 transition-colors duration-300 shadow-soft">
        <CardContent className="p-6 sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-gray-100">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your full name"
                        className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-zinc-700 transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-gray-100">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        placeholder="Enter your email"
                        className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-zinc-700 transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="subject"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-gray-100">
                      Subject
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-zinc-700 transition-colors">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
                        {/* <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">
                          Technical Support
                        </SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="report">Report an Issue</SelectItem> */}
                        <SelectItem value="agency_verification">
                          Agency Verification
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="message"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-gray-100">
                      Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        {...field}
                        placeholder="Enter your message"
                        className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-zinc-700 transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="file"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-gray-100">
                      Attachment (Optional)
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-4">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, field)}
                          className="text-gray-800 dark:text-gray-100"
                        />
                        {filePreview && (
                          <Image
                            src={filePreview}
                            alt="File preview"
                            className="h-16 w-16 rounded-md"
                            width={64}
                            height={64}
                            onError={() => setFilePreview("")}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Message Sent Successfully</AlertDialogTitle>
            <AlertDialogDescription>
              Thank you for contacting us! We've received your message and will
              get back to you as soon as possible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
