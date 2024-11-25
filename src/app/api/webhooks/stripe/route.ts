import { NextResponse } from "next/server";
import AgencyManager from "@/lib/managers/agencyManager";
import stripeManager from "@/lib/managers/stripeManager";

export async function POST(req: Request) {
  // JavaScript's most annoying feature is that the errors are not
  // declarative and imperative, so we'll put this piece of code in
  // a try-catch block

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

    const subscription = agency.subscription;
    if (subscription) {
      // The Subscriptions field can be empty...

      if (!subscription) {
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
        // const stripeSub = await stripeManager.stripe.subscriptions.retrieve(
        //   subscription.stripeSubscriptionId
        // );
      }
    }
  } catch (e) {
    console.error("Error processing webhook", e);
    return new NextResponse("", { status: 500 });
  }
}
