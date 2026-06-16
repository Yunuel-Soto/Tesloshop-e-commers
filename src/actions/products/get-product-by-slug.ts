'use server'

import { prisma } from "@/lib/prisma";

export const getProductBySlog = async (slug: string) => {
    try {
        const product = await prisma.product.findFirst({
            include: {
                productImages: {
                    select: {
                        url: true
                    }
                }
            },
            where: {
                slug: slug
            }
        });

        if (!product) {
            return null;    
        }

        return {            
            ...product,
            images: product.productImages.map(image => image.url)
        }

    } catch (error) {
        throw new Error('Error al obtener producto por slug');
    }
}