"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ZipEntry = { zip: string; city: string };

let cache: ZipEntry[] | null = null;
let loadingPromise: Promise<ZipEntry[]> | null = null;

function loadZipCodes(): Promise<ZipEntry[]> {
  if (cache) return Promise.resolve(cache);
  if (!loadingPromise) {
    loadingPromise = fetch("/data/de-zip-codes.json")
      .then((res) => res.json())
      .then((data: ZipEntry[]) => {
        cache = data;
        return data;
      });
  }
  return loadingPromise;
}

type ZipCodeAutocompleteProps = {
  name: string;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
};

/**
 * Text field for a 5-digit German postal code with live city suggestions.
 *
 * @param name Form field name submitted with the surrounding form.
 * @param defaultValue Initial value, e.g. from URL search params.
 * @param className Extra classes merged onto the input.
 * @param placeholder Input placeholder text.
 */
export const ZipCodeAutocomplete = ({
  name,
  defaultValue = "",
  className,
  placeholder = "PLZ",
}: ZipCodeAutocompleteProps) => {
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<ZipEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = async (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 5);
    setValue(digits);
    setHighlighted(0);

    if (digits.length === 0) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const zipCodes = await loadZipCodes();
    const matches = zipCodes
      .filter((entry) => entry.zip.startsWith(digits))
      .slice(0, 8);

    setSuggestions(matches);
    setIsOpen(matches.length > 0);
  };

  const selectSuggestion = (entry: ZipEntry) => {
    setValue(entry.zip);
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectSuggestion(suggestions[highlighted]);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        inputMode="numeric"
        name={name}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => handleChange(event.target.value)}
        onFocus={() =>
          value.length > 0 && suggestions.length > 0 && setIsOpen(true)
        }
        onKeyDown={handleKeyDown}
        className={className}
      />

      {isOpen ? (
        <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-auto rounded-md border border-black/15 bg-white py-1 shadow-lg">
          {suggestions.map((entry, index) => (
            <li key={`${entry.zip}-${entry.city}`}>
              <button
                type="button"
                onClick={() => selectSuggestion(entry)}
                onMouseEnter={() => setHighlighted(index)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm",
                  index === highlighted ? "bg-zinc-100" : "bg-white",
                )}
              >
                <span className="font-medium text-zinc-900">{entry.zip}</span>
                <span className="truncate text-zinc-600">{entry.city}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
