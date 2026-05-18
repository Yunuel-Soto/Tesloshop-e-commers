import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string
  }
}

export default async function ({ params }: Props) {
  const { id } = await params;

  if (id === 'kids') {
    notFound();
  }

  return (
    <div>
        <h1>Category page</h1>      
    </div>
  )
}
