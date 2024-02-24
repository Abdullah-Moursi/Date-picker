import { FC } from "react";
import { DateRangePickerProps } from "./DatePicker";

interface TableProps {
  exchangeData: DateRangePickerProps["exchangeDataType"];
}

const Table: FC<TableProps> = ({ exchangeData }) => {
  return (
    <table className="table__wrapper">
      <thead>
        <tr>
          <th>Date</th>
          <th>EGP</th>
          <th>CAD</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(exchangeData.quotes).map((item: string) => (
          <tr key={item}>
            <td>{item}</td>
            <td>{exchangeData.quotes[item].USDEGP}</td>
            <td>{exchangeData.quotes[item].USDCAD}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
