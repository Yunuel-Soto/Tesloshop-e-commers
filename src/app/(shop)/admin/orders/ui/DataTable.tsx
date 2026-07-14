'use client'
import { getPaginatedOrders } from '@/actions'
import { Order } from '@/generated/prisma/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { IoCardOutline, IoSearch } from 'react-icons/io5'

interface Props {
    orders: Order[],
    page?: number;
}

const DataTable = ({ orders, page }: Props) => {

    const [ordersI, setOrdersI] = useState(orders);

    const search = async (searchI: string) => {
        const { ok, orders = [] } = await getPaginatedOrders({
            search: searchI,
            page: page,
            take: 5
        });

        setOrdersI(orders);
    }

    useEffect(() => {
        setOrdersI(orders);
    }, [orders])

    return (
        <>
            {/* Sacar este componente para que las ordenes vengan de un solo lugar */}
            <div className='mb-5 flex justify-end'>
                <div className='w-70 relative'>
                    <input onChange={(e) => search(e.target.value)} className='pl-8 border border-gray-500 w-full h-9 rounded' type="text" placeholder='Buscar orden' />
                    <IoSearch className='text-gray-400 absolute top-2 left-2' size={20} />
                </div>
            </div>
            <div className="mb-10">
                <table className="min-w-full">
                    <thead className="bg-gray-200 border-b">
                        <tr>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                #ID
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                Nombre completo
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                Estado
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                Opciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            ordersI.map(order => (
                                <tr key={order.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id.split('-').at(0)}</td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                        {(order as any).orderAddresses?.firstName} {(order as any).orderAddresses?.lastName}
                                    </td>
                                    <td className="flex items-center text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                        {
                                            order.isPaid
                                                ? (
                                                    <>
                                                        <IoCardOutline className="text-green-800" />
                                                        <span className='mx-2 text-green-800'>Pagada</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <IoCardOutline className="text-red-800" />
                                                        <span className='mx-2 text-red-800'>No Pagada</span>
                                                    </>
                                                )
                                        }

                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 ">
                                        <Link href={`/orders/${order.id}`} className="hover:underline">
                                            Ver orden
                                        </Link>
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