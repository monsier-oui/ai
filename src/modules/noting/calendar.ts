import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { google, type calendar_v3 } from 'googleapis';
import 'dotenv/config';
import dayjs, { getCurrentDate } from '@/utils/dayjs.js';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const key = JSON.parse(await fs.readFile(path.join(process.cwd(),'service-account-key.json')));
const GOOGLE_PRIVATE_KEY = key.private_key;
const GOOGLE_CLIENT_EMAIL = key.client_email;
const GOOGLE_PROJECT_NUMBER = key.project_id;
const {GOOGLE_CALENDAR_ID_DEFAULT,GOOGLE_CALENDAR_ID_RELEASE} = process.env;

const auth = new google.auth.JWT(GOOGLE_CLIENT_EMAIL,null,GOOGLE_PRIVATE_KEY,SCOPES);
const calendar = google.calendar({
	version: 'v3',
	project: GOOGLE_PROJECT_NUMBER,
	auth
});

export const getGoogleCalendar = async (today) => {
	if(!today) return null;

  const response = await calendar.events.list({
    calendarId: GOOGLE_CALENDAR_ID_DEFAULT,
    timeMin: today.format(),
    timeMax: today.clone().endOf('date').format(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const data: calendar_v3.Schema$Events = response.data;
	// console.log(data?.items);

  return data?.items?.length
    ? data?.items.map(formatSchedule)
    : [];
};

export const createEventNote = async (today) => {
	if(!today) return null;

  let calendar = await getGoogleCalendar(today);
	const productCalendar = await getProduct(today);
	calendar = [
		...calendar?.map(({summary, start, end, isSingleDay, hasTime, ...rest})=>{
			if(hasTime){
				return {
					summary,
					start,
					...rest
				}
			}
			
				if(isSingleDay){
					return {
						summary,
						...rest
					};
				}

				let suffix = '';
				if(start && start.isSame(today, 'day')){
					suffix = '初日';
				}
				if(end && end.isSame(today, 'day')){
					suffix = '最終日';
				}

				return suffix 
					? {
						summary: `${summary} ${suffix}`,
						...rest
					} 
					: false;
			})
			.filter(v => v),
		...productCalendar
			.filter(({start})=>{
				return start.isSame(today,'day')
			}).map(({summary,...rest})=>{
				return {
					summary: summary + ' 発売日',
					...rest
				}
			})
	]

	return calendar.length > 0 
		? `プロデューサーさん、本日の予定はこちらです。一緒に頑張りましょうね！\n\n` +
			calendar
				.map(({ summary, start, description }) => {
					return `${start ? `${start.format('H:mm')}から ` : ''}${summary}${description ? `\n${description}` : ''}`;
				})
				.join(`\n\n`)
		: null
}
const getProduct = async (today) => {
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

const formatSchedule = ({ start: _start, end: _end, summary, description }: calendar_v3.Schema$Event) => {
	const start = _start?.date ? dayjs(_start.date).tz() : dayjs(_start.dateTime).tz(_start.timeZone);
	const end = _end?.date ? dayjs(_end.date).tz() : dayjs(_end.dateTime).tz(_end.timeZone);
	const isSingleDay = _end?.date && end.diff(start, 'day') === 1 || false;
	const hasTime = _start?.dateTime !== undefined || false;
	
	return {
		summary,
		start,
		end,
		hasTime,
		isSingleDay,
		description: description
			? description.replace('<br>',"\n").replace(/(<([^>]+)>)/gi, '')
			: '',
	};
}
