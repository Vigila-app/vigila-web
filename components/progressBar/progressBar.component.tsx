import React from "react";

type ProgressBarI = {
  percentage: number; // valore da 0 a 100
};

const ProgressBar = (props: ProgressBarI) => {
  const { percentage } = props;
  const safePercentage = Math.max(0, Math.min(percentage, 100));

  return (
    <div className="w-full bg-gray-200 rounded-full my-2 h-6 overflow-hidden shadow">
      <div
        style={{
          width: `${safePercentage}%`,
        }}
        className="h-full transition-all duration-300 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
      />
    </div>
  );
};

export default ProgressBar;
