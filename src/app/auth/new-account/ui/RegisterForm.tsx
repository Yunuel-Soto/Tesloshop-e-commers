'use client'
import { login, registerUser } from '@/actions';
import clsx from 'clsx';
import Link from 'next/link'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoInformationOutline } from 'react-icons/io5';

export const RegisterForm = () => {

    const [errorMessage, setErrorMessage] = useState('');

    type FormInputs = {
        name: string;
        email: string;
        password: string;
    }

    const { register, handleSubmit, formState: {errors} } = useForm<FormInputs>();

    const onSubmit = async (data: FormInputs) => {
        setErrorMessage('');

        const { name, email, password } = data;
        const resp = await registerUser(name, email, password);

        console.log({ resp });

        if (!resp.ok) {
            setErrorMessage(resp.message);
            return;
        }

        await login(email.toLocaleLowerCase(), password);
        window.location.replace('/');
    }

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>          
            <label htmlFor="email">Nombre completo</label>
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            'border-red-500 shadow-red-400 shadow-[0px_0px_5px] focus:outline-0 ': !!errors.name
                        }
                    )
                }
                type="text"
                autoFocus
                {...register('name', {required: true})}
            />

            <label htmlFor="email">Correo electrónico</label>
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            'border-red-500 shadow-red-400 shadow-[0px_0px_5px] focus:outline-0 ': !!errors.email
                        }
                    )
                }
                type="email"
                {...register('email', {required: true, pattern: /^\S+@\S+$/i})}
            />


            <label htmlFor="email">Contraseña</label>
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            'border-red-500 shadow-red-400 shadow-[0px_0px_5px] focus:outline-0 ': !!errors.password
                        }
                    )
                }
                type="password"
                {...register('password', {required: true})}
            />

            {
                errorMessage && (
                    <span className='text-red-500 mb-4 flex items-center gap-2'> <IoInformationOutline/> {errorMessage}</span>
                )
            }

            <button
                type='submit'
                className="btn-primary"
            >
                Crear cuenta
            </button>


            {/* divisor l ine */}
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link
                href="/auth/login"
                className="btn-secondary text-center">
                Ingresar
            </Link>

        </form>
    )
}
