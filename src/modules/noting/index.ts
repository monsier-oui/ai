import { bindThis } from '@/decorators.js';
import Module from '@/module.js';
import serifs from '@/serifs.js';
import { genItem } from '@/vocabulary.js';
import config from '@/config.js';
import { createFeedNote } from './feed.js';
import { createBirthdayNote } from './birthday.js';
import { createEventNote } from './calendar.js';
import dayjs, { getCurrentDateTime } from '@/utils/dayjs.js'

// 投稿スパン
export const NOTE_SPAN = 10;

export default class extends Module {
	public readonly name = 'noting';

	@bindThis
	public install() {
		if (config.notingEnabled === false) return {};
		
		setInterval(
			() => {
				this.post();
			}, 
			1000 * 60 * NOTE_SPAN
		);

		return {};
	}	

	@bindThis
	private async post() {
		let noNotes = true;
		
		const currentDateTime = getCurrentDateTime();
		const minMorning = dayjs().tz().hour(9).minute(0).second(0);
		const maxMorning = dayjs().tz().hour(9).minute(NOTE_SPAN).second(0);
		const isMorning = currentDateTime.isBetween(minMorning, maxMorning)
		const minEvening = dayjs().tz().hour(18).minute(0).second(0)
		const maxEvening = dayjs().tz().hour(18).minute(NOTE_SPAN).second(0)
		const isWeekendEvening = dayjs().tz().day() === 5 && currentDateTime.isBetween(minEvening,maxEvening)
		if(isMorning){
			// 朝のお知らせ
			// 誕生日
			const birthdayNote = await createBirthdayNote()
			if(birthdayNote){
				this.ai.post({ text: birthdayNote });
				noNotes = false
			}
			// 本日の予定
			const eventNote = await createEventNote()
			if(eventNote){
				this.ai.post({ text: eventNote });
				noNotes = false
			}
		}else if(isWeekendEvening){
			// 週末のあいさつ
			// TODO: 季節によって変わるとうれしい
			this.ai.post({ text: 'プロデューサーさん、今週もお疲れさまでした！' });
			noNotes = false
		}
		// フィードのチェック
		const feedNote = await createFeedNote();
		if(feedNote){
			this.ai.post({ text: feedNote });
			noNotes = false
		}


		// if(noNotes && Math.random() < 0.04){
		// 	const notes = [
		// 		...serifs.noting.notes,
		// 		() => {
		// 			const item = genItem();
		// 			return serifs.noting.want(item);
		// 		},
		// 		() => {
		// 			const item = genItem();
		// 			return serifs.noting.see(item);
		// 		},
		// 		() => {
		// 			const item = genItem();
		// 			return serifs.noting.expire(item);
		// 		},
		// 	];
	
	
		// 	note = notes[Math.floor(Math.random() * notes.length)];
	
		// 	// TODO: 季節に応じたセリフ
	
		// 	this.ai.post({
		// 		text: typeof note === 'function' ? note() : note
		// 	});
		// }
	}
}
