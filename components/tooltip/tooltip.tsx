import clsx from "clsx";

type TooltipI = {
  content: string | React.ReactNode;
  children: React.ReactNode;
  customClass?: string;
};

const Tooltip = (props: TooltipI) => {
  const { children, content, customClass } = props;

  return (
    <div className={clsx("has-tooltip relative", customClass)}>
      <span
        className="tooltip w-max max-w-48 sm:max-w-xs text-center text-sm rounded shadow p-1 bg-gray-100 absolute left-1/2 transition"
        style={{ transform: "translate(-50%, 1.5rem)" }}
      >
        {content}
      </span>
      {children}
    </div>
  );
};

export default Tooltip;
