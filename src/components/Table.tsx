import { FC } from 'react';

interface TableProps {
    exchangeData: any
}

const Table:FC<TableProps> = ({exchangeData}) => {
  return (
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
  )
}

export default Table