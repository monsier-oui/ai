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

	const timeMin = today.clone().subtract(1, 'second').format();
	const timeMax = today.clone().add(1, 'day').add(1, 'second').format();
  const response = await calendar.events.list({
    calendarId: GOOGLE_CALENDAR_ID_DEFAULT,
    timeMin,
    timeMax,
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
		...calendar?.map(({summary, start, end, isAllDay, isSingleDay, ...rest})=>{
				if(isSingleDay){
					if(isAllDay){
						return {
							summary,
							...rest
						};
					}
				
					return {
						summary,
						start,
						...rest
					}
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
			}).map(({summary,description})=>{
				return {
					summary: summary + ' 発売日',
					description
				}
			})
	]

	return calendar.length > 0 
		? calendar
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
	const start = _start?.dateTime ? dayjs(_start.dateTime).tz(_start.timeZone) : dayjs(_start.date).tz();
	const end = _end?.dateTime ? dayjs(_end.dateTime).tz(_end.timeZone) : dayjs(_end.date).tz().subtract(1, 'day');
	const isAllDay = _end?.date !== undefined;
	const isSingleDay = end.diff(start, 'day') === 0 || false;
	
	return {
		summary,
		start,
		end,
		isAllDay,
		isSingleDay,
		description: description
			? description.replace('<br>',"\n").replace(/(<([^>]+)>)/gi, '')
			: '',
	};
}
