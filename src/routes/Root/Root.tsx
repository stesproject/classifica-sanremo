import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import { LeaderboardObj, VoteObj } from "../../types";
import TableComponent from "../../components/TableComponent/TableComponent";

const Root = () => {
  const [names, setNames] = useState<LeaderboardObj[]>([]);
  const [votes, setVotes] = useState<VoteObj[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { t } = useTranslation();

  useEffect(() => {
    fetch("/api/classifica.json")
      .then((res) => res.json())
      .then((data) => setNames(data));

    fetch("/api/votes.json")
      .then((res) => res.json())
      .then((data) => setVotes(data));
  }, []);

  useEffect(() => {
    table.setPageSize(names.length);
  }, [names]);

  const columns = useMemo<ColumnDef<LeaderboardObj>[]>(
    () => [
      {
        id: "names",
        header: () => t("name"),
        accessorFn: (row) => row,
        cell: ({ getValue }) => {
          const item = getValue() as LeaderboardObj;
          return `${item.id} - ${item.info}`;
        },
        footer: (props) => props.column.id,
        enableSorting: true,
      },
      {
        id: "votes",
        header: () => t("vote"),
        accessorFn: (row) => row.id,
        cell: ({ getValue }) => {
          const itemId = getValue<string>();
          return (
            <div className="flex gap-4">
              {votes.map((vote) => {
                const id = `${itemId}-${vote.id}`;
                return (
                  <label key={id} htmlFor={id}>
                    <input id={id} type="radio" name={itemId} />
                    {vote.id}
                  </label>
                );
              })}
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableSorting: false,
      },
    ],
    [votes]
  );

  const table = useReactTable({
    data: names,
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    paginateExpandedRows: false,
  });

  return (
    <>
      <TableComponent table={table} />
    </>
  );
};

export default Root;
