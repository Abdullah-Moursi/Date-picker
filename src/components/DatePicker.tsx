import React, { FC, useState } from "react";

const ACCESS_KEY = "b8e97526bd00a09c25a0b8705fd36069";

interface DateRangePickerProps {
  onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
}

const DatePicker: FC<DateRangePickerProps> = ({ onDateRangeChange }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const date = event.target.value ? new Date(event.target.value) : null;
    setStartDate(date);
    if (onDateRangeChange) onDateRangeChange(date, endDate);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value ? new Date(event.target.value) : null;
    setEndDate(date);
    if (onDateRangeChange) onDateRangeChange(startDate, date);
  };

  const handleSubmit = () => {
    console.log(startDate, endDate);
  };

  return (
    <div>
      <label htmlFor="startDate">Start Date:</label>
      <input
        type="date"
        id="startDate"
        value={startDate ? startDate.toISOString().split("T")[0] : ""}
        onChange={handleStartDateChange}
      />

      <label htmlFor="endDate">End Date:</label>
      <input
        type="date"
        id="endDate"
        value={endDate ? endDate.toISOString().split("T")[0] : ""}
        onChange={handleEndDateChange}
        min={startDate ? startDate.toISOString().split("T")[0] : ""}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default DatePicker;
