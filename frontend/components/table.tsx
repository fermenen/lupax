/* eslint-disable react/jsx-key */
import React from 'react';
import { Table, Tbody, Td, Th, Thead, Tr, Text, TableContainer } from '@chakra-ui/react';
import { useTable, useSortBy, useExpanded, Column } from 'react-table';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';

export default function TableReact({ data, columns, renderRowSubComponent }: { data: Array<object>, columns: Array<any>, renderRowSubComponent?: Function }) {

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    useExpanded
  )


  return (
    <TableContainer>
      <Table {...getTableProps()}>
        <Thead>
          {// Loop over the header rows
            headerGroups.map(headerGroup => (
              // Apply the header row props
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {// Loop over the headers in each row
                  headerGroup.headers.map(column => (
                    // Apply the header cell props
                    <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {// Render the header
                        column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? <ArrowDownIcon ml={1} />
                            : <ArrowUpIcon ml={1} />
                          : ''}
                      </span>
                    </Th>
                  ))}
              </Tr>
            ))}
        </Thead>
        {/* Apply the table body props */}
        <Tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              // Use a React.Fragment here so the table markup is still valid
              <React.Fragment {...row.getRowProps()}>
                <Tr>
                  {row.cells.map(cell => {
                    return (
                      <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                    )
                  })}
                </Tr>
                {/*
                    If the row is in an expanded state, render a row with a
                    column that fills the entire length of the table.
                  */}
                {row.isExpanded && renderRowSubComponent ? (
                  <Tr>
                    <Td colSpan={visibleColumns.length}>
                      {/*
                          Inside it, call our renderRowSubComponent function. In reality,
                          you could pass whatever you want as props to
                          a component like this, including the entire
                          table instance. But for this example, we'll just
                          pass the row
                        */}
                      {renderRowSubComponent({ row })}
                    </Td>
                  </Tr>
                ) : null}
              </React.Fragment>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

