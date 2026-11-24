import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// This program only reads the local POST.json next to it and reports it.
// It never contacts X or any other network service, and it never writes
// anything into the repository directory.
const here = dirname(fileURLToPath(import.meta.url));
const postPath = join(here, "POST.json");

const parsed = JSON.parse(readFileSync(postPath, "utf-8")) as unknown;

if (typeof parsed !== "object" || parsed === null) {
  throw new Error("POST.json must contain a JSON object");
}

const { post_url, author, play_code } = parsed as Record<string, unknown>;

if (typeof post_url !== "string" || post_url.length === 0) {
  throw new Error("POST.json is missing post_url");
}

let statusId: string;
try {
  const url = new URL(post_url);
  const parts = url.pathname.split("/").filter((part) => part.length > 0);
  const looksRight =
    url.protocol === "https:" &&
    url.hostname === "x.com" &&
    url.search === "" &&
    url.hash === "" &&
    parts.length === 3 &&
    parts[1] === "status" &&
    /^\d+$/.test(parts[2]);
  if (!looksRight) {
    throw new Error("not a plain x.com status URL");
  }
  statusId = parts[2];
  // The handle in the URL should be the same author named in POST.json,
  // so a pasted link from a different account cannot slip through.
  if (typeof author === "string" && author.length > 0 && parts[0] !== author) {
    throw new Error(
      `post_url handle @${parts[0]} does not match author ${author}`,
    );
  }
} catch (error) {
  throw new Error(`post_url is not a valid x.com status URL: ${post_url}`);
}

if (typeof play_code !== "string" || play_code.trim().length === 0) {
  throw new Error("POST.json is missing play_code");
}

if (typeof author !== "string" || author.trim().length === 0) {
  throw new Error("POST.json is missing author");
}

const entry = {
  post_url: post_url,
  author: author,
  play_code: play_code,
};

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
if (
  resolve(outDir) === resolve(here) ||
  resolve(outDir).startsWith(resolve(here) + "/")
) {
  throw new Error("MAKEFUN_OUTPUT_DIR must not point inside the repository");
}
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.json");
writeFileSync(outPath, JSON.stringify(entry, null, 2) + "\n", "utf-8");

// Read the file back and confirm it holds exactly what POST.json said.
const roundTrip = JSON.parse(readFileSync(outPath, "utf-8")) as Record<
  string,
  unknown
>;
if (
  roundTrip.post_url !== entry.post_url ||
  roundTrip.author !== entry.author ||
  roundTrip.play_code !== entry.play_code
) {
  throw new Error("entry.json does not match POST.json after writing");
}

console.log(`Verified post ${statusId} by @${author} (code ${play_code})`);
console.log(`Wrote ${outPath}`);
