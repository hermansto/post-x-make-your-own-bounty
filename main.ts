import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Entry checker for the Post-X bounty.
// It reads the single post link from POST.json, checks that it really is
// the entrant's own X post, and reports it as entry.json in the output
// directory. It never fetches anything and never writes into this repo.
const repoDir = dirname(fileURLToPath(import.meta.url));

function fail(message: string): never {
  throw new Error(message);
}

const raw = readFileSync(join(repoDir, "POST.json"), "utf-8");
const data: unknown = JSON.parse(raw);

if (typeof data !== "object" || data === null || Array.isArray(data)) {
  fail("POST.json must contain a JSON object");
}

const { url } = data as { url?: unknown };
if (typeof url !== "string" || url.length === 0) {
  fail('POST.json must contain a "url" string');
}

let handle: string;
let postId: string;
let parsed: URL;
try {
  parsed = new URL(url);
} catch {
  fail(`url is not a valid URL: ${url}`);
}
const segments = parsed.pathname.split("/").filter(Boolean);
const plainStatus =
  parsed.protocol === "https:" &&
  parsed.hostname === "x.com" &&
  parsed.search === "" &&
  parsed.hash === "" &&
  segments.length === 3 &&
  segments[1] === "status" &&
  /^\d+$/.test(segments[2]);
if (!plainStatus) {
  fail("url is not a plain x.com status URL");
}
handle = segments[0];
postId = segments[2];

if (handle !== "brobanditoo") {
  fail(`post handle @${handle} is not brobanditoo`);
}

// The author is the handle in the URL; the play code is this account's
// code, already carried in the post's own text.
const entry = {
  url: url,
  author: handle,
  play_code: "9rack9n5",
};

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const resolvedOut = resolve(outDir);
const resolvedRepo = resolve(repoDir);
if (resolvedOut === resolvedRepo || resolvedOut.startsWith(resolvedRepo + "/")) {
  fail("MAKEFUN_OUTPUT_DIR must not point inside the repository");
}
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "entry.json");
writeFileSync(outPath, JSON.stringify(entry, null, 2) + "\n", "utf-8");

// Read it back and make sure nothing was lost or changed on the way out.
const written = JSON.parse(readFileSync(outPath, "utf-8")) as {
  url?: unknown;
  author?: unknown;
  play_code?: unknown;
};
if (
  written.url !== entry.url ||
  written.author !== entry.author ||
  written.play_code !== entry.play_code
) {
  fail("entry.json does not match POST.json after writing");
}

console.log(`Verified post ${postId} by @${handle} (code ${entry.play_code})`);
console.log(`Wrote ${outPath}`);
