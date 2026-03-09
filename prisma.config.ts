import path from "node:path";
import { defineConfig } from "prisma/config";

const DB_PATH = `file:${path.join(process.cwd(), "prisma", "dev.db")}`;

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: DB_PATH,
  },
});
