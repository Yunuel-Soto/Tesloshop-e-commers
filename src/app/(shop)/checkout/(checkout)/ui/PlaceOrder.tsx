'use client'

import { placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { ok } from "assert";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { useShallow } from "zustand/shallow";

const PlaceOrder = () => {
    const router = useRouter();

    const [loaded, setLoaded] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const address = useAddressStore(state => state.address);

    const { subTotal, tax, total, itemsInCart } = useCartStore(useShallow(state => state.getSummaryInformation()));    
    const cart = useCartStore(state => state.cart);
    const clearCart = useCartStore(state => state.clearCart);

    useEffect(() => {
        setLoaded(true)
    }, []);


    const onPlaceOrder = async() => {
        setIsPlacingOrder(true);

        const productsInOrder = cart.map(product => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size
        }));

        const res = await placeOrder(productsInOrder, address);

        if (!res.ok) {
            setIsPlacingOrder(false);
            setErrorMessage(res.message);
            return;
        }
        
        setIsPlacingOrder(false);
        clearCart();
        router.replace('/orders/' + res.order);
    }


    if (!loaded) {
        return <p>Cargando...</p>
    }

    return (
        <div className="bg-white rounded-xl shadow-xl p-7 h-fit">

            <h2 className="text-2xl font-bold mb-2">Direccio de entrega</h2>
            <div className="mb-10">
                <p className="text-xl">{address.firstName} { address.lastName}</p>
                <p>{address.address}</p>
                <p>{address.addres2}</p>
                <p>{address.postalCode}</p>
                <p>{address.city}, {address.country}</p>
                <p>{address.phone}</p>
            </div>

            {/* divider */}

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

            <h2 className="text-2xl font-bold mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
                <span>No. Productos</span>
                <span className="text-right">{itemsInCart === 1 ? '1 arcitulo' : `${itemsInCart} articulos`}</span>
                
                <span>Subtotal</span>
                <span className="text-right">{currencyFormat(subTotal)}</span>
    
                <span>Impuestos (15%)</span>
                <span className="text-right">{currencyFormat(tax)}</span>
    
                <span className="mt-5 text-2xl">Total</span>
                <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
            </div>

            <div className="mt-5 mb-2 w-full">

                <p className="mb-5">
                    <span className="text-xs">
                        Al hacer clic en "Colocar orden", aceptas nuestros <a href="#" className="underline">terminos y condiciones de uso</a>
                    </span>
                </p>

                <p className="text-red-500">{errorMessage}</p>

                <button
                    className={
                        clsx({
                            'btn-primary': !isPlacingOrder,
                            'btn-disabled': isPlacingOrder
                        })
                    }
                    // href={'/orders/123'}
                    disabled={isPlacingOrder}
                    onClick={() => onPlaceOrder()}
                >
                    Colocar orden
                </button>
            </div>
        </div>
    )
}

export default PlaceOrder