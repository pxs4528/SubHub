import pgPromise, { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";

const pgp = pgPromise();

const createSingleton = (
  name: string,
  create: () => string | Record<string, unknown>,
) => {
  const s = Symbol.for(name);
  let scope = (global as any)[s];
  if (!scope) {
    const created = create();
    if (typeof created === "string") {
      scope = created;
    } else {
      scope = { ...created };
    }
    (global as any)[s] = scope;
  }
  return scope;
};

export const client = () =>
  createSingleton("my-app-db-space", () =>
    pgp(process.env.DATABASE_URL || ""),
  ) as IClient;
