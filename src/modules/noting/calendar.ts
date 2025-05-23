import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { google, type calendar_v3 } from 'googleapis';
import 'dotenv/config';
import dayjs, {today} from '@/utils/dayjs.js';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const key = JSON.parse(await fs.readFile(path.join(process.cwd(),'service-account-key.json')));
const GOOGLE_PRIVATE_KEY = key.private_key;
const GOOGLE_CLIENT_EMAIL = key.client_email;
const GOOGLE_PROJECT_NUMBER = key.project_id;
const GOOGLE_CALENDAR_ID = '315.yamamura.bot@gmail.com';
const GOOGLE_CALENDAR_ID_RELEASE = '39f3cad4fd58a0f9cae1b2df295572eb2af83987e6a70bc0b1394bfd692e66ae@group.calendar.google.com';

const auth = new google.auth.JWT(GOOGLE_CLIENT_EMAIL,null,GOOGLE_PRIVATE_KEY,SCOPES);
const calendar = google.calendar({
	version: 'v3',
	project: GOOGLE_PROJECT_NUMBER,
	auth
});

export const getGoogleCalendar = async () => {
  const response = await calendar.events.list({
    calendarId: GOOGLE_CALENDAR_ID,
    timeMin: today.format(),
    timeMax: today.clone().endOf('date').format(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const data: calendar_v3.Schema$Events = response.data;
	// console.log({data});

  return data?.items?.length
    ? data?.items.map(formatSchedule)
    : [];
};

export const createEventNote = async () => {
  let calendar = await getGoogleCalendar();
	const productCalendar = await getProduct();
	calendar = [
		...calendar,
		...productCalendar
			.filter(({date})=>{
				return date.isSame(today,'day')
			}).map(({summary,...rest})=>{
				return {
					summary: summary + ' 発売日',
					...rest
				}
			})
	]
  if (calendar) {
    return `プロデューサさん、本日の予定はこちらです。一緒に頑張りましょうね！\n\n` +
      calendar
        .map(({ hour, summary, description }) => {
          return `${hour ? `${hour}から ` : ''}${summary}${description ? `\n${description}` : ''}`;
        })
        .join(`\n\n`);
  }
}
const getProduct = async () => {
  const response = await calendar.events.list({
    calendarId: GOOGLE_CALENDAR_ID_RELEASE,
    timeMin: today.clone().subtract(1, 'month').utc().format(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const data: calendar_v3.Schema$Events = response.data;

	return data?.items?.length > 0
		? data?.items
			.map(formatSchedule)
		: [];
};

const formatSchedule = ({ start, summary, description }: calendar_v3.Schema$Event) => {
	return {
		summary,
		date: start?.dateTime ? dayjs(start.dateTime).tz(start.timeZone) : dayjs(start?.date).tz(),
		hour: start?.dateTime ? `${dayjs(start?.dateTime).tz().format('H:mm')}` : null,
		description: description
			? description.replace(/(<([^>]+)>)/gi, '')
			: '',
	};
}
