import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import ja from 'dayjs/locale/ja.js';

dayjs.extend(isBetween);
dayjs.extend(timezone);
dayjs.extend(utc);

dayjs.tz.setDefault('Asia/Tokyo');
dayjs.locale(ja);

export default dayjs;

export type { Dayjs };

export const getCurrentDate = () => {
	return dayjs().tz().startOf('date');
}

export const getCurrentDateTime = () => {
	return dayjs().tz();
}
