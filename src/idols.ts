// アイドル情報
import dayjs, { getCurrentDate, type Dayjs } from '@/utils/dayjs';

const idolsRaw = [
	{
		name: '天ヶ瀬 冬馬',
		kana: 'あまがせ とうま',
		age: 17,
		birthday: '03-03',
		url: 'https://idolmaster-official.jp/sidem/idol/toma'
	},
	{
		name: '御手洗 翔太',
		kana: 'みたらい しょうた',
		age: 14,
		birthday: '04-20',
		url: 'https://idolmaster-official.jp/sidem/idol/shota'
	},
	{
		name: '伊集院 北斗',
		kana: 'いじゅういん ほくと',
		age: 20,
		birthday: '02-14',
		url: 'https://idolmaster-official.jp/sidem/idol/hokuto'
	},
	{
		name: '天道 輝',
		kana: 'てんどう てる',
		age: 28,
		birthday: '02-23',
		url: 'https://idolmaster-official.jp/sidem/idol/teru'
	},
	{
		name: '桜庭 薫',
		kana: 'さくらば かおる',
		age: 26,
		birthday: '09-24',
		url: 'https://idolmaster-official.jp/sidem/idol/kaoru'
	},
	{
		name: '柏木 翼',
		kana: 'かしわぎ つばさ',
		age: 24,
		birthday: '06-02',
		url: 'https://idolmaster-official.jp/sidem/idol/tsubasa'
	},
	{
		name: '都築 圭',
		kana: 'つづき けい',
		age: undefined,
		birthday: '04-02',
		url: 'https://idolmaster-official.jp/sidem/idol/kei'
	},
	{
		name: '神楽 麗',
		kana: 'かぐら れい',
		age: 16,
		birthday: '06-17',
		url: 'https://idolmaster-official.jp/sidem/idol/rei'
	},
	{
		name: '鷹城 恭二',
		kana: 'たかじょう きょうじ',
		age: 20,
		birthday: '02-02',
		url: 'https://idolmaster-official.jp/sidem/idol/kyoji'
	},
	{
		name: 'ピエール',
		kana: 'ぴえーる',
		age: 15,
		birthday: '08-01',
		url: 'https://idolmaster-official.jp/sidem/idol/pierre'
	},
	{
		name: '渡辺 みのり',
		kana: 'わたなべ みのり',
		age: 31,
		birthday: '03-22',
		url: 'https://idolmaster-official.jp/sidem/idol/minori'
	},
	{
		name: '蒼井 悠介',
		kana: 'あおい ゆうすけ',
		age: 18,
		birthday: '07-07',
		url: 'https://idolmaster-official.jp/sidem/idol/yusuke'
	},
	{
		name: '蒼井 享介',
		kana: 'あおい きょうすけ',
		age: 18,
		birthday: '07-07',
		url: 'https://idolmaster-official.jp/sidem/idol/kyosuke'
	},
	{
		name: '握野 英雄',
		kana: 'あくの ひでお',
		age: 23,
		birthday: '03-07',
		url: 'https://idolmaster-official.jp/sidem/idol/hideo'
	},
	{
		name: '木村 龍',
		kana: 'きむら りゅう',
		age: 20,
		birthday: '05-05',
		url: 'https://idolmaster-official.jp/sidem/idol/ryu'
	},
	{
		name: '信玄 誠司',
		kana: 'しんげん せいじ',
		age: 31,
		birthday: '12-24',
		url: 'https://idolmaster-official.jp/sidem/idol/seiji'
	},
	{
		name: '猫柳 キリオ',
		kana: 'ねこやなぎ きりお',
		age: 18,
		birthday: '11-12',
		url: 'https://idolmaster-official.jp/sidem/idol/kirio'
	},
	{
		name: '華村 翔真',
		kana: 'はなむら しょうま',
		age: 27,
		birthday: '08-24',
		url: 'https://idolmaster-official.jp/sidem/idol/shoma'
	},
	{
		name: '清澄 九郎',
		kana: 'きよすみ くろう',
		age: 19,
		birthday: '07-03',
		url: 'https://idolmaster-official.jp/sidem/idol/kuro'
	},
	{
		name: '秋山 隼人',
		kana: 'あきやま はやと',
		age: 17,
		birthday: '11-22',
		url: 'https://idolmaster-official.jp/sidem/idol/hayato'
	},
	{
		name: '冬美 旬',
		kana: 'ふゆみ じゅん',
		age: 16,
		birthday: '01-02',
		url: 'https://idolmaster-official.jp/sidem/idol/jun'
	},
	{
		name: '榊 夏来',
		kana: 'さかき なつき',
		age: 17,
		birthday: '06-18',
		url: 'https://idolmaster-official.jp/sidem/idol/natsuki'
	},
	{
		name: '若里 春名',
		kana: 'わかざと はるな',
		age: 18,
		birthday: '03-30',
		url: 'https://idolmaster-official.jp/sidem/idol/haruna'
	},
	{
		name: '伊瀬谷 四季',
		kana: 'いせや しき',
		age: 16,
		birthday: '04-12',
		url: 'https://idolmaster-official.jp/sidem/idol/shiki'
	},
	{
		name: '紅井 朱雀',
		kana: 'あかい すざく',
		age: 16,
		birthday: '04-04',
		url: 'https://idolmaster-official.jp/sidem/idol/suzaku'
	},
	{
		name: '黒野 玄武',
		kana: 'くろの げんぶ',
		age: 17,
		birthday: '07-22',
		url: 'https://idolmaster-official.jp/sidem/idol/genbu'
	},
	{
		name: '神谷 幸広',
		kana: 'かみや ゆきひろ',
		age: 21,
		birthday: '01-17',
		url: 'https://idolmaster-official.jp/sidem/idol/yukihiro'
	},
	{
		name: '東雲 荘一郎',
		kana: 'しののめ そういちろう',
		age: 21,
		birthday: '11-08',
		url: 'https://idolmaster-official.jp/sidem/idol/soichiro'
	},
	{
		name: 'アスラン＝ベルゼビュートⅡ世',
		kana: 'あすらんべるぜびゅーとにせい',
		age: 26,
		birthday: '10-09',
		url: 'https://idolmaster-official.jp/sidem/idol/asselin'
	},
	{
		name: '卯月 巻緒',
		kana: 'うづき まきお',
		age: 18,
		birthday: '12-12',
		url: 'https://idolmaster-official.jp/sidem/idol/makio'
	},
	{
		name: '水嶋 咲',
		kana: 'みずしま さき',
		age: 18,
		birthday: '08-19',
		url: 'https://idolmaster-official.jp/sidem/idol/saki'
	},
	{
		name: '岡村 直央',
		kana: 'おかむら なお',
		age: 11,
		birthday: '03-25',
		url: 'https://idolmaster-official.jp/sidem/idol/nao'
	},
	{
		name: '橘 志狼',
		kana: 'たちばな しろう',
		age: 11,
		birthday: '04-22',
		url: 'https://idolmaster-official.jp/sidem/idol/shiro'
	},
	{
		name: '姫野 かのん',
		kana: 'ひめの かのん',
		age: 9,
		birthday: '02-10',
		url: 'https://idolmaster-official.jp/sidem/idol/kanon'
	},
	{
		name: '硲 道夫',
		kana: 'はざま みちお',
		age: 32,
		birthday: '01-13',
		url: 'https://idolmaster-official.jp/sidem/idol/michio'
	},
	{
		name: '舞田 類',
		kana: 'まいた るい',
		age: 23,
		birthday: '08-08',
		url: 'https://idolmaster-official.jp/sidem/idol/rui'
	},
	{
		name: '山下 次郎',
		kana: 'やました じろう',
		age: 30,
		birthday: '09-01',
		url: 'https://idolmaster-official.jp/sidem/idol/jiro'
	},
	{
		name: '大河 タケル',
		kana: 'たいが たける',
		age: 17,
		birthday: '12-21',
		url: 'https://idolmaster-official.jp/sidem/idol/takeru'
	},
	{
		name: '円城寺 道流',
		kana: 'えんじょうじ みちる',
		age: 24,
		birthday: '09-14',
		url: 'https://idolmaster-official.jp/sidem/idol/michiru'
	},
	{
		name: '牙崎 漣',
		kana: 'きざき れん',
		age: 18,
		birthday: '05-14',
		url: 'https://idolmaster-official.jp/sidem/idol/ren'
	},
	{
		name: '秋月 涼',
		kana: 'あきづき りょう',
		age: 15,
		birthday: '09-15',
		url: 'https://idolmaster-official.jp/sidem/idol/ryo'
	},
	{
		name: '兜 大吾',
		kana: 'かぶと だいご',
		age: 14,
		birthday: '05-20',
		url: 'https://idolmaster-official.jp/sidem/idol/daigo'
	},
	{
		name: '九十九 一希',
		kana: 'つくも かずき',
		age: 19,
		birthday: '10-13',
		url: 'https://idolmaster-official.jp/sidem/idol/kazuki'
	},
	{
		name: '葛之葉 雨彦',
		kana: 'くずのは あめひこ',
		age: 30,
		birthday: '10-31',
		url: 'https://idolmaster-official.jp/sidem/idol/amehiko'
	},
	{
		name: '北村 想楽',
		kana: 'きたむら そら',
		age: 19,
		birthday: '11-28',
		url: 'https://idolmaster-official.jp/sidem/idol/sora'
	},
	{
		name: '古論 クリス',
		kana: 'ころん くりす',
		age: 29,
		birthday: '10-11',
		url: 'https://idolmaster-official.jp/sidem/idol/chris'
	},
	{
		name: '天峰 秀',
		kana: 'あまみね しゅう',
		age: 16,
		birthday: '12-01',
		url: 'https://idolmaster-official.jp/sidem/idol/shu'
	},
	{
		name: '花園 百々人',
		kana: 'はなぞの ももひと',
		age: 17,
		birthday: '06-30',
		url: 'https://idolmaster-official.jp/sidem/idol/momohito'
	},
	{
		name: '眉見 鋭心',
		kana: 'まゆみ えいしん',
		age: 18,
		birthday: '05-23',
		url: 'https://idolmaster-official.jp/sidem/idol/eishin'
	},
];

interface IdolBirthday {
	date: Dayjs
	daysUntil: number
}

interface IdolRawData {
	name: string
	kana: string
	age?: number
	birthday: string
	url: string
}

interface IdolData {
	name: string
	kana: string
	age?: number
	birthday: IdolBirthday
	url: string
}

export class Idol {
	name:string
	kana:string
	age?:number
	birthday: IdolBirthday
	url:string
	
	constructor(data: IdolRawData, today?: Dayjs) {
		this.name = data.name
		this.kana = data.kana
		this.age = data.age
		this.birthday = this.getNextBirthday(today,data.birthday)
		this.url = data.url
	}

	getNextBirthday(today: Dayjs = getCurrentDate(), birthday: string): IdolBirthday {
		const thisYearBirthday = dayjs(`${today.year()}-${birthday}`);
		const date = thisYearBirthday.isBefore(today, 'date')
				? thisYearBirthday.add(1, 'year')
				: thisYearBirthday;

		return {
			date,
			daysUntil: date.diff(today, 'day')
		};
	}

	isBirthday(today: Dayjs): boolean {
		return today.isSame(this.birthday.date);
	}

	getNameWithTitle(): string {
		const title = this.name === '水嶋 咲' ? 'ちゃん' : this.age && this.age < 20 ? 'くん' : 'さん';

		return `${this.name}${title}`;
	}
}

export class IdolList {
	idols: Idol[]

	constructor(today?: Dayjs){
		this.idols = idolsRaw.map((data: IdolRawData) => new Idol(data, today));
	}
	
	getBirthdayIdol(today: Dayjs): Idol[] {
		return this.idols.filter((idol) => {
			return idol.isBirthday(today);
		});
	}
	
	getNextBirthdayIdol(today: Dayjs): Idol[] {
		const sortedIdols = [...this.idols].sort((a,b)=>a.birthday.date.valueOf() - b.birthday.date.valueOf());

		if(sortedIdols[0].birthday.date.format('MM-DD') === '07-07'){
			return [sortedIdols[2]];
		}else if(sortedIdols[1].birthday.date.format('MM-DD') === '07-07'){
			return [sortedIdols[1],sortedIdols[2]]
		}else{
			return [sortedIdols[1]];
		}
	}
}
