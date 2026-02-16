type OrologioProps = { className?: string }
export default function Orologio({ className }: OrologioProps) {
  return (
    <svg
      width="13"
      height="12"
      viewBox="0 0 13 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_204_1152)">
        <path
          d="M6.49998 11C9.49152 11 11.9166 8.76142 11.9166 6C11.9166 3.23858 9.49152 1 6.49998 1C3.50844 1 1.08331 3.23858 1.08331 6C1.08331 8.76142 3.50844 11 6.49998 11Z"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.5 3V6L8.66667 7"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_204_1152">
          <rect width="13" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
