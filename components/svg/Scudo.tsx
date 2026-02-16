type ScudoProps = { className?: string };
export default function Scudo({ className }: ScudoProps) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M9.5 1C11.7092 2.95177 14.5926 3.96798 17.5393 3.83333C17.9683 5.29063 18.0995 6.81916 17.9253 8.32812C17.751 9.83707 17.2747 11.2956 16.5248 12.6172C15.7749 13.9387 14.7666 15.0962 13.5598 16.0209C12.353 16.9456 10.9724 17.6186 9.5 18C8.0276 17.6186 6.64699 16.9456 5.44021 16.0209C4.23344 15.0962 3.22513 13.9387 2.47519 12.6172C1.72526 11.2956 1.249 9.83707 1.07473 8.32812C0.900461 6.81916 1.03173 5.29063 1.46073 3.83333C4.40739 3.96798 7.29078 2.95177 9.5 1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
