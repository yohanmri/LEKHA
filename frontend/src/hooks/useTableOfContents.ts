import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';

export interface TOCItem {
  id: string;
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
      if (!page.content) return;
      const doc = parser.parseFromString(page.content, 'text/html');
      const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      headings.forEach((heading, hIndex) => {
        const level = parseInt(heading.tagName.replace('H', ''), 10);
        const text = heading.textContent || '';
        if (text.trim()) {
          items.push({
            id: `${page.id}-h${hIndex}`,
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
