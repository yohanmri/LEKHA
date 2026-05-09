import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';

export interface TOCItem {
  id: string;          // stable anchor id (used in TOC page links)
  level: number;
  text: string;
  pageId: string;
  pageIndex: number;
}

export const useTableOfContents = () => {
  const { pages } = useAppStore();

  const toc = useMemo(() => {
    const items: TOCItem[] = [];
    const parser = new DOMParser();

    pages.forEach((page, index) => {
      // Skip special generated pages
      if (page.id.startsWith('page-toc-') || page.id.startsWith('page-lof-') ||
          page.id.startsWith('page-lot-') || page.id.startsWith('page-ref-')) return;

      if (!page.content) return;
      const doc = parser.parseFromString(page.content, 'text/html');
      const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

      headings.forEach((heading, hIndex) => {
        const level = parseInt(heading.tagName.replace('H', ''), 10);
        const text = heading.textContent?.trim() || '';
        if (text) {
          // Stable ID: page-<pageId>-h<index> — used in both navigator and TOC anchor links
          const stableId = `${page.id}-h${hIndex}`;
          items.push({
            id: stableId,
            level,
            text,
            pageId: page.id,
            pageIndex: index,
          });
        }
      });
    });

    return items;
  }, [pages]);

  return toc;
};
