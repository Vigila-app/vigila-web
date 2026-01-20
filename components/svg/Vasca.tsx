type VascaProps = { className?: string };
export default function Vasca({ className }: VascaProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="27"
        height="27"
        viewBox="0 0 27 27"
        fill="none"
        className={className}
      >
        <g clip-path="url(#clip0_4_2925)">
          <path
            d="M4.5 13.5H22.5C22.7984 13.5 23.0845 13.6185 23.2955 13.8295C23.5065 14.0405 23.625 14.3266 23.625 14.625V18C23.625 19.1935 23.1509 20.3381 22.307 21.182C21.4631 22.0259 20.3185 22.5 19.125 22.5H7.875C6.68153 22.5 5.53693 22.0259 4.69302 21.182C3.84911 20.3381 3.375 19.1935 3.375 18V14.625C3.375 14.3266 3.49353 14.0405 3.7045 13.8295C3.91548 13.6185 4.20163 13.5 4.5 13.5Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6.75 13.5V5.625C6.75 5.02826 6.98705 4.45597 7.40901 4.03401C7.83097 3.61205 8.40326 3.375 9 3.375H12.375V5.90625"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M4.5 23.625L5.625 21.9375"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M22.5 23.625L21.375 21.9375"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_4_2925">
            <rect width="27" height="27" fill="white" />
          </clipPath>
        </defs>
      </svg>
    )
}