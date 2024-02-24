import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { FallingLines } from "react-loader-spinner";
import Table from "./Table";

const baseURL = "http://api.exchangerate.host/timeframe?";
const ACCESS_KEY = "b8e97526bd00a09c25a0b8705fd36069";

interface DateRangePickerProps {
  date?: string | null;
}

const DatePicker: FC<DateRangePickerProps> = ({ date }) => {
  const [startDate, setStartDate] = useState<typeof date>(null);
  const [endDate, setEndDate] = useState<typeof date>(null);
  const [todayFormatted, setTodayFormatted] = useState<typeof date>(null);
  const [exchangeData, setExchangeData] = useState<any | null>({});
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setTodayFormatted(getFormattedDate());
  }, []);

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const date = event.target.value ? event.target.value : null;
    setStartDate(date);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value ? event.target.value : null;
    setEndDate(date);
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
    } else {
      setError(true);
    }
  };

  function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

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
              value={startDate ?? ""}
              onChange={handleStartDateChange}
              max={endDate ?? todayFormatted ?? ""}
            />
          </div>
          <div className="datePicker__wrapper-endDate">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              value={endDate ?? ""}
              onChange={handleEndDateChange}
              min={startDate ?? ""}
              max={todayFormatted ?? ""}
            />
          </div>
        </div>
        {error && <p className="errorMessage">Please select a date range</p>}
        <button className="datePicker__submitBtn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
      {loader && !exchangeData.success && (
        <FallingLines color="#e6f7ff" width="100" visible={true} />
      )}
      {exchangeData.success && <Table exchangeData={exchangeData} />}
    </div>
  );
};

export default DatePicker;
