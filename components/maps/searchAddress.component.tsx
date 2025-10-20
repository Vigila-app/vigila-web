"use client";

import { FormFieldType } from "@/src/constants/form.constants";
import { MapsService } from "@/src/services";
import { useDebouncedSearch } from "@/src/hooks/useDebouncedSearch";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/form";
import { AddressI } from "@/src/types/maps.types";
import { useCurrentLocation } from "@/src/hooks/useCurrentLocation";
import { RolesEnum } from "@/src/enums/roles.enums";

type SearchMapFormI = {
  search: string;
};

const SearchAddress = (props: {
  onSubmit: (address: AddressI) => void;
  onChange?: (search?: string) => void;
  minLength?: number;
  label?: string;
  role?: RolesEnum;
  location?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}) => {
  const {
    onSubmit: eOnSubmit,
    onChange,
    minLength = 3,
    label,
    location = false,
    role,
    placeholder = "Inserisci CAP",
    autoFocus = true,
  } = props;

  const { searchTerm, debouncedSearchTerm, setSearchTerm } = useDebouncedSearch(
    "",
    500,
    "searchAddress"
  );

  const { currentLocation } = useCurrentLocation({
    onRender: location,
  });
  const [autocompleteResults, setAutocompleteResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
  } = useForm<SearchMapFormI>();

  const submit = (address: AddressI) => {
    eOnSubmit(address);
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
        const displayName = address.display_name || address.city || "";
        setValue("search", displayName);
        setSearchTerm(displayName); // Sincronizza con il nostro hook
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
      if (debouncedSearchTerm?.length >= minLength) {
        setIsLoading(true);
        const results =
          await MapsService.autocompleteAddress(debouncedSearchTerm);
        setAutocompleteResults(results);
        if (results.length > 1) {
          setAutocompleteResults(results);
        } else if (results.length === 1) {
          const address = results[0];
          const displayName = address.display_name || address.city || "";
          setValue("search", displayName);
          setSearchTerm(displayName);
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

  useEffect(() => {
    setSubmitted(false);
    autocompleteAdress();
    setAutocompleteResults([]);
    onChange?.(debouncedSearchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

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
              onChange={(value) => {
                field.onChange(value);
                setSearchTerm(value as string);
              }}
              value={searchTerm}
              autoFocus={autoFocus}
              label={label}
              placeholder={placeholder}
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              required
              role={role}
              isLoading={isLoading}
              aria-invalid={!!errors.search}
              error={errors.search}
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
                    const displayName =
                      result.display_name || result.name || "";
                    setValue("search", displayName);
                    setSearchTerm(displayName);
                    setSubmitted(true);
                    submit(result);
                  }}
                  className="text-blue-600 hover:underline flex items-center justify-center border-1 rounded-2xl">
                  {result.display_name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {submitted && !autocompleteResults.length ? (
        <div className="text-gray-500">Perfavore perfeziona la ricerca</div>
      ) : !autocompleteResults.length && !isLoading ? (
        <div className="text-gray-500">
          Nessun risultato trovato, perfavore perfeziona la ricerca
        </div>
      ) : null}
    </>
  );
};
export default SearchAddress;
