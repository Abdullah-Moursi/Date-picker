import React, { FC, useState } from "react";
import axios from "axios";
import { FallingLines } from "react-loader-spinner";
import Table from "./Table";

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
  const [exchangeData, setExchangeData] = useState<any | null>({});
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    setExchangeData({});
    setError(false);
    setLoader(true);
    const params = {
      start_date: startDate,
      end_date: endDate,
      access_key: ACCESS_KEY,
    };
    try {
      const response = await axios.get(baseURL, { params });
      setExchangeData(response.data);
      setError(false);
      setLoader(false);
      if (!response.data.success) {
        setError(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = () => {
    if (startDate && endDate) {
      setError(false);
      getExchangeData();
    }
    {
      setError(true);
    }
  };

  return (
    <div className="datePicker__wrapper">
      <div className="datePicker__content">
        <h1>Currency Exchange Rates</h1>
        <div className="datePicker__wrapper-inputDates">
          <div className="datePicker__wrapper-startDate">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              value={startDate ? startDate.toString().split("T")[0] : ""}
              onChange={handleStartDateChange}
            />
          </div>
          <div className="datePicker__wrapper-endDate">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              value={endDate ? endDate.toString().split("T")[0] : ""}
              onChange={handleEndDateChange}
              min={startDate ? startDate.toString().split("T")[0] : ""}
            />
          </div>
        </div>
        {error && <p className="errorMessage">Please select a valid range</p>}
        <button className="datePicker__submitBtn" onClick={handleSubmit}>Submit</button>
      </div>
      {loader && !exchangeData.quotes && (
        <FallingLines color="#e6f7ff" width="100" visible={true} />
      )}
      {exchangeData.quotes && <Table exchangeData={exchangeData} />}
    </div>
  );
};

export default DatePicker;
