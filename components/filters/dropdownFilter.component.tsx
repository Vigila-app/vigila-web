"use client";
import { FilterI } from "@/src/types/filter.types";
import {
  ArrowUturnLeftIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Checkbox, Input } from "@/components/form";

type DropdownFilterI = FilterI & {
  options?: { label: string; value: string }[];
  type?: "checkbox" | "text";
};

const DropdownFilter = (props: DropdownFilterI) => {
  const {
    label,
    placeholder,
    onChange = () => ({}),
    options = [],
    type = "text",
    value = "",
  } = props;
  const [filterValue, setFilterValue] = useState<string>(value);

  const renderFilterByType = () => {
    switch (type) {
      case "checkbox":
        return (
          <ul className="space-y-1 text-sm text-gray-700">
            {options.map((opt) => (
              <li key={opt.value}>
                <Checkbox
                  label={opt.label}
                  checked={filterValue.includes(opt.value)}
                  onChange={(checked) => {
                    if (checked) {
                      setFilterValue(
                        [
                          ...(filterValue ? filterValue.split(", ") : []),
                          opt.value,
                        ].join(", ")
                      );
                    } else {
                      setFilterValue(
                        [...(filterValue ? filterValue.split(", ") : [])]
                          .filter((o) => o !== opt.value)
                          .join(", ")
                      );
                    }
                  }}
                />
              </li>
            ))}
          </ul>
        );
      case "text":
      default:
        return (
          <Input
            label={placeholder || label}
            placeholder={placeholder}
            type="text"
            onChange={(newValue) => setFilterValue?.(newValue?.toString())}
            value={filterValue}
          />
        );
    }
  };

  const handleFilterReset = () => {
    setFilterValue("");
  };

  useEffect(() => {
    if (filterValue !== value) onChange?.(filterValue || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValue]);

  return (
    <div className="flex gap-8">
      <div className="relative">
        <details className="group [&_summary::-webkit-details-marker]:hidden">
          <summary
            className={clsx(
              "flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600",
              filterValue && "border-primary-400 hover:border-primary-600"
            )}
          >
            <span className="text-sm font-medium">{label}</span>

            <span className="transition group-open:-rotate-180">
              <ChevronDownIcon className="size-4" />
            </span>
          </summary>

          <div className="z-50 group-open:absolute group-open:start-0 group-open:top-auto group-open:mt-2">
            <div className="w-max max-w-60 md:max-w-96 shadow-lg overflow-x-hidden rounded border border-gray-200 bg-white">
              <div className="flex items-center justify-between gap-2 py-2 px-4 border-b border-gray-200">
                <span className="text-xs text-gray-700 italic text-nowrap text-ellipsis overflow-hidden">
                  {label}: {filterValue ? `"${filterValue}"` : "-"}
                </span>

                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs text-gray-900 hover:underline underline-offset-2"
                  onClick={handleFilterReset}
                >
                  <ArrowUturnLeftIcon className="size-3" />
                  Reset
                </button>
              </div>

              <div className="p-4">{renderFilterByType()}</div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default DropdownFilter;
