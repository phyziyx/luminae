import Stripe from "stripe";

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

  // TODO: Setup the webhook endpoint here, and then use that function in the "api/webhhooks/stripe"
  public async POST() {
    //
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
