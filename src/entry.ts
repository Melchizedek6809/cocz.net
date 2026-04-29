import fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import markdownIt from 'markdown-it';
import markdownItHighlightJS from 'markdown-it-highlightjs';
import { parse } from 'yaml';
import { escapeHtml } from './utils';

const __dirname = dirname(fileURLToPath(import.meta.url));
const md = markdownIt({
    html: true,
}).use(markdownItHighlightJS);

export interface EntryData {
    filename: string;
    rawContent: string;
    url: string;
    title: string;
    date: string | undefined;
    description: string;
    tags: string[];
    content: string;
    image: string | undefined;
    hidden: boolean;
}

export type EntryCache = Record<string, {
    mtimeMs: number;
    size: number;
    data?: EntryData;
}>;

export type EntrySignatures = Record<string, {
    mtimeMs: number;
    size: number;
}>;

const absoluteUrl = (url: string): string => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `https://cocz.net${url.startsWith('/') ? url : `/${url}`}`;
};

export class Entry {
    readonly filename: string;
    readonly rawContent: string;
    readonly url: string;

    readonly title = "";
    readonly date: Date | undefined;
    readonly description = "";
    readonly tags: string[] = [];
    readonly content:string = "";
    readonly image: string | undefined;
    readonly hidden: boolean = false;

    private static allEntries: Promise<Map<string, Entry>> | undefined;

    static async loadAll(cache?: EntryCache, signatures?: EntrySignatures): Promise<Map<string, Entry>> {
        if (Entry.allEntries) {
            return Entry.allEntries;
        }

        Entry.allEntries = Entry.loadAllUncached(cache, signatures);
        return Entry.allEntries;
    }

    private static async loadAllUncached(cache?: EntryCache, signatures?: EntrySignatures): Promise<Map<string, Entry>> {
        const urlMap = new Map<string, Entry>();

        const entries = await fs.readdir(path.join(__dirname, '../content'));
        const all = await Promise.all(entries.map((filename) => {
            const cachedEntry = cache?.[filename];
            const signature = signatures?.[filename];
            if (
                cachedEntry?.data &&
                signature &&
                cachedEntry.mtimeMs === signature.mtimeMs &&
                cachedEntry.size === signature.size
            ) {
                return Entry.fromData(cachedEntry.data);
            }
            return Entry.load(filename);
        }));

        for (const entry of all) {
            urlMap.set(entry.url, entry);
        }

        return urlMap;
    }

    static async load(filename: string) {
        const content = await fs.readFile(path.join(__dirname, '../content', filename), 'utf8');
        return new Entry(filename, content);
    }

    static fromData(data: EntryData): Entry {
        return Object.assign(Object.create(Entry.prototype), {
            ...data,
            date: data.date ? new Date(data.date) : undefined,
        }) as Entry;
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
        this.image = fm.image || undefined;

        const parsed = md.render(raw);
        this.content = parsed;
    }

    toData(): EntryData {
        return {
            filename: this.filename,
            rawContent: this.rawContent,
            url: this.url,
            title: this.title,
            date: this.date?.toISOString(),
            description: this.description,
            tags: this.tags,
            content: this.content,
            image: this.image,
            hidden: this.hidden,
        };
    }

    getJsonLd(): Record<string, unknown> {
        const jsonLd: Record<string, unknown> = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": this.getUrl()
            },
            "headline": this.title,
            "description": this.description,
            "datePublished": this.date?.toISOString(),
            "dateModified": this.date?.toISOString(),
            "author": {
                "@type": "Person",
                "url": "https://cocz.net/",
                "name": "Ben"
            }
        };

        if (this.image) {
            jsonLd.image = absoluteUrl(this.image);
        }

        return jsonLd;
    }

    getBreadcrumbJsonLd() {
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://cocz.net/"
            }, {
                "@type": "ListItem",
                "position": 2,
                "name": this.title,
                "item": this.getUrl()
            }]
        };
    }

    renderJsonLd() {
        return `
            <script type="application/ld+json">
                ${JSON.stringify(this.getJsonLd())}
            </script>
            <script type="application/ld+json">
                ${JSON.stringify(this.getBreadcrumbJsonLd())}
            </script>
        `;
    }

    getImageUrl(): string | undefined {
        return this.image ? absoluteUrl(this.image) : undefined;
    }

    renderOpenGraph() {
        const image = this.getImageUrl();
        return `
            <meta property="og:title" content="${escapeHtml(this.title)}">
            <meta property="og:description" content="${escapeHtml(this.description)}">
            <meta property="og:url" content="${this.getUrl()}">
            ${image ? `<meta property="og:image" content="${image}">` : ""}
            <meta property="og:type" content="article">
            <meta property="og:site_name" content="Ben's Blog">
            <meta property="og:locale" content="en_US">
        `;
    }

    renderMetadata() {
        return `
            <meta name="description" content="${escapeHtml(this.description)}">
            <meta name="author" content="Ben">
            <meta name="robots" content="max-image-preview:large">
            <meta name="last-modified" content="${this.date?.toISOString()}">
            <link rel="canonical" href="${this.getUrl()}">
            ${this.renderOpenGraph()}
            ${this.renderJsonLd()}
        `;
    }

    renderTeaser(index = 0) {
        const imageAttrs = index >= 3 ? ' loading="lazy" decoding="async"' : ' decoding="async"';
        return `<article>
            <header class="article-header">
            <h3 class="post-title"><a href="/${this.url}/">${escapeHtml(this.title)}</a></h3>
                <div class="post-side">
                    <time datetime="${this.date?.toISOString()}">${this.date?.toISOString().split('T')[0]}</time>
                    <ul role="list">
                        ${this.tags.map(tag => `<li role="listitem"><span class="tag">${escapeHtml(tag)}</span></li>`).join(' ')}
                    </ul>
                </div>
            </header>
            ${this.image ? `<a class="teaser-image-link" href="/${this.url}/"><img class="teaser-image" src="${this.image}" alt="${escapeHtml(this.title)}"${imageAttrs} /></a>` : `<p>${this.getSummary()}</p>`}
        </article>`;
    }

    renderFull() {
        return `<article class="full-article">
            <header class="page-header">
                <h1 class="post-title">${this.title}</h1>
                <div class="post-side">
                    ${this.date ? `<time datetime="${this.date.toISOString()}">${this.date.toISOString().split('T')[0]}</time>` : ""}
                    <ul role="list">
                    ${this.tags.map(tag => `<li role="listitem"><span class="tag">${tag}</span></li>`).join(' ')}
                    </ul>
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

    getUrl() {
        return `https://cocz.net/${this.url}/`;
    }
}
