import { useEffect, useRef, useCallback } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[] | ((dateString: string) => void);
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  value?: string;
  maxDate?: DateOption;
  minDate?: DateOption;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  value,
  maxDate,
  minDate,
}: PropsType) {
  const flatpickrRef = useRef<flatpickr.Instance | flatpickr.Instance[] | null>(null);

  const handleChange = useCallback<Hook>((dates, dateStr) => {
    if (typeof onChange === 'function') {
      (onChange as (dateString: string) => void)(dateStr);
    } else if (Array.isArray(onChange)) {
      (onChange as Hook[]).forEach(fn => fn(dates, dateStr));
    }
  }, [onChange]);

  useEffect(() => {
    flatpickrRef.current = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate: value || defaultDate,
      maxDate,
      minDate,
      onChange: handleChange,
    });

    return () => {
      if (flatpickrRef.current) {
        if (Array.isArray(flatpickrRef.current)) {
          flatpickrRef.current.forEach(fp => fp.destroy());
        } else {
          flatpickrRef.current.destroy();
        }
      }
    };
  }, [mode, id, defaultDate, maxDate, minDate, handleChange, value]);

  useEffect(() => {
    if (flatpickrRef.current && value !== undefined) {
      const fp = Array.isArray(flatpickrRef.current) ? flatpickrRef.current[0] : flatpickrRef.current;
      if (fp && value) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          fp.setDate(date);
        }
      }
    }
  }, [value, handleChange]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          value={value || ""}
          readOnly
          className="h-11 w-full cursor-pointer rounded-lg border appearance-none px-4 py-2.5 pr-10 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-5" />
        </span>
      </div>
    </div>
  );
}
