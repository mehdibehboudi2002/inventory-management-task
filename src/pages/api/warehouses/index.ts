import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { Warehouse } from "../../../types/data";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), "src", "data", "warehouses.json");

  const jsonData = fs.readFileSync(filePath);
  let warehouses: Warehouse[] = [];

  try {
    warehouses = JSON.parse(jsonData.toString()) as Warehouse[];
  } catch (error) {
    return res.status(500).json({ message: "Error loading data" });
  }

  if (req.method === "GET") {
    res.status(200).json(warehouses);
  } else if (req.method === "POST") {
    // Type the new warehouse object from the request body
    const newWarehouse: Omit<Warehouse, "id"> = req.body;

    const nextId = warehouses.length
      ? Math.max(...warehouses.map((w) => w.id)) + 1
      : 1;

    // Create the final warehouse object
    const createdWarehouse: Warehouse = {
      ...(newWarehouse as Warehouse),
      id: nextId,
    };

    warehouses.push(createdWarehouse);

    fs.writeFileSync(filePath, JSON.stringify(warehouses, null, 2));
    res.status(201).json(createdWarehouse);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
