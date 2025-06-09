import clsx from "clsx";

type DashboardCardI = {
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  title: string;
};

const DashboardCard = (props: DashboardCardI) => {
  const { children, headerAction, title } = props;
  return (
    <div className={clsx("w-full bg-white shadow rounded py-2")}>
      <div
        className={clsx(
          "w-full inline-flex items-center justify-between px-4 pb-2 border-b border-gray-200"
        )}
      >
        <h4 className="font-medium text-lg">{title}</h4>
        {headerAction ? <div>{headerAction}</div> : null}
      </div>
      <div className={clsx("px-4")}>{children}</div>
    </div>
  );
};

export default DashboardCard;
