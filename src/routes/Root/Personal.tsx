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

const Personal = () => {
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

    const ratings = localStorage.getItem("ratings");
    if (ratings?.length) {
      setRatings(JSON.parse(ratings));
    } else {
      setRatings(
        names
          .map((item) => ({ id: item.key.toString(), score: 0 }))
          .sort((a, b) => +a.id - +b.id)
      );
    }
  }, [names]);

  useEffect(() => {
    if (ratings.length === 0) return;

    localStorage.setItem("ratings", JSON.stringify(ratings));
  }, [ratings]);

  const columns = useMemo<ColumnDef<RatingObj>[]>(
    () => [
      {
        id: "names",
        header: () => t("name"),
        accessorFn: (row) =>
          names.find((item) => item.key.toString() === row.id)?.value,
        cell: ({ getValue, row }) => {
          const name = getValue<string>();
          return `${row.index + 1}. ${name}`;
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
    data: ratings.sort((a, b) => b.score - a.score || 0),
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

export default Personal;
