import { titleFont } from "@/config/fonts"
import Link from "next/link"

export const Footer = () => {
    return (
        <footer className="flex w-full justify-center text-sx my-10">
            <Link
                href={'/'}
            >
                <span className={`${titleFont.className} antialiased font-bold`}>Teslo </span>
                <span>| shop </span>
                <span>© { new Date().getFullYear() }</span>
            </Link>

            <Link
                href={'/'}
                className="mx-3"
            >
                Privacidad & legarl
            </Link>

            <Link
                href={'/'}
                className="mx-3"
            >
                Ubicaciones
            </Link>
        </footer>
    )
}
