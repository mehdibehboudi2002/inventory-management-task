import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { Warehouse } from '../../../types/data';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id: queryId } = req.query;
    const idString = Array.isArray(queryId) ? queryId[0] : (queryId || '');
    const warehouseId = parseInt(idString);

    if (isNaN(warehouseId)) {
        return res.status(400).json({ message: 'Invalid Warehouse ID' });
    }

    const filePath = path.join(process.cwd(), 'data', 'warehouses.json');
    
    const jsonData = fs.readFileSync(filePath);
    let warehouses: Warehouse[] = [];

    try {
        warehouses = JSON.parse(jsonData.toString()) as Warehouse[];
    } catch (error) {
        return res.status(500).json({ message: 'Error loading data' });
    }

    // --- GET (Read single warehouse) ---
    if (req.method === 'GET') {
        const warehouse = warehouses.find((w) => w.id === warehouseId);
        if (warehouse) {
            res.status(200).json(warehouse);
        } else {
            res.status(404).json({ message: 'Warehouse not found' });
        }
    
    // --- PUT (Update warehouse) ---
    } else if (req.method === 'PUT') {
        const index = warehouses.findIndex((w) => w.id === warehouseId);
        if (index !== -1) {
            const updatedData: Partial<Warehouse> = req.body;
            
            warehouses[index] = { 
                ...warehouses[index], 
                ...updatedData, 
                id: warehouseId 
            } as Warehouse;

            fs.writeFileSync(filePath, JSON.stringify(warehouses, null, 2));
            res.status(200).json(warehouses[index]);
        } else {
            res.status(404).json({ message: 'Warehouse not found' });
        }

    // --- DELETE (Remove warehouse) ---
    } else if (req.method === 'DELETE') {
        const index = warehouses.findIndex((w) => w.id === warehouseId);
        if (index !== -1) {
            warehouses.splice(index, 1);
            fs.writeFileSync(filePath, JSON.stringify(warehouses, null, 2));
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'Warehouse not found' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}