import RssParser from 'rss-parser';
import dayjs from '@/utils/dayjs.js'
import { NOTE_SPAN } from './index.js';
import type { Dayjs } from 'dayjs';

interface Feed {
  title?: string;
  link: string;
  categories?: string[];
}

type YouTubeItem = {
  'media:group': {
    'media:description': string;
  };
};

const parser: RssParser<YouTubeItem> = new RssParser({
  customFields: {
    item: ['media:group'],
  },
});

const feedUrls = [
	'https://www.youtube.com/feeds/videos.xml?channel_id=UCe3uJZIjfYwNNR0S6W3GvEA',
	'https://www.youtube.com/feeds/videos.xml?user=Lantis',
];

const getFeed = async (
  url: string,
	currentDateTime: Dayjs
): Promise<{ media: string; items: Feed[] }> => {
  const items: Feed[] = [];
  let media = '';
  await parser
    .parseURL(url)
    .then((result) => {
      media = result.title || '';
			const previousTime = currentDateTime.clone().subtract(NOTE_SPAN, 'minute');
			
      result.items
        .filter(
          (item) =>{
            return (item.categories?.includes('SideM') || item.title?.includes('SideM')) &&
            	dayjs(item.pubDate).isAfter(previousTime)
        })
        .forEach((item) => {
          if (item.link) {
            items.push({
              title: item.title || '',
              link: item.link || '',
              categories: item.categories || [],
            });
          }
        });
    })
    .catch((error) => {
      console.error('RSS取得失敗: ', error);
    });

  return { media, items };
};

export const createFeedNote = async (currentDateTime) => {
	let contents = [];
  for (const url of feedUrls) {
    const feed = await getFeed(url, currentDateTime);
    if (feed && feed.items) {
			for (const {title,link} of feed.items) {
				contents.push(`${feed.media}が更新されましたよ！\n「${title}」\n${link}`);
			}
    }
  }

	return contents.join("\n") || null;
}
