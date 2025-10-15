import { NextApiRequest, NextApiResponse } from "next";
import { loadData, saveData } from "@/lib/dataUtils";
import { Alert } from "@/types/inventory";
import path from "path";

const ALERTS_FILE = path.join(process.cwd(), "data", "alerts.json");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    try {
      const { id, status, notes } = req.body;

      if (!id || !status) {
        return res.status(400).json({ error: "Missing required fields: id, status" });
      }

      const alerts: Alert[] = loadData(ALERTS_FILE);
      const alertIndex = alerts.findIndex((a) => a.id === id);

      if (alertIndex === -1) {
        return res.status(404).json({ error: "Alert not found" });
      }

      // Update alert
      alerts[alertIndex] = {
        ...alerts[alertIndex],
        status,
        notes: notes || alerts[alertIndex].notes,
        acknowledgedAt:
          status === "Acknowledged"
            ? new Date().toISOString()
            : alerts[alertIndex].acknowledgedAt,
        resolvedAt:
          status === "Resolved"
            ? new Date().toISOString()
            : alerts[alertIndex].resolvedAt,
      };

      saveData(ALERTS_FILE, alerts);

      res.status(200).json(alerts[alertIndex]);
    } catch (error) {
      console.error("Error updating alert:", error);
      res.status(500).json({ error: "Failed to update alert" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}