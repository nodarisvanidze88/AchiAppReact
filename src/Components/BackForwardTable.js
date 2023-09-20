import React, { useMemo } from "react";
import { useTable } from 'react-table'
import { COLUMNS } from "./BackFowardTableColumns"


export function BackForwardTable ({data})  {

    const columns = React.useMemo(()=> COLUMNS,[])
    const tableData = React.useMemo(()=> data,[data])
    
    console.log(JSON.stringify(tableData))
    console.log(JSON.stringify(columns))
    console.log(tableData.length)
    const {getTableProps,
        getTableBodyProps,
        headerGroups,
        properRow,
        rows} = useTable({ columns, data: tableData  })
    
        if (!tableData || tableData.length===0){
            return <p>NoData</p>
        }

        
    return (
        <div>
            {data.length > 0 ? (
                <table {...getTableProps()}>
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
                            properRow(row)
                            return (
                                <tr {...row.getRowProps()}>
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