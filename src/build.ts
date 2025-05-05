import { exec } from "child_process";
import { Entry } from "./entry";
import fs from "fs/promises";
import path, { dirname, resolve } from "path";
import { render } from "./pages";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
    const build = await new Promise<{stdout: string, stderr: string}>((resolve, reject) => {
        const process = exec("vite build", (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({stdout, stderr});
        });
    });
    console.log("Build output:", build.stdout);

    const template = await fs.readFile("dist/src/template.html", "utf-8");
    await fs.rm("dist/src", { recursive: true, force: true });
    
    const templateRender = (head: string, body: string) => {
        return template
            .replace('<!-- HEAD_CONTENT_PLACEHOLDER -->', head)
            .replace('<!-- BODY_CONTENT_PLACEHOLDER -->', body);
    }

    // Now build all the entries
    const entries = await Entry.loadAll();
    for (const entry of entries.values()) {
        const filename = path.join("dist", entry.url, "index.html");
        const rendered = await render(entry.url);
        await fs.mkdir(path.dirname(filename), { recursive: true });
        await fs.writeFile(filename, templateRender(rendered.head, rendered.body));
    }

    // Now build the index page
    const indexFilename = path.join("dist", "index.html");
    const renderedIndex = await render("/");
    await fs.writeFile(indexFilename, templateRender(renderedIndex.head, renderedIndex.body));

    // Now build the tags page
    const tagsFilename = path.join("dist", "tags", "index.html");
    const renderedTags = await render("/tags");
    await fs.mkdir(path.dirname(tagsFilename), { recursive: true });
    await fs.writeFile(tagsFilename, templateRender(renderedTags.head, renderedTags.body));

    // Now build the tag pages
    const tags = [...new Set(Array.from(entries.values()).map(entry => entry.tags).flat())];
    for (const tag of tags) {
        const tagFilename = path.join("dist", "tags", tag, "index.html");
        const rendered = await render(`/tags/${tag}`);
        await fs.mkdir(path.dirname(tagFilename), { recursive: true });
        await fs.writeFile(tagFilename, templateRender(rendered.head, rendered.body));
    }
};

buildAll();