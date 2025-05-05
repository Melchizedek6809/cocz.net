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
        url = url.replace(/^(\d+-?)*/g, '');
        this.url = url;
        
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
        this.title = fm.title || "";
        this.date = fm.date ? new Date(fm.date) : undefined;
        this.description = fm.description || "";
        this.tags = fm.tags || [];
        this.hidden = fm.hidden || false;

        const parsed = md.render(raw);
        this.content = parsed;
    }

    renderTeaser() {
        return `<article>
            <header class="article-header">
            <h3 class="post-title"><a href="/${this.url}/">${this.title}</a></h3>
                <div class="post-side">
                    <time datetime="${this.date?.toISOString()}">${this.date?.toISOString().split('T')[0]}</time>
                    <ul role="list">
                        ${this.tags.map(tag => `<li role="listitem"><a rel="tag" class="tag" href="/tags/${tag}/">${tag}</a></li>`).join(' ')}
                    </ul>
                </div>
            </header>
            <p>${this.getSummary()}</p>
        </article>`;
    }

    renderFull() {
        return `<article>
            <header class="page-header">
                <h1 class="post-title">${this.title}</h1>
                <div class="post-side">
                    ${this.date ? `<time datetime="${this.date.toISOString()}">${this.date.toISOString().split('T')[0]}</time>` : ""}
                    <ul role="list">${this.tags.map(tag => `<li role="listitem"><a href="/tags/${tag}/">#${tag}</a></li>`).join(' ')}</ul>
                </div>
            </header>
            ${this.content}
          </article>`
    }

    getSummary() {
        const text = this.content
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&copy;/g, '©')
            .replace(/&reg;/g, '®')
            .replace(/&trade;/g, '™')
            .replace(/&bull;/g, '•')
            .replace(/&hellip;/g, '…')
            .replace(/&mdash;/g, '—')
            .replace(/&ndash;/g, '–')
            .replace(/&nbsp;/g, ' ')
            .replace(/&mdash;/g, '—')
            .replace(/&ndash;/g, '–')
            .replace(/&nbsp;/g, ' ');

        return text.slice(0, 200) + '...';
    }
}
