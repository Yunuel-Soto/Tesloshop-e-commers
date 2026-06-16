'use client'

import { getSotckBySlug } from "@/actions/products/get-sotck-by-slug"
import { titleFont } from "@/config/fonts"
import { useEffect, useState } from "react"

interface Props {
  slug: string
}

export const StockLabel = ({ slug }: Props) => {
  const [stock, setStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getStock(slug);
  }, [])

  const getStock = async (slug: string) => {
    const inStock = await getSotckBySlug(slug);
    setStock(inStock);
    setIsLoading(false);
  }

  return (
    <>
      {
        isLoading ? (
          <h1 className={`${titleFont.className} antialiased font-bold text-xl animate-pulse bg-gray-200`}>
            &nbsp;
          </h1>
        ) : (
            <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
            Stock: {stock}
          </h1>
        )
      }            
    </>
  )
}
