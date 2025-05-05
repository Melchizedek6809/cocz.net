import fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import markdownIt from 'markdown-it';
import { parse } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class Entry {
    readonly filename: string;
    readonly rawContent: string;
    readonly url: string;

    readonly title = "";
    readonly date: Date | undefined;
    readonly description = "";
    readonly tags: string[] = [];
    readonly content:string = "";
    readonly hidden: boolean = false;
    static async loadAll(): Promise<Map<string, Entry>> {
        const urlMap = new Map<string, Entry>();

        const entries = await fs.readdir(path.join(__dirname, '../content'));
        const all = await Promise.all(entries.map(Entry.load));

        for (const entry of all) {
            urlMap.set(entry.url, entry);
        }

        return urlMap;
    }

    static async load(filename: string) {
        const content = await fs.readFile(path.join(__dirname, '../content', filename), 'utf8');
        return new Entry(filename, content);
    }
    
    constructor(filename: string, rawContent: string) {
        this.filename = filename;
        this.rawContent = rawContent;

        let url = filename.replace('.md', '');
        if (url.startsWith('_')) {
            url = url.slice(1);
        }
        if (url.startsWith('/')) {
            url = url.slice(1);
        }
        url = url.replace(/(\d+-?)*/g, '');
        this.url = url;
        
        console.log(filename, url);
        const md = new markdownIt({
            html: true,
        });

        let raw = rawContent;
        let rawFM = "";
        if (raw.startsWith('---')) {
            const fmEnd = raw.indexOf('---', 3);
            rawFM = raw.slice(3, fmEnd);
            raw = raw.slice(fmEnd + 3);
        }

        const fm = parse(rawFM);
        console.log(fm);
        this.title = fm.title || "";
        this.date = fm.date ? new Date(fm.date) : undefined;
        this.description = fm.description || "";
        this.tags = fm.tags || [];
        this.hidden = fm.hidden || false;

        const parsed = md.render(raw);
        this.content = parsed;
    }
}
