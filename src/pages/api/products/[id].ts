import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { Product } from "../../../types/data";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: queryId } = req.query;
  const id = Array.isArray(queryId) ? queryId[0] : queryId;
  const productId = parseInt(id as string);

  const filePath = path.join(process.cwd(), "src", "data", "products.json");

  const jsonData = fs.readFileSync(filePath);

  let products: Product[] = JSON.parse(jsonData.toString());

  // Check if ID is valid before proceeding
  if (isNaN(productId)) {
    return res.status(400).json({ message: "Invalid Product ID" });
  }

  // GET
  if (req.method === "GET") {
    const product = products.find((p) => p.id === productId);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }

    // PUT
  } else if (req.method === "PUT") {
    const index = products.findIndex((p) => p.id === productId);

    if (index !== -1) {
      // Ensure the incoming body matches the Product type structure
      const updatedProductData: Partial<Product> = req.body;

      // Merge existing product with new data, ensuring ID remains a number
      products[index] = {
        ...products[index],
        ...updatedProductData,
        id: productId,
      } as Product;

      fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
      res.status(200).json(products[index]);
    } else {
      res.status(404).json({ message: "Product not found" });
    }

    // DELETE
  } else if (req.method === "DELETE") {
    const index = products.findIndex((p) => p.id === productId);

    if (index !== -1) {
      products.splice(index, 1);
      fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
      res.status(204).end(); 
    } else {
      res.status(404).json({ message: "Product not found" });
    }

  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
