import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { Stock } from '../../../types/data';

// Local interface needed because the original logic assumes a simple numeric 'id' field
interface StockWithId extends Stock {
    id: number;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const filePath = path.join(process.cwd(), 'data', 'stock.json');
    
    const jsonData = fs.readFileSync(filePath);
    let stock: StockWithId[] = [];

    try {
        stock = JSON.parse(jsonData.toString()) as StockWithId[];
    } catch (error) {
        return res.status(500).json({ message: 'Error loading stock data' });
    }

    if (req.method === 'GET') {
        res.status(200).json(stock);
    } else if (req.method === 'POST') {
        const newStock: Omit<StockWithId, 'id'> = req.body;
        
        const nextId = stock.length ? Math.max(...stock.map(s => s.id)) + 1 : 1;
        
        const createdStock: StockWithId = { 
            ...newStock as StockWithId,
            id: nextId
        };
        
        stock.push(createdStock);
        
        fs.writeFileSync(filePath, JSON.stringify(stock, null, 2));
        res.status(201).json(createdStock);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}