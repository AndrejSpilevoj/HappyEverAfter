// Exercise the actual Worker request boundary with only framework dependencies stubbed.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
const source = await readFile(new URL("../worker/index.ts", import.meta.url), "utf8");
const isolated = source.replace(/^import .*$/gm, "").replaceAll("import.meta.env.DEV", "false");
const { outputText } = ts.transpileModule(isolated, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
});
const stubs = `
const handler = { fetch: async request => Response.json(Object.fromEntries(request.headers)) };
const runWithConnectorBinding = (binding, callback) => callback();
`;
const { default: worker } = await import("data:text/javascript;base64," + Buffer.from(stubs + outputText).toString("base64"));
const forged = {
  "OAI-Authenticated-User-Email": "andrej.spilevoj@gmail.com",
  "oai-authenticated-user-id": "forged-owner",
  "oai-authenticated-user-full-name": "forged",
  cookie: "math_session=student-cookie",
};
const request = () => new Request("https://example.com/api/me", { headers: forged });
const standalone = await worker.fetch(request(), { DEPLOYMENT_TARGET: "cloudflare" }, {});
const headers = await standalone.json();
assert.equal(headers["oai-authenticated-user-email"], undefined);
assert.equal(headers["oai-authenticated-user-id"], undefined);
assert.equal(headers["oai-authenticated-user-full-name"], undefined);
assert.equal(headers.cookie, "math_session=student-cookie");
for (const path of ["/signin-with-chatgpt", "/signout-with-chatgpt"]) {
  const response = await worker.fetch(new Request("https://example.com" + path), { DEPLOYMENT_TARGET: "cloudflare" }, {});
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("cache-control"), "no-store");
}
const sites = await worker.fetch(request(), {}, {});
assert.equal((await sites.json())["oai-authenticated-user-id"], "forged-owner");
console.log("Cloudflare boundary: forged identity stripped, student cookies preserved, teacher sign-in fails closed, Sites path preserved.");
