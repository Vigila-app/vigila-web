type MapPinProps = { className?: string }
export default function MapPin({ className }: MapPinProps) {
  return (
    <svg
      width="13"
      height="12"
      viewBox="0 0 13 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M10.8334 5C10.8334 8 6.50002 11 6.50002 11C6.50002 11 2.16669 8 2.16669 5C2.16669 3.93913 2.62323 2.92172 3.43589 2.17157C4.24855 1.42143 5.35075 1 6.50002 1C7.64929 1 8.75149 1.42143 9.56415 2.17157C10.3768 2.92172 10.8334 3.93913 10.8334 5Z"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 6.5C7.39746 6.5 8.125 5.82843 8.125 5C8.125 4.17157 7.39746 3.5 6.5 3.5C5.60254 3.5 4.875 4.17157 4.875 5C4.875 5.82843 5.60254 6.5 6.5 6.5Z"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
