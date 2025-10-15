import type { NextApiRequest, NextApiResponse } from "next";
import { loadData, TRANSFERS_FILE } from "@/lib/dataHandler";
import { Transfer } from "@/types/inventory";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Transfer[] | { message: string }>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Load all transfer data
    const transfers = loadData(TRANSFERS_FILE) as Transfer[];

    // Sort by timestamp descending
    transfers.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    res.status(200).json(transfers);
  } catch (error) {
    console.error("Error fetching transfers:", error);
    res
      .status(500)
      .json({
        message: "A server error occurred while retrieving transfer history.",
      });
  }
}
