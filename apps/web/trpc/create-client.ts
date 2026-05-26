import { httpLink, httpBatchStreamLink } from "@repo/trpc/client";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  return c({
    url: env.NEXT_PUBLIC_API_URL
      ? (env.NEXT_PUBLIC_API_URL.endsWith("/trpc")
        ? env.NEXT_PUBLIC_API_URL
        : `${env.NEXT_PUBLIC_API_URL}/trpc`)
      : "/trpc",
    fetch(url, options) {
      return fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          ...options?.headers,
          "x-user-id":
            typeof window !== "undefined"
              ? localStorage.getItem("x-user-id") || "00000000-0000-0000-0000-000000000000"
              : "00000000-0000-0000-0000-000000000000",
        },
      });
    },
  });
};
