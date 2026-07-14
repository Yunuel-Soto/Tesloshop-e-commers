import { Pagination, Title } from '@/components';
import { redirect } from 'next/navigation';
import { getPaginatedOrders, getPaginatedProductsWithImages } from '@/actions';
import DataTable from './ui/DataTable';
import Link from 'next/link';
import { Product } from '../../../../generated/prisma/browser';

interface Props {
    searchParams: {
        page?: string
    }
}

export default async function ({ searchParams } : Props) {    
    const pagePromise = await searchParams;
    
    const page = pagePromise.page ? parseInt(pagePromise.page) : 1;

    const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({
        page
    });   
    
    return (
        <>
            <Title title="Mantenimiento de productos" />
            <div className='flex justify-end mb-5'>
                <Link href={'/admin/product/new'} className='btn-primary'>
                    Nuevo Producto
                </Link>
            </div>
            <DataTable products={products} page={page} />
            <Pagination totalPages={totalPages!}/>
        </>
    );
}