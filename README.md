# Description

## Correr en dev

1. Clonar el directorio
2. Crear una copia del archivo ```.env.template``` y renombrarlo a ```.env```
3. Instalar dependencias ```pnpm install```

4. Levantar la base de datos ```docker compose up -d```
5. Correr las migraciones ```pnpm dlx prisma migrate dev```
6. Llenar la base de datos con data de relleno ```pnpm run seed```

7. Correr el proyecto ```pnpm run dev```

## Como instale prisma

1. Instalar prisma ```pnpm i prisma --save-dev```
2. Despues iniciar un proveedor ```pnpm prisma init --datasource-provider PostgreSQL```

## Correr en desarrollo