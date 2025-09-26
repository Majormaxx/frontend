import React from "react";

interface CustomRangeSliderProps {
  value: number;
  field: string;
  setFieldValue: (field: string, value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const CustomRangeSlider: React.FC<CustomRangeSliderProps> = ({
  value,
  field,
  setFieldValue,
  min = 0,
  max = 100,
  step = 5,
}) => {
  return (
    <div className="flex w-full items-center">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        name={field}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFieldValue(field, Number(e.target.value))
        }
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-berrylavender-100 accent-berrylavender-500"
      />
      <span className="ml-2 text-purple-600">{value}%</span>
    </div>
  );
};

export default CustomRangeSlider;
