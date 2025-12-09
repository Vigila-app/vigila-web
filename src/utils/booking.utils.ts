import { BookingStatusEnum, PaymentStatusEnum } from "@/src/enums/booking.enums"
import { RolesEnum } from "@/src/enums/roles.enums"
import { BookingI } from "@/src/types/booking.types"
import { BookingsService, UserService } from "@/src/services"
import { Routes } from "@/src/routes"
import { replaceDynamicUrl } from "@/src/utils/common.utils"
import { EXPENSE_TYPE, TRANSACTION_STATUS } from "../types/transactions.types"
import { getAdminClient } from "@/server/api.utils.server"

export const BookingUtils = {
  getStatusColor: (status: BookingStatusEnum | PaymentStatusEnum) => {
    switch (status) {
      case BookingStatusEnum.PENDING:
      case PaymentStatusEnum.PENDING:
        return "yellow"
      case BookingStatusEnum.CONFIRMED:
        return "blue"
      case BookingStatusEnum.IN_PROGRESS:
      case PaymentStatusEnum.REFUNDED:
        return "purple"
      case BookingStatusEnum.COMPLETED:
      case PaymentStatusEnum.PAID:
        return "green"
      case BookingStatusEnum.CANCELLED_USER:
      case BookingStatusEnum.CANCELLED_VIGIL:
      case BookingStatusEnum.REJECTED:
      case BookingStatusEnum.REFUNDED:
      case PaymentStatusEnum.FAILED:
        return "red"
      default:
        return "gray"
    }
  },

  getStatusText: (status: BookingStatusEnum): string => {
    switch (status) {
      case BookingStatusEnum.PENDING:
        return "In attesa"
      case BookingStatusEnum.CONFIRMED:
        return "Confermata"
      case BookingStatusEnum.IN_PROGRESS:
        return "In corso"
      case BookingStatusEnum.COMPLETED:
        return "Completata"
      case BookingStatusEnum.CANCELLED_USER:
      case BookingStatusEnum.CANCELLED_VIGIL:
        return "Cancellata"
      case BookingStatusEnum.REJECTED:
        return "Rifiutata"
      case BookingStatusEnum.REFUNDED:
        return "Rimborsata"
      default:
        return status
    }
  },

  getPaymentStatusText: (status: PaymentStatusEnum): string => {
    switch (status) {
      case PaymentStatusEnum.PENDING:
        return "Da pagare"
      case PaymentStatusEnum.PAID:
        return "Pagato"
      case PaymentStatusEnum.FAILED:
        return "Fallito"
      case PaymentStatusEnum.REFUNDED:
        return "Rimborsato"
      default:
        return status
    }
  },

  formatBookingDate: (date: Date): string => {
    return new Date(date).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  },

  /**
   * Formatta l'orario di una prenotazione
   */
  formatBookingTime: (startDate: Date, endDate: Date): string => {
    const startTime = new Date(startDate).toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    })
    const endTime = new Date(endDate).toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    })
    return `${startTime} - ${endTime}`
  },

  /**
   * Calcola l'importo totale di una prenotazione
   */
  calculateTotalAmount: (booking: BookingI): string => {
    return booking.price.toFixed(2)
  },

  calculateAmountVigil: (booking: BookingI): string => {
    return (booking.price - booking.fee).toFixed(0)
  },

  handleStatusUpdate: async (
    booking: BookingI,
    newStatus: BookingStatusEnum
  ): Promise<BookingI | undefined> => {
    if (!(booking && newStatus)) return

    try {
      const updatedBooking = await BookingsService.updateBookingStatus(
        booking.id,
        newStatus
      )
      return updatedBooking
    } catch (error) {
      return error as undefined
    }
  },

  getBookingDetailsUrl: (bookingId: string): string => {
    return replaceDynamicUrl(Routes.bookingDetails.url, ":bookingId", bookingId)
  },

  canCancelBooking: async (booking: BookingI): Promise<boolean> => {
    try {
      const user = await UserService.getUser()
      if (!user?.user_metadata?.role) {
        return false
      }

      const userRole = user.user_metadata.role as RolesEnum

      if (
        booking.status === BookingStatusEnum.COMPLETED ||
        booking.status === BookingStatusEnum.CANCELLED_USER ||
        booking.status === BookingStatusEnum.CANCELLED_VIGIL ||
        booking.status === BookingStatusEnum.REFUNDED ||
        booking.status === BookingStatusEnum.REJECTED
      ) {
        return false
      }

      if (
        userRole === RolesEnum.VIGIL &&
        booking.status === BookingStatusEnum.PENDING
      ) {
        return false
      }
      if (userRole === RolesEnum.VIGIL) {
        return true
      }

      if (
        userRole === RolesEnum.CONSUMER &&
        booking.status === BookingStatusEnum.CONFIRMED
      ) {
        const now = new Date()
        const endDate = new Date(booking.endDate)
        const timeDifferenceMs = endDate.getTime() - now.getTime()
        const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60)

        return timeDifferenceHours >= 24
      } else {
        return true
      }
    } catch (error) {
      console.error(
        "BookingUtils canCancelBooking error: Errore nel verificare la possibilità di cancellazione:",
        error
      )
      return false
    }
  },

  
  refundByWalletId: async (
    walletId: string,
    price: number,
    bookingId: string
  ) => {
    const supabase = getAdminClient()

    const { error: refundError } = await supabase
      .from("wallet_transactions")
      .insert({
        wallet_id: walletId,
        amount: price,
        type: EXPENSE_TYPE.DEBIT, //or refund type?
        status: TRANSACTION_STATUS.COMPLETED,
        description: `Rimborso prenotazione non andata a buon fine #${bookingId}`,
        created_at: new Date().toISOString(),
      })
    if (refundError) {
      console.error(
        "CRITICAL: Failed to refund after transaction recording failure:",
        refundError
      )
    }
    return refundError
  },
}
