import clsx from "clsx";

const colors =
  "bg-gray-100 text-gray-700 bg-purple-100 text-purple-700 bg-sky-100 text-sky-700 bg-blue-100 text-blue-700 bg-green-100 text-green-700 bg-red-100 text-red-700 bg-yellow-100 text-yellow-700";

type BadgeI = {
  label?: string | React.ReactNode;
  color?: string;
  customClass?: string;
};
const Badge = (props: BadgeI) => {
  const { color = "gray", label, customClass } = props;
  return (
    <span
      className={clsx(
        "cursor-default shadow rounded-full px-2.5 py-0.5 text-xs",
        "max-w-40 text-nowrap text-ellipsis overflow-hidden",
        "inline-flex items-center",
        `bg-${color}-100 text-${color}-700`,
        customClass,
      )}
    >
      {label}
    </span>
  );
};

export default Badge;
