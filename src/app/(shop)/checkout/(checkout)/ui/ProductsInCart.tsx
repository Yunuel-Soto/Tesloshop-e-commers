'use client'

import { useCartStore } from "@/store"
import { currencyFormat } from "@/utils";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {
    const [loaded, setLoaded] = useState(false);
    const productsInCart = useCartStore(state => state.cart);
    const router = useRouter();   
    
    useEffect(() => {
        setLoaded(true);

        if (productsInCart.length === 0) {
            router.replace('/empty');
        }
        
    }, [productsInCart, router])

    if (!loaded || productsInCart.length === 0) {
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
                            <span>
                                {product.size} - {product.title} ({product.quantity})
                            </span>

                            <p className="font-bold">{currencyFormat(product.price * product.quantity)}</p>                                                        
                        </div>
                    </div>
                ))
            }
        </>
    )
}
