import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '../../../types/data'; // Assuming types file is in src/types/data.ts

// The handler is typed using the Next.js API types
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Get ID from query and ensure it's a single string/number for file processing
  const { id: queryId } = req.query;
  const id = Array.isArray(queryId) ? queryId[0] : queryId;
  const productId = parseInt(id as string);

  // 2. Define file path and read data
  const filePath = path.join(process.cwd(), 'data', 'products.json');
  
  // Explicitly read the file data as Buffer
  const jsonData = fs.readFileSync(filePath); 
  
  // Explicitly convert Buffer to string before parsing, and assume it contains Product[]
  let products: Product[] = JSON.parse(jsonData.toString());

  // Check if ID is valid before proceeding
  if (isNaN(productId)) {
    return res.status(400).json({ message: 'Invalid Product ID' });
  }

  // --- GET (Read single product) ---
  if (req.method === 'GET') {
    const product = products.find((p) => p.id === productId);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  
  // --- PUT (Update product) ---
  } else if (req.method === 'PUT') {
    const index = products.findIndex((p) => p.id === productId);
    
    if (index !== -1) {
      // Ensure the incoming body matches the Product type structure
      const updatedProductData: Partial<Product> = req.body;
      
      // Merge existing product with new data, ensuring ID remains a number
      products[index] = { 
        ...products[index], 
        ...updatedProductData, 
        id: productId 
      } as Product; 

      fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
      res.status(200).json(products[index]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  
  // --- DELETE (Remove product) ---
  } else if (req.method === 'DELETE') {
    const index = products.findIndex((p) => p.id === productId);

    if (index !== -1) {
      products.splice(index, 1);
      fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
      res.status(204).end(); // 204 No Content for successful deletion
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  
  // --- Method Not Allowed ---
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}