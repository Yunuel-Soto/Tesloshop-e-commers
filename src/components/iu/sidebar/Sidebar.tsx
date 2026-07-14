'use client'
import { logout } from "@/actions";
import { useUIStore } from "@/store";
import clsx from "clsx";
import Link from "next/link"
import { useSession } from 'next-auth/react';

import { IoCloseOutline, IoLogInOutline, IoLogOutOutline, IoPeopleOutline, IoPersonOutline, IoSearchOutline, IoShareOutline, IoTicketOutline } from "react-icons/io5"

export const Sidebar = () => {

    const isSideMenuOpen = useUIStore(state => state.isSideMenuOpen);
    const closeMenu = useUIStore(state => state.closeSideMenu);

    /**
     * Para validar si el usuario esta logeado o no de forma efectiva, se tiene que evaluar con el
     * hook useSession de next-auth/react para no tener que refrescar el navegador al cerrar sesion.
     * 
     * Para que funcione hay que envolver toda la aplicacion en el provider SessionProvider. En este caso
     * se hizo creando un componente llamado Provider en el se coloco SessionProvider, para que asi
     * si tenemos mas providers, los pongamos ahi y en el layout solo usemos el componente Provider
     */
    const { data: session } = useSession(); 
    const isAuthenticated = !!session?.user;
    const isAdmin = session?.user.role == 'admin'

    return (
        <div>
            {/* black background */}
            {
                isSideMenuOpen && (
                    <>
                        <div
                            className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"                            
                        />
                        {/* blur */}
                        <div
                            className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
                            onClick={() => closeMenu()}
                        />
                    </>
                )
            }

            {/* sidemenu */}
            <nav
                className={
                    clsx(
                        "fixed p-5 right-0 top-0 w-125 h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
                        {
                            "translate-x-full": !isSideMenuOpen
                        }
                    )
                 }>
                <IoCloseOutline
                    size={50}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={() => closeMenu()}
                />
                <div className="relative mt-14">
                    <IoSearchOutline size={20} className="absolute top-2 left-2" />
                    <input
                        type="text"
                        placeholder="Buscar"
                        className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-50"
                    />
                </div>

                {/* options menu */}
                {
                    isAuthenticated && (
                        <>
                            <Link
                                href={'/profile'}
                                onClick={() => closeMenu()}
                                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                            >
                                <IoPersonOutline size={30} />
                                <span className="ml-3 text-xl">Perfil</span>
                            </Link>
                            <Link
                                href={'/orders'}
                                onClick={() => closeMenu()}
                                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                            >
                                <IoTicketOutline size={30} />
                                <span className="ml-3 text-xl">Ordenes</span>
                            </Link>                        
                        </>
                    )
                }
                {
                    isAuthenticated && (
                        <button    
                            onClick={() => {
                                logout()
                                closeMenu()
                                window.location.replace('/auth/login');
                            }}    
                            className="flex w-full items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        >
                            <IoLogOutOutline size={30} />
                            <span className="ml-3 text-xl">Salir</span>
                        </button>
                    )
                }

                {
                    !isAuthenticated && (
                        <Link
                            href={'/auth/login'}
                            onClick={() => closeMenu()}
                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        >
                            <IoLogInOutline size={30} />
                            <span className="ml-3 text-xl">Ingresar</span>
                        </Link>
                    )
                }                
                

                {/* Line separator */}

                {
                    isAdmin && (
                        <>
                            <div className="w-full my-10 h-px bg-gray-200"></div>
                            <Link
                                href={'/admin/products'}
                                onClick={() => closeMenu()}
                                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                            >
                                <IoShareOutline size={30} />
                                <span className="ml-3 text-xl">Productos</span>
                            </Link>
                            <Link
                                href={'/admin/orders'}
                                onClick={() => closeMenu()}
                                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                            >
                                <IoTicketOutline size={30} />
                                <span className="ml-3 text-xl">Ordenes</span>
                            </Link>
                            <Link
                                href={'/admin/users'}
                                onClick={() => closeMenu()}
                                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                            >
                                <IoPeopleOutline size={30} />
                                <span className="ml-3 text-xl">Usuarios</span>
                            </Link>                        
                        </>
                    )
                }
            </nav>
        </div>
    )
}
