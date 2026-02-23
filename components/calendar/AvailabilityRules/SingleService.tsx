import React, { ComponentType } from "react"
import clsx from "clsx"

export const SingleService = ({
  Icon,
  name,
  desc,
  price,
  checked, // optional controlled
  onChange, // optional controlled
}: {
  Icon: ComponentType<{ className?: string }>
  name: string
  desc: string
  price: number
  checked?: boolean
  onChange?: (next: boolean) => void
}) => {
  const [internalSelected, setInternalSelected] = React.useState(false)
  const selected = typeof checked === "boolean" ? checked : internalSelected
  const toggle = (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    const next = !selected
    if (typeof onChange === "function") onChange(next)
    else setInternalSelected((v) => !v)
  }
  return (
    <label
      className={clsx(
        "flex flex-col items-center justify-between gap-2 border-3 p-3 rounded-3xl cursor-pointer transition-all",
        selected
          ? "border-vigil-orange border-2 bg-vigil-light-orange"
          : "border-zinc-400 bg-white",
      )}
      onMouseDown={(e) => toggle(e)}
    >
      <input type="checkbox" checked={selected} readOnly className="hidden" />
      <Icon
        className={clsx(
          "w-10",
          selected ? "text-vigil-orange" : "text-zinc-400",
        )}
      />
      <span className="font-semibold text-zinc-900 text-center">{name}</span>
      <span className="text-sm text-zinc-500 text-center">{desc}</span>
      <div
        className={clsx(
          "badge px-2 py-1 rounded text-white text-xs font-bold",
          selected ? "bg-vigil-orange" : "bg-zinc-400",
        )}
      >
        {price} EUR/h
      </div>
    </label>
  )
}
