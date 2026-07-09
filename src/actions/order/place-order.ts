'use server'

import { auth } from "@/auth.config";
import { Address, Size } from "@/interfaces"
import { prisma } from "@/lib/prisma";
import { ok } from "assert";

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size;
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {
    
    const session = await auth();
    const userIdSession = session?.user.id;

    if (!userIdSession) {
        return {
            ok: false,
            message: 'No hay sesion de usuario'
        }
    }

    // Nota: recuerden que podemos llevar dos o mas productos con el mismo ID
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds.map(p => p.productId)
            }
        }
    });

    const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);
    
    // Los totales de tax, subtotal y total
    const { subTotal, tax, total } = productIds.reduce((totals, item) => {
        
        const productQuantity = item.quantity;
        const product = products.find(p => p.id == item.productId);

        if (!product) throw new Error(`${item.productId} no existe - 500`);

        const subTotal = product.price * productQuantity;

        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;

        return totals;    
    }, {subTotal: 0, tax: 0, total: 0})
    
    try {
        // Crear transaction
        const prismaTx = await prisma.$transaction(async (tx) => {
            // 1. Actualizar el stock de los productos
            const updatedProductsPromises = products.map(async (product) => {
                // Acomular los valores
                const productQuantity = productIds.filter(
                    p => p.productId === product.id
                ).reduce((acc, item) => item.quantity + acc, 0)
    
                if (productQuantity === 0) {
                    throw new Error(`${product.id} no tiene cantidad definida`);
                }
    
                return tx.product.update({
                    where: {
                        id: product.id
                    },
                    data: {
                        // inStock: product.inStock - productQuantity // no hacer
                        inStock: {
                            decrement: productQuantity
                        }
                    }
                })
            });
    
            const updatedProducts = await Promise.all(updatedProductsPromises);
    
            // Verificar valores negativos en la existencia 
            updatedProducts.forEach(product => {
                if (product.inStock < 0) {
                    throw new Error(`${product.title} no tiene inventario suficiente.`);
                }
            });
    
            // 2. Crear  la orden - Encabezado - Encabezado - Detalles
            const order = await tx.order.create({
                data: {
                    userId: userIdSession,
                    itemsInOrder: itemsInOrder,
                    subtTotal: subTotal,
                    tax: tax,
                    total: total,
                    orderItems: {
                        createMany: {
                            data: productIds.map(p => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: products.find(product => product.id === p.productId)?.price ?? 0
                            }))
                        }
                    }
                }
            });
    
            const { country, userId, id, ...rest } = address as any;
    
            const insertAddress = {
                orderId: order.id,
                countryId: country, 
                ...rest,
            }
            // 3. Crear la direccion de la orden
            const addressOrder = await tx.orderAddress.create({
                data: insertAddress
            });
    
            return {
                order: order,
                updatedProducts: updatedProducts,
                orderAddress: addressOrder
            }
        });

        return {
            ok: true,
            order: prismaTx.order.id,
            prismaTx: prismaTx
        }
    } catch (error: any) {
        return {
            ok: false,
            message: error?.message
        }
    }
}