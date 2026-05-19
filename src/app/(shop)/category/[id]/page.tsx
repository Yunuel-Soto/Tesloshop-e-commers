import { ProductGrid, Title } from "@/components";
import { Catogory } from "@/interfaces";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: Catogory
  }
}

export default async function ({ params }: Props) {
  const { id } = await params;
  const ids = ['women', 'men', 'kid'];

  const products = initialData.products.filter(product => product.gender === id);
  
  const labels: Record<Catogory, string> = {
    'women': 'para mujeres',
    'men': 'para hombres',
    'kid': 'para niños',
    'unisex': 'para todos'
  };

  if (!ids.includes(id)) {
    notFound();
  }

  return (
    <>
      <Title title="Tienda" subTilte={`Articulos ${labels[id]}`} className="mb-2" />
      <ProductGrid products={products} />
    </>
  )
}
