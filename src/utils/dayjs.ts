import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';
import utc from 'dayjs/plugin/utc.js';
import ja from 'dayjs/locale/ja.js';

dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.locale(ja);

export default dayjs;
