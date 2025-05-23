import RssParser from 'rss-parser';
import dayjs, {now} from '@/utils/dayjs.js'
import { NOTE_SPAN } from './index.js';

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
  url: string
): Promise<{ media: string; items: Feed[] }> => {
  const items: Feed[] = [];
  let media = '';
  await parser
    .parseURL(url)
    .then((result) => {
      media = result.title || '';
      result.items
        .filter(
          (item) =>{
            return (item.categories?.includes('SideM') || item.title?.includes('SideM')) &&
            	dayjs(item.pubDate).isAfter(now.clone().subtract(NOTE_SPAN, 'minute'))
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

export const createFeedNote = async () => {
	let contents = [];
  for (const url of feedUrls) {
    const feed = await getFeed(url);
    if (feed && feed.items) {
			for (const {title,link} of feed.items) {
				contents.push(`${feed.media}が更新されましたよ！\n「${title}」\n${link}`);
			}
    }
  }

	return contents.join("\n");
}
