import clsx from "clsx";

type AccordionI = {
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
  title: string | React.ReactNode;
};

const Accordion = (props: AccordionI) => {
  const { children, className, defaultOpen = false, title } = props;
  return (
    <details
      className={clsx(
        "w-full group [&_summary::-webkit-details-marker]:hidden",
        className
      )}
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded bg-gray-50 p-4 text-gray-900">
        <span className="">{title}</span>

        <svg
          className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>

      <div>{children}</div>
    </details>
  );
};
export default Accordion;
