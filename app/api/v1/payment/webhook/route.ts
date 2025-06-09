import { AppConstants, ResponseCodesConstants } from "@/src/constants";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { initAdmin } from "@/server/supabaseAdmin";
import { getFirestore } from "firebase-admin/firestore";
import { getUUID, replaceDynamicUrl } from "@/src/utils/common.utils";
import { NotifyUser } from "@/src/services/notifications.service";
import { Routes } from "@/src/routes";

const requestHandler = async (req: Request) => {
  const { headers, method } = req;
  const sig = headers.get("stripe-signature") as string;

  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY as string);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  console.log(`API ${method} payment/webhook`);

  if (!(stripe && endpointSecret)) {
    return NextResponse.json(
      {
        code: ResponseCodesConstants.PAYMENT_WEBHOOK_ERROR.code,
        success: false,
      },
      { status: 500 }
    );
  }

  let event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        code: ResponseCodesConstants.PAYMENT_WEBHOOK_UNAUTHORIZED.code,
        success: false,
      },
      { status: 401 }
    );
  }

  switch (method) {
    case "POST": {
      try {
        if (!event?.type) {
          return NextResponse.json(
            {
              code: ResponseCodesConstants.PAYMENT_WEBHOOK_BAD_REQUEST.code,
              success: false,
            },
            { status: 400 }
          );
        }

        // Handle the event
        switch (event.type) {
          case "payment_intent.succeeded": {
            const paymentIntent = event.data?.object;
            if (paymentIntent?.id) {
              await initAdmin();
              const firestore = getFirestore();

              const items = Object.keys(paymentIntent?.metadata || {})
                .filter((key) => key.includes("item-"))
                .map((key) => JSON.parse(paymentIntent?.metadata[key] || "{}"));

              if (items?.length) {
                let ownerId = "";
                const newSaleId = getUUID("SALE");
                const batch = firestore.batch();

                items.forEach((item) => {
                  const payload = {
                    id: newSaleId,
                    amount: Number(item.unitPrice) * Number(item.qty) || "-",
                    currency: item.currency,
                    customer: paymentIntent.customer,
                    guestId: paymentIntent.metadata?.guestId || "",
                    description: paymentIntent.description,
                    metadata: item,
                    receipt_email: paymentIntent.receipt_email,
                    status: paymentIntent.status,
                    shipping: paymentIntent.shipping,
                    creationDate: new Date(),
                    payment_intent: paymentIntent.id,
                    serviceId: item.id,
                  };

                  const salesRef = firestore.doc(`sales/${newSaleId}`);
                  batch.set(
                    salesRef,
                    {
                      ...payload,
                      unitId: item.unitId,
                      ownerId: item.ownerId,
                    },
                    { merge: true }
                  );

                  if (item?.unitId) {
                    const unitSalesRef = firestore.doc(
                      `units-sales/${item.unitId}`
                    );
                    batch.set(
                      unitSalesRef,
                      {
                        [newSaleId]: { ...payload, ownerId: item.ownerId },
                      },
                      { merge: true }
                    );
                  }

                  if (item?.ownerId) {
                    ownerId = item.ownerId;
                    const userSalesRef = firestore.doc(
                      `users-sales/${item.ownerId}`
                    );
                    batch.set(
                      userSalesRef,
                      {
                        [newSaleId]: {
                          ...payload,
                          unitId: item.unitId,
                        },
                      },
                      { merge: true }
                    );
                  }
                });

                await batch.commit();

                if (ownerId) {
                  NotifyUser({
                    userId: ownerId,
                    title: "New sale!",
                    subtitle: "Checkout your new sale details",
                    url: `${AppConstants.hostUrl}${replaceDynamicUrl(
                      Routes.saleDetails.url,
                      ":saleId",
                      newSaleId
                    )}`,
                  });
                }

                return NextResponse.json(
                  {
                    code: ResponseCodesConstants.PAYMENT_WEBHOOK_SUCCESS.code,
                    data: paymentIntent,
                    success: true,
                  },
                  { status: 200 }
                );
              } else {
                // TODO manage anomaly transaction
                return NextResponse.json(
                  {
                    code: ResponseCodesConstants.PAYMENT_WEBHOOK_UNMANAGED.code,
                    success: true,
                  },
                  { status: 202 }
                );
              }
            } else {
              return NextResponse.json(
                {
                  code: ResponseCodesConstants.PAYMENT_WEBHOOK_ERROR.code,
                  success: false,
                },
                { status: 500 }
              );
            }
            break;
          }
          // TODO handle other event types
          default: {
            // console.log(`Unhandled event type ${event.type}`);
            return NextResponse.json(
              {
                code: ResponseCodesConstants.PAYMENT_WEBHOOK_UNMANAGED.code,
                success: true,
              },
              { status: 202 }
            );
          }
        }
      } catch (error) {
        return NextResponse.json(
          {
            code: ResponseCodesConstants.PAYMENT_WEBHOOK_ERROR.code,
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
          code: ResponseCodesConstants.PAYMENT_WEBHOOK_METHOD_NOT_ALLOWED.code,
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
