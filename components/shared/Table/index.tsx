"use client";

import { motion } from "framer-motion";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import TableSkeleton from "./TableSkeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full bg-white border overflow-auto  border-gray-300 rounded-lg "
    >
      <table className="w-full min-w-max ">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-transparent rounded-none ">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className=" h-12 font-medium text-[14px] bg-[#F3F4F6] min-w-[120px]
                  border-b border-l border-[#D2D6DB] text-center px-7! text-nowrap text-[#384250]"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="w-full ">
          {isLoading ? (
            <TableSkeleton columnsLength={columns.length} />
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-[#F3F4F6] transition-all duration-300  
                bg-white even:bg-[#F8F8F8] 
                text-center text-[16px] text-[#161616]
                border-b  border-[#D2D6DB] last:border-b-0 "
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="text-center px-7 py-3.5"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-16 text-center">
                No results.
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </motion.div >
  );
}
