type DisponbilitàProps = { className?: string };
export default function Disponbilità({ className }: DisponbilitàProps) {
  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12.4999 22C18.2529 22 22.9166 17.5228 22.9166 12C22.9166 6.47715 18.2529 2 12.4999 2C6.74695 2 2.08325 6.47715 2.08325 12C2.08325 17.5228 6.74695 22 12.4999 22Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 6V12L16.6667 14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
