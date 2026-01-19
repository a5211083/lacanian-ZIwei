
import { STAR_DATA, PALACE_DATA } from '../data';
import { ChartPalace, StarMapping, StarCategory } from '../types';

const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

export interface BaziInfo {
  year: string;
  month: string;
  day: string;
  hour: string;
}

/**
 * 计算简化的八字信息
 */
export function calculateBazi(date: Date): BaziInfo {
  const year = date.getFullYear(), month = date.getMonth(), day = date.getDate(), hour = date.getHours(), minute = date.getMinutes();

    const getJD = (y: number, m: number, d: number, h: number, min: number) => {
        if (m <= 2) { y -= 1; m += 12; }
        const A = Math.floor(y / 100);
        const B = 2 - A + Math.floor(A / 4);
        const dayFraction = (h + min / 60) / 24;
        return Math.floor(365.25 * (y + 4716)) + 
               Math.floor(30.6001 * (m + 1)) + 
               d + dayFraction + B - 1524.5;
    };

    const getSolarLongitude = (jd: number) => {
        const D = jd - 2451545.0;
        const rad = Math.PI / 180;
        let L = (280.460 + 0.9856474 * D) % 360;
        let g = (357.528 + 0.9856003 * D) % 360;
        let lambda = L + 1.915 * Math.sin(g * rad) + 0.020 * Math.sin(2 * g * rad);
        if (lambda < 0) lambda += 360;
        if (lambda >= 360) lambda -= 360;
        return lambda;
    };

    const jd = getJD(year, month, day, hour, minute);
    const lambda = getSolarLongitude(jd);

    let baziYear = year;
    if (month <= 2 && lambda >= 270 && lambda < 315) {
        baziYear = year - 1;
    }
    
    const yearOffset = (baziYear - 1260 + 60000) % 60;
    const yearGanIdx = yearOffset % 10;

    let correctedLambda = lambda;
    if (lambda < 315) {
        correctedLambda = lambda + 360;
    }
    
    const monthBranchTerm = Math.floor((correctedLambda - 315) / 30);
    const monthZhiIdx = (2 + monthBranchTerm + 1) % 12;

    const monthGanBase = (yearGanIdx % 5) * 2 + 2;
    const monthGanIdx = (monthGanBase + monthBranchTerm + 1) % 10;

    const dayCyclical = Math.floor(jd + 0.5 + 49); 
    const dayOffset = dayCyclical % 60;
    const dayGanIdx = dayOffset % 10;

    const hourZhiIdx = (Math.floor((hour + 1) / 2) + 8) % 12;
    const hourGanBase = (dayGanIdx % 5) * 2;
    const hourGanIdx = (hourGanBase + hourZhiIdx + 2) % 10;


  return {
    year: `${GAN[yearGanIdx]}${ZHI[yearOffset % 12]}`,
    month: `${GAN[monthGanIdx]}${ZHI[monthZhiIdx]}`,
    day: `${GAN[(dayOffset + 1) % 10]}${ZHI[(dayOffset + 7) % 12]}`,
    hour: `${GAN[hourGanIdx]}${ZHI[hourZhiIdx]}`
  };
}


/**
 * 生成基于拉康 RSI 框架的紫微命盘
 */
export function generateZwdsChart(dateStr: string, hourIdx: number, timezone: number = 8): { chart: ChartPalace[], bazi: BaziInfo } {
  const hourVal = (hourIdx - 1) * 2;
  const hourPadded = String(hourVal).padStart(2, '0');
  const date = new Date(`${dateStr}T${hourPadded}:00:00Z`);
  
  if (isNaN(date.getTime())) {
    console.error("Invalid date generated:", dateStr);
    return { chart: [], bazi: { year: '', month: '', day: '', hour: '' } };
  }

  const localDate = new Date(date.getTime());
  const bazi = calculateBazi(localDate);
  
  const m = localDate.getMonth() + 1;
  const d = localDate.getDate();
  const hourBranchIdx = Math.floor((localDate.getHours() + 1) / 2) % 12;

  const palaceSeq = ['life', 'siblings', 'spouse', 'children', 'wealth', 'health', 'travel', 'friends', 'career', 'property', 'happiness', 'parents'];
  const lifeIdx = (2 + (m - 1) - hourBranchIdx + 12) % 12;

  const chart: ChartPalace[] = ZHI.map((branch, idx) => {
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

  // 14 主星定位 (基于简单数学映射)
  const ziWeiPos = (d % 12); 
  const main1Group = ['ziwei', 'tianji', 'taiyang', 'wuqu', 'tiantong', 'lianzhen'];
  main1Group.forEach((id, i) => placeStar(id, (ziWeiPos - i + 12) % 12));

  const tianFuPos = (4 - ziWeiPos + 12) % 12;
  const main2Group = ['tianfu', 'taiyin', 'tanlang', 'jumen', 'tianxiang', 'tianliang', 'qisha', 'pojun'];
  main2Group.forEach((id, i) => placeStar(id, (tianFuPos + i) % 12));

  // 14 助星分配
  const assistants = ['wenqu', 'wenchang', 'zuofu', 'youbi', 'tiankui', 'tianyue', 'qingyang', 'tuoluo', 'huoxing', 'lingxing', 'dikong', 'dijie', 'lucun', 'tianma'];
  assistants.forEach((id, i) => {
    const pos = (hourBranchIdx + i + m) % 12;
    placeStar(id, pos);
  });

  // 分配所有的杂曜 (Grade B, C, D, E)
  // Fix: MISC property does not exist on StarCategory. Filtering for non-Grade A stars instead.
  const miscStars = STAR_DATA.filter(s => s.category !== StarCategory.GRADE_A);
  miscStars.forEach((star, i) => {
    // 使用生日和索引生成的伪随机位置
    const pos = (d + i + m + hourBranchIdx) % 12;
    placeStar(star.id, pos);
  });

  return { chart, bazi };
}
