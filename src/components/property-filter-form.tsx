"use client";

import type { FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";

import { PriceRangeFilter } from "@/components/price-range-filter";
import { ZipCodeAutocomplete } from "@/components/zip-code-autocomplete";
import {
  AREA_TYPE_OPTIONS,
  LOCATION_OPTIONS,
  OBJECT_TYPE_OPTIONS,
} from "@/lib/filter-options";
import { cn } from "@/lib/utils";
import type { PropertyFilters } from "@/types/property";

type PropertyFilterFormProps = {
  filters: PropertyFilters;
};

/**
 * Advanced filter form modeled after the Frymo search bar.
 *
 * @param filters Active filter values from URL.
 */
export const PropertyFilterForm = ({ filters }: PropertyFilterFormProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const inputClassName = cn(
    "h-10 w-full rounded-md border border-black/15 bg-white px-3 text-sm text-zinc-900",
    "placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none",
  );

  const selectClassName = cn(inputClassName, "appearance-none pr-8");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();
    const formData = new FormData(event.currentTarget);

    formData.forEach((value, key) => {
      if (value && value.toString().trim()) {
        params.set(key, value.toString());
      }
    });

    router.replace(params.toString() ? `${pathname}?${params}` : pathname, {
      scroll: false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-sidhu-border bg-white p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <fieldset className="space-y-2">
          <legend className="text-xs font-medium uppercase tracking-[0.12em] text-sidhu-meta">
            Objekttyp
          </legend>
          <label>
            <span className="sr-only">Objekttyp</span>
            <select
              className={selectClassName}
              name="objectType"
              defaultValue={filters.objectType ?? ""}
            >
              {OBJECT_TYPE_OPTIONS.map((option) => {
                return (
                  <option key={option.value || "all"} value={option.value}>
                    {option.label}
                  </option>
                );
              })}
            </select>
          </label>
        </fieldset>

        <fieldset className="space-y-2 md:col-span-2 xl:col-span-1">
          <PriceRangeFilter
            listingSegment={filters.listingSegment}
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
          />
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-xs font-medium uppercase tracking-[0.12em] text-sidhu-meta">
            Fläche
          </legend>
          <label className="flex flex-col gap-2 sm:flex-row">
            <input
              className={inputClassName}
              type="number"
              name="minArea"
              placeholder="Fläche von (m²)"
              min={0}
              defaultValue={filters.minArea}
            />
            <select
              className={selectClassName}
              name="areaType"
              defaultValue={filters.areaType ?? "wohnflaeche"}
            >
              {AREA_TYPE_OPTIONS.map((option) => {
                return (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                );
              })}
            </select>
          </label>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-xs font-medium uppercase tracking-[0.12em] text-sidhu-meta">
            Standort
          </legend>
          <label>
            <span className="sr-only">Standort</span>
            <select
              className={selectClassName}
              name="location"
              defaultValue={filters.location ?? ""}
            >
              {LOCATION_OPTIONS.map((option) => {
                return (
                  <option key={option.value || "all"} value={option.value}>
                    {option.label}
                  </option>
                );
              })}
            </select>
          </label>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-xs font-medium uppercase tracking-[0.12em] text-sidhu-meta">
            Anzahl Zimmer
          </legend>
          <label>
            <span className="sr-only">Anzahl Zimmer</span>
            <input
              className={inputClassName}
              type="number"
              name="minRooms"
              placeholder="Von"
              min={0}
              max={1000}
              step={0.5}
              defaultValue={filters.minRooms}
            />
          </label>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-xs font-medium uppercase tracking-[0.12em] text-sidhu-meta">
            Postleitzahl
          </legend>
          <label>
            <span className="sr-only">Postleitzahl</span>
            <ZipCodeAutocomplete
              name="zipCode"
              defaultValue={filters.zipCode ?? ""}
              className={inputClassName}
              placeholder="z. B. 22850"
            />
          </label>
        </fieldset>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className={cn(
            "h-10 w-full rounded-md bg-sidhu-dark px-6 text-sm font-medium text-white",
            "transition hover:bg-sidhu-title md:w-auto",
          )}
        >
          Suchen
        </button>
      </div>
    </form>
  );
};
