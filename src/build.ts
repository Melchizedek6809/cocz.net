import { exec } from "child_process";
import { Entry } from "./entry";
import fs from "fs/promises";
import path, { dirname } from "path";
import { render } from "./pages";
import { fileURLToPath } from "url";
import { renderSitemap } from "./sitemap";
import { generateRSS } from "./rss";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

    // First empty/remove the old dist directory
    await fs.rm("dist", { recursive: true, force: true });
    await fs.mkdir("dist");

    // Then copy over the public files
    await fs.cp("public", "dist", { recursive: true });

    // Now run npm run build to bundle everything up
    const build = await runCommand("vite build");
    console.log("Build output:", build.stdout);

    const template = await fs.readFile("dist/src/template.html", "utf-8");
    await fs.rm("dist/src", { recursive: true, force: true });

    const templateRender = (head: string, body: string) => {
        return template
            .replace('<!-- HEAD_CONTENT_PLACEHOLDER -->', head)
            .replace('<!-- BODY_CONTENT_PLACEHOLDER -->', body);
    };

    // Now build all the entries
    const entries = await Entry.loadAll();
    await Promise.all(Array.from(entries.values()).map(async (entry) => {
        const filename = path.join("dist", entry.url, "index.html");
        await renderAndWritePage(filename, entry.url, templateRender);
    }));

    // Now build the index page
    const indexFilename = path.join("dist", "index.html");
    await renderAndWritePage(indexFilename, "/", templateRender);

    // Now build the tags page
    const tagsFilename = path.join("dist", "tags", "index.html");
    await renderAndWritePage(tagsFilename, "/tags", templateRender);

    // Now build the tag pages
    const tags = [...new Set(Array.from(entries.values()).map(entry => entry.tags).flat())];
    for (const tag of tags) {
        const tagFilename = path.join("dist", "tags", tag, "index.html");
        await renderAndWritePage(tagFilename, `/tags/${tag}`, templateRender);
    }

    // Generate the RSS feed
    const rssContent = await generateRSS(entries);
    await fs.writeFile("dist/rss.xml", rssContent);
    console.log("RSS feed generated at dist/rss.xml");

    // Now build the sitemap
    await fs.writeFile("dist/sitemap.xml", await renderSitemap());
    console.log("Sitemap generated at dist/sitemap.xml");
};

buildAll();