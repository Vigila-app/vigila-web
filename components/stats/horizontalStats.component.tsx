type HorizontalStatsI = {
  stats: { label: string; value: string | React.ReactNode }[];
};

const HorizontalStats = (props: HorizontalStatsI) => {
  const { stats = [] } = props;

  return (
    <div className="w-full">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:divide-x sm:divide-gray-100">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col px-4 py-8 text-center">
            <dt className="order-last text-lg font-medium text-gray-500">
              {stat.label}
            </dt>

            <dd className="text-4xl font-extrabold text-primary-600 md:text-5xl transition hover:scale-105">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default HorizontalStats;
