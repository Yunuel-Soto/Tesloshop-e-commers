'use server'

import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma";

interface PaginationOptions {
    page?: number;
    take?: number;
    search?: string;
}

export const getPaginatedOrders = async ({search = '', page = 1, take = 10,} : PaginationOptions) => {
    const session = await auth();

    if (!session?.user || session.user.role !== 'admin') {
        return {
            ok: false,
            message: 'Debe de estar autenticado'
        }
    }

    const isPaidCondition = search.toLowerCase() == 'pagada' ? true : (search.toLowerCase() == 'no pagada' ? false : null);

    const orders = await prisma.order.findMany({
        take: take,
        skip: (page - 1) * take,
        where: {
            OR: [
                {
                    id: {
                        contains: search,
                        mode: 'insensitive'
                    },
                },
                {
                    orderAddresses: {
                        firstName: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                },
                {
                    orderAddresses: {
                        lastName: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                },
                ...(isPaidCondition !== null ? [{ isPaid: isPaidCondition }] : [])
            ]
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            orderAddresses: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
    });

    const totalCount = await prisma.order.count();
    const totalPages = Math.ceil(totalCount / take);

    return {
        ok: true,
        orders: orders,
        totalPage: totalPages
    }
}