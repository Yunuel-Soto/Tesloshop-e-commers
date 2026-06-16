'use server'

import { prisma } from "@/lib/prisma"
import { sleep } from "@/utils"

interface Props {
    slug: string
}

export const getSotckBySlug = async (slug: string) : Promise<number> => {
    try {        
        const product = await prisma.product.findUnique({
            where: {
                slug: slug
            },
            select: {
                inStock: true
            }
        });

        return product?.inStock ?? 0;
    } catch (error) {
        throw new Error('No se encontro el objeto o hubo un error en el servidor');
    }
}