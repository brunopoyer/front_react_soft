import {wineTypes} from "../data/wineTypes.ts";
import {WineType} from "../types/wineType.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {api} from "./api.ts";
import {Wine as WineData} from "../types/wine.ts";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

type Inputs = {
    name: string,
    type: string,
    weight: number,
    price: number
}

export function Wine({ closeModal }: { closeModal: () => void }) {
    const typeList = wineTypes.map((wineType: WineType) => (
        <option key={wineType.nome} value={wineType.nome}>{wineType.nome}</option>
    ));

    const MySwal = withReactContent(Swal);

    const { handleSubmit, register, formState: { errors } } = useForm<Inputs>();

    const handleFormSubmit: SubmitHandler<Inputs> = (data) => {
        const winex: WineData = {
            name: data.name,
            type: data.type,
            weight: data.weight,
            price: data.price
        }
        api.createWine(winex).then((response) => {
            MySwal.fire({
                title: <strong>Sucesso!</strong>,
                html: <i>{response.message}</i>,
                icon: 'success'
            })
            closeModal();
        }).catch((error) => {
            MySwal.fire({
                title: <strong>Ooops!</strong>,
                html: <i>{error.response.data?.message}</i>,
                icon: 'error'
            })
        });
    }

    return (
        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Vinhos</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Adicione um novo vinho
                        </p>
                        <hr/>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="name" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Nome do vinho
                                </label>
                                <div className="mt-2">
                                        <input
                                            type="text"
                                            id="name"
                                            {...register("name", { required: true }) }
                                            autoComplete="name"
                                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            placeholder="Bordon"
                                        />
                                </div>
                                {
                                    errors.name && <span className="text-red-500">Campo obrigatório</span>
                                }
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="type" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Tipo do Vinho
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="type"
                                        {...register("type", { required: true }) }
                                        autoComplete="type"
                                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    >
                                        <option value="">Selecione</option>
                                        {typeList}
                                    </select>
                                </div>
                                { errors.type && <span className="text-red-500">Campo obrigatório</span> }
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="type" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Peso do Vinho em Kg
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        {...register("weight", { required: true }) }
                                        id="weight"
                                        autoComplete="weight"
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        placeholder="0 kg"
                                    />
                                </div>
                                { errors.weight && <span className="text-red-500">Campo obrigatório</span> }
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="type" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Preço
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        {...register("price", { required: true }) }
                                        min="1"
                                        autoComplete="price"
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        placeholder="R$ 0,00"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={closeModal}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    )
}
