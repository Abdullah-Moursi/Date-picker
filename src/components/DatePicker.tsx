import axios from "axios";
import React, { FC, useState } from "react";

const baseURL = "http://api.exchangerate.host/timeframe?";
const ACCESS_KEY = "b8e97526bd00a09c25a0b8705fd36069";

interface DateRangePickerProps {
  onDateRangeChange?: (
    startDate: string | null,
    endDate: string | null
  ) => void;
}

const DatePicker: FC<DateRangePickerProps> = ({ onDateRangeChange }) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [exchangeData, setExchangeData] = useState<{} | null>({})

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("change", event.target.value);
    const date = event.target.value ? event.target.value : null;
    setStartDate(date);
    if (onDateRangeChange) onDateRangeChange(date, endDate);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value ? event.target.value : null;
    setEndDate(date);
    if (onDateRangeChange) onDateRangeChange(startDate, date);
  };

  const getExchangeData = async () => {
    const params = {
      start_date: startDate,
      end_date: endDate,
      access_key: ACCESS_KEY,
    };
    try {
      const response = await axios.get(baseURL, { params });
      setExchangeData(response.data);
      console.log(exchangeData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = () => {
    if (startDate && endDate) {
      getExchangeData();
    }
    alert('Please enter date values')
  };

  return (
    <div>
      <label htmlFor="startDate">Start Date:</label>
      <input
        type="date"
        id="startDate"
        value={startDate ? startDate.toString().split("T")[0] : ""}
        onChange={handleStartDateChange}
      />

      <label htmlFor="endDate">End Date:</label>
      <input
        type="date"
        id="endDate"
        value={endDate ? endDate.toString().split("T")[0] : ""}
        onChange={handleEndDateChange}
        min={startDate ? startDate.toString().split("T")[0] : ""}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default DatePicker;
