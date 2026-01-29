import React from "react";

type ProgressBarI = {
  percentage: number; // valore da 0 a 100
};

const ProgressBar = (props: ProgressBarI) => {
  const { percentage } = props;
  const safePercentage = Math.max(0, Math.min(percentage, 100));

  return (
    <div className="w-full bg-gray-200 rounded-full my-2 h-4 overflow-hidden shadow">
      <div
        style={{
          width: `${safePercentage}%`,
        }}
        className="h-full transition-all duration-300 rounded-full bg-gradient-to-r from-consumer-blue to-vigil-orange"
      />
    </div>
  );
};

export default ProgressBar;
