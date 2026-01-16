
import { STAR_DATA, PALACE_DATA, TRANSFORMATION_DATA } from '../data';
import { ChartPalace, StarMapping } from '../types';

const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

interface LunarDate {
  y: number;
  m: number;
  d: number;
  isLeap: boolean;
  lunarYearStemIdx: number;
  lunarYearBranchIdx: number;
}

function extractNum(val: string): number {
  const match = val.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

/**
 * 获取阴历信息及阴历年干支 (用于紫微斗数安星)
 */
function getLunar(date: Date, timezone: string): LunarDate {
  try {
    const formatter = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: timezone
    });
    const parts = formatter.formatToParts(date);

    let y = 2024, m = 1, d = 1, isLeap = false;
    let yearStr = "";
    parts.forEach(p => {
      if (p.type === 'year') {
        y = extractNum(p.value);
        yearStr = p.value; // e.g., "2024丙午年"
      }
      if (p.type === 'month') {
        isLeap = p.value.includes('闰');
        const mNames = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        const cleanM = p.value.replace('闰', '');
        const foundM = mNames.indexOf(cleanM);
        m = foundM !== -1 ? foundM + 1 : extractNum(p.value);
      }
      if (p.type === 'day') d = extractNum(p.value);
    });

    // 解析阴历年的天干地支 (Intl 格式通常包含)
    // 注意：紫微斗数大多使用阴历年干，即农历正月初一更换的干支
    const yearMatch = yearStr.match(/([甲乙丙丁戊己庚辛壬癸])([子丑寅卯辰巳午未申酉戌亥])/);
    const stemIdx = yearMatch ? STEMS.indexOf(yearMatch[1]) : ((y - 4) % 10);
    const branchIdx = yearMatch ? BRANCHES.indexOf(yearMatch[2]) : ((y - 4) % 12);

    return { y, m, d, isLeap, lunarYearStemIdx: stemIdx, lunarYearBranchIdx: branchIdx };
  } catch (e) {
    return { 
      y: date.getFullYear(), m: date.getMonth() + 1, d: date.getDate(), 
      isLeap: false, lunarYearStemIdx: 0, lunarYearBranchIdx: 0 
    };
  }
}

/**
 * 节气计算 (用于八字月柱/年柱判定)
 */
const SOLAR_TERM_OFFSETS = [
  0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 
  263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758
];

function getSolarTermTime(year: number, index: number): number {
  const baseDate = new Date(1900, 0, 6, 2, 5).getTime();
  const yearOffset = 31556925974.7 * (year - 1900);
  return baseDate + yearOffset + SOLAR_TERM_OFFSETS[index] * 60000;
}

function getBazi(solarDate: Date, hourBranchIdx: number) {
  let baziDate = new Date(solarDate.getTime());
  if (hourBranchIdx === 0 && solarDate.getHours() >= 23) {
    baziDate.setDate(baziDate.getDate() + 1);
  }

  const time = baziDate.getTime();
  const year = baziDate.getFullYear();

  const lichunThisYear = getSolarTermTime(year, 2);
  let baziYearNum = time >= lichunThisYear ? year : year - 1;
  const yStemIdx = ((baziYearNum - 4) % 10 + 10) % 10;
  const yBranchIdx = ((baziYearNum - 4) % 12 + 12) % 12;

  const jies = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 0];
  let monthIdx = 0; 
  for (let i = 0; i < 11; i++) {
    const termStart = getSolarTermTime(year, jies[i]);
    if (time >= termStart) monthIdx = i;
  }
  if (time >= getSolarTermTime(year, 22) || time < getSolarTermTime(year, 0)) {
    if (time >= getSolarTermTime(year, 22)) monthIdx = 10; 
    if (time < getSolarTermTime(year, 0)) monthIdx = 11; 
  }
  
  const mBranchIdx = (monthIdx + 2) % 12;
  const mStartStemIdx = (yStemIdx % 5 * 2 + 2) % 10;
  const mStemIdx = (mStartStemIdx + monthIdx) % 10;

  const refDate = new Date(1900, 0, 31).getTime();
  const diffDays = Math.floor((time - refDate) / 86400000);
  const dStemIdx = (diffDays % 10 + 10) % 10;
  const dBranchIdx = ((diffDays + 4) % 12 + 12) % 12; 

  const hStartStemIdx = (dStemIdx % 5 * 2) % 10;
  const hStemIdx = (hStartStemIdx + hourBranchIdx) % 10;

  return {
    year: `${STEMS[yStemIdx]}${BRANCHES[yBranchIdx]}`,
    month: `${STEMS[mStemIdx]}${BRANCHES[mBranchIdx]}`,
    day: `${STEMS[dStemIdx]}${BRANCHES[dBranchIdx]}`,
    hour: `${STEMS[hStemIdx]}${BRANCHES[hourBranchIdx]}`
  };
}

function getPhase(stemIdx: number, branchIdx: number): number {
  const s = Math.floor((stemIdx % 10) / 2);
  const b = Math.floor((branchIdx % 6) / 2);
  const matrix = [[1, 2, 3], [4, 0, 1], [2, 3, 4], [0, 1, 2], [3, 4, 0]];
  const phases = [3, 4, 2, 6, 5]; 
  const resIdx = matrix[s]?.[b] ?? 0;
  return phases[resIdx];
}

export function generateZwdsChart(dateStr: string, hourIdx: number, timezone: string): ChartPalace[] {
  const branchIdx = hourIdx - 1; // 0=子, 1=丑...
  const hourValue = branchIdx === 0 ? 0 : (branchIdx * 2 - 1); 
  const isoString = `${dateStr}T${hourValue.toString().padStart(2, '0')}:30:00`;
  const date = new Date(new Date(isoString).toLocaleString('en-US', { timeZone: timezone }));
  
  const rawLunar = getLunar(date, timezone);
  const bazi = getBazi(date, branchIdx);

  /** 
   * 紫微斗数月份判定规则：
   * 闰月出生，15日（含）之前按本月算，16日之后按下一个月算。
   */
  let zwdsMonth = rawLunar.m;
  if (rawLunar.isLeap && rawLunar.d > 15) {
    zwdsMonth = (zwdsMonth % 12) + 1;
  }

  // 命宫、身宫：寅(2)顺月逆时、寅顺月顺时
  const lifeIdx = (2 + (zwdsMonth - 1) - branchIdx + 12) % 12;
  const bodyIdx = (2 + (zwdsMonth - 1) + branchIdx) % 12;

  // 使用阴历年干安星 (天干四化、禄存等)
  const lunarYearStem = STEMS[rawLunar.lunarYearStemIdx];
  const lunarYearStemIdx = rawLunar.lunarYearStemIdx;

  // 12宫干支布位 (起宫干：甲己起丙寅)
  const startStemIdx = (lunarYearStemIdx % 5 * 2 + 2) % 10;
  const chart: ChartPalace[] = BRANCHES.map((branch, idx) => {
    let seqIdx = (lifeIdx - idx + 12) % 12;
    const palaceId = ['life', 'siblings', 'spouse', 'children', 'wealth', 'health', 'travel', 'friends', 'career', 'property', 'happiness', 'parents'][seqIdx];
    const palaceInfo = PALACE_DATA.find(p => p.id === palaceId)!;
    const stem = STEMS[(startStemIdx + (idx - 2 + 12) % 12) % 10];

    return {
      id: branch,
      palaceName: palaceInfo.name,
      branch: `${stem}${branch}`,
      stars: [],
      transformations: idx === bodyIdx ? ['身宫'] : []
    };
  });

  // 五行局
  const phase = getPhase(STEMS.indexOf(chart[lifeIdx].branch[0]), lifeIdx);

  // --- 安星逻辑 ---

  const getStar = (id: string) => {
    const s = STAR_DATA.find(star => star.id === id);
    return s ? JSON.parse(JSON.stringify(s)) : null;
  };

  const placeStar = (id: string, idx: number) => {
    const s = getStar(id);
    if (s && chart[idx]) chart[idx].stars.push(s);
  };

  // 1. 紫微星系
  let quotient = Math.ceil(rawLunar.d / phase);
  let remainder = (phase * quotient) - rawLunar.d;
  let ziWeiIdx = (remainder % 2 === 0) 
    ? (2 + quotient + remainder) % 12 
    : (2 + quotient - remainder + 12) % 12;

  const zwGroup = ['ziwei', 'tianji', null, 'taiyang', 'wuqu', 'tiantong', null, null, 'lianzhen'];
  zwGroup.forEach((id, i) => { if (id) placeStar(id, (ziWeiIdx - i + 12) % 12); });

  // 2. 天府星系 (与紫微对称，轴线为寅申)
  const tianFuBaseIdx = (2 + 8 - ziWeiIdx + 12) % 12;
  const tfGroup = ['tianfu', 'taiyin', 'tanlang', 'jumen', 'tianxiang', 'tianliang', 'qisha', null, null, null, 'pojun'];
  tfGroup.forEach((id, i) => { if (id) placeStar(id, (tianFuBaseIdx + i) % 12); });

  // 3. 六吉星
  placeStar('zuofu', (4 + (zwdsMonth - 1)) % 12); // 辰起正月顺行
  placeStar('youbi', (10 - (zwdsMonth - 1) + 12) % 12); // 戌起正月逆行
  placeStar('wenchang', (10 - branchIdx + 12) % 12); // 戌起子时逆行
  placeStar('wenqu', (4 + branchIdx) % 12); // 辰起子时顺行
  
  // 天魁、天钺 (基于年干)
  const kuiYueMap: Record<string, [number, number]> = {
    '甲': [1, 7], '乙': [0, 8], '丙': [11, 9], '丁': [11, 9], '戊': [1, 7],
    '己': [0, 8], '庚': [1, 7], '辛': [6, 2], '壬': [3, 5], '癸': [3, 5]
  };
  const [kui, yue] = kuiYueMap[lunarYearStem];
  placeStar('tiankui', kui);
  placeStar('tianyue', yue);

  // 4. 六煞星
  placeStar('dikong', (11 - branchIdx + 12) % 12); // 亥起子时逆行
  placeStar('dijie', (11 + branchIdx) % 12); // 亥起子时顺行
  
  // 擎羊、陀罗 (基于禄存)
  const luCunMap: Record<string, number> = {
    '甲': 2, '乙': 3, '丙': 5, '丁': 6, '戊': 5, '己': 6, '庚': 8, '辛': 9, '壬': 11, '癸': 0
  };
  const luCunIdx = luCunMap[lunarYearStem];
  placeStar('lucun', luCunIdx);
  placeStar('qingyang', (luCunIdx + 1) % 12);
  placeStar('tuoluo', (luCunIdx - 1 + 12) % 12);

  // 火星、铃星 (起例较复杂，根据年支和时辰)
  const getHuoLing = (yearBranch: number, hIdx: number) => {
    const branchType = yearBranch % 4; // 0:寅午戌, 1:申子辰, 2:巳酉丑, 3:亥卯未 (简化逻辑)
    const baseHuo = [1, 2, 3, 9][branchType]; 
    const baseLing = [10, 8, 10, 10][branchType];
    return [(baseHuo + hIdx) % 12, (baseLing + hIdx) % 12];
  };
  // 修正后的火铃逻辑 (基于寅午戌、申子辰、巳酉丑、亥卯未四类年支)
  const fireGroup = [ [2, 6, 10], [0, 4, 8], [5, 1, 9], [11, 3, 7] ];
  let groupIdx = fireGroup.findIndex(g => g.includes(rawLunar.lunarYearBranchIdx));
  if (groupIdx === -1) groupIdx = 0;
  const huoStart = [1, 2, 3, 9][groupIdx];
  const lingStart = [10, 8, 10, 10][groupIdx];
  placeStar('huoxing', (huoStart + branchIdx) % 12);
  placeStar('lingxing', (lingStart + branchIdx) % 12);

  // 5. 杂曜 (天马、红鸾、阴煞)
  const maIdx = [6, 3, 0, 9][rawLunar.lunarYearBranchIdx % 4];
  placeStar('tianma', maIdx);
  placeStar('hongluan', (3 - rawLunar.lunarYearBranchIdx + 12) % 12); // 卯起子逆
  placeStar('yinsha', (2 - ((zwdsMonth - 1) % 6) * 2 + 12) % 12); // 寅起正月逆

  // 6. 四化逻辑
  const siHuaMap: Record<string, Record<string, string>> = {
    '甲': { lianzhen: 'lu', pojun: 'quan', wuqu: 'ke', taiyang: 'ji' },
    '乙': { tianji: 'lu', tianliang: 'quan', ziwei: 'ke', taiyin: 'ji' },
    '丙': { tiantong: 'lu', tianji: 'quan', wenqu: 'ke', lianzhen: 'ji' },
    '丁': { taiyin: 'lu', tiantong: 'quan', tianji: 'ke', jumen: 'ji' },
    '戊': { tanlang: 'lu', taiyin: 'quan', youbi: 'ke', tianji: 'ji' },
    '己': { wuqu: 'lu', tanlang: 'quan', tianliang: 'ke', wenqu: 'ji' },
    '庚': { taiyang: 'lu', wuqu: 'quan', taiyin: 'ke', tiantong: 'ji' },
    '辛': { jumen: 'lu', taiyang: 'quan', wenqu: 'ke', wenchang: 'ji' },
    '壬': { tianliang: 'lu', ziwei: 'quan', zuofu: 'ke', wuqu: 'ji' },
    '癸': { pojun: 'lu', jumen: 'quan', taiyin: 'ke', tanlang: 'ji' },
  };
  const yearSiHua = siHuaMap[lunarYearStem];

  chart.forEach(p => p.stars.forEach(s => {
    const tid = yearSiHua?.[s.id];
    if (tid) (s as any).currentTransformation = TRANSFORMATION_DATA.find(t => t.id === tid);
  }));

  (chart as any).meta = { 
    phase: `${phase}局`, 
    bazi, 
    lunar: `阴历：${rawLunar.isLeap ? '闰' : ''}${rawLunar.m}月${rawLunar.d}日 (${lunarYearStem}${BRANCHES[rawLunar.lunarYearBranchIdx]}年)` 
  };
  return chart;
}
