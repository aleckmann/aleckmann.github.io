import { createReadStream } from "node:fs";
import { mkdir, realpath, stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { chromium } from "playwright";

const DEFAULT_SITE_DIR = "public";
const DEFAULT_RESUME_PATH = "/resume/";
const DEFAULT_OUTPUT = "public/resume/aleckmann-resume.pdf";

function parseArgs(argv) {
  const options = {
    siteDir: DEFAULT_SITE_DIR,
    resumePath: DEFAULT_RESUME_PATH,
    output: DEFAULT_OUTPUT,
    port: 0,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--site-dir" && next) {
      options.siteDir = next;
      i += 1;
    } else if (arg === "--resume-path" && next) {
      options.resumePath = next;
      i += 1;
    } else if (arg === "--output" && next) {
      options.output = next;
      i += 1;
    } else if (arg === "--port" && next) {
      options.port = Number.parseInt(next, 10);
      i += 1;
    } else {
      throw new Error(`Unknown or incomplete argument: ${arg}`);
    }
  }

  if (!options.resumePath.startsWith("/")) {
    options.resumePath = `/${options.resumePath}`;
  }

  return options;
}

function contentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const types = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".map": "application/json; charset=utf-8",
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".svg": "image/svg+xml; charset=utf-8",
    ".webmanifest": "application/manifest+json; charset=utf-8",
  };

  return types[extension] ?? "application/octet-stream";
}

async function createStaticServer(siteDir, port) {
  const root = await realpath(siteDir);

  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
      let pathname = decodeURIComponent(requestUrl.pathname);

      if (pathname.endsWith("/")) {
        pathname = `${pathname}index.html`;
      }

      const filePath = path.resolve(root, `.${pathname}`);
      if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }

      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      response.writeHead(200, { "Content-Type": contentType(filePath) });
      createReadStream(filePath).pipe(response);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });

  return new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const server = await createStaticServer(options.siteDir, options.port);
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const resumeUrl = new URL(options.resumePath, baseUrl).toString();
  let browser;

  try {
    await mkdir(path.dirname(options.output), { recursive: true });
    browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto(resumeUrl, { waitUntil: "networkidle" });
    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: options.output,
      format: "Letter",
      printBackground: true,
      preferCSSPageSize: true,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
