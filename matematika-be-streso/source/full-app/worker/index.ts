import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";

const worker = {
  fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext<{ CONNECTORS?: ConnectorBinding }>) {
    // Direct Cloudflare requests do not pass through the Sites identity gateway.
    // Never accept caller-supplied Sites identity headers on the standalone Worker.
    if ((env as Cloudflare.Env & { DEPLOYMENT_TARGET?: string }).DEPLOYMENT_TARGET === "cloudflare") {
      const headers = new Headers(request.headers);
      for (const name of [...headers.keys()]) {
        if (name.startsWith("oai-authenticated-user-")) headers.delete(name);
      }
      request = new Request(request, { headers });
      const pathname = new URL(request.url).pathname;
      if (pathname === "/signin-with-chatgpt" || pathname === "/signout-with-chatgpt") {
        return new Response("Mokytojo prisijungimas dar ruošiamas. Viešos vaizdo pamokos veikia.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
        });
      }
    }
    let binding = ctx.props?.CONNECTORS;
    // Local preview emulates the same request-scoped capability. This branch and
    // the auxiliary service binding are absent from production builds.
    if (import.meta.env.DEV && !binding && env.CONNECTORS) {
      const preview = env.CONNECTORS;
      const expiresAt = Date.now() + 60_000;
      binding = {
        async getContext() {
          if (Date.now() >= expiresAt) return { status: "request_context_expired" };
          return preview.getContext?.() ?? { status: "binding_unavailable" };
        },
        async invoke(connectorId, actionName, args) {
          if (Date.now() >= expiresAt) {
            return { status: "request_context_expired", message: "This request has expired. Please try again." };
          }
          return preview.invoke(connectorId, actionName, args);
        },
      };
    }
    return runWithConnectorBinding(binding, () => handler.fetch(request, env, ctx));
  },
};

export default worker;
