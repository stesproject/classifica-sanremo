import { Table, flexRender } from "@tanstack/react-table";
import arrowTableIcon from "../../assets/icon-arrow-table.svg";
// import Pagination from "./Pagination/Pagination";
import "./TableComponent.scss";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: Table<any>;
}

const TableComponent = (props: Props) => {
  const { table } = props;

  const { pageSize } = table.getState().pagination;

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none flex justify-center"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: (
                            <img
                              src={arrowTableIcon}
                              alt="asc"
                              className="ml-3"
                            />
                          ),
                          desc: (
                            <img
                              src={arrowTableIcon}
                              alt="desc"
                              className="ml-3"
                              style={{ rotate: "180deg" }}
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table
            .getRowModel()
            .rows.slice(0, pageSize)
            .map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
      {/* {table.getPageCount() > 1 && (
        <div className="flex items-center justify-center gap-1 mt-4">
          <Pagination table={table} />
        </div>
      )} */}
    </div>
  );
};

export default TableComponent;
