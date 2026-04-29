import { Entry } from "./entry";

const escapeXml = (value: string): string => {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
};

/**
 * Generate an XML sitemap for the website
 */
export const renderSitemap = async (): Promise<string> => {
    // Get all indexable entries. about-me is hidden from the blog index but linked in nav.
    const allEntries = await Entry.loadAll();
    const entries = Array.from(allEntries.values()).filter(entry => !entry.hidden || entry.url === "about-me");

    // Get the last modification date from the entries
    const lastmod = entries.map(entry => entry.date?.toISOString()).sort().pop() || new Date().toISOString();

    // Render the sitemap XML
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Homepage -->
    <url>
        <loc>https://cocz.net/</loc>
        <lastmod>${lastmod}</lastmod>
    </url>

    <!-- Blog entries -->
    ${entries.map(entry => `<url>
        <loc>${escapeXml(entry.getUrl())}</loc>
        <lastmod>${entry.date?.toISOString() || lastmod}</lastmod>
    </url>`).join('\n    ')}
</urlset>`;
}
