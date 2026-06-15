'use server'

import { Gender } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma"

interface PaginationOptions {
    page?: number;
    take?: number;
    gender?: Gender;
}

export const getPaginatedProductsWithImages = async ({page = 1, take = 12, gender}: PaginationOptions) => {
    try {
        if (isNaN(Number(page))) page = 1;
        if(page < 1) page = 1

        const products = await prisma.product.findMany({
            take: take,
            where: {
                gender: gender
            },
            skip: (page - 1) * take,
            include: {
                productImages: {
                    take: 2,
                    select: {
                        url: true
                    }
                }
            }
        });

        const totalCount = await prisma.product.count({
            where: {
                gender: gender
            }
        });
        const totalPages = Math.ceil(totalCount / take);

        return {
            currentPage: page,
            totalPages : totalPages,
            products: products.map(product => ({
                ...product,
                images: product.productImages.map(image => image.url)
            }))
        };

    } catch (error) {
        throw new Error('No se puddo cargar los objetos')
    }
}