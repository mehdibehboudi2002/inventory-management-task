import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '../../../types/data';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), 'data', 'products.json');
  
  const jsonData = fs.readFileSync(filePath);
  let products: Product[] = [];

  try {
    products = JSON.parse(jsonData.toString());
  } catch (error) {
    return res.status(500).json({ message: 'Error loading data' });
  }

  if (req.method === 'GET') {
    res.status(200).json(products);
  } else if (req.method === 'POST') {
    // Type the new product object from the request body
    const newProduct: Omit<Product, 'id'> = req.body;
    
    // Determine the next ID: use max existing ID + 1, or start at 1 if empty
    const nextId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    // Create the final, type-safe product object
    const createdProduct: Product = { 
      ...newProduct as Product, // Cast body to Product shape
      id: nextId 
    };
    
    products.push(createdProduct);
    
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    res.status(201).json(createdProduct);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
