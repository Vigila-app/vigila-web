import { ResponseCodesConstants } from "@/src/constants";
import { PaymentIntent } from "@stripe/stripe-js";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const requestHandler = async (
  req: Request,
  context: { params: { paymentIntentId: PaymentIntent["id"] } }
) => {
  const { method } = req;
  const {
    params: { paymentIntentId },
  } = context;
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY as string);

  console.log(`API ${method} payment/intent/${paymentIntentId}`);

  if (!paymentIntentId) {
    return NextResponse.json(
      {
        code: ResponseCodesConstants.PAYMENT_INTENT_UNAUTHORIZED.code,
        success: false,
      },
      { status: 401 }
    );
  } else if (!stripe) {
    return NextResponse.json(
      {
        code: ResponseCodesConstants.PAYMENT_INTENT_ERROR.code,
        success: false,
      },
      { status: 500 }
    );
  }

  switch (method) {
    case "GET": {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId
        );
        return NextResponse.json(
          {
            code: ResponseCodesConstants.PAYMENT_INTENT_SUCCESS.code,
            data: paymentIntent,
            success: true,
          },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          {
            code: ResponseCodesConstants.PAYMENT_INTENT_ERROR.code,
            success: false,
            error,
          },
          { status: 500 }
        );
      }
      break;
    }
    default: {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.PAYMENT_INTENT_METHOD_NOT_ALLOWED.code,
          success: false,
        },
        { status: 405 }
      );
      break;
    }
  }
};

export async function GET(
  req: Request,
  context: { params: { paymentIntentId: PaymentIntent["id"] } }
) {
  return requestHandler(req, context);
}
