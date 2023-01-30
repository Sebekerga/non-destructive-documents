#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import { generateDocumentsManifest } from "./utils/documents.ts";

await generateDocumentsManifest(import.meta.url, "./documents");
await dev(import.meta.url, "./main.ts");
