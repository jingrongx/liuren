import { Solar, Lunar } from 'lunar-javascript';

export interface Gua {
  result: string;
  desc: string;
  gua: string;
  element: string;
}

export const guaList: Gua[] = [
  { result: "大安", desc: "大吉，诸事顺利", gua: "震", element: "木" },
  { result: "留连", desc: "小凶，事情拖延", gua: "巽", element: "木" },
  { result: "速喜", desc: "中吉，快速成功", gua: "离", element: "火" },
  { result: "赤口", desc: "大凶，口舌是非", gua: "兑", element: "金" },
  { result: "小吉", desc: "小吉，平稳顺利", gua: "坎", element: "水" },
  { result: "空亡", desc: "大凶，诸事不顺", gua: "中", element: "土" },
  { result: "病符", desc: "小凶，健康不佳", gua: "坤", element: "土" },
  { result: "桃花", desc: "中吉，感情运势", gua: "艮", element: "土" },
  { result: "天德", desc: "大吉，贵人相助", gua: "乾", element: "金" }
];

export const shichenMap: Record<string, number> = {
  "子": 1, "丑": 2, "寅": 3, "卯": 4,
  "辰": 5, "巳": 6, "午": 7, "未": 8,
  "申": 9, "酉": 10, "戌": 11, "亥": 12
};

export const shichenNames = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

export interface DivinationResult {
  solarDate: string;
  lunarDate: string;
  shichen: string;
  gua: Gua;
  steps: {
    step1: { index: number; gua: Gua };
    step2: { index: number; gua: Gua };
    step3: { index: number; gua: Gua };
  };
}

export interface FutureGuaItem {
  time: string;
  shichenName: string;
  gua: Gua;
}

export interface FutureGuaDay {
  date: string;
  lunarDate: string;
  times: FutureGuaItem[];
}

export function getGuaIndex(step1: number, step2: number, step3: number): number {
  const monthIndex = (step1 - 1) % guaList.length;
  const dayIndex = (monthIndex + step2 - 1) % guaList.length;
  const finalIndex = (dayIndex + step3 - 1) % guaList.length;
  return finalIndex;
}

export function getShichenNumber(hour: number): number {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  const solar = Solar.fromDate(date);
  const lunar = Lunar.fromSolar(solar);
  const zhi = lunar.getTimeZhi();
  return shichenMap[zhi] || 1;
}

export function getShichenName(hour: number): string {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  const solar = Solar.fromDate(date);
  const lunar = Lunar.fromSolar(solar);
  return `${lunar.getTimeZhi()}时`;
}

export function getLunarTime(date: Date): { month: number; day: number; hour: number } {
  const solar = Solar.fromDate(date);
  const lunar = Lunar.fromSolar(solar);
  return {
    month: lunar.getMonth(),
    day: lunar.getDay(),
    hour: date.getHours()
  };
}

export function calculateDivination(date: Date, shichen: string): DivinationResult {
  const solar = Solar.fromDate(date);
  const lunar = Lunar.fromSolar(solar);
  
  const lunarMonth = lunar.getMonth();
  const lunarDay = lunar.getDay();
  
  let step3: number;
  let shichenName: string;
  
  if (shichen === "当前") {
    const hour = date.getHours();
    step3 = getShichenNumber(hour);
    shichenName = getShichenName(hour);
  } else {
    step3 = shichenMap[shichen[0]] || 1;
    shichenName = `${shichen}时`;
  }
  
  const step1 = lunarMonth;
  const step2 = lunarDay;
  
  const step1Index = (step1 - 1) % guaList.length;
  const step2Index = (step1Index + step2 - 1) % guaList.length;
  const step3Index = (step2Index + step3 - 1) % guaList.length;
  
  const gua = guaList[step3Index];
  
  const lunarDateStr = `${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()}日`;
  
  return {
    solarDate: solar.toYmd(),
    lunarDate: lunarDateStr,
    shichen: shichenName,
    gua,
    steps: {
      step1: { index: step1Index, gua: guaList[step1Index] },
      step2: { index: step2Index, gua: guaList[step2Index] },
      step3: { index: step3Index, gua: guaList[step3Index] }
    }
  };
}

export function getFutureGua(days: number = 3): FutureGuaDay[] {
  const results: FutureGuaDay[] = [];
  
  for (let day = 0; day < days; day++) {
    const date = new Date();
    date.setDate(date.getDate() + day);
    
    const solar = Solar.fromDate(date);
    const lunar = Lunar.fromSolar(solar);
    const lunarMonth = lunar.getMonth();
    const lunarDay = lunar.getDay();
    
    const dayResults: FutureGuaItem[] = [];
    
    for (let hour = 0; hour < 24; hour += 2) {
      const shichenNum = getShichenNumber(hour);
      const guaIndex = getGuaIndex(lunarMonth, lunarDay, shichenNum);
      const gua = guaList[guaIndex];
      
      const shichenIndex = Math.floor(hour / 2) % 12;
      const shichenName = shichenNames[shichenIndex] + "时";
      
      dayResults.push({
        time: `${hour.toString().padStart(2, '0')}:00-${(hour + 2) % 24 === 0 ? '24' : (hour + 2).toString().padStart(2, '0')}:00`,
        shichenName,
        gua
      });
    }
    
    results.push({
      date: solar.toYmd(),
      lunarDate: `${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()}日`,
      times: dayResults
    });
  }
  
  return results;
}
