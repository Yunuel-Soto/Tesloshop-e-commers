'use server'

import { PayPalOrderStatusResponse } from "@/interfaces";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (transactionId: string) => {
    const authtoken = await getPaypalBearerToken();

    if (!authtoken) {
        return {
            ok: false,
            message: 'No se pudo obtener el token de verificacion'
        }
    }

    const result = await verifyPayPalPayment(transactionId, authtoken);

    if (!result) {
        return {
            ok: false,
            message: 'Error al verificar el pago'
        }
    }

    const { status, purchase_units } = result;
    const { invoice_id: orderId } = purchase_units[0];
    if (status != 'COMPLETED') {
        return {
            ok: false,
            message: 'Aun no se ha pagado en PayPal'
        }
    }

    try {
        console.log({ status, purchase_units });

        await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                isPaid: true,
                paidAt: new Date()
            }
        });

        //TODO: Revalidar un path
        revalidatePath(`/orders/${orderId}`);

        return {
            ok: true,
            message: 'Orden completada'
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Ocurrio un error inesperado al momento de hacer su transaccion'
        }
    }
}

const getPaypalBearerToken = async (): Promise<string | null> => {

    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET_KEY = process.env.PAYPAL_SECRET_KEY;
    const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? '';

    const base64Token = Buffer.from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`,
        "utf-8"
    ).toString('base64');

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Basic ${base64Token}`);
    myHeaders.append("Cookie", "__cf_bm=Q4KJoG_dKiSw.mSmVWQ4uJui9Ku8nlJIOx77wO2Hpio-1783712073.920491-1.0.1.1-o2WRWqGO4XEEteZ.obb6rgcjTTFjd_89QaeULVs89YVIyo4wuYgMSuxbjClRU6IiOAcxmVEuJUfrecFklM8DnhgYlo1Yj9MPSSJJv4gDHoY_W2u3M._lMHJ6iI_UnbIb");

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
    };

    try {
        const result = await fetch(oauth2Url, {
            ...requestOptions,
            cache: 'no-store'
        }).then(r => r.json());
        return result.access_token;
    } catch (error) {
        console.log(error);
        return 'Error al obtener token de autenticacion';
    }
}

const verifyPayPalPayment = async (paypalTransactionId: string, bearerToken: string) : Promise<PayPalOrderStatusResponse | null> => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${bearerToken}`);

    const paypalOrderUrl = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`;

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    try {
        const result = await fetch(paypalOrderUrl, {
            ...requestOptions,
            cache: 'no-store'
        }).then(r => r.json());
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}