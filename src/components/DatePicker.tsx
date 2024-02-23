import React, { FC, useState } from "react";
import axios from "axios";
import { FallingLines } from "react-loader-spinner";

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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = () => {
    if (startDate && endDate) {
      getExchangeData();
    }
    // alert('Please enter date values')
  };

  return (
    <>
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
      {loader && !exchangeData.quotes && (
        <FallingLines color="#4fa94d" width="100" visible={true} />
      )}
      {exchangeData.quotes && (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>EGP</th>
              <th>CAD</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(exchangeData.quotes).map((item: any) => (
              <tr key={item}>
                <td>{item}</td>
                <td>{exchangeData.quotes[item].USDEGP}</td>
                <td>{exchangeData.quotes[item].USDCAD}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default DatePicker;
