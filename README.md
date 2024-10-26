# Luminae

![Luminae Logo](/public/assets/logo.png)

## Getting Started

1. First, `git clone ...` the project.
2. Run `npm i --force` to install the dependencies.
3. Run `npm run dev:turbo` to run the development server.
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

- Do not push the environment variables (`.env`) file to the Git or anywhere else.
- Modify the `.env.local` to `.env`, and fill in your environment variables.

## Prisma

- If you have modified the Prisma data model/schema, please run `prisma generate` to update the typings.
- Migrate the schema with `prisma migrate dev`.
- More information here: [https://www.prisma.io/docs/orm/prisma-migrate/getting-started](Getting Started with Prisma Migrate)
- MySQL/MariaDB type mapping to Prisma: [https://www.prisma.io/docs/orm/overview/databases/mysql#type-mapping-between-mysql-to-prisma-schema](Type Mappings)

## Credits

- Mohammed Ali Khowaja [https://github.com/phyziyx](Phyziyx)
- Mahad Hasan Asim [https://github.com/senenzo](Senenzo)
