import { titleFont } from "@/config/fonts";

export default function Home() {
  return (
    <>
      <h1>Hola mundo</h1>
      <h2 className={`${titleFont.className} font-bold`}>Hola mundo</h2>
    </>
  );
}
