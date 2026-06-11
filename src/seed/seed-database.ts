import { prisma } from "../lib/prisma";
import { initialData } from "./seed";


async function main() {

    await Promise.all([
        prisma.productImage.deleteMany(),
        prisma.product.deleteMany(),
        prisma.category.deleteMany()
    ]);

    console.log('Seed se ejecuto');
}

(() => {
    if (process.env.NODE_ENV === 'production') return;

    main();
})()