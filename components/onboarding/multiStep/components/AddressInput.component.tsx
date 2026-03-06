import { SearchAddress } from "@/components/maps"
import { RolesEnum } from "@/src/enums/roles.enums"
import { AddressI } from "@/src/types/maps.types"
import { QuestionRendererProps } from "@/src/types/multiStepOnboard.types"
import {
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline"
import clsx from "clsx"
import { Dispatch, SetStateAction } from "react"
interface AddressInputI {
  setAddress: Dispatch<SetStateAction<AddressI | null>>
  address: AddressI | null
}
export const AddressInput = ({
  question,
  role,
  error,
  setAddress,
  address,
}: QuestionRendererProps & AddressInputI) => (
  <div>
    <SearchAddress
      role={role}
      onSubmit={(selectedAddress) => {
        setAddress(selectedAddress)
      }}
      placeholder={question.placeholder}
      label={question.label}
      autoFocus={question.autoFocus}
    />
    {address && (
      <div className="flex flex-col items-start text-start pt-1 mt-2 bg-gray-100 rounded-2xl">
        <span className="text-xs font-medium text-start px-2 text-gray-500">
          Se l&apos;indirizzo è sbagliato, ri-effettua la ricerca
        </span>
        <span className="text-black mt-2 p-2 rounded text-sm">
          {(address?.address
            ? `${address.display_name || address.address.city || address.address.town || address.address.village || address.address.suburb}${address.address.city !== address.address.county ? ` (${address.address.county})` : ""}, ${address.address.postcode || ""}`
            : null) || address.display_name}
        </span>
      </div>
    )}
    {error && (
      <p className="text-red-500 text-sm mt-1">
        {question.validation?.required ? "Seleziona un indirizzo" : ""}
      </p>
    )}
  </div>
)

export const MultiAddressInput = ({
  question,
  role,
  error,
  value,
  onChange,
}: QuestionRendererProps) => {
  const selectedAddresses = (value as AddressI[]) || []

  const formatAddressDisplay = (addr: AddressI) => {
    if (!addr.address) return addr.display_name
    const { neighbourhood, suburb, city, town, village, county, postcode } =
      addr.address

    const mainLocation = city || town || village || ""
    const district =
      neighbourhood || suburb ? `${neighbourhood || suburb}, ` : ""
    const province = city !== county ? ` (${county})` : ""

    return `${district}${mainLocation}${province}, ${postcode || ""}`
  }

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          e.stopPropagation()
        }
      }}
    >
      <label
        className={clsx(
          "block font-medium mb-2",
          role === RolesEnum.VIGIL && "text-vigil-orange",
          role === RolesEnum.CONSUMER && "text-consumer-blue",
        )}
      >
        {question.label}
        {/* {question.validation?.required } */}
      </label>

      <SearchAddress
        role={role}
        placeholder={question.placeholder}
        label=""
        autoFocus={question.autoFocus}
        resetOnSubmit={true}
        onSubmit={(newAddress) => {
          const exists = selectedAddresses.some(
            (a) => a.display_name === newAddress.display_name,
          )

          if (!exists) {
            onChange([...selectedAddresses, newAddress])
          }
        }}
      />

      <div className="mt-4">
        {selectedAddresses.length > 0 ? (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Aree selezionate:
            </h4>
            <ul className="flex flex-col gap-2">
              {selectedAddresses.map((addr, index) => (
                <li
                  key={addr.display_name || index}
                  className={clsx(
                    "w-fit inline-flex items-center gap-2 text-sm border rounded-full px-3 py-1.5",
                    role === RolesEnum.VIGIL
                      ? "bg-orange-50 border-orange-200 text-orange-800"
                      : "bg-blue-50 border-blue-200 text-blue-800",
                  )}
                >
                  <span className="max-w-[250px] truncate">
                    {formatAddressDisplay(addr)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newDetails = selectedAddresses.filter(
                        (_, i) => i !== index,
                      )
                      onChange(newDetails)
                    }}
                    className="text-red-500 hover:text-red-700 ml-1"
                    aria-label="Rimuovi zona"
                  >
                    <XCircleIcon className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <ExclamationTriangleIcon className="w-5 h-5 text-gray-400" />
            <span>Nessuna area selezionata</span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2">
          {question.validation?.required && selectedAddresses.length === 0
            ? "Seleziona almeno un'area operativa"
            : "Errore nella selezione delle aree"}
        </p>
      )}
    </div>
  )
}
