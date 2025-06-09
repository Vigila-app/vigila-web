import clsx from "clsx";

type DividerI = {
  label?: string;
  dark?: boolean;
};

const Divider = (props: DividerI) => {
  const { dark = false, label } = props;
  const dividerStyle = clsx(
    "h-px flex-1 bg-gray-100 shadow",
    dark && "bg-gray-300"
  );
  return (
    <>
      <br />
      <span className="w-full relative flex items-center justify-center">
        <span className={dividerStyle}></span>
        {label ? (
          <>
            <span className="shrink-0 px-6 text-sm">{label}</span>
            <span className={dividerStyle}></span>
          </>
        ) : null}
      </span>
      <br />
    </>
  );
};

export default Divider;
