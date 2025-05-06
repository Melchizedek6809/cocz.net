import { Entry } from "./entry";
import { escapeHtml } from "./utils";

/**
 * Convert relative URLs to absolute URLs in HTML content
 */
const convertRelativeUrls = (content: string, baseUrl: string): string => {
  // Convert href attributes
  let processedContent = content.replace(/href=(["'])\/(.*?)\1/g, `href=$1${baseUrl}/$2$1`);
  // Convert src attributes
  processedContent = processedContent.replace(/src=(["'])\/(.*?)\1/g, `src=$1${baseUrl}/$2$1`);
  return processedContent;
};

/**
 * Generate an RSS feed from a list of entries
 */
export const generateRSS = async (entries: Map<string, Entry>): Promise<string> => {
  const sortedEntries = Array.from(entries.values())
    .filter(entry => entry.date) // Filter out entries without dates
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return b.date.getTime() - a.date.getTime();
    })
    .slice(0, 20); // Get the 20 most recent entries

  const baseUrl = "https://cocz.net";
  
  const items = sortedEntries.map(entry => {
    const content = convertRelativeUrls(entry.content, baseUrl);
    const pubDate = entry.date ? new Date(entry.date).toUTCString() : new Date().toUTCString();
    
    return `    <item>
      <title>${escapeHtml(entry.title)}</title>
      <link>${baseUrl}/${entry.url}/</link>
      <guid>${baseUrl}/${entry.url}/</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeHtml(entry.description)}</description>
      <content:encoded><![CDATA[${content}]]></content:encoded>
      ${entry.tags.map(tag => `<category>${escapeHtml(tag)}</category>`).join('\n      ')}
    </item>`;
  }).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Cocz.net</title>
    <link>${baseUrl}</link>
    <description>A blog about programming, tech, and projects</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return rss;
}; 