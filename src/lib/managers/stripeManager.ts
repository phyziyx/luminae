import Stripe from "stripe";
import AgencyManager from "./agencyManager";
import prisma from "../db";
import { Subscription, SubscriptionStatus } from "@prisma/client";
import PackageManager from "./packageManager";

class StripeManager {
  private _stripe: Stripe;

  constructor() {
    const { STRIPE_SECRET_KEY } = process.env;
    if (!STRIPE_SECRET_KEY) {
      throw new Error(
        "Please add STRIPE_SECRET_KEY (Secret key) from Stripe Dashboard to .env or .env.local"
      );
    }

    const { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY } = process.env;
    if (!NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error(
        "Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (Publishable key) from Stripe Dashboard to .env or .env.local"
      );
    }

    // Do not change the "apiVersion" without changing the version in the Stripe Dashboard,
    // and also ensure that the API version is supported by Stripe.

    this._stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2024-11-20.acacia",
      typescript: true,
    });
  }

  private unwrapStripeCustomer(
    customer: string | Stripe.Customer | Stripe.DeletedCustomer
  ) {
    return typeof customer === "string" ? customer : customer.id;
  }

  private unwrapStripeStatus(
    status: Stripe.Subscription.Status
  ): SubscriptionStatus | undefined {
    switch (status) {
      case "active":
        return "ACTIVE";
      case "canceled":
        return "CANCELED";
      case "incomplete":
        return "INCOMPLETE";
      case "incomplete_expired":
        return "INCOMPLETE_EXPIRED";
      case "past_due":
        return "PAST_DUE";
      // case "paused":
      //   return "PAUSED";
      case "trialing":
        return "TRIALING";
      case "unpaid":
        return "UNPAID";
    }

    // TODO: Please look into how to deal with this...
    // Return's  undefined  when the status is  paused
    return undefined;
  }

  // TODO: Setup the webhook endpoint here, and then use that function in the "api/webhhooks/stripe"
  public async createSubscription(subscription: Stripe.Subscription) {
    const customerId = this.unwrapStripeCustomer(subscription.customer);

    const agency = await AgencyManager.findAgencyByStripeCustomerId(customerId);
    if (!agency) {
      throw new Error(
        `Attempt to create subscription for non-existent agency! [customerId: ${customerId}]`
      );
    }

    const subscriptionActive = subscription.status === "active";
    const priceId = subscription.items.data[0].price.id;

    const pricingPackage = await PackageManager.getPackageByPriceId(priceId);
    if (!pricingPackage) {
      throw new Error(
        `Attempt to create subscription for non-existent package! [customerId: ${customerId}]`
      );
    }

    if (pricingPackage.retired) {
      throw new Error(
        `Attempt to create subscription for a retired package! [customerId: ${customerId}]`
      );
    }

    const subscriptionStatus = this.unwrapStripeStatus(subscription.status);
    if (!subscriptionStatus) {
      throw new Error(
        `Attempt to create subscription with unhandled status (${subscription.status})`
      );
    }

    const data: Omit<Subscription, "id" | "createdAt" | "updatedAt"> = {
      packageId: pricingPackage.id,
      price: "0", // TODO: Figure this out if this is even needed over here or not?
      agencyId: agency.id,
      priceId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerId,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      active: subscriptionActive,
      status: subscriptionStatus,
    };

    const dbSubscription = await prisma.subscription.upsert({
      where: {
        agencyId: agency.id,
      },
      create: data,
      update: data,
    });

    return dbSubscription;
  }

  public async GET() {
    //
  }

  public get stripe() {
    return this._stripe;
  }
}

const stripeManager = new StripeManager();
export default stripeManager;
