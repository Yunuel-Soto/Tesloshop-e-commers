import { titleFont } from "@/config/fonts"

interface Props {
  title: string,
  subTilte?: string,
  className?: string,
}

export const Title = ({title, subTilte, className} : Props) => {
  return (
    <div className={`mt-3 ${className}`}>
      <h1 className={`${titleFont.className} antialiased text-4xl font-semibold my-7`}>
        {title}
      </h1>
      {
        subTilte && (
          <h3 className="text-xl mb-5">
            {subTilte}
          </h3>
        )
      }
    </div>
  )
}
