// src/app/rounds/page.tsx

import React from "react";

async function getRounds(page: number = 1) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/rounds?page=${page}`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch rounds");
  return res.json();
}

export default async function RoundsPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const page = Number(searchParams?.page ?? 1);

  const data = await getRounds(page);
  const { rounds, total, limit } = data;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Plinko Rounds</h1>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-300 shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Status</th>
              <th className="p-3">Bet</th>
              <th className="p-3">Multiplier</th>
              <th className="p-3">Bin</th>
              <th className="p-3">Rows</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {rounds.map((r: any) => (
              <tr key={r.id} className="border-t hover:bg-gray-100 transition">
                <td className="p-3 text-sm">{r.id}</td>
                <td className="p-3">{r.status}</td>
                <td className="p-3">{(r.betCents / 100).toFixed(2)} ₹</td>
                <td className="p-3">{r.payoutMultiplier}x</td>
                <td className="p-3">{r.binIndex}</td>
                <td className="p-3">{r.rows}</td>
                <td className="p-3 text-sm">
                  {new Date(r.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-6">
        {page > 1 && (
          <a
            href={`/rounds?page=${page - 1}`}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Previous
          </a>
        )}

        <span className="text-lg">
          Page {page} / {totalPages}
        </span>

        {page < totalPages && (
          <a
            href={`/rounds?page=${page + 1}`}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Next
          </a>
        )}
      </div>
    </div>
  );
}
