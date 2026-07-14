"use client";

import { Category, ProductWImages } from "@/interfaces";
import Image from "next/image";
import { useForm } from "react-hook-form";

interface Props {
  product: ProductWImages;
//   product: Product & {ProductImage?: ProductImage[]}; Se puede hacer algo asi
  categories: Category[]
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];


interface FormInput {
    title: string;
    slug: string;
    description: string;
    price: number;
    inStock: number;
    sizes: string[];
    tags: string; //camisa, t-shirt
    gender: 'men' | 'women' | 'kid' | 'unisex';
    categoryId: string;

    //Todo: imagenes
}

export const ProductForm = ({ product, categories }: Props) => {

    const { handleSubmit, register, formState: { isValid } } = useForm<FormInput>({
        defaultValues: {
            ...product,
            tags: product.tags.join(', '),
            sizes: product.sizes ?? [],
            // TODO: IMAGES
        }
    });

    const onSubmit = async (data: FormInput) => {
        console.log({ data });
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3">
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input type="text" {...register('title', {required: true})} className="p-2 border rounded-md bg-gray-200" />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input type="text" {...register('slug', {required: true})} className="p-2 border rounded-md bg-gray-200" />
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
            {...register('description', {required: true})}
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input type="number" {...register('price', {required: true, min: 0})} className="p-2 border rounded-md bg-gray-200" />
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input type="text" {...register('tags', {required: true})} className="p-2 border rounded-md bg-gray-200" />
        </div>

        <div className="flex flex-col mb-2">
          <span>Gender</span>
          <select className="p-2 border rounded-md bg-gray-200" {...register('gender', {required: true})}>
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoria</span>
          <select className="p-2 border rounded-md bg-gray-200" {...register('categoryId', {required: true})}>
            <option value="">[Seleccione]</option>
            {
                categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))
            }
          </select>
        </div>

        <button 
            className="btn-primary w-full">
          Guardar
        </button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        {/* As checkboxes */}
        <div className="flex flex-col">

          <span>Tallas</span>
          <div className="flex flex-wrap">
            
            {
              sizes.map( size => (
                // bg-blue-500 text-white <--- si está seleccionado
                <div key={ size } className="flex  items-center justify-center w-10 h-10 mr-2 border rounded-md">
                  <span>{ size }</span>
                </div>
              ))
            }

          </div>


          <div className="flex flex-col mb-2">

            <span>Fotos</span>
            <input 
              type="file"
              multiple 
              className="p-2 border rounded-md bg-gray-200" 
              accept="image/png, image/jpeg"
            />

          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {
                product.productImages.map(image => (
                    <div key={image.id}>
                        <Image alt={product.title ?? ''} src={`/products/${image.url}`}
                            width={300}
                            height={300}
                            className="rounded-t shadow-md"
                        />

                        <button
                            type="button"
                            className="btn-danger rounded-b-xl w-full"
                            onClick={() => console.log(image.id, image.url)}
                        >
                            Eliminar
                        </button>
                    </div>
                ))
            }
          </div>

        </div>
      </div>
    </form>
  );
};