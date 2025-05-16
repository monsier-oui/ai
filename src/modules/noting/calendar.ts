import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { google, type calendar_v3 } from 'googleapis';
import 'dotenv/config';
import dayjs from '@/utils/dayjs.js';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const key = JSON.parse(await fs.readFile(path.join(process.cwd(),'service-account-key.json')));
const GOOGLE_PRIVATE_KEY = key.private_key;
const GOOGLE_CLIENT_EMAIL = key.client_email;
const GOOGLE_PROJECT_NUMBER = key.project_id;
const GOOGLE_CALENDAR_ID = '315.yamamura.bot@gmail.com';

const auth = new google.auth.JWT(GOOGLE_CLIENT_EMAIL,null,GOOGLE_PRIVATE_KEY,SCOPES);
const calendar = google.calendar({
	version: 'v3',
	project: GOOGLE_PROJECT_NUMBER,
	auth
});

export const getGoogleCalendar = async () => {
  const today = dayjs().startOf('date');
  const response = await calendar.events.list({
    calendarId: GOOGLE_CALENDAR_ID,
    timeMin: today.utc().format(),
    timeMax: today.clone().endOf('date').utc().format(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const listResults: calendar_v3.Schema$Events = response.data;
	// console.log({listResults});

  return listResults?.items?.length
    ? listResults?.items.map(
        ({ start, summary, description }: calendar_v3.Schema$Event) => {
					// console.log({start,summary,description});
          const isAllDay = start?.dateTime === undefined;
          const date = isAllDay ? start?.date : start?.dateTime;

          return {
            start: !isAllDay ? `${dayjs(date).format('H:mmから')} ` : '',
            summary,
            description: description
              ? `\n` + description.replace(/(<([^>]+)>)/gi, '')
              : '',
          };
        }
      )
    : false;
};

export const createEventNote = async () => {
  const calendar = await getGoogleCalendar();
  if (calendar) {
    return `プロデューサさん、本日の予定はこちらです。一緒に頑張りましょうね！\n` +
      calendar
        .map(({ start, summary, description }) => {
          return `${start}${summary}${description}`;
        })
        .join(`\n`);
  }
}

const getProduct = async () => {
  const today = dayjs().startOf('date');
  const listParams: calendar_v3.Params$Resource$Events$List = {
    calendarId: GOOGLE_CALENDAR_ID_RELEASE,
    timeMin: today.subtract(1, 'month').utc().format(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  };
  const response = await calendar.events.list(listParams);
  const listResults: calendar_v3.Schema$Events = response.data;
  const length = listResults?.items?.length || 0;
  const rand = Math.floor(Math.random() * length);

  const result =
    listResults.items &&
    length > 0 &&
    listResults?.items
      .filter((_, i) => i === rand)
      .map(({ start, summary, description }: calendar_v3.Schema$Event) => {
        const status = dayjs(start?.date).isBefore(today)
          ? '発売中'
          : `${dayjs(start?.date).format('M月D日')}発売`;

        const product = {
          summary,
          status,
          description: description
            ? `\n` + description.replace(/(<([^>]+)>)/gi, '')
            : '',
        };

        return product;
      });

  return Array.isArray(result) && result[0];
};
