import { exec } from "child_process";
import crypto from "crypto";
import { Entry, EntryData, EntrySignatures } from "./entry";
import fs from "fs/promises";
import path, { dirname } from "path";
import { render } from "./pages";
import { fileURLToPath } from "url";
import { renderSitemap } from "./sitemap";
import { generateRSS } from "./rss";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cachePath = ".cocz-build-cache.json";
const cacheVersion = 1;

interface CachedEntry {
    mtimeMs: number;
    size: number;
    url: string;
    data?: EntryData;
}

interface FileSignature {
    mtimeMs: number;
    size: number;
}

interface BuildCache {
    version: number;
    viteHash: string;
    rendererHash: string;
    template: string;
    entries: Record<string, CachedEntry>;
    publicFiles: Record<string, FileSignature>;
    tags: string[];
}

const emptyCache = (): BuildCache => ({
    version: cacheVersion,
    viteHash: "",
    rendererHash: "",
    template: "",
    entries: {},
    publicFiles: {},
    tags: [],
});

const readCache = async (): Promise<BuildCache> => {
    try {
        const cache = JSON.parse(await fs.readFile(cachePath, "utf-8")) as BuildCache;
        if (cache.version !== cacheVersion) {
            return emptyCache();
        }
        const normalizedCache = {
            ...emptyCache(),
            ...cache,
        };
        if (Array.isArray(normalizedCache.publicFiles)) {
            normalizedCache.publicFiles = {};
        }
        return normalizedCache;
    } catch {
        return emptyCache();
    }
};

const writeCache = async (cache: BuildCache): Promise<void> => {
    await fs.writeFile(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
};

const listFiles = async (inputPath: string): Promise<string[]> => {
    const stat = await fs.stat(inputPath);
    if (stat.isFile()) {
        return [inputPath];
    }

    const entries = await fs.readdir(inputPath, { withFileTypes: true });
    const files = await Promise.all(entries.map((entry) => {
        return listFiles(path.join(inputPath, entry.name));
    }));

    return files.flat().sort();
};

const hashFiles = async (inputPaths: string[]): Promise<string> => {
    const hash = crypto.createHash("sha256");
    for (const inputPath of inputPaths) {
        const files = await listFiles(inputPath);
        for (const file of files) {
            hash.update(file);
            hash.update("\0");
            hash.update(await fs.readFile(file));
            hash.update("\0");
        }
    }
    return hash.digest("hex");
};

const getFileSignatures = async (root: string, filter = (_file: string) => true): Promise<Record<string, FileSignature>> => {
    const files = (await listFiles(root)).map(file => path.relative(root, file)).filter(filter).sort();
    const signatures: Record<string, FileSignature> = {};
    for (const file of files) {
        const stat = await fs.stat(path.join(root, file));
        signatures[file] = {
            mtimeMs: stat.mtimeMs,
            size: stat.size,
        };
    }
    return signatures;
};

const getContentSignatures = async (): Promise<EntrySignatures> => {
    return getFileSignatures("content", file => file.endsWith(".md")) as Promise<EntrySignatures>;
};

const getPublicSignatures = async (): Promise<Record<string, FileSignature>> => {
    return getFileSignatures("public");
};

const pathExists = async (inputPath: string): Promise<boolean> => {
    try {
        await fs.access(inputPath);
        return true;
    } catch {
        return false;
    }
};

const hasSameContentInputs = (cache: BuildCache, signatures: EntrySignatures): boolean => {
    const cachedFiles = Object.keys(cache.entries).sort();
    const currentFiles = Object.keys(signatures).sort();
    if (cachedFiles.length !== currentFiles.length) {
        return false;
    }

    return currentFiles.every((file, index) => {
        const cachedEntry = cache.entries[file];
        const signature = signatures[file];
        return (
            cachedFiles[index] === file &&
            cachedEntry?.data &&
            cachedEntry.mtimeMs === signature.mtimeMs &&
            cachedEntry.size === signature.size
        );
    });
};

const hasAggregateOutputs = async (tags: string[]): Promise<boolean> => {
    const paths = [
        "dist/index.html",
        "dist/tags/index.html",
        "dist/rss.xml",
        "dist/sitemap.xml",
    ];

    const exists = await Promise.all(paths.map(pathExists));
    return exists.every(Boolean);
};

const syncPublicFiles = async (
    previousFiles: Record<string, FileSignature>,
    currentFiles: Record<string, FileSignature>,
): Promise<void> => {
    await Promise.all(Object.keys(previousFiles).map(async (file) => {
        if (!currentFiles[file]) {
            await fs.rm(path.join("dist", file), { force: true });
        }
    }));

    await Promise.all(Object.entries(currentFiles).map(async ([file, signature]) => {
        const previousSignature = previousFiles[file];
        if (
            previousSignature?.mtimeMs === signature.mtimeMs &&
            previousSignature?.size === signature.size &&
            await pathExists(path.join("dist", file))
        ) {
            return;
        }

        const outputPath = path.join("dist", file);
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.copyFile(path.join("public", file), outputPath);
    }));
};

/**
 * Run a command in a shell and return the result
 */
const runCommand = async (command: string): Promise<{stdout: string, stderr: string}> => {
    return new Promise((resolve, reject) => {
        const process = exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({stdout, stderr});
        });
    });
};

/**
 * Render a page and write it to a file
 */
const renderAndWritePage = async (
    outputPath: string, 
    url: string, 
    templateRender: (head: string, body: string) => string
): Promise<void> => {
    const rendered = await render(url);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, templateRender(rendered.head, rendered.body));
};

export const buildAll = async () => {
    // First change to the root directory containing the package.json
    const rootDir = path.join(__dirname, "..");
    process.chdir(rootDir);

    await fs.mkdir("dist", { recursive: true });

    const previousCache = await readCache();
    const viteHash = await hashFiles(["src/template.html", "src/fe"]);
    const rendererHash = await hashFiles([
        "src/build.ts",
        "src/entry.ts",
        "src/pages.ts",
        "src/rss.ts",
        "src/sitemap.ts",
        "src/utils.ts",
    ]);
    const contentSignatures = await getContentSignatures();
    const publicFiles = await getPublicSignatures();

    const shouldRunVite =
        previousCache.viteHash !== viteHash ||
        !previousCache.template ||
        !(await pathExists("dist/assets"));
    const shouldRebuildAllHtml = shouldRunVite || previousCache.rendererHash !== rendererHash;
    const sameContentInputs = hasSameContentInputs(previousCache, contentSignatures);

    let template = previousCache.template;
    if (shouldRunVite) {
        const build = await runCommand("vite build");
        console.log("Build output:", build.stdout);

        template = await fs.readFile("dist/src/template.html", "utf-8");
        await fs.rm("dist/src", { recursive: true, force: true });
    } else {
        console.log("Vite inputs unchanged; skipping vite build.");
    }

    await syncPublicFiles(previousCache.publicFiles, publicFiles);

    if (
        !shouldRebuildAllHtml &&
        sameContentInputs &&
        await hasAggregateOutputs(previousCache.tags)
    ) {
        console.log("Content inputs unchanged; skipping HTML/RSS/sitemap generation.");
        await writeCache({
            ...previousCache,
            version: cacheVersion,
            viteHash,
            rendererHash,
            template,
            publicFiles,
        });
        return;
    }

    const templateRender = (head: string, body: string) => {
        return template
            .replace('<!-- HEAD_CONTENT_PLACEHOLDER -->', head)
            .replace('<!-- BODY_CONTENT_PLACEHOLDER -->', body);
    };

    // Now build all the entries
    const entries = await Entry.loadAll(previousCache.entries, contentSignatures);
    const nextEntries: Record<string, CachedEntry> = {};

    for (const cachedEntry of Object.values(previousCache.entries)) {
        if (!entries.has(cachedEntry.url)) {
            await fs.rm(path.join("dist", cachedEntry.url), { recursive: true, force: true });
        }
    }

    await Promise.all(Array.from(entries.values()).map(async (entry) => {
        const contentSignature = contentSignatures[entry.filename];
        const filename = path.join("dist", entry.url, "index.html");
        const previousEntry = previousCache.entries[entry.filename];
        const shouldRenderEntry =
            shouldRebuildAllHtml ||
            previousEntry?.mtimeMs !== contentSignature?.mtimeMs ||
            previousEntry?.size !== contentSignature?.size ||
            previousEntry?.url !== entry.url ||
            !(await pathExists(filename));

        if (shouldRenderEntry) {
            await renderAndWritePage(filename, entry.url, templateRender);
        }

        nextEntries[entry.filename] = {
            mtimeMs: contentSignature?.mtimeMs || 0,
            size: contentSignature?.size || 0,
            url: entry.url,
            data: entry.toData(),
        };
    }));

    // Now build the index page
    const indexFilename = path.join("dist", "index.html");
    await renderAndWritePage(indexFilename, "/", templateRender);

    // Now build the tags page
    const tagsFilename = path.join("dist", "tags", "index.html");
    await renderAndWritePage(tagsFilename, "/tags", templateRender);

    // Remove stale per-tag pages. The build only emits /tags/ now.
    const tags = [...new Set(Array.from(entries.values()).map(entry => entry.tags).flat())];
    for (const tag of previousCache.tags) {
        await fs.rm(path.join("dist", "tags", tag), { recursive: true, force: true });
    }

    // Generate the RSS feed
    const rssContent = await generateRSS(entries);
    await fs.writeFile("dist/rss.xml", rssContent);
    console.log("RSS feed generated at dist/rss.xml");

    // Now build the sitemap
    await fs.writeFile("dist/sitemap.xml", await renderSitemap());
    console.log("Sitemap generated at dist/sitemap.xml");

    await writeCache({
        version: cacheVersion,
        viteHash,
        rendererHash,
        template,
        entries: nextEntries,
        publicFiles,
        tags,
    });
};

buildAll();
