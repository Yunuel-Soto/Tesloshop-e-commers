import { getOrderById } from "@/actions/order/get-order-by-id";
import { Title } from "@/components";
import { initialData } from "@/seed/seed";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import Image from "next/image";
import { redirect } from "next/navigation";
import { IoCardOutline } from 'react-icons/io5';

interface Props {
  params: {
    id: string
  }
}

export default async function ({ params }: Props) {

  const { id } = await params;

  const { order, totalItems, subTotal, tax, total, ok } = await getOrderById(id);

  if (!order || !ok) {
    redirect('/');
  }

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">

      <div className="flex flex-col w-250">
        <Title
          title={`Orden #${id.split('-').at(0)}`}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">

            <div className={
              clsx(
                "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                {
                  'bg-red-500': !order.isPaid,
                  'bg-green-700': order.isPaid
                }
              )
            }>
              <IoCardOutline size={30} />
              <span className="mx-2">{order.isPaid ? 'Pagado' : 'Pendiente de pago'}</span>
            </div>


            {/* Items */}
            {
              order.orderItems!.map(orderI => {   
                const product = orderI.product;
                return(
                  <div key={`${product.slug}-${orderI.size}`} className="flex mb-5">
                    <Image
                      src={`/products/${product.productImages[0].url}`}
                      alt={product.title}
                      width={100}
                      height={100}
                      style={{
                        width: '100px',
                        height: '100px'
                      }}
                      className="mr-5 rounded"
                    />
  
                    <div>
                      <p>{product.title}</p>
                      <p>${product.price} x {orderI.quantity}</p>
                      <p className="font-bold">Subtotal: ${product.price * orderI.quantity}</p>
                    </div>
                  </div>                  
                )
              })
            }
          </div>

          {/* Checkout */}

          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">

            <h2 className="text-2xl font-bold mb-2">Direccio de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">{order.orderAddresses?.firstName} {order.orderAddresses?.lastName}</p>
              <p>{order.orderAddresses?.address}</p>
              <p>{order.orderAddresses?.address2}</p>
              <p>{order.orderAddresses?.postalCode}</p>
              <p>{order.orderAddresses?.city}, {order.orderAddresses?.countryId}</p>
              <p>{order.orderAddresses?.phone}</p>
            </div>

            {/* divider */}

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

            <h2 className="text-2xl font-bold mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">{totalItems === 1 ? '1 arcitulo' : `${totalItems} articulos`}</span>

              <span>Subtotal</span>
              <span className="text-right">{currencyFormat(subTotal!)}</span>

              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormat(tax)}</span>

              <span className="mt-5 text-2xl">Total</span>
              <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
            </div>

            <div className="mt-5 mb-2 w-full">

              <div className={
                clsx(
                  "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                  {
                    'bg-red-500': !order.isPaid,
                    'bg-green-700': order.isPaid
                  }
                )
              }>
                <IoCardOutline size={30} />
                <span className="mx-2">{order.isPaid ? 'Pagado' : 'Pendiente de pago'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
