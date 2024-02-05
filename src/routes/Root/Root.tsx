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
import { Rating, StickerStar } from "@smastrom/react-rating";
import { NamesObj, RatingObj } from "../../types";
import TableComponent from "../../components/TableComponent/TableComponent";

const Root = () => {
  const [names, setNames] = useState<NamesObj[]>([]);
  const [ratings, setRatings] = useState<RatingObj[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { t } = useTranslation();

  useEffect(() => {
    fetch("/api/classifica.json")
      .then((res) => res.json())
      .then((data) => setNames(data));
  }, []);

  useEffect(() => {
    table.setPageSize(names.length);

    setRatings(
      names.map((item) => ({ id: `${item.id} - ${item.info}`, value: 0 }))
    );
  }, [names]);

  useEffect(() => {}, [ratings]);

  const columns = useMemo<ColumnDef<RatingObj>[]>(
    () => [
      {
        id: "names",
        header: () => t("name"),
        accessorFn: (row) => row,
        cell: ({ getValue, row }) => {
          const item = getValue() as NamesObj;
          return `${row.index + 1}. ${item.id}`;
        },
        footer: (props) => props.column.id,
        enableSorting: true,
      },
      {
        id: "ratings",
        header: () => t("score"),
        accessorFn: (row) => row.id,
        cell: ({ getValue }) => {
          const itemId = getValue<string>();
          return (
            <div className="flex justify-center">
              <Rating
                style={{ maxWidth: 160 }}
                itemStyles={{
                  itemShapes: StickerStar,
                  activeFillColor: "#FFE3DC",
                  activeStrokeColor: "#FFE3DC",
                  inactiveFillColor: "#dbc9c67d",
                  inactiveStrokeColor: "#ddcbc799",
                  itemStrokeWidth: 2,
                }}
                value={ratings.find((item) => item.id === itemId)?.score || 0}
                onChange={(value: number) =>
                  setRatings((prev) => {
                    const index = prev.findIndex((item) => item.id === itemId);
                    prev[index].score = value;
                    return [...prev];
                  })
                }
              />
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableSorting: false,
      },
    ],
    [ratings]
  );

  const table = useReactTable({
    data: ratings.sort(
      (a, b) => b.score - a.score || a.id.localeCompare(b.id) || 0
    ),
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
      <h1 className="text-center my-8 font-semibold">
        🎶 Classifica Sanremo 2024 🎶
      </h1>
      <TableComponent table={table} />
    </>
  );
};

export default Root;
