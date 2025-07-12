import { BookingI } from "@/src/types/booking.types";

type PaymentBookingI = {
  bookingId: BookingI["id"];
};

const BookingPaymentComponent = (props: PaymentBookingI) => {
  const {} = props;

  return (
    <div className="bg-white w-full mx-auto p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <h2 className="text-center font-medium text-xl">
          Completa prenotazione
        </h2>
        <p className="text-center text-sm text-gray-500 mt-2">
          Per completare la prenotazione, procedi al pagamento. Una volta
          effettuato il pagamento, riceverai una conferma via email.
        </p>
      </div>
    </div>
  );
};

export default BookingPaymentComponent;
