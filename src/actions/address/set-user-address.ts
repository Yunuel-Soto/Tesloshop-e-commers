'use server'
import { Address } from "@/interfaces"
import { prisma } from "@/lib/prisma"

export const setUserAddress = async (address: Address, userId: string) => {
    try {
        console.log(userId);

        const saveAddress = await createOrReplaceAddress(address, userId);

        return {
            ok: true,
            address: saveAddress
        }
    } catch (error) {
        return {
            ok: false,
            message: 'No se pudo guardar el registro'
        }
    }
}

const createOrReplaceAddress = async (address: Address, userId: string) => {
    try {
        const storedAddress = await prisma.userAddress.findUnique({
            where: { userId }
        });

        const countryN = await prisma.country.findFirst({
            where: {
                'id': address.country
            }
        });

        const { country, ...rest } = address;        

        if (!storedAddress) {            

            if (countryN) {
                const newAddress = await prisma.userAddress.create({
                    data: {
                        ...rest,
                        userId: userId,
                        countryId: countryN.id
                    }
                });               
                
                return newAddress;
            }
            return null;
        }
        
        if (countryN) {
            return await prisma.userAddress.update({
                where: {
                    userId: userId
                },
                data: {
                    ...rest,
                    userId: userId,
                    countryId: countryN.id
                }
            });                        
        }      
        
        return null;
    } catch (error) {
        console.log(error);
        throw new Error('no se pudo guardar la direccion');
    }
}