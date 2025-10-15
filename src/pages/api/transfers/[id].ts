import type { NextApiRequest, NextApiResponse } from "next";
import { loadData, writeData, TRANSFERS_FILE } from "@/lib/dataHandler";
import { Transfer } from "@/types/inventory";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Transfer | { message: string }>
) {
  const { id } = req.query;

  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const transfers = loadData(TRANSFERS_FILE) as Transfer[];
    const transferIndex = transfers.findIndex(
      (t) => String(t.id) === String(id)
    );

    if (transferIndex === -1) {
      return res.status(404).json({ message: "Transfer not found" });
    }

    transfers.splice(transferIndex, 1);
    writeData(TRANSFERS_FILE, transfers);

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting transfer:", error);
    res.status(500).json({ message: "Failed to delete transfer" });
  }
}
