'use server'
import { prisma } from "@/lib/prisma"

export const deleteUserAddress = async (userId: string) => {
    try {
        await prisma.userAddress.delete({
            where: {
                userId: userId
            }
        })

        return {
            ok: true,
            message: 'Se elimino la direccion del usuario'
        }
    } catch (error) {
        console.log(error);

        return {
            ok: false,
            message: 'Error al eliminar direccion'
        }
    }
}