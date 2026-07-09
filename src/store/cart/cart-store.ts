import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
    cart: CartProduct[];
    addProductToCart: (product: CartProduct) => void;
    getTotalItems: () => number;
    getSummaryInformation: () => {
        subTotal: number;
        tax: number;
        total: number;
        itemsInCart: number;
    };
    updateProductQuantity: (product: CartProduct, quantity: number) => void;
    removeProductCart: (product: CartProduct) => void;
    clearCart: () => void;
}

export const useCartStore = create<State>()(
    // en el store no es persistente hasta que usemos persist
    persist(
        (set, get) => ({
            cart: [],            

            getTotalItems: () => {
                const { cart } = get();                
                return cart.reduce((total, item) => total + item.quantity, 0);
            },

            getSummaryInformation: () => {
                const { cart } = get();

                const subTotal = cart.reduce((subTotal, product) => product.quantity * product.price + subTotal, 0);

                const tax = subTotal * 0.15;
                const total = subTotal + tax;

                const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

                return {
                    subTotal, tax, total, itemsInCart
                }
            },

            addProductToCart: (product: CartProduct) => {
                const { cart } = get();

                // Revisamos coincidencias
                const productInCart = cart.some(
                    (item) => (item.id === product.id && item.size === product.size)
                );

                // Si no existia, insertamos nuevo
                if (!productInCart) {
                    set({ cart: [...cart, product] }); //Insertar nuevo producto al carrito
                    return;
                }

                // De lo contrario, actualizamos el producto
                const updatedCartProduct = cart.map((item) => {
                    if (item.id === product.id && item.size === product.size) {
                        return {
                            ...item, quantity: item.quantity + product.quantity
                        }
                    }

                    return item;
                });

                // y lo insertamos
                set({ cart: updatedCartProduct });
            },

            updateProductQuantity: (product: CartProduct, quantity: number) => {                
                const { cart } = get();
                const updateCartProduct = cart.map((item) => {
                    if (item.id === product.id && item.size === product.size) {
                        return {
                            ...item, quantity: (quantity - item.quantity) + item.quantity,
                        }
                    }

                    return item;
                });

                set({ cart: updateCartProduct });
            },

            removeProductCart: (product: CartProduct) => {
                const { cart } = get();
                console.log(product);
                const updateCartProduct = cart.filter(item => item.id != product.id || item.size !== product.size);
                set({ cart: updateCartProduct });
            },

            clearCart: () => {
                set({cart: []})
            }
        }),        
        {
            name: 'shopping-cart',
        }
    )

    
)