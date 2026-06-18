'use client'

import { QuantitySelector } from "@/components";
import { useCartStore } from "@/store"
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {
    const [loaded, setLoaded] = useState(false);
    const productsInCart = useCartStore(state => state.cart);
    const updateProductQuantity = useCartStore(state => state.updateProductQuantity);
    const removeProductCart = useCartStore(state => state.removeProductCart);    

    useEffect(() => {
        setLoaded(true);
    }, [])

    useEffect(() => {
        if (productsInCart.length === 0) {
            redirect('/empty');
        }
    }, [productsInCart])

    if (!loaded) {
        return <p>Loading...</p>
    }        
    
    return (
        <>
            {
                productsInCart.map((product) => (
                    <div key={`${product.slug}-${product.size}`} className="flex mb-5">
                        <Image
                            src={`/products/${product.image}`}
                            alt={product.title}
                            width={100}
                            height={100}
                            style={{
                                width: '100px',
                                height: '100px'
                            }}
                            className="mr-5 rounded"
                        />

                        <div>
                            <Link href={`/product/${product.slug}`} className="hover:underline cursor-pointer">
                                {product.title} Talla: <strong className="text-blue-400">{product.size}</strong>
                            </Link>
                            <p>${product.price}</p>
                            <QuantitySelector quantity={product.quantity} onQuantityChanged={(quantity) => updateProductQuantity(product, quantity)} />

                            <button className="underline mt-3" onClick={() => removeProductCart(product)}>
                                Remover
                            </button>
                        </div>
                    </div>
                ))
            }
        </>
    )
}
