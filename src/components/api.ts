import axios from "axios";
import {Wine} from "../types/wine.ts";

const BASE = 'http://127.0.0.1:8080/api/';

export const api = {
    getAllWines: async () => {
        const response = await axios.get(BASE + 'wines');
        return response.data;
    },
    createWine: async (wine: Wine) => {
        const response = await axios.post(BASE + 'wines', wine);
        return response.data;
    },
    createSale: async (wine: any) => {
        const response = await axios.post(BASE + 'sales', wine);
        return response.data;
    },
    getAllSales: async () => {
        const response = await axios.get(BASE + 'sales');
        return response.data;
    },
    deleteWine: async (id: number) => {
        const response = await axios.delete(BASE + 'wines/' + id);
        return response.data;
    },
    deleteSale: async (id: number) => {
        const response = await axios.delete(BASE + 'sales/' + id);
        return response.data;
    }
}
