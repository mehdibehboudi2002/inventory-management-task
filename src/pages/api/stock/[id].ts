import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { Stock } from '../../../types/data';

interface StockWithId extends Stock {
    id: number;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id: queryId } = req.query;
    const idString = Array.isArray(queryId) ? queryId[0] : (queryId || '');
    const stockId = parseInt(idString as string);

    if (isNaN(stockId)) {
        return res.status(400).json({ message: 'Invalid Stock ID' });
    }

    const filePath = path.join(process.cwd(), 'data', 'stock.json');
    
    const jsonData = fs.readFileSync(filePath);
    let stock: StockWithId[] = [];

    try {
        // Casting the parsed array to StockWithId[] to satisfy the original logic
        stock = JSON.parse(jsonData.toString()) as StockWithId[];
    } catch (error) {
        return res.status(500).json({ message: 'Error loading stock data' });
    }

    // --- GET (Read single stock item) ---
    if (req.method === 'GET') {
        const stockItem = stock.find((s) => s.id === stockId);
        if (stockItem) {
            res.status(200).json(stockItem);
        } else {
            res.status(404).json({ message: 'Stock item not found' });
        }
    
    // --- PUT (Update stock item) ---
    } else if (req.method === 'PUT') {
        const index = stock.findIndex((s) => s.id === stockId);
        if (index !== -1) {
            const updatedData: Partial<StockWithId> = req.body;

            // Merge existing stock data with request body
            stock[index] = { 
                ...stock[index], 
                ...updatedData, 
                id: stockId 
            } as StockWithId;
            
            fs.writeFileSync(filePath, JSON.stringify(stock, null, 2));
            res.status(200).json(stock[index]);
        } else {
            res.status(404).json({ message: 'Stock item not found' });
        }

    // --- DELETE (Remove stock item) ---
    } else if (req.method === 'DELETE') {
        const index = stock.findIndex((s) => s.id === stockId);
        if (index !== -1) {
            stock.splice(index, 1);
            fs.writeFileSync(filePath, JSON.stringify(stock, null, 2));
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'Stock item not found' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}