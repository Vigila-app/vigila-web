import clsx from "clsx";
import BaseHero, { BaseHeroI } from "./baseHero";

type ImgHeroI = BaseHeroI & {
  bgImage: string;
  gradientColor?: string;
};

const ImgHero = (props: ImgHeroI) => {
  const { gradientColor, bgImage } = props;
  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div
        className={clsx(
          "absolute inset-0 bg-white/75",
          gradientColor && `bg-${gradientColor}/75`
        )}
      />
      <BaseHero
        {...{ ...props, bgImage: undefined }}
        bgColor="bg-transparent"
      />
    </div>
  );
};

export default ImgHero;
