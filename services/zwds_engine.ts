
import { STAR_DATA, PALACE_DATA } from '../data';
import { ChartPalace, StarMapping } from '../types';

// import * as Iztro from 'iztro';

const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

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
  // === 内部工具函数 ===
  const year = date.getFullYear(), month = date.getMonth(), day = date.getDate(), hour = date.getHours(), minute = date.getMinutes();

    // 1. 计算儒略日 (Julian Day)
    // 这是一个天文学的标准时间单位，将时间量化为浮点数
    const getJD = (y, m, d, h, min) => {
        if (m <= 2) { y -= 1; m += 12; }
        const A = Math.floor(y / 100);
        const B = 2 - A + Math.floor(A / 4);
        const dayFraction = (h + min / 60) / 24;
        return Math.floor(365.25 * (y + 4716)) + 
               Math.floor(30.6001 * (m + 1)) + 
               d + dayFraction + B - 1524.5;
    };

    // 2. 计算太阳视黄经 (0-360度)
    // 使用简化的 VSOP/Meeus 算法，精度足以处理八字节气
    const getSolarLongitude = (jd) => {
        const D = jd - 2451545.0; // 距离 J2000.0 的天数
        const rad = Math.PI / 180;
        
        // 平黄经 (Mean Longitude)
        let L = (280.460 + 0.9856474 * D) % 360;
        // 平近点角 (Mean Anomaly)
        let g = (357.528 + 0.9856003 * D) % 360;
        
        // 黄道经度 = L + 中心差修正
        // 这一步修正了地球公转速度不均导致的节气时间不固定的问题
        let lambda = L + 1.915 * Math.sin(g * rad) + 0.020 * Math.sin(2 * g * rad);
        
        // 归一化到 0-360
        if (lambda < 0) lambda += 360;
        if (lambda >= 360) lambda -= 360;
        return lambda;
    };

    // === 主计算逻辑 ===

    const jd = getJD(year, month, day, hour, minute);
    const lambda = getSolarLongitude(jd);

    // --- A. 计算【年柱】 ---
    // 只有当太阳到达黄经 315° (立春) 时，才算新的一年。
    // 如果当前处于年初(1月或2月)，且太阳黄经 < 315°，说明还在上一年的管辖内（即辛丑年尾，非壬寅年头）。
    let baziYear = year;
    // 逻辑：如果是1月或2月，并且角度在270(冬至)到315(立春)之间，说明还没立春，算上一年
    if (month <= 2 && lambda >= 270 && lambda < 315) {
        baziYear = year - 1;
    }
    
    // 计算年干支 1264 1984
    const yearOffset = (baziYear - 1260 + 60000) % 60;
    const yearGanIdx = yearOffset % 10;

    // --- B. 计算【月柱】 ---
    // 月柱完全取决于太阳角度。
    // 立春(315°)对应寅月(索引2)，每隔30度换一个月。
    // 公式推导：(lambda - 315) / 30
    
    let correctedLambda = lambda;
    // 处理跨越春分点(0度)的情况：比如 15度(清明) 实际上是 315 + 60 = 375度
    if (lambda < 315) {
        correctedLambda = lambda + 360;
    }
    
    // 计算月支 (寅=2, 卯=3...)
    const monthBranchTerm = Math.floor((correctedLambda - 315) / 30);
    const monthZhiIdx = (2 + monthBranchTerm + 1) % 12;

    // 计算月干 (五虎遁：甲己之年丙作首)
    // 寅月的干 = (年干 x 2 + 2)
    const monthGanBase = (yearGanIdx % 5) * 2 + 2;
    const monthGanIdx = (monthGanBase + monthBranchTerm + 1) % 10;

    // --- C. 计算【日柱】 ---
    // 日柱是连续的周期，不依赖节气，直接用 JD 算出绝对天数
    // 修正值 +49 是基于 1900-01-01 (甲戌) 推算出来的基准偏移
    const dayCyclical = Math.floor(jd + 0.5 + 49); 
    const dayOffset = dayCyclical % 60;
    const dayGanIdx = dayOffset % 10;

    // --- D. 计算【时柱】 ---
    // 时支：(小时+1)/2
    const hourZhiIdx = (Math.floor((hour + 1) / 2) + 8) % 12;
    // 时干 (五鼠遁：甲己还加甲)
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

  const chart: ChartPalace[] = ZHI.map((branch, idx) => {
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
