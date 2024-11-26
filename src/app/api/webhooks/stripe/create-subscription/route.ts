import { NextResponse } from "next/server";
import AgencyManager from "@/lib/managers/agencyManager";
import stripeManager from "@/lib/managers/stripeManager";

export async function POST(req: Request) {
  // JavaScript's most annoying feature is that the errors are not
  // declarative, so we'll put this piece of code in a try-catch block

  try {
    const body = await req.json();
    // : Stripe.WebhookEndpoint

    console.log("body", body);

    const { customerId, priceId } = body;
    if (!customerId || !priceId) {
      return new NextResponse("Customer ID or Price ID is missing", {
        status: 400,
      });
    }

    const agency = await AgencyManager.findAgencyByStripeCustomerId(
      customerId,
      true
    );

    if (!agency) {
      // The agency with that Stripe Customer ID does not exist.
      return;
    }

    const dbSubscription = agency.subscription;
    if (!dbSubscription) {
      // New subscription to be created...

      const stripeSub = await stripeManager.stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
        payment_behavior: "default_incomplete",
        payment_settings: {
          save_default_payment_method: "on_subscription",
        },
        expand: ["latest_invoice.payment_intent"],
      });

      return NextResponse.json({
        subsriptionId: stripeSub.id,
        clientSecret:
          typeof stripeSub.latest_invoice === "string"
            ? ""
            : typeof stripeSub.latest_invoice?.payment_intent === "string"
            ? ""
            : stripeSub.latest_invoice?.payment_intent?.client_secret,
      });
    } else {
      // Subscription exists in the database, and then we can update it...
      //
      // TODO:
      const stripeSub = await stripeManager.stripe.subscriptions.retrieve(
        dbSubscription.id
      );

      const newStripeSub = await stripeManager.stripe.subscriptions.update(
        dbSubscription.id,
        {
          items: [
            {
              id: stripeSub.items.data[0].id,
              deleted: true,
            },
            { price: priceId },
          ],
          expand: ["latest_invoice.payment_intent"],
        }
      );

      return NextResponse.json({
        subscriptionId: dbSubscription.id,
        clientSecret:
          typeof newStripeSub.latest_invoice === "string"
            ? ""
            : typeof newStripeSub.latest_invoice?.payment_intent === "string"
            ? ""
            : newStripeSub.latest_invoice?.payment_intent?.client_secret,
      });
    }
  } catch (e) {
    console.error("Error processing webhook", e);
    return new NextResponse("", { status: 500 });
  }
}
