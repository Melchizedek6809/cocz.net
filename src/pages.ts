import { Entry } from "./entry";
import { generateRSS } from "./rss";
import { renderSitemap } from "./sitemap";

export interface RenderedPage {
    head: string;
    body: string;
    status: number;
    contentType?: string;
}


const renderHeader = async (): Promise<string> => {
    return `
        <header class="primary-header">
          <section>
            <h3><a href="/">Ben's blog</a></h3>
            <h4 class="cyberspace">rambling through <span class="cs1">c</span><span class="cs2">y</span><span class="cs3">b</span><span class="cs4">e</span><span class="cs5">r</span><span class="cs1">s</span><span class="cs2">p</span><span class="cs3">a</span><span class="cs4">c</span><span class="cs5">e</span></h4>
          </section>
          <section>
            <nav class="primary-nav">
                <ul role="list">
                    <li role="listitem"><a href="/about-me/" class="">About me</a></li>
                    <li role="listitem"><a href="/rss.xml" target="_blank" rel="noopener noreferrer" title="RSS Feed" class="rss-icon"></a></li>
                    <li role="listitem"><a href="https://sr.ht/~melchizedek6809/" target="_blank" rel="noopener noreferrer" title="sourcehut" class="sourcehut"></a></li>
                    <li role="listitem"><a href="https://github.com/Melchizedek6809" target="_blank" rel="noopener noreferrer" title="GitHub" class="github"></a></li>
                    <li role="listitem"><a href="https://www.twitch.tv/melchizedek6809" target="_blank" rel="noopener noreferrer" title="Twitch" class="twitch"></a></li>
                </ul>
            </nav>
        </section>
        <div class="primary-header-spacer">
            <div class="primary-header-spacer-a"></div>
            <div class="primary-header-spacer-b"></div>
            <div class="primary-header-spacer-c"></div>
            <div class="primary-header-spacer-d"></div>
            <div class="primary-header-spacer-e"></div>
        </div>
        </header>
    `;
}

const renderFooter = async (): Promise<string> => {
    return `
        <footer class="primary-footer">
          <ul role="list">
            <li role="listitem">©
              <time datetime="2025">2025</time> Benjamin Vincent Schulenburg
            </li>

            <li role="listitem">
              Content <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode.txt" target="_blank" rel="noopener noreferrer">CC-BY-NC-ND-4.0</a>
            </li>

            <li role="listitem">
              <a href="https://github.com/melchizedek6809/cocz.net/" target="_blank" rel="noopener noreferrer">Source Code</a>
              <a href="https://spdx.org/licenses/MIT.html" target="_blank" rel="noopener noreferrer">MIT</a>
            </li>
          </ul>
        </footer>
    `;
}

const renderOpenGraph = async (): Promise<string> => {
    return `
        <meta property="og:title" content="Ben's Blog">
        <meta property="og:description" content="ramblings from cyberspace">
        <meta property="og:url" content="https://cocz.net/">
        <meta property="og:image" content="https://url2og.cocz.net/?url=https://cocz.net/">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="Ben's Blog">
        <meta property="og:locale" content="en_US">
    `;
}

const renderJsonLd = async (): Promise<string> => {
    const websiteJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": "https://cocz.net/",
        "name": "Ben's Blog",
        "description": "ramblings from cyberspace"
    };
    const personJsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Ben",
        "url": "https://cocz.net/",
        "sameAs": [
            "https://sr.ht/~melchizedek6809/",
            "https://github.com/Melchizedek6809",
            "https://www.twitch.tv/melchizedek6809"
        ]
    };

    return `
        <script type="application/ld+json">
            ${JSON.stringify(websiteJsonLd)}
        </script>
        <script type="application/ld+json">
            ${JSON.stringify(personJsonLd)}
        </script>
    `;
}

const renderIndex = async (): Promise<RenderedPage> => {
    const allEntries = await Entry.loadAll();
    const entries = Array.from(allEntries.values()).sort((a, b) => b.date!.getTime() - a.date!.getTime()).filter(entry => !entry.hidden);
    const lastmod = entries.map(entry => entry.date?.toISOString()).sort().pop();
    const entriesHTML = entries.map((entry, index) => entry.renderTeaser(index)).join(' ');

    const head = `
        <title>Ben's Blog</title>
        <meta name="description" content="ramblings from cyberspace">
        <meta name="robots" content="max-image-preview:large">
        <meta name="last-modified" content="${lastmod}">
        <link rel="canonical" href="https://cocz.net/">
        ${await renderOpenGraph()}
        ${await renderJsonLd()}
      `;

    const main = `
        <main class="index-main">
          ${entriesHTML}
        </main>
    `;

    const body = `
        ${await renderHeader()}
        ${main}
        ${await renderFooter()}
      `;

    return {
        head,
        body,
        status: 200
    }
}

const render404 = async (): Promise<RenderedPage> => {
    return {
        head: '<title>404</title>',
        body: '<main><p>404</p></main>',
        status: 404
    }
}
const renderPage = async (pageName: string): Promise<RenderedPage> => {
    const entries = await Entry.loadAll();
    const entry = entries.get(pageName);
    if (!entry) {
        return render404();
    }

    const head = `
        <title>${entry.title}</title>
        <meta name="date" content="${entry.date?.toISOString()}">
        ${entry.renderMetadata()}
      `;

    const body = `
        ${await renderHeader()}
        <main>
          ${entry.renderFull()}
        </main>
        ${await renderFooter()}
      `;

    return {
        head,
        body,
        status: 200
    }
}

export const render = async (url: string): Promise<RenderedPage> => {
    // Handle root/index routes
    if ((url === '/') || (url === "") || (url === "/index") || (url === "/index.html")) {
        return await renderIndex();
    }

    // Handle sitemap.xml
    if (url === "/sitemap.xml") {
        return {
            head: '',
            body: await renderSitemap(),
            status: 200,
            contentType: 'text/xml'
        };
    }

    // Handle RSS feed
    if (url === "/rss.xml") {
        const entries = await Entry.loadAll();
        return {
            head: '',
            body: await generateRSS(entries),
            status: 200,
            contentType: 'application/rss+xml'
        };
    }

    // Parse URL and handle other routes
    const split = url.split("/");
    const pageName = split[1] || split[0] || "";

    // Default: render single page
    return renderPage(pageName);
}
