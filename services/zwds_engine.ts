
import { STAR_DATA, PALACE_DATA } from '../data';
import { ChartPalace, StarMapping } from '../types';

const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// FIXED: Regex range error resolved by using explicit characters.
const BRANCHES_SAFE = /[子丑寅卯辰巳午未申酉戌亥]/;

export function getLunarDetails(date: Date) {
  try {
    const formatter = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
      year: 'numeric', month: 'numeric', day: 'numeric'
    });
    const parts = formatter.formatToParts(date);
    let m = 1, d = 1;
    parts.forEach(p => {
      if (p.type === 'month') m = parseInt(p.value) || 1;
      if (p.type === 'day') d = parseInt(p.value) || 1;
    });
    return { m, d };
  } catch (e) {
    return { m: date.getMonth() + 1, d: date.getDate() };
  }
}

export function generateZwdsChart(dateStr: string, hourIdx: number): ChartPalace[] {
  const localDate = new Date(`${dateStr}T12:00:00`);
  const lunar = getLunarDetails(localDate);
  
  // Life palace positioning logic
  const hourBranchIdx = hourIdx - 1;
  const lifeIdx = (2 + (lunar.m - 1) - hourBranchIdx + 12) % 12;

  const chart: ChartPalace[] = BRANCHES.map((branch, idx) => {
    const palaceSeq = ['life', 'siblings', 'spouse', 'children', 'wealth', 'health', 'travel', 'friends', 'career', 'property', 'happiness', 'parents'];
    let seqIdx = (lifeIdx - idx + 12) % 12;
    const palaceName = PALACE_DATA.find(p => p.id === palaceSeq[seqIdx])?.name || PALACE_DATA[0].name;
    
    return {
      id: branch,
      palaceName,
      branch: branch,
      stars: []
    };
  });

  // Basic placement for 14 Main Stars
  const ziWeiIdx = (lunar.d + lifeIdx) % 12;
  const placeStar = (id: string, idx: number) => {
    const s = STAR_DATA.find(star => star.id === id);
    if (s && chart[idx]) chart[idx].stars.push(s);
  };

  const zwGroup = ['ziwei', 'tianji', 'taiyang', 'wuqu', 'tiantong', 'lianzhen'];
  zwGroup.forEach((id, i) => placeStar(id, (ziWeiIdx - i + 12) % 12));
  
  const tfGroup = ['tianfu', 'taiyin', 'tanlang', 'jumen', 'tianxiang', 'tianliang', 'qisha', 'pojun'];
  tfGroup.forEach((id, i) => placeStar(id, (ziWeiIdx + i) % 12));

  // Add a few Assistant stars for variety
  placeStar('wenshu', (ziWeiIdx + 2) % 12);
  placeStar('wenchang', (ziWeiIdx + 4) % 12);
  placeStar('qingyang', (ziWeiIdx + 1) % 12);

  return chart;
}
