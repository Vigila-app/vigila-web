"use client";

import { FormFieldType } from "@/src/constants/form.constants";
import { MapsService } from "@/src/services";
import { debounce } from "@/src/utils/common.utils";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/form";
import { AddressI } from "@/src/types/maps.types";

type SearchMapFormI = {
  search: string;
};

const SearchAddress = (props: {
  onSubmit: (address: AddressI) => void;
  minLength?: number;
}) => {
  const { onSubmit: eOnSubmit, minLength = 3 } = props;
  const [autocompleteResults, setAutocompleteResults] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    watch,
    setValue,
  } = useForm<SearchMapFormI>();

  const submit = (address: AddressI) => {
    eOnSubmit(address);
    setSubmitted(true);
  };

  const onSubmit = async (formData: SearchMapFormI) => {
    if (isValid) {
      const { search } = formData;
      try {
        const address = await MapsService.validateAddress({ city: search });
        if (address) {
          submit(address);
        }
      } catch (error) {
        console.error("Error searching on maps", error);
      }
    }
  };

  const autocompleteAdress = async () => {
    try {
      if (watch().search?.length >= minLength && !submitted) {
        const results = await MapsService.autocompleteAddress(watch().search);
        setAutocompleteResults(results);
      }
    } catch (error) {
      console.error("Error during address autocomplete", error);
    }
  };

  useEffect(() => {
    debounce(autocompleteAdress);
    setSubmitted(false);
    setAutocompleteResults([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch()?.search]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="my-4">
        <Controller
          name="search"
          control={control}
          rules={{ required: true, ...FormFieldType.ADDRESS }}
          render={({ field }) => (
            <Input
              {...field}
              autoFocus
              label="Search Address"
              placeholder="Inserisci città"
              type="text"
              required
              aria-invalid={!!errors.search}
              error={errors.search}
              icon={<MagnifyingGlassIcon className="size-4 text-gray-500" />}
            />
          )}
        />
      </form>
      {!submitted && autocompleteResults?.length ? (
        <div>
          <ul className="list-disc pl-5">
            {autocompleteResults.map((result, index) => (
              <li key={index} className="my-2">
                <button
                  onClick={() => {
                    setValue("search", result.name || result.display_name);
                    submit(result);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  {result.display_name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
};
export default SearchAddress;
