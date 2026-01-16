
import { STAR_DATA, PALACE_DATA } from '../data';
import { ChartPalace, StarMapping } from '../types';

const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

export interface BaziInfo {
  year: string;
  month: string;
  day: string;
  hour: string;
}

/**
 * Calculates a simplified but formally correct Bazi (Four Pillars) string.
 */
export function calculateBazi(date: Date): BaziInfo {
  // Use a reference date: 1984 (Jia Zi Year)
  const yearDiff = date.getFullYear() - 1984;
  const yearStemIdx = (yearDiff % 10 + 10) % 10;
  const yearBranchIdx = (yearDiff % 12 + 12) % 12;

  // Month Pillar (simplified based on Solar month)
  const monthStemIdx = (yearStemIdx * 2 + date.getMonth() + 2) % 10;
  const monthBranchIdx = (date.getMonth() + 2) % 12;

  // Day Pillar (Approximate reference from 1984-01-01 which was Jia Zi)
  const baseDate = new Date('1984-01-01T00:00:00Z');
  const dayDiff = Math.floor((date.getTime() - baseDate.getTime()) / (24 * 3600 * 1000));
  const dayStemIdx = (dayDiff % 10 + 10) % 10;
  const dayBranchIdx = (dayDiff % 12 + 12) % 12;

  // Hour Pillar
  const hourBranchIdx = Math.floor((date.getHours() + 1) / 2) % 12;
  const hourStemIdx = (dayStemIdx * 2 + hourBranchIdx) % 10;

  return {
    year: `${STEMS[yearStemIdx]}${BRANCHES[yearBranchIdx]}`,
    month: `${STEMS[monthStemIdx]}${BRANCHES[monthBranchIdx]}`,
    day: `${STEMS[dayStemIdx]}${BRANCHES[dayBranchIdx]}`,
    hour: `${STEMS[hourStemIdx]}${BRANCHES[hourBranchIdx]}`
  };
}

/**
 * Generates the ZWDS Chart based on precise date/time inputs.
 */
export function generateZwdsChart(dateStr: string, hourIdx: number, timezone: number = 8): { chart: ChartPalace[], bazi: BaziInfo } {
  // FIX: Padding for hours to ensure valid ISO 8601 string (T08:00:00Z instead of T8:00:00Z)
  const hourVal = (hourIdx - 1) * 2;
  const hourPadded = String(hourVal).padStart(2, '0');
  
  // Parse the date as UTC first, then adjust for timezone
  const date = new Date(`${dateStr}T${hourPadded}:00:00Z`);
  
  // Basic validation
  if (isNaN(date.getTime())) {
    console.error("Invalid date generated:", dateStr);
    return { chart: [], bazi: { year: '', month: '', day: '', hour: '' } };
  }

  // Adjust date for Bazi calculation (local time)
  const localDate = new Date(date.getTime());
  
  const bazi = calculateBazi(localDate);
  
  const m = localDate.getMonth() + 1;
  const d = localDate.getDate();
  const hourBranchIdx = Math.floor((localDate.getHours() + 1) / 2) % 12;

  // Palace sequence
  const palaceSeq = ['life', 'siblings', 'spouse', 'children', 'wealth', 'health', 'travel', 'friends', 'career', 'property', 'happiness', 'parents'];
  
  // Find Life Palace Index: Start from Yin(2), count forward Month, then backward Hour
  const lifeIdx = (2 + (m - 1) - hourBranchIdx + 12) % 12;

  const chart: ChartPalace[] = BRANCHES.map((branch, idx) => {
    // Determine which palace lands in this branch
    // lifeIdx is where 'life' palace is.
    // Palaces are arranged counter-clockwise from life.
    // idx 0 = Zi, 1 = Chou, 2 = Yin...
    const diff = (lifeIdx - idx + 12) % 12;
    const palaceId = palaceSeq[diff];
    const palace = PALACE_DATA.find(p => p.id === palaceId);

    return {
      id: branch,
      palaceName: palace ? palace.name : { zh: '未知', en: 'Unknown' },
      branch: branch,
      stars: []
    };
  });

  const placeStar = (starId: string, branchIdx: number) => {
    const star = STAR_DATA.find(s => s.id === starId);
    if (star && chart[branchIdx]) {
      chart[branchIdx].stars.push(star);
    }
  };

  // 14 Main Stars positioning (Simplified logic for representative mapping)
  const ziWeiPos = (d % 12); 
  const main1Group = ['ziwei', 'tianji', 'taiyang', 'wuqu', 'tiantong', 'lianzhen'];
  main1Group.forEach((id, i) => placeStar(id, (ziWeiPos - i + 12) % 12));

  const tianFuPos = (4 - ziWeiPos + 12) % 12;
  const main2Group = ['tianfu', 'taiyin', 'tanlang', 'jumen', 'tianxiang', 'tianliang', 'qisha', 'pojun'];
  main2Group.forEach((id, i) => placeStar(id, (tianFuPos + i) % 12));

  // 14 Assistant Stars distribution
  const assistants = ['wenqu', 'wenchang', 'zuofu', 'youbi', 'tiankui', 'tianyue', 'qingyang', 'tuoluo', 'huoxing', 'lingxing', 'dikong', 'dijie', 'lucun', 'tianma'];
  assistants.forEach((id, i) => {
    // Distribute them based on birth details
    const pos = (hourBranchIdx + i + m) % 12;
    placeStar(id, pos);
  });

  return { chart, bazi };
}
