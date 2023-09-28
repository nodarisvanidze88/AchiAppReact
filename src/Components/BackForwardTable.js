import React from "react";
import { useTable } from 'react-table'
import { COLUMNS } from "./BackFowardTableColumns"
import "./BackForward.css"

export function BackForwardTable ({data})  {

    const columns = React.useMemo(()=> COLUMNS,[])
    // const tableData = React.useMemo(()=> data,[data])
    

    console.log(JSON.stringify(columns))

    const {getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows} = useTable({ columns, data })
    
        if (!data || data===0){
            return <p>NoData</p>
        }
console.log(rows)
        
    return (
        <div className="item_table">
            {data.length > 0 ? (
                <table {...getTableProps()} className="table table-striped table-dark table-hover">
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>
                                        {column.render("Header")}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()} className="table-quantity">
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </td>

                                    ))}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            ) : (
                <p>No Data</p>
            )}
        </div>
    )
}