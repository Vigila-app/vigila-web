const baseBtnStyle =
  "inline-flex items-center rounded border px-12 py-3 text-sm font-medium focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600 transition";

const primaryBtnStyle =
  "shadow border-primary-600 bg-primary-600 text-white hover:bg-white hover:text-primary-600";
const secondaryBtnStyle =
  "shadow border-primary-600 bg-white text-primary-600 hover:bg-secondary-600 hover:border-secondary-600 hover:text-white";
const textBtnStyle =
  "border-transparent bg-transparent text-primary-600 hover:text-primary-700";
const dangerBtnStyle =
  "border-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500";

const disabledBtnStyle = "opacity-50";
const loadingBtnStyle = "cursor-wait";
const fullBtnStyle = "w-full justify-center";

const vigilBtnStyle =
  "shadow border-vigil-orange rounded-4xl bg-vigil-orange text-white hover:bg-white hover:text-vigil-orange ";
const consumerBtnStyle =
  "shadow border-consumer-blue rounded-4xl bg-consumer-blue text-white hover:bg-white hover:text-consumer-blue";

export const ButtonStyle = {
  baseBtnStyle,
  primaryBtnStyle,
  secondaryBtnStyle,
  consumerBtnStyle,
  textBtnStyle,
  vigilBtnStyle,
  dangerBtnStyle,
  disabledBtnStyle,
  loadingBtnStyle,
  fullBtnStyle,
};
