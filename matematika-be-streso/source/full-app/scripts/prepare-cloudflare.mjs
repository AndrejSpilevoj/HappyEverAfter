// Prepare an explicit standalone deployment; never deploy starter placeholder bindings.
import { readFile, writeFile } from "node:fs/promises";
const path = new URL("../dist/server/wrangler.json", import.meta.url);
const config = JSON.parse(await readFile(path, "utf8"));
config.name = "matematika-be-streso";
config.account_id = "a018d05a961f4c8e0293cd139ec781eb";
config.workers_dev = true;
config.preview_urls = false;
config.vars = { ...config.vars, DEPLOYMENT_TARGET: "cloudflare" };
config.d1_databases = [{
  binding: "DB",
  database_name: "matematika-be-streso-db",
  database_id: "9678cab8-96b3-463b-9bc2-0ac8f89884dc",
  jurisdiction: "eu",
}];
// R2 requires account billing activation. Do not deploy a fake or public bucket.
config.r2_buckets = [];
config.services = [];
await writeFile(path, JSON.stringify(config, null, 2) + "\n");
console.log("Prepared matematika-be-streso with its EU D1 database; R2 and teacher sign-in pending.");
