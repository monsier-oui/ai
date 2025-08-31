import dayjs, { getCurrentDate, type Dayjs } from '@/utils/dayjs.js';
import { Idol,IdolList } from '@/idols.js';

export const getBirthdayData = (today: Dayjs) => {
	const idolList = new IdolList(today);
	const idols = idolList.getBirthdayIdol(today);

	if(idols.length > 0){
		const next = idolList.getNextBirthdayIdol(today);
		const nextBirthday = next[0].birthday.date.format('M月D日');

		return {
			idols,
			next,
			nextBirthday,
		};
	}

	return null;
}

export const createBirthdayNote = (today) => {
	const birthdayData = getBirthdayData(today);
	
	if(birthdayData){
		const {idols,next,nextBirthday} = birthdayData;
		const names = idols.map((idol)=>idol.getNameWithTitle()).join('、');
		const urls = idols.map(({url})=>url).join(`\n`);
		
		const nextNames = next.map((idol)=>idol.getNameWithTitle()).join('、');

		return `今日は${names}の誕生日です！ おめでとうございます！\n`
		+`次のお誕生日は${nextNames}（${nextBirthday}）で、あと${next[0].birthday.daysUntil}日です。\n` + `${urls}`;
	}

	return null;
};
