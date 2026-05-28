import fs from "node:fs";
import sharp from "sharp";
const [src, out, widthArg] = process.argv.slice(2);
const raw = fs.readFileSync(src, "utf8");
const outer = JSON.parse(raw);
// Proxy may return { content: base64 } directly, OR a Vercel-MCP wrapper { text: JSON-string }
const payload = outer.text ? JSON.parse(outer.text) : outer;
const b64 = (payload.base64 || payload.content || payload.body || payload.data || "").replace(/^data:[^;]+;base64,/, "");
const buf = Buffer.from(b64, "base64");
console.log(`${src} → ${buf.length} bytes, ${payload.contentType || "binary/octet-stream"}`);
const meta = await sharp(buf).metadata();
console.log(`  source: ${meta.width}x${meta.height} ${meta.format}`);
const width = widthArg ? parseInt(widthArg, 10) : Math.min(meta.width, 1600);
await sharp(buf).resize({ width }).webp({ quality: 82 }).toFile(out);
const after = fs.statSync(out);
console.log(`  → ${out} (${Math.round(after.size / 1024)} KB)`);
