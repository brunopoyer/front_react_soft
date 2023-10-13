import {useEffect, useState} from "react";
import { Wine as CreateWine } from "./Wine";
import {api} from "./api.ts";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";


class Wine {
    id: number;
    name: string;
    type: string;
    weight: number;
    price: number;
    constructor(id: number, name: string, type: string, weight: number, price: number) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.weight = weight;
        this.price = price;
    }
}

export function Wines() {
    const [showModal, setShowModal] = useState(false);

    const [wines, setWines] = useState<Wine[]>([]);

    const MySwal = withReactContent(Swal);

    useEffect(() => {
        loadWines();
    }, []);

    const handleDelete = (itemId: number) => {
        // Faça a solicitação para o seu endpoint de exclusão
        api.deleteWine(itemId).then((response) => {
            MySwal.fire({
                title: <strong>Sucesso!</strong>,
                html: <i>{response.message}</i>,
                icon: 'success'
            })
            // Atualize a lista de itens
            loadWines();
        }).catch((error) => {
            MySwal.fire({
                title: <strong>Ooops!</strong>,
                html: <i>{error.response.data?.message}</i>,
                icon: 'error'
            })
        });
    };

    const loadWines = async () => {
        const response = await api.getAllWines();
        setWines(response.data);
    }

    const closeWineModal = () => {
        setShowModal(false);
        loadWines();
    };
    return (
        <div>
            {
                showModal ? (
                    // pass the setShowModal function to the child component
                    <CreateWine closeModal={closeWineModal} />
                ) :
                    <>
                        <div className="flex justify-end mt-4 mr-4">
                            <button className="bg-cyan-400 rounded px-2 py-3 text-white" onClick={() => setShowModal(true)}>
                                Add Wine
                            </button>
                        </div>
                        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                <div className="overflow-hidden">
                                    <table className="min-w-full text-left text-sm font-light">
                                        <thead className="border-b font-medium dark:border-neutral-500">
                                        <tr>
                                            <th scope="col" className="px-6 py-4">#</th>
                                            <th scope="col" className="px-6 py-4">Nome</th>
                                            <th scope="col" className="px-6 py-4">Tipo</th>
                                            <th scope="col" className="px-6 py-4">Peso</th>
                                            <th scope="col" className="px-6 py-4">Preço</th>
                                            <th scope="col" className="px-6 py-4">Ações</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            wines.map((wine, index) => (
                                                <tr className="border-b dark:border-neutral-500" key={index}>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{wine.name}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{wine.type}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{wine.weight} KG</td>
                                                    <td className="whitespace-nowrap px-6 py-4">R$ {wine.price}</td>
                                                    <td className="px-6 py-4">
                                                        <a
                                                            href="#"
                                                            className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                                            onClick={() => handleDelete(wine.id)}
                                                        >
                                                            Delete
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </div>
    )
}
