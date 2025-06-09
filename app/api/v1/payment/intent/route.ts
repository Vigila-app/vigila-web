import { ResponseCodesConstants } from "@/src/constants";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const requestHandler = async (req: Request) => {
  const { method } = req;
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY as string);

  console.log(`API ${method} payment/intent`);

  if (!stripe) {
    return NextResponse.json(
      {
        code: ResponseCodesConstants.PAYMENT_INTENT_ERROR.code,
        success: false,
      },
      { status: 500 }
    );
  }

  switch (method) {
    case "POST": {
      try {
        const body = await req.json();
        const { amount, currency, description, metadata, receipt_email } = body;
        if (!(amount && currency && metadata)) {
          return NextResponse.json(
            {
              code: ResponseCodesConstants.PAYMENT_INTENT_BAD_REQUEST.code,
              success: false,
            },
            { status: 400 }
          );
        }

        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency,
          description,
          metadata,
          receipt_email,
        });

        if (!(paymentIntent?.id && paymentIntent?.client_secret)) {
          return NextResponse.json(
            {
              code: ResponseCodesConstants.PAYMENT_INTENT_ERROR.code,
              success: false,
            },
            { status: 500 }
          );
        }

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

export async function POST(req: Request) {
  return requestHandler(req);
}
