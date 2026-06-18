'use client'
import { QuantitySelector, SizeSelector } from "@/components";
import { Product, Size } from "@/interfaces";
import { useState } from "react";

interface Props {
    product: Product
}

export default function AddToCart({ product }: Props) {
    
    const [size, setSize] = useState<Size | undefined>();
    const [quantity, setQuantity] = useState<number>(1);
    const [posted, setPosted] = useState(false)

    const addToCart = () => {
        setPosted(true);
        if (size) return;

        console.log({ size, quantity });
    }

  return (
      <>          
        {
            posted && !size && (
                <span className="mt-2 text-red-500 fade-in">
                    Debe de seleccionar una talla*     
                </span>                  
            )
        }
        {/* Selector de tallas */}
        <SizeSelector selectedSize={size} availableSizes={product.sizes} onSizeChanged={(size) => setSize(size)}/>

        {/* selector de cantidad */}
        <QuantitySelector quantity={quantity} onQuantityChanged={(quantity) => setQuantity(quantity)} />

        {/* Button */}
          <button className="btn-primary my-5" onClick={addToCart}>              
          Agregar al carrito
        </button>
      </>
  )
}
