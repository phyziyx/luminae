import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CameraIcon } from "lucide-react";
import ChangePassword from "./change-password";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default async function Profile() {
  const t = await getTranslations();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) return <></>;

  return (
    <Card className="max-w-3xl mx-auto w-full bg-white dark:bg-muted/30">
      <CardHeader>
        <CardTitle>{t("PROFILE.HEADER")}</CardTitle>
        <CardDescription>{t("PROFILE.DESCRIPTION")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.image || ""} alt={user?.name} />
              <AvatarFallback>
                {user?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Label
              htmlFor="profile-image"
              className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <CameraIcon className="h-4 w-4" />
              <span className="sr-only">Upload profile image</span>
            </Label>
            <Input
              id="profile-image"
              type="file"
              accept="image/*"
              className="hidden"
            />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">
              Update your profile information below
            </p>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="change-password">
            <AccordionTrigger>Change Password</AccordionTrigger>
            <AccordionContent>
              <ChangePassword />
            </AccordionContent>
          </AccordionItem>
          {/* <AccordionItem value="security-settings">
            <AccordionTrigger>Security Settings</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Active Sessions</h4>
                    <p className="text-sm text-muted-foreground">
                      Manage your active sessions
                    </p>
                  </div>
                  <Button variant="outline">View</Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem> */}
        </Accordion>
      </CardContent>
    </Card>
  );
}
