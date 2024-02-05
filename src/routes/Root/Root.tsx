/* eslint-disable no-case-declarations */
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
import { useLocation, useSearchParams } from "react-router-dom";

const Root = () => {
  const [names, setNames] = useState<NamesObj[]>([]);
  const [ratings, setRatings] = useState<RatingObj[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { t } = useTranslation();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetch("/api/classifica.json")
      .then((res) => res.json())
      .then((data) => setNames(data));
  }, []);

  useEffect(() => {}, []);

  useEffect(() => {
    table.setPageSize(names.length);
  }, [names]);

  useEffect(() => {
    if (!names?.length) return;

    const _ratings = names
      .map((item) => ({ id: item.key.toString(), score: 0 }))
      .sort((a, b) => +a.id - +b.id);

    switch (location.pathname) {
      case "/personal":
        const ratings = localStorage.getItem("ratings");
        if (ratings?.length) {
          setRatings(JSON.parse(ratings));
        } else {
          setRatings(_ratings);
        }
        break;
      case "/shared":
        const rate = searchParams.get("rate");
        const sharedRating = rate?.split(",").map((item) => {
          const [id, score] = item.split(":");
          return { id, score: +score };
        });
        sharedRating?.forEach((item) => {
          const index = _ratings.findIndex((rating) => rating.id === item.id);
          if (index !== -1) _ratings[index].score = item.score;
        });
        setRatings(_ratings);
        break;
      default:
        setRatings(_ratings);
        break;
    }
  }, [names]);

  useEffect(() => {
    if (ratings.length === 0 || location.pathname !== "/personal") return;

    localStorage.setItem("ratings", JSON.stringify(ratings));
  }, [ratings]);

  const shareRatings = () => {
    const url = `${window.location.origin}/shared?rate=${ratings
      .filter((item) => item.score > 0)
      .map((item) => `${item.id}:${item.score}`)
      .join(",")}`;

    navigator.clipboard.writeText(url);
  };

  const columns = useMemo<ColumnDef<RatingObj>[]>(
    () => [
      {
        id: "names",
        header: () => t("name"),
        accessorFn: (row) =>
          names.find((item) => item.key.toString() === row.id)?.value,
        cell: ({ getValue, row }) => {
          const name = getValue<string>();
          return <span className="pl-2">{`${row.index + 1}. ${name}`}</span>;
        },
        footer: (props) => props.column.id,
        enableSorting: true,
      },
      {
        id: "ratings",
        header: () => t("score"),
        accessorFn: (row) => row,
        cell: ({ getValue }) => {
          const { id, score } = getValue<RatingObj>();
          return location.pathname !== "/" && ratings?.length ? (
            <div className="flex justify-center min-w-48">
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
                value={score || 0}
                onChange={(value: number) =>
                  setRatings((prev) => {
                    const index = prev.findIndex((item) => item.id === id);
                    prev[index].score = value;
                    return [...prev];
                  })
                }
                readOnly={location.pathname !== "/personal"}
              />
            </div>
          ) : (
            <div className="text-center min-w-48">{score}</div>
          );
        },
        footer: (props) => props.column.id,
        enableSorting: false,
      },
    ],
    [ratings, location.pathname]
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
      {location.pathname === "/personal" && (
        <div className="fixed top-2/4 right-4 flex flex-col gap-3">
          <button onClick={shareRatings}>{t("share")}</button>
          <button>{t("send")}</button>
        </div>
      )}
    </>
  );
};

export default Root;
