import {useEffect, useState} from "react";
import {api} from "./api.ts";
import {useNavigate} from "react-router-dom";
import { format } from "date-fns";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

interface Sale {
    id: number;
    createdAt: string;
    distance: number;
    freight: number;
    items: {
        name: string;
        quantity: number;
        unitPrice: number;
        wine: {
            name: string;
            type: string;
        }
    }[];
    total: number;
}

const Sales = () => {
    const [salesData, setSalesData] = useState<Sale[]>([]);

    const navigate = useNavigate();

    const MySwal = withReactContent(Swal);

    useEffect(() => {
        // Fazer a solicitação GET para o endpoint de vendas usando Axios
        loadSales();
    }, []);

    const loadSales = async () => {
        api.getAllSales().then((response) => {
            setSalesData(response.data);
        });
    }

    const handleDelete = (saleId: number) => {
        // Faça a solicitação para o seu endpoint de exclusão
        api.deleteSale(saleId).then((response) => {
            MySwal.fire({
                title: <strong>Sucesso!</strong>,
                html: <i>{response.message}</i>,
                icon: 'success'
            })
            // Atualize a lista de itens
            loadSales();
        }).catch((error) => {
            MySwal.fire({
                title: <strong>Ooops!</strong>,
                html: <i>{error.response.data?.message}</i>,
                icon: 'error'
            })
        });
    }

    const addSale = async () => {
        navigate("/sale");
    }

    return (
        <>
            <div className="flex justify-end mt-4 mr-4">
                <button className="bg-cyan-400 rounded px-2 py-3 text-white" onClick={() => addSale()}>
                    Nova Venda
                </button>
            </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {salesData.map((sale, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">{`Venda #${sale.id}`}</h2>
                    <p className="text-gray-700 mb-4">
                        <strong>Data:</strong> {format(new Date(sale.createdAt), "dd/MM/yyyy")}
                    </p>
                    <p className="text-gray-700 mb-4">
                        <strong>Distância:</strong> {sale.distance} km
                    </p>
                    <h3 className="text-lg font-semibold mb-2">Itens da venda:</h3>
                    <ul>
                        {sale.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="mb-2">
                                <strong>Nome do item:</strong> {item.wine.name} - {item.wine.type} <br />
                                <strong>Quantidade:</strong> {item.quantity} <br />
                                <strong>Preço Unitário:</strong> R$ {item.unitPrice.toFixed(2)} <br />
                                <strong>Total:</strong> R$ {(item.quantity * item.unitPrice).toFixed(2)}
                            </li>
                        ))}
                    </ul>
                    <p className="text-xl font-semibold mt-4">
                        <strong>Frete:</strong> R$ {sale.freight.toFixed(2)}
                    </p>
                    <p className="text-xl font-semibold mt-4">
                        <strong>Custo Total:</strong> R$ {sale.total.toFixed(2)}
                    </p>
                    <button className="bg-red-800 rounded text-white px-2 py-2 block ml-auto"
                            onClick={() => handleDelete(sale.id)}>
                        Deletar
                    </button>
                </div>
            ))}
        </div>
        </>
    );
};

export default Sales;
