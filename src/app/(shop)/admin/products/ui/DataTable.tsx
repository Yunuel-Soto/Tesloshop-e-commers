'use client'
import { Product } from '@/interfaces';
import { currencyFormat } from '@/utils';
import Image from 'next/image'
import Link from 'next/link';
import { useEffect, useState } from 'react'
import { IoSearch } from 'react-icons/io5'

interface Props {
    products: Product[],
    page?: number;
}

const DataTable = ({ products, page }: Props) => {

    const [productsI, setProductsI] = useState(products);

    const search = async (searchI: string) => {
        // const { ok, orders = [] } = await getPaginatedOrders({
        //     search: searchI,
        //     page: page,
        //     take: 5
        // });

        // setProductsI(products);
    }

    useEffect(() => {
        setProductsI(products);
    }, [products])

    return (
        <>
            {/* Sacar este componente para que las ordenes vengan de un solo lugar */}
            <div className='mb-5 flex justify-end'>
                <div className='w-70 relative'>
                    <input onChange={(e) => search(e.target.value)} className='pl-8 border border-gray-500 w-full h-9 rounded' type="text" placeholder='Buscar producto' />
                    <IoSearch className='text-gray-400 absolute top-2 left-2' size={20} />
                </div>
            </div>
            <div className="mb-10">
                <table className="min-w-full">
                    <thead className="bg-gray-200 border-b">
                        <tr>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                Imagen
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                Titulo
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                Precio
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                Genero
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                Inventario
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                Tallas
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            productsI.map(product => (
                                <tr key={product.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <Link href={`/product/${product.slug}`}>
                                            <Image
                                                alt={product.title}
                                                src={`/products/${product.images[0]}`}
                                                width={80}
                                                height={80}
                                                className='w-20 h-20 object-cover rounded'
                                            />
                                        </Link>
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                        <Link href={`/admin/product/${product.slug}`} className='hover:underline'>
                                            {product.title}
                                        </Link>
                                    </td>
                                    <td className="text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap">
                                        {currencyFormat(product.price)}
                                    </td>
                                    <td className="text-sm font-light text-gray-900 px-6 py-4 whitespace-nowrap">
                                        {product.gender}
                                    </td>  
                                    <td className="text-sm font-light text-gray-900 px-6 py-4 whitespace-nowrap">
                                        {product.inStock}
                                    </td>     
                                    <td className="text-sm font-light text-gray-900 px-6 py-4 whitespace-nowrap">
                                        {product.sizes.join(', ')}
                                    </td>   
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default DataTable