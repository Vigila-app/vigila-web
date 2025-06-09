import clsx from "clsx";

type LogoI = {
  size?: "small" | "normal" | "big";
};

const Logo = (props: LogoI) => {
  const { size = "normal" } = props;

  const calcSizeClasses = () => {
    switch (size) {
      case "small":
        return "h-8 w-8";
      case "normal":
      default:
        return "h-16 w-16";
      case "big":
        return "h-32 w-32";
    }
  };
  return (
    <>
      <svg
        className={clsx("fill-primary-500", calcSizeClasses())}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="100px"
        height="100px"
        viewBox="0 0 32 32"
      >
        <g data-name="76-House-Plan">
          <path d="M29 0H3a3 3 0 0 0-3 3v26a3 3 0 0 0 3 3h14v-2H3a1 1 0 0 1-1-1v-9h6v4a1 1 0 0 0 1 1h6v-2h-5v-3h5a1 1 0 0 0 1-1v-6h-2v5H2V3a1 1 0 0 1 1-1h11v6H7v2h8a1 1 0 0 0 1-1V2h13a1 1 0 0 1 1 1v9h-6V5h-2v8a1 1 0 0 0 1 1h7v2h2V3a3 3 0 0 0-3-3z" />
          <path d="m23 26.59-3.29-3.29-1.41 1.41 4 4a1 1 0 0 0 1.41 0l8-8-1.41-1.41z" />
        </g>
      </svg>
    </>
  );
};

export default Logo;
