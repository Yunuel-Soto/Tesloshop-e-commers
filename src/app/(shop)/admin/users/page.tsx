import { Pagination, Title } from '@/components';
import { redirect } from 'next/navigation';
import { getPaginatedUsers } from '@/actions';
import UserTable from './ui/UserTable';
import { auth } from '@/auth.config';

interface Props { 
  searchParams: {
    page: number
  }
}

export default async function ({ searchParams }: Props) {
    const { page } = await searchParams;
    
    const { ok, users = [], totalPages } = await getPaginatedUsers({ page: page, take: 10 });
    const session = await auth();

    if (!session?.user || session.user.role !== 'admin') {
        redirect('/auth/login');
    }

    return (
        <>
            <Title title="Usuarios" />
            <UserTable users={users} />
            <Pagination totalPages={totalPages!}/>
        </>
    );
}