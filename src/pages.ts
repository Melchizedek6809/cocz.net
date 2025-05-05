import { Entry } from "./entry";

export interface RenderedPage {
    head: string;
    body: string;
    status: number;
}

const renderHeader = async (): Promise<string> => {
    return `
        <header class="primary-header">
          <section>
            <h3><a href="https://cocz.net/">Ben's blog</a></h3>
            <h4 class="cyberspace">rambling through <span class="cs1">c</span><span class="cs2">y</span><span class="cs3">b</span><span class="cs4">e</span><span class="cs5">r</span><span class="cs1">s</span><span class="cs2">p</span><span class="cs3">a</span><span class="cs4">c</span><span class="cs5">e</span></h4>
          </section>
          <section>
            <nav class="primary-nav">
                <ul role="list"><li role="listitem"><a href="/" class="">Home</a></li>
                    <li role="listitem"><a href="/about-me/" class="">About me</a></li>
                    <li role="listitem"><a href="/tags/" class="">Tags</a></li>
                    <li role="listitem"><a href="https://sr.ht/~melchizedek6809/" target="_blank" rel="noopener noreferrer" title="sourcehut" class="sourcehut"></a></li>
                    <li role="listitem"><a href="https://github.com/Melchizedek6809" target="_blank" rel="noopener noreferrer" title="GitHub" class="github"></a></li>
                    <li role="listitem"><a href="https://www.twitch.tv/melchizedek6809" target="_blank" rel="noopener noreferrer" title="Twitch" class="twitch"></a></li>
                </ul>
            </nav>
        </section>
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

const renderTags = async (): Promise<RenderedPage> => {
    const tags = new Map<string, number>();
    const allEntries = await Entry.loadAll();
    for (const entry of allEntries.values()) {
        for (const tag of entry.tags) {
            tags.set(tag, (tags.get(tag) || 0) + 1);
        }
    }
    const uniqueTags = [...new Set(tags.keys())].sort();

    return {
        head: '<title>Tags</title>',
        body: `
            ${await renderHeader()}
            <main>
                <h1>Tags</h1>
                <p>Here is a list of all the tags I've used in my posts so far.</p>
                <nav aria-labelledby="list-of-tags" class="tag-list-nav">
                    <ul role="list">
                        ${uniqueTags.map(tag => `<li role="listitem"><a href="/tags/${tag}/">${tag}</a><sup class="tag-sup">${tags.get(tag)}</sup></li>`).join(' ')}
                    </ul>
                </nav>
            </main>
            ${await renderFooter()}
        `,
        status: 200
    }
}

const renderTag = async (tag: string): Promise<RenderedPage> => {
    const allEntries = await Entry.loadAll();
    const entries = Array.from(allEntries.values()).filter(entry => entry.tags.includes(tag));
    const entriesHTML = entries.map(entry => entry.renderTeaser()).join(' ');

    return {
        head: `<title>${tag}</title>`,
        body: `
            ${await renderHeader()}
            <main>
                <h1>All posts tagged with '${tag}'</h1>
                <br>
                <hr>
                <br>
                ${entriesHTML}
            </main>
            ${await renderFooter()}
        `,
        status: 200
    }
}

const renderIndex = async (): Promise<RenderedPage> => {
    const head = `
        <title>Ben's Blog</title>
        <meta name="description" content="ramblings from cyberspace">
      `;

    const allEntries = await Entry.loadAll();
    const entries = Array.from(allEntries.values()).sort((a, b) => b.date!.getTime() - a.date!.getTime()).filter(entry => !entry.hidden);

    const entriesHTML = entries.map(entry => entry.renderTeaser()).join(' ');

    const main = `
        <main>
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
        <meta name="description" content="${entry.description}">
        <meta name="tags" content="${entry.tags.join(', ')}">
        <meta name="date" content="${entry.date?.toISOString()}">
      `;

    const main = `
        <main>
          <article>
            <header class="page-header">
                <h1 class="post-title">${entry.title}</h1>
                <div class="post-side">
                    ${entry.date ? `<time datetime="${entry.date.toISOString()}">${entry.date.toISOString().split('T')[0]}</time>` : ""}
                    <ul role="list">${entry.tags.map(tag => `<li role="listitem"><a href="/tags/${tag}/">#${tag}</a></li>`).join(' ')}</ul>
                </div>
            </header>
            ${entry.content}
          </article>
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

export const render = async (url: string): Promise<RenderedPage> => {
    if ((url === '/') || (url === "") || (url === "/index") || (url === "/index.html")) {
        return await renderIndex();
    }

    const split = url.split("/");
    const page = split[1];
    const pageName = page.split(".")[0];

    if (pageName === "tags") {
        const tag = split[2];
        if (tag) {
            return await renderTag(tag);
        }
        return await renderTags();
    }

    return renderPage(pageName);
}
