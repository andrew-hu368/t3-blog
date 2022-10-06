// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { blogRouter } from "./blog";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("blog.", blogRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
