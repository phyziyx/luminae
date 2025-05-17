import { initEdgeStore } from "@edgestore/server";
import {
  createEdgeStoreNextHandler,
  type CreateContextOptions,
} from "@edgestore/server/adapters/next/app";
import { initEdgeStoreClient } from "@edgestore/server/core";
import { z } from "zod";
import { auth, getSession } from "../auth/auth";
import { headers } from "next/headers";
import { authClient } from "../auth/auth-client";
import AgencyManager from "../managers/agencyManager";

type Context = {
  userId: string;
  userRole: "admin" | "guest" | "user";
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function createContext(_opts: CreateContextOptions): Promise<Context> {
  const { data: session } = await authClient.getSession();

  return {
    userId: session?.user.id || "0",
    userRole: session?.user.id ? "user" : "guest",
  };
}

const es = initEdgeStore.context<Context>().create();

/**
 * This is the main router for the EdgeStore buckets.
 */
const edgeStoreRouter = es.router({
  publicFiles: es
    .fileBucket({
      maxSize: 1 * 1024 * 1024, // 1MB
      accept: ["image/jpeg", "image/png"],
    })
    .input(z.object({ type: z.enum(["post", "article"]) }))
    .path(({ ctx, input }) => [{ type: input.type }, { author: ctx.userId }])
    .metadata(({ ctx }) => ({
      role: ctx.userRole,
    })),
  // .beforeUpload(({ ctx, input, fileInfo }) => {
  //   // forbid 50% of the time (for demo purposes)
  //   return Math.random() < 0.5;
  // })
  // .beforeDelete(({ ctx, fileInfo }) => {
  //   // forbid 50% of the time (for demo purposes)
  //   return Math.random() < 0.5;
  // }),
  publicImages: es.imageBucket(),
  profilePictures: es.imageBucket({
    maxSize: 1 * 1024 * 1024, // 1MB
    accept: ["image/jpeg", "image/png", "image/webp"],
  }),
  privateFiles: es
    .fileBucket({
      maxSize: 25 * 1024 * 1024, // 25 MB
    })
    // required for every file upload
    .input(
      z.object({
        fileType: z.string(),
        agencyId: z.string(),
      })
    )
    // file path: /privateFiles/{agencyId}
    .path(({ ctx, input }) => [
      {
        agencyId: input.agencyId,
      },
    ])
    .beforeUpload(({ ctx, input, fileInfo }) => {
      return new Promise(async (resolve) => {
        let retVal = false;

        // get user agency here...
        // check file access...

        resolve(retVal);
      });
    })
    .beforeDelete(({ ctx, fileInfo }) => {
      console.log("beforeDelete", ctx, fileInfo);
      return true;
    })
    // file metadata
    .metadata(({ ctx, input }) => ({
      agencyId: input.agencyId,
      fileType: input.fileType,
    })),
});

export const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;

export const backendClient = initEdgeStoreClient({
  router: edgeStoreRouter,
});
