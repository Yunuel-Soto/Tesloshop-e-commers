'use server'

import { auth } from "@/auth.config";
import { prisma } from "@/lib/prisma"

export const getOrderById = async (id: string) => {
    const session = await auth();

    if (!session?.user) {
        return {
            ok: false,
            message: 'Debe de estar autenticado'
        }
    }

    try {
        const order = await prisma.order.findFirst({
            where: {
                id: id
            },       
            include: {
                orderItems: {                    
                    include: {
                        product: {
                            include: {
                                productImages: {
                                    select: {
                                        url: true
                                    },
                                    take: 1
                                }
                            }
                        }
                    },
                },
                orderAddresses: true
            }
        });

        if (!order) {
            throw `El ${id} no existe`;
        }

        if (session.user.role === 'user') {
            if (session.user.id !== order.userId) {
                throw `${id} no es de este usuario`;
            }
        }
    
        const totalItems = order?.orderItems.reduce((count, item) => count + item.quantity, 0);
        const subTotal = order?.orderItems.reduce((count, item) => count + item.price, 0);
        const tax = subTotal! * 0.15;
        const total = subTotal! * 1.15;
    
        return {
            ok: true,
            order: order,
            totalItems: totalItems,
            subTotal: subTotal,
            tax: tax,
            total: total
        };
    } catch (error) {
        console.log(error);

        return {
            ok: false,
            message: 'Comunicate con el administrador porque hubo un error'
        }
    }
}