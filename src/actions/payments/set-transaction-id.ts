'use server'

import { prisma } from "@/lib/prisma"

export const setTransactionId = async (transactionId: string, orderId: string) => {
    try {
        const order = await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                transactionId: transactionId
            }
        });

        if (!order) {
            return {
                ok: false,
                message: `No se encontro la orden: 121`
            }
        }

        return {
            ok: true,
            message: 'Transaction id guardado'
        }

    } catch (error) {
        return {
            ok: false,
            message: error
        }
    }
}