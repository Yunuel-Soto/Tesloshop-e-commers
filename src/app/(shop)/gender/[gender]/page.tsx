export const revalidate = 60; //Son 60 segundos (se va a revalidar la info cada minuto)

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@/generated/prisma/enums";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: {
    gender: string,
  }
  searchParams: {
    page: number
  }
}

export default async function ({ params, searchParams }: Props) {
  const { gender } = await params;
  const { page } = await searchParams;

  const validGenders = ['women', 'men', 'kid'];

  const pageNumber = Number(page) ?? 1;

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({
    page: pageNumber,
    take: 12,
    gender: gender as Gender
  });

  const labels: Record<string, string> = {
    'women': 'para mujeres',
    'men': 'para hombres',
    'kid': 'para niños',
    'unisex': 'para todos'
  };

  if (!validGenders.includes(gender)) {
    notFound();
  }

  if (products.length == 0) {
    redirect(`/gender/${gender}`);
  }

  return (
    <>
      <Title title="Tienda" subTilte={`Articulos ${labels[gender]}`} className="mb-2" />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  )
}
