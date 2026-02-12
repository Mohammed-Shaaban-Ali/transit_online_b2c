import React from "react";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";

type Props = {
  name: string | number;
  checked: boolean;
  onChange: () => void;
  label: string;
  count: number | string;
};

function Checkbox({ name, checked, onChange, label, count }: Props) {
  return (
    <label className="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded px-2 py-1 transition-colors gap-2.5">
      <div className="flex items-center gap-1.5 w-full">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            name={name.toString()}
            checked={checked}
            onChange={onChange}
            className="sr-only"
          />
          {checked ? (
            <ImCheckboxChecked className="w-[18px] h-[18px] text-primary fill-primary" />
          ) : (
            <ImCheckboxUnchecked className="w-[18px] h-[18px] text-gray-300 fill-gray-300 bg-white" />
          )}
        </div>
        <span className="text-gray-600">{label}</span>
        {count && (
          <span className="text-gray-500 text-14 ms-auto">{count || 0}</span>
        )}
      </div>
    </label>
  );
}

export default Checkbox;
