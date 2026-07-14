import { Pagination, Title } from '@/components';
import { redirect } from 'next/navigation';
import { getPaginatedOrders } from '@/actions';
import DataTable from './ui/DataTable';

interface Props {
    searchParams: {
        page: number
    }
}

export default async function ({searchParams} : Props) {
    const { page } = await searchParams;
    
    const { ok, orders = [], totalPage } = await getPaginatedOrders({
        page: page,
        take: 5,
    });
    
    if (!ok) {
        redirect('/auth/login');
    }
    
    return (
        <>
            <Title title="Todas las ordenes" />
            {/* Aqui debe de haber un componente de search */}
            <DataTable orders={orders} page={page} />
            <Pagination totalPages={totalPage!}/>
        </>
    );
}