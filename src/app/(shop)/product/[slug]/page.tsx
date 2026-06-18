export const revalidate = 604800; //revalidar en 7 dias

import { QuantitySelector, SizeSelector, ProductSlideshow, StockLabel } from "@/components";
import { titleFont } from "@/config/fonts";
import { notFound } from "next/navigation";
import { ProductMobileSlideshow } from '../../../../components/product/slideshow/ProductMobileSlideshow';
import { getProductBySlog } from "@/actions";
import { Metadata, ResolvingMetadata } from "next";

interface Props {
  params: {
    slug: string
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug
 
  // fetch post information
  const product = await getProductBySlog(slug);
 
  return {
    title: product?.title ?? 'Producto no encontrado',
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? 'Producto no encontrado',
      description: product?.description ?? '',
      images: [`/products/${product?.images[1]}`]
    }
  }
}

export default async function ({ params }: Props) {

  const { slug } = await params;
  const product = await getProductBySlog(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      
      {/* slideshow */}
      <div className="col-span-1 md:col-span-2">

        {/* Mobile Slideshow */}
        <ProductMobileSlideshow
          title={product.title}
          images={product.images}
          className="block md:hidden"
        />

        {/* Desktop slideshow */}
        <ProductSlideshow
          images={product.images}
          title={product.title}
          className="hidden md:block h-[70vh]"
        />
      </div>

      {/* details */}
      <div className="col-span-1 px-5">
        <StockLabel slug={slug} />

        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>
        <p className="text-lg mb-5">{product.price}</p>
        
        {/* Selector de tallas */}
        <SizeSelector selectedSize={product.sizes[1]} availableSizes={product.sizes}/>

        {/* selector de cantidad */}
        <QuantitySelector quantity={2}/>

        {/* Button */}
        <button className="btn-primary my-5">
          Agregar al carrito
        </button>

        {/* Description */}
        <h3 className="font-bold text-sm">Descripcion</h3>
        <p className="font-light">
          {product.description}
        </p>
      </div>
    </div>
  )
}
