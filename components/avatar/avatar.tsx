/* eslint-disable @next/next/no-img-element */
"use client";
import clsx from "clsx";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { InputFile } from "@/components/form";
import { randomNumber } from "@/src/utils/common.utils";
import { useUserStore } from "@/src/store/user/user.store";
import { useEffect, useMemo, useState, useRef } from "react";
import { StorageUtils } from "@/src/utils/storage.utils";

const BACKGROUND_COLORS = [
  "EBF3FF",
  "EEEDFD",
  "FFEBEE",
  "FDEFE2",
  "E7F9F3",
  "EDEEFD",
  "ECFAFE",
  "F2FFD1",
  "FFF7E0",
  "FDF1F7",
  "EAEFE6",
  "E0E6EB",
  "E4E2F3",
  "E6DFEC",
  "E2F4E8",
  "E6EBEF",
  "EBE6EF",
  "E8DEF6",
  "D8E8F3",
  "ECE1FE",
];

const TEXT_COLORS = [
  "060A23",
  "4409B9",
  "BD0F2C",
  "C56511",
  "216E55",
  "05128A",
  "1F84A3",
  "526E0C",
  "935F10",
  "973562",
  "69785E",
  "2D3A46",
  "280F6D",
  "37364F",
  "363548",
  "4D176E",
  "AB133E",
  "420790",
  "222A54",
  "192251",
];

type AvatarI = {
  imgUrl?: string | null;
  size?: "small" | "standard" | "medium" | "big" | "xxl";
  label?: string;
  inline?: boolean;
  withUpload?: boolean;
  onFileUpload?: (
    file: string | ArrayBuffer | File,
    metadata: { contentType: string }
  ) => void;
  value?: string;
  userId?: string;
  className?: string;
};

const AvatarSize = {
  small: "size-4 text-xs",
  standard: "size-8 text-sm",
  medium: "size-12 text-md",
  big: "size-16 text-lg",
  xxl: "size-25 text-xl",
};

const Avatar = (props: AvatarI) => {
  const {
    imgUrl,
    size = "standard",
    inline = false,
    label,
    withUpload = false,
    onFileUpload,
    value,
    userId,
    className,
  } = props;
  const { user, lastUpdate: lastUserUpdate } = useUserStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [profilePic, setProfilePic] = useState<string | undefined>();

  const getProfilePic = async (id: string) => {
    if (id) {
      const profilePicUrl = await StorageUtils.getURL("profile-pics", id);
      if (profilePicUrl) {
        setProfilePic(profilePicUrl);
      }
    }
  };

  useEffect(() => {
    const finalUserId = userId || user?.id;
    if (!imgUrl && finalUserId) getProfilePic(finalUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgUrl, user?.id, userId, lastUserUpdate]);

  const imgStyle = clsx(
    "rounded-full object-cover font-normal",
    AvatarSize[size]
  );

  const randomKey = useMemo(() => randomNumber(0, 19), []);

  return (
    <div
      // onClick={() => inputRef.current?.click()}
      className={clsx(
        "relative items-center cursor-pointer",
        inline ? "inline-flex gap-1" : "flex flex-col gap-1",
        className
      )}
    >
      {imgUrl || profilePic ? (
        <img alt="avatar" src={imgUrl || profilePic} className={imgStyle} />
      ) : value ? (
        <div
          className={clsx(
            "inline-flex items-center justify-center rounded-full select-none",
            AvatarSize[size],
            size === "big" && "shadow"
          )}
          style={{
            backgroundColor: `#${BACKGROUND_COLORS[randomKey]}`,
          }}
        >
          <span className="sr-only">{value}</span>
          <span
            className="uppercase !no-underline"
            style={{ color: `#${TEXT_COLORS[randomKey]}` }}
          >
            {String(
              value.includes(" ")
                ? value
                    .split(" ")
                    .map((s) => s.substring(0, 1))
                    .join("")
                : value
            ).substring(0, 2)}
          </span>
        </div>
      ) : (
        <UserCircleIcon className={imgStyle} />
      )}
      {label ? (
        <p
          className={clsx(
            "text-left text-ellipsis overflow-hidden text-nowrap select-all",
            inline ? "max-w-40" : "max-w-60"
          )}
        >
          {label}
        </p>
      ) : null}

      {withUpload ? (
        <div className="absolute">
          <InputFile
            ref={inputRef}
            hidden
            label="profile pic"
            type="image"
            onFileUpload={onFileUpload}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Avatar;
