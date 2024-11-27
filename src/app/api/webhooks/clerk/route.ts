import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import UserManager from "@/lib/managers/userManager";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!CLERK_WEBHOOK_SECRET) {
      throw new Error(
        "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
      );
    }

    const headerPayload = await headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new NextResponse("Error occured -- no svix headers", {
        status: 400,
      });
    }

    const payload = await req.json();
    console.log("Payload", payload);

    const body = JSON.stringify(payload);
    console.log("Body", body);

    const wh = new Webhook(CLERK_WEBHOOK_SECRET);

    let event: WebhookEvent;

    try {
      event = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred", {
        status: 400,
      });
    }

    const { id } = event.data;
    const eventType = event.type;

    switch (eventType) {
      case "user.created":
        if (!!id) {
          await UserManager.createUser({
            id: id,
            email: event.data.email_addresses[0].email_address,
            name: `${event.data.first_name} ${event.data.last_name}`,
            avatarUrl: event.data.image_url,
          });
        }
        break;
      case "user.updated":
        // Do something when a user is updated
        break;
      case "user.deleted":
        if (!!id) {
          try {
            console.log("Deleting user with ID", id);
            await UserManager.deleteUsers([id]);
          } catch (e) {
            console.warn("Error deleting user", e);
          }
        }
        break;
      default:
        break;
    }

    console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
    console.log("Webhook body:", body);

    return new NextResponse("", { status: 200 });
  } catch (e) {
    console.error("Error processing webhook", e);
    return new NextResponse("Error occurred", { status: 400 });
  }
}
