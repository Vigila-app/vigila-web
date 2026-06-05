type BedProps = { className?: string };
export default function Bed({ className }: BedProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="27"
      viewBox="0 0 27 27"
      fill="none"
      className={className}
    >
      <g clipPath="url(#clip0_4_2939)">
        <path
          d="M5.625 10.125C5.625 10.7217 5.86205 11.294 6.28401 11.716C6.70597 12.1379 7.27826 12.375 7.875 12.375C8.47174 12.375 9.04403 12.1379 9.46599 11.716C9.88795 11.294 10.125 10.7217 10.125 10.125C10.125 9.52826 9.88795 8.95597 9.46599 8.53401C9.04403 8.11205 8.47174 7.875 7.875 7.875C7.27826 7.875 6.70597 8.11205 6.28401 8.53401C5.86205 8.95597 5.625 9.52826 5.625 10.125Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24.75 19.125V15.75H2.25"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.25 9V19.125"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.5 15.75H24.75V13.5C24.75 12.6049 24.3944 11.7464 23.7615 11.1135C23.1286 10.4806 22.2701 10.125 21.375 10.125H13.5V15.75Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_4_2939">
          <rect width="27" height="27" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}