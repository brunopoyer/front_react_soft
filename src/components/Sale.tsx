import {useEffect, useState} from "react";
import {Wine} from "../types/wine.ts";
import {api} from "./api.ts";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";

export function Sale() {
    const [wines, setWines] = useState<Wine[]>([]);
    const [cart, setCart] = useState<{ wine: Wine; quantity: number }[]>([]);
    const [deliveryDistance, setDeliveryDistance] = useState<number>(1); // Estado para armazenar a distância de entrega
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();

    useEffect(() => {
        loadWines();
    }, []);

    const calculateTotalCost = () => {
        return cart.reduce((total, cartItem) => {
            const itemCost = cartItem.wine.price * cartItem.quantity;
            return total + itemCost;
        }, 0);
    };

    const handleCheckout = () => {
        // Monta o objeto com os dados a serem enviados ao backend
        const orderData = {
            items: cart,
            distance: deliveryDistance,
        };

        // Realiza a solicitação ao backend usando a função Axios
        api.createSale(orderData)
            .then((response) => {
                MySwal.fire({
                    title: <strong>Sucesso!</strong>,
                    html: <i>{response.message}</i>,
                    icon: 'success'
                })
                navigate('/');
            })
            .catch((error) => {
                MySwal.fire({
                    title: <strong>Ooops!</strong>,
                    html: <i>{error.response.data?.message}</i>,
                    icon: 'error'
                })
            });
    };

    const addToCart = (wine: Wine, quantity: number) => {
        const existingCartItem = cart.find((item) => item.wine === wine);

        if (existingCartItem) {
            // Se o item já está no carrinho, atualize a quantidade
            const updatedCart = cart.map((item) => {
                if (item.wine === wine) {
                    return { wine: wine, quantity: item.quantity + quantity };
                }
                return item;
            });
            setCart(updatedCart);
        } else {
            // Caso contrário, adicione o item ao carrinho
            setCart([...cart, { wine: wine, quantity: quantity }]);
        }
    };

    const removeFromCart = (wine: Wine) => {
        const updatedCart = cart.filter((item) => item.wine !== wine);
        setCart(updatedCart);
    };



    const loadWines = async () => {
        const response = await api.getAllWines();
        setWines(response.data);
    }

    return (
        <>
            <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 gap-5">
                {wines.map((wine: Wine, index) => (
                <div className="rounded overflow-hidden shadow-lg" key={index}>
                        <div className="px-6 py-4">
                            <div className="font-bold text-xl mb-2">{wine.name}</div>
                            <p className="text-gray-700 text-base">
                                {wine.type}
                            </p>
                            <small className="italic text-sm">{wine.weight} Kg</small>
                            <div className="mt-4 flex items-center">
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <input type="number"
                                               id={`quantity-input-${index}`}
                                               className="w-12 h-10 text-center outline-none border text-gray-700 focus:outline-none hover:text-black focus:text-black"
                                        min="1"/>
                                    </div>
                                    <span className="pt-2 font-bold">R$ {wine.price}</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 pt-4 pb-2">
                            <button className="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full"
                                    onClick={() => {
                                        const quantityInput = document.getElementById(`quantity-input-${index}`) as HTMLInputElement;
                                        const quantity = parseInt(quantityInput.value, 10);
                                        if (quantity > 0) {
                                            addToCart(wine, quantity);
                                        }
                                    }}
                            >
                                Adicionar ao carrinho</button>
                        </div>
                </div>
                ))}
            </div>
            <div className="mx-auto mt-10">
                <div className="flex shadow-md my-10">
                    <div className="w-3/4 bg-white px-10 py-10">
                        <div className="flex justify-between border-b pb-8">
                            <h1 className="font-semibold text-2xl">Carrinho de compra</h1>
                            <h2 className="font-semibold text-2xl">{cart.reduce((total, cartItem) => total + cartItem.quantity, 0)} Item(s)</h2>
                        </div>
                        <div className="flex mt-10 mb-5">
                            <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">Detalhes do Produto</h3>
                            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center">Quantidade</h3>
                            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center">Preço Unitário</h3>
                            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center">Total</h3>
                        </div>
                        {cart.map((cartItem, index) => (
                            <div key={index} className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5">
                                <div className="flex w-2/5">
                                    <div className="flex flex-col justify-between ml-4 flex-grow">
                                        <span className="font-bold text-sm">{cartItem.wine.name}</span>
                                        <span className="text-red-500 text-xs">{cartItem.wine.type}</span>
                                        <a
                                            href="#"
                                            className="font-semibold hover:text-red-500 text-gray-500 text-xs"
                                            onClick={() => removeFromCart(cartItem.wine)}
                                        >
                                            Remover
                                        </a>
                                    </div>
                                </div>
                                <div className="flex justify-center w-1/5">
                                    <input
                                        className="mx-2 border text-center w-8"
                                        type="number"
                                        min="1"
                                        value={cartItem.quantity} // Exibe a quantidade do item
                                        onChange={(e) => {
                                            const newQuantity = parseInt(e.target.value, 10);
                                            const updatedCart = cart.map((item) => {
                                                if (item.wine === cartItem.wine) {
                                                    return { ...item, quantity: newQuantity };
                                                }
                                                return item;
                                            });
                                            setCart(updatedCart);
                                        }}
                                    />
                                </div>
                                <span className="text-center w-1/5 font-semibold text-sm">R$ {cartItem.wine.price.toFixed(2)}</span>
                                <span className="text-center w-1/5 font-semibold text-sm">
                                  R$ {(cartItem.quantity * cartItem.wine.price).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div id="summary" className="w-1/4 px-8 py-10">
                        <h1 className="font-semibold text-2xl border-b pb-8">Resumo do Pedido</h1>
                        <div className="py-10">
                            <label htmlFor="promo" className="font-semibold inline-block mb-3 text-sm uppercase">Distância da entrega</label>
                            <input
                                type="number"
                                min="1"
                                id="delivery-distance"
                                placeholder="Digite a distância da entrega em KM"
                                className="p-2 text-sm w-full"
                                value={deliveryDistance}
                                onChange={(e) => setDeliveryDistance(parseInt(e.target.value, 10) || 1)}
                            />
                        </div>
                        <div className="border-t mt-8">
                            <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                                <span>Custo total</span>
                                <span>R$ {calculateTotalCost().toFixed(2)}</span>
                            </div>
                            <button className="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full"
                                    onClick={handleCheckout}>Finalizar a venda</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
