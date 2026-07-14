'use client'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions } from '@paypal/paypal-js'
import { paypalCheckPayment, setTransactionId } from '@/actions';

interface Props {
    orderId: string;
    amount: number;
}

const PayPalButton = ({amount, orderId} : Props) => {
    const [{ isPending }] = usePayPalScriptReducer();

    const roundedAmount = (Math.round(amount * 100) / 100);

    if (isPending) {
        return (
            <div className='animate-pulse flex gap-2 flex-col mb-16'>
                <div className='h-11 bg-gray-300 rounded'></div>
                <div className='h-11 bg-gray-300 rounded'></div>
                <div className='flex justify-center'>
                    <div className='w-[30%] h-6 bg-gray-300 m-auto'></div>
                </div>
            </div>
        )
    }

    const createOrder = async (data: CreateOrderData, actions: CreateOrderActions) : Promise<string> => {
        
        const transactionId = await actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    invoice_id: orderId,                    
                    amount: {
                        value: `${roundedAmount}`,
                        currency_code: 'USD'
                    }
                }
            ]
        });

        const resp = await setTransactionId(transactionId, orderId);

        if (!resp.ok) {
            throw new Error('No se pudo actualizar la orden');
        }

        return transactionId;
    }

    const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
        const details = await actions.order?.capture()
        if (!details) {
            return;
        }

        await paypalCheckPayment(details.id!);
    }

    return (
      <div className='relative z-0'>
        <PayPalButtons    
            createOrder={createOrder}  
            onApprove={ onApprove }  
        />            
      </div>
  )
}

export default PayPalButton