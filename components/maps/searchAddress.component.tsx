"use client";

import { FormFieldType } from "@/src/constants/form.constants";
import { MapsService } from "@/src/services";
import { debounce } from "@/src/utils/common.utils";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import { Input } from "@/components/form";
import { AddressI } from "@/src/types/maps.types";
import { useUserStore } from "@/src/store/user/user.store";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useCurrentLocation } from "@/src/hooks/useCurrentLocation";

type SearchMapFormI = {
  search: string;
};

const SearchAddress = (props: {
  onSubmit: (address: AddressI) => void;
  onChange?: (search?: string) => void;
  minLength?: number;
  label?: string;
  role?: RolesEnum;
  isForm?: boolean;
  location?: boolean;
  placeholder?: string;
}) => {
  const {
    onSubmit: eOnSubmit,
    onChange,
    minLength = 3,
    label = "Search Address",
    location = false,
    role,
    placeholder = "Inserisci città",
  } = props;
  const { currentLocation } = useCurrentLocation({
    onRender: location,
  });
  const [autocompleteResults, setAutocompleteResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useUserStore();

  
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    watch,
    setValue,
  } = useForm<SearchMapFormI>();

  const submit = (address: AddressI) => {
    if (submitted) return; // no duplicazione di risultati
    setSubmitted(true);
    eOnSubmit(address);
    setValue("search", "");
  };

  const validateAddress = async (address: Partial<AddressI>) => {
    try {
      setIsLoading(true);
      const validatedAddress = await MapsService.validateAddress(address);
      if (validatedAddress) {
        return validatedAddress;
      } else {
        console.error("Address validation failed", address);
        return;
      }
    } catch (error) {
      throw new Error(
        `Error validating address: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (formData: SearchMapFormI) => {
    try {
      if (isValid) {
        setSubmitted(true);
        const { search } = formData;
        const address = await validateAddress({ city: search });
        if (address) {
          submit(address);
        }
      } else {
        console.error(isValid, formData, errors);
        throw new Error("Form is not valid");
      }
    } catch (error) {
      console.error("Error searching on maps", error);
    }
  };

  const getLocationAddress = async (locationAddress: Partial<AddressI>) => {
    try {
      const address = await validateAddress({
        q: `${locationAddress.lat}, ${locationAddress.lon}`,
      });
      if (address) {
        setValue("search", address.display_name || address.city || "");
        return address;
      } else {
        throw new Error("Address not found for the given coordinates");
      }
    } catch (error) {
      console.error("Error getting address from coordinates", error);
      return;
    }
  };

  const autocompleteAdress = async () => {
    try {
      if (watch().search?.length >= minLength) {
        setIsLoading(true);
        setHasSearched(true); 
        const results = await MapsService.autocompleteAddress(watch().search);
        setAutocompleteResults(results);
        if (results.length > 1) {
          setAutocompleteResults(results);
          console.log(results);
        } else if (results.length === 1) {
          const address = results[0];
          setValue("search", address.display_name || address.city || "");
          console.log(address);
          submit(address);
          setSubmitted(false);
        }
      }
    } catch (error) {
      console.error("Error during address autocomplete", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (location && currentLocation) {
      getLocationAddress({
        lat: currentLocation.latitude,
        lon: currentLocation.longitude,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, currentLocation]);
  
  const debouncedAutocomplete = useCallback(
    debounce(()=>autocompleteAdress(), 500), // es: 500ms
    []
  );

  useEffect(() => {
    console.log("Input corrente:", watch().search);
    setSubmitted(false);
    setAutocompleteResults([]);
    setHasSearched(false); 
    debouncedAutocomplete();
    console.log("risultati", autocompleteResults);
    onChange?.(watch()?.search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch()?.search]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="my-1">
        <Controller
          name="search"
          control={control}
          rules={{ required: true, ...FormFieldType.ADDRESS }}
          render={({ field }) => (
            <Input
              {...field}
              autoFocus
              label={label}
              placeholder={placeholder}
              type="text"
              required
              role={role}
              isLoading={isLoading}
              aria-invalid={!!errors.search}
              error={errors.search}
              // icon={<MagnifyingGlassIcon className="size-4 text-gray-500 bg-transparent" />}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            />
          )}
        />
      </form>
      {!submitted && autocompleteResults?.length > 1 ? (
        <div>
          <ul>
            {autocompleteResults.map((result, index) => (
              <li key={index} className="my-2 ">
                <button
                  onClick={() => {
                    setValue("search", result.display_name || result.name);
                    setSubmitted(true);
                    submit(result);
                  }}
                  className="text-blue-600 hover:underline flex items-center justify-center border-1 rounded-2xl  ">
                  {result.display_name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {submitted && !autocompleteResults.length ? (
        <div className="text-gray-500">Perfavore perfeziona la ricerca</div>
      ) : hasSearched &&!autocompleteResults.length && !isLoading ? (
        <div className="text-gray-500">
          Nessun risultato trovato, perfavore perfeziona la ricerca
        </div>
      ) : null}
    </>
  );
};
export default SearchAddress;
