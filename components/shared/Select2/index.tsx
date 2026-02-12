"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  useGetCurrenciesQuery,
  CurrencyItem,
} from "@/redux/features/currencies/currenciesApi";
import useDebounce from "@/hooks/useDebounce";
import { FaSpinner } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";

interface CurrencySelectProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({
  form,
  name,
  label = "Currency",
  required = false,
  error,
}) => {
  const { register, setValue, watch } = form;
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyItem | null>(
    null
  );
  const [page, setPage] = useState("1");
  const [allItems, setAllItems] = useState<CurrencyItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formValue = watch(name);

  // Use a separate search value for the input
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);

  // Set mounted state after hydration to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch currencies data
  const { data, isFetching } = useGetCurrenciesQuery(
    {
      search: debouncedSearch || "",
      page,
    },
    {
      skip:
        !isFocused && (!debouncedSearch || debouncedSearch.trim().length === 0),
    }
  );

  // Reset page when search changes
  useEffect(() => {
    setPage("1");
    setAllItems([]);
  }, [debouncedSearch]);

  // Update items when data changes
  useEffect(() => {
    if (data?.items) {
      if (page === "1") {
        setAllItems(data.items);
      } else {
        setAllItems((prev) => [...prev, ...data.items]);
      }
    }
  }, [data, page]);

  // Load more when scrolling to bottom
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current || !data?.hasMore || isFetching) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        const nextPage = (parseInt(page) + 1).toString();
        setPage(nextPage);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, [data?.hasMore, isFetching, page]);

  // Find selected currency when form value changes
  useEffect(() => {
    if (formValue && allItems.length > 0) {
      const currency = allItems.find(
        (item) => item.id.toString() === formValue.toString()
      );
      if (
        currency &&
        (!selectedCurrency || selectedCurrency.id !== currency.id)
      ) {
        setSelectedCurrency(currency);
        setSearchValue(currency.text);
      }
    } else if (!formValue && selectedCurrency) {
      setSelectedCurrency(null);
      setSearchValue("");
    }
  }, [formValue, allItems, selectedCurrency]);

  // Filter currencies based on search value
  const filteredCurrencies = useMemo(() => {
    // If focused, show all items even with empty search
    if (isFocused) {
      return allItems;
    }
    // If not focused, only show items when there's a search value
    if (!debouncedSearch || debouncedSearch.trim().length === 0) {
      return [];
    }
    return allItems;
  }, [debouncedSearch, allItems, isFocused]);

  // Show dropdown when input is focused
  useEffect(() => {
    if (isFocused) {
      setShowDropdown(true);
    } else {
      // Delay hiding to allow click events
      const timer = setTimeout(() => setShowDropdown(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isFocused]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (currency: CurrencyItem) => {
    setSelectedCurrency(currency);
    setValue(name, currency.id, { shouldValidate: true });
    setSearchValue(currency.text);
    setShowDropdown(false);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setShowDropdown(true);
    if (!value) {
      setValue(name, "", { shouldValidate: true });
      setSelectedCurrency(null);
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (selectedCurrency) {
      // Keep the search value but allow editing
      setSearchValue(selectedCurrency.text);
    } else {
      // If no selected currency, ensure empty search and reset to page 1
      if (!searchValue || searchValue.trim().length === 0) {
        setSearchValue("");
        setPage("1");
        setAllItems([]);
      }
    }
  };

  const hasValue = searchValue && searchValue.length > 0;
  // Only use hasValue after mount to prevent hydration mismatch
  const isActive = isFocused || (isMounted && hasValue);

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="hidden"
        {...register(name as any, {
          required: required,
          validate: required
            ? (value) => {
              if (required && (!value || value === 0 || value === "0")) {
                return "This field is required";
              }
              return true;
            }
            : undefined,
        })}
      />

      <div>
        {/* label */}
        <div
          className="relative flex items-center px-3 h-16 bg-transparent border border-gray-300 rounded-md
           transition-all duration-300"
        >
          <label
            htmlFor={name}
            className={`absolute left-3  transition-all font-bold duration-200 pointer-events-none ${isActive
                ? "top-1 text-gray-500"
                : "top-1/2 -translate-y-1/2 text-gray-500"
              }`}
          >
            {label}
          </label>
          <div className="flex items-center gap-1 relative w-full">
            <input
              autoComplete="off"
              type="search"
              value={searchValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className={` w-full! font-bold text-black  border-none outline-none p-0 ${isActive ? "mt-4 " : ""
                }`}
              ref={inputRef}
            />
          </div>
        </div>
      </div>

      {/* Dropdown with search results */}
      {showDropdown && (
        <CurrencyDropdown
          dropdownRef={dropdownRef}
          scrollRef={scrollRef}
          filteredCurrencies={filteredCurrencies}
          handleSelect={handleSelect}
          isFetching={isFetching}
          selectedCurrency={selectedCurrency}
        />
      )}

      {/* Error message */}
      {error && (
        <p title={error} className="absolute -bottom-4 start-4 text-xs text-red-500 font-medium line-clamp-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default CurrencySelect;

const CurrencyDropdown = ({
  dropdownRef,
  scrollRef,
  filteredCurrencies,
  handleSelect,
  isFetching,
  selectedCurrency,
}: {
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  filteredCurrencies: CurrencyItem[];
  handleSelect: (currency: CurrencyItem) => void;
  isFetching: boolean;
  selectedCurrency: CurrencyItem | null;
}) => {
  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-hidden flex flex-col"
    >
      {isFetching && filteredCurrencies.length === 0 ? (
        <div className="px-4 py-3 flex items-center gap-2">
          <FaSpinner className="animate-spin" />
          <span className="font-semibold text-gray-500">Loading...</span>
        </div>
      ) : filteredCurrencies.length === 0 ? (
        <div className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150 flex items-center gap-2">
          <span className="font-semibold text-gray-900">No results found</span>
        </div>
      ) : (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto max-h-60">
            {filteredCurrencies.map((currency) => (
              <div
                key={currency.id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(currency)}
                className={`px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150 flex items-center gap-2 ${selectedCurrency?.id === currency.id ? "bg-blue-50" : ""
                  }`}
              >
                <span className="font-semibold text-gray-900">
                  {currency.text}
                </span>
              </div>
            ))}
          </div>
          {isFetching && filteredCurrencies.length > 0 && (
            <div className="flex justify-center items-center p-2 border-t border-gray-200">
              <FaSpinner className="animate-spin" />
            </div>
          )}
        </>
      )}
    </div>
  );
};
