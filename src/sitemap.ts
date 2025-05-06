import { Entry } from "./entry";

/**
 * Generate an XML sitemap for the website
 */
export const renderSitemap = async (): Promise<string> => {
    // Get all non-hidden entries
    const allEntries = await Entry.loadAll();
    const entries = Array.from(allEntries.values()).filter(entry => !entry.hidden);

    // Extract all unique tags from entries
    const tags = [...new Set(entries.map(entry => entry.tags).flat())];

    // Get the last modification date from the entries
    const lastmod = entries.map(entry => entry.date?.toISOString()).sort().pop() || new Date().toISOString();

    // Render the sitemap XML
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Homepage -->
    <url>
        <loc>https://cocz.net/</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>

    <!-- Blog entries -->
    ${entries.map(entry => `<url>
        <loc>${entry.getUrl()}</loc>
        <lastmod>${entry.date?.toISOString() || lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>`).join('\n    ')}

    <!-- Tags page -->
    <url>
        <loc>https://cocz.net/tags/</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
    </url>

    <!-- Individual tag pages -->
    ${tags.map(tag => `<url>
        <loc>https://cocz.net/tags/${tag}/</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
    </url>`).join('\n    ')}
</urlset>`;
}