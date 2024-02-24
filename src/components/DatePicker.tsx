import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { FallingLines } from "react-loader-spinner";
import Table from "./Table";

// API Credentials
const baseURL = "http://api.exchangerate.host/timeframe?";
const ACCESS_KEY = "b8e97526bd00a09c25a0b8705fd36069";

////////////////////////////////////////////////////

export interface DateRangePickerProps {
  date?: string | null;
  exchangeDataType?: any;
}

const DatePicker: FC<DateRangePickerProps> = ({ date, exchangeDataType }) => {
  const [startDate, setStartDate] = useState<typeof date>(null);
  const [endDate, setEndDate] = useState<typeof date>(null);
  const [todaysDate, setTodaysDate] = useState<typeof date>(null);
  const [exchangeData, setExchangeData] = useState<typeof exchangeDataType>({});
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  // Getting today's date on mounting
  useEffect(() => {
    setTodaysDate(getFormattedDate());
  }, []);

  const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  ////////////////////////////////////////////////////

  // Fetching Exchange Rates
  const getExchangeData = async () => {
    setError(false);
    setExchangeData({});
    setLoader(true);
    const params = {
      start_date: startDate,
      end_date: endDate,
      access_key: ACCESS_KEY,
    };
    try {
      const response = await axios.get(baseURL, { params });
      setExchangeData(response.data);
      setLoader(false);
      if (!response.data.success) {
        setError(true);
      }
    } catch (error) {
      alert(`Error fetching data: ${error}`);
    }
  };

  ////////////////////////////////////////////////////

  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    dateType: string
  ) => {
    const date = event.target.value ?? null;

    if (dateType === "start") setStartDate(date);
    else if (dateType === "end") setEndDate(date);
  };

  const onSubmit = () => {
    if (startDate && endDate) {
      getExchangeData();
    } else {
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
              value={startDate ?? ""}
              onChange={(e) => handleDateChange(e, "start")}
              max={endDate ?? todaysDate ?? ""}
            />
          </div>
          <div className="datePicker__wrapper-endDate">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              value={endDate ?? ""}
              onChange={(e) => handleDateChange(e, "end")}
              min={startDate ?? ""}
              max={todaysDate ?? ""}
            />
          </div>
        </div>
        {error && <p className="errorMessage">Please select a valid date range</p>}
        <button className="datePicker__submitBtn" onClick={onSubmit}>
          Show Rates!
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
