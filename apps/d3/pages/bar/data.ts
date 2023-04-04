export interface campaignProps {
  score?: number;
  date: string;
  count: number;
}

export const campaign: campaignProps[] = [
  { date: 'May 5 2017', count: 20 },
  { date: 'May 7 2017', count: 55 },
  { date: 'Jun 11 2017', count: 11 },
  { date: 'Jun 25 2017', count: 23 },
  { date: 'Jul 2 2017', count: 14 },
  { date: 'Jul 5 2017', count: 25 },
  { date: 'Jul 7 2017', count: 34 },
  { date: 'Jul 10 2017', count: 52 },
  { date: 'Jul 15 2017', count: 45 },
  { date: 'Jul 17 2017', count: 37 },
];

export const campaign2: campaignProps[] = [
  { date: 'May 5 2017', count: 102 },
  { date: 'May 7 2017', count: 240 },
  { date: 'Jun 11 2017', count: 200 },
  { date: 'Jun 25 2017', count: 400 },
];

export const yLabel = 'y축 제목';

export const margin = { top: 50, right: 50, bottom: 50, left: 50 };

// export const random = (max: number) => Math.floor(Math.random() * max + 1);

// export function getRandomData() {
//   const count = random(campaign.length);
//   const shuffled = campaign.sort(() => 0.5 - Math.random());
//   const data = shuffled.slice(0, count);
//   data.sort((f1, f2) => f1.date.localeCompare(f2.date));
//   for (const item of data) {
//     item.score = random(10);
//   }
//   return data;
// }
