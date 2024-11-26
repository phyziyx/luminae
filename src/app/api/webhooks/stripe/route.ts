import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import stripeManager from "@/lib/managers/stripeManager";

const stripeWebhookEvents = new Set([
  "product.created",
  "product.updated",
  //
  "price.created",
  "price.updated",
  //
  "checkout.session.completed",
  //
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: NextRequest) {
  try {
    const webhookSecret =
      process.env.STRIPE_WEBHOOK_SECRET_LIVE ??
      process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error(
        "Please add STRIPE_WEBHOOK_SECRET(_LIVE) from Stripe Dashboard to .env or .env.local"
      );
    }

    const headerPayload = await headers();
    const signature = headerPayload.get("Stripe-Signature");

    if (!signature || !webhookSecret) {
      return new NextResponse("Error occured -- no stripe headers", {
        status: 400,
      });
    }

    const payload = await req.text();

    let event: Stripe.Event;

    try {
      event = stripeManager.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred", {
        status: 400,
      });
    }

    const eventType = event.type;

    if (!stripeWebhookEvents.has(eventType)) {
      return new NextResponse("Error occured -- invalid stripe event", {
        status: 400,
      });
    }

    const subscription = event.data.object as Stripe.Subscription;
    console.log(subscription);

    if (
      !subscription.metadata.connectAccountPayments &&
      !subscription.metadata.connectAccountSubscriptions
    ) {
      switch (eventType) {
        case "customer.subscription.created":
        case "customer.subscription.updated": {
          if (subscription.status === "active") {
            console.log("Creating subscription", subscription);
            await stripeManager.createSubscription(subscription);
          } else {
            console.log(
              "Skipping subscription creation because subscription status is not active",
              subscription
            );
          }
          break;
        }
        default:
          console.log("Unhandled stripe event:", eventType);
      }
    } else {
      console.log(
        "Skipping from webhook because subscription was from a connected account not for the application",
        subscription
      );
    }

    return NextResponse.json(
      {
        webhookActionReceived: true,
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    console.log("Error processing webhook", e);
    return new NextResponse("Error occured", {
      status: 400,
    });
  }
}
