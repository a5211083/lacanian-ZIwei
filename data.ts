
import { LacanRealm, StarMapping } from './types';

export const STAR_DATA: StarMapping[] = [
  {
    id: 'ziwei',
    name: '紫微',
    pinyin: 'Zi Wei',
    realm: LacanRealm.SYMBOLIC,
    lacanConcept: '大它者 (The Big Other) / 父之名',
    description: '作为象征秩序的核心，紫微代表了绝对的律法与权威。',
    traditionalMeaning: '帝座，至尊，代表领导力与尊贵。',
    philosophicalInsight: '紫微在命盘中的位置，即是主体（Subject）试图锚定象征秩序的中心点。',
    color: '#a855f7'
  },
  {
    id: 'tianji',
    name: '天机',
    pinyin: 'Tian Ji',
    realm: LacanRealm.SYMBOLIC,
    lacanConcept: '能指链的滑动 (Sliding of Signifiers)',
    description: '思维的流转，象征系统中不断变动的逻辑与谋略。',
    traditionalMeaning: '智多星，善变，代表智慧与变动。',
    philosophicalInsight: '智慧并非真相，而是能指在系统中的无尽替换。',
    color: '#3b82f6'
  },
  {
    id: 'taiyang',
    name: '太阳',
    pinyin: 'Tai Yang',
    realm: LacanRealm.IMAGINARY,
    lacanConcept: '理想自我 (Ideal-Ego)',
    description: '通过他人的目光构建出的光辉形象，自恋的投射。',
    traditionalMeaning: '官禄主，博爱，代表光明与显赫。',
    philosophicalInsight: '太阳的灼热源于对完美认同的渴求，是镜像阶段中那道眩目的光。',
    color: '#fbbf24'
  },
  {
    id: 'wuqu',
    name: '武曲',
    pinyin: 'Wu Qu',
    realm: LacanRealm.IMAGINARY,
    lacanConcept: '身体的坚实性 (Imaginary Body)',
    description: '对物质与力量的执着，是自我（Ego）最坚硬的铠甲。',
    traditionalMeaning: '财星，刚毅，代表金钱与果断。',
    philosophicalInsight: '武曲代表了主体在物质世界中寻找的坚硬支撑点，防止其滑向实在界的深渊。',
    color: '#94a3b8'
  },
  {
    id: 'tiantong',
    name: '天同',
    pinyin: 'Tian Tong',
    realm: LacanRealm.IMAGINARY,
    lacanConcept: '原初享乐 (Jouissance of the Child)',
    description: '对融合与满足的退行性渴求，逃避象征律法的重压。',
    traditionalMeaning: '福星，慵懒，代表福德与享受。',
    philosophicalInsight: '天同是主体对那份“失去的乐园”的不断回溯。',
    color: '#2dd4bf'
  },
  {
    id: 'lianzhen',
    name: '廉贞',
    pinyin: 'Lian Zhen',
    realm: LacanRealm.SYMBOLIC,
    lacanConcept: '欲望与超我的冲突 (Conflict of Desire & Superego)',
    description: '律法中的阴暗面，是忠诚与邪恶、秩序与放纵的张力。',
    traditionalMeaning: '囚星，次桃花，代表纪律与纠葛。',
    philosophicalInsight: '廉贞展示了象征秩序如何通过禁忌来维持主体的欲望。',
    color: '#ef4444'
  },
  {
    id: 'tianfu',
    name: '天府',
    pinyin: 'Tian Fu',
    realm: LacanRealm.IMAGINARY,
    lacanConcept: '自我的容器 (The Ego as Reservoir)',
    description: '一种防御性的稳定感，试图将欲望封存于稳固的库房。',
    traditionalMeaning: '财库，稳重，代表宽厚与保守。',
    philosophicalInsight: '天府是自我（Ego）构建的避风港，用以抵御外部能指的入侵。',
    color: '#f97316'
  },
  {
    id: 'taiyin',
    name: '太阴',
    pinyin: 'Tai Yin',
    realm: LacanRealm.IMAGINARY,
    lacanConcept: '幻想空间 (Phantasy / Little Other)',
    description: '私密的、感性的、映射出的柔和镜像，是主体避世的幻景。',
    traditionalMeaning: '田宅主，温柔，代表母性与宁静。',
    philosophicalInsight: '太阴是那面能映射出所有温情的魔镜，隐藏了实在界的恐怖。',
    color: '#818cf8'
  },
  {
    id: 'tanlang',
    name: '贪狼',
    pinyin: 'Tan Lang',
    realm: LacanRealm.IMAGINARY,
    lacanConcept: '小客体a (Objet Petit a)',
    description: '欲望的诱因，那永远无法被满足的、在缺失处闪烁的微光。',
    traditionalMeaning: '桃花星，多才多艺，代表欲望与修行。',
    philosophicalInsight: '贪狼不代表欲望的对象，而代表欲望本身作为动力的缺失。',
    color: '#ec4899'
  },
  {
    id: 'jumen',
    name: '巨门',
    pinyin: 'Ju Men',
    realm: LacanRealm.REAL,
    lacanConcept: '能指的裂缝 (The Gap in the Signifier)',
    description: '言语无法填补的空洞，是引发焦虑与口舌的黑洞。',
    traditionalMeaning: '暗星，口舌，代表疑惑与表达。',
    philosophicalInsight: '巨门是实在界的入侵，在象征秩序的言说中撕开的那个“不可说”的口子。',
    color: '#4b5563'
  },
  {
    id: 'tianxiang',
    name: '天相',
    pinyin: 'Tian Xiang',
    realm: LacanRealm.SYMBOLIC,
    lacanConcept: '镜像识别 (Mirror-Stage Identification)',
    description: '辅佐紫微，它是象征秩序得以维持的仪轨与契约。',
    traditionalMeaning: '印星，协调，代表文书与外貌。',
    philosophicalInsight: '天相通过形式上的完美（印章），来掩盖结构性的匮乏。',
    color: '#06b6d4'
  },
  {
    id: 'tianliang',
    name: '天亮',
    pinyin: 'Tian Liang',
    realm: LacanRealm.SYMBOLIC,
    lacanConcept: '超我的监护 (The Guardian Superego)',
    description: '一种保护性的法律，通过牺牲与庇荫来缓解主体的内疚感。',
    traditionalMeaning: '荫星，老人，代表长寿与纪律。',
    philosophicalInsight: '天亮是文明赋予个体的道德护盾。',
    color: '#84cc16'
  },
  {
    id: 'qisha',
    name: '七杀',
    pinyin: 'Qi Sha',
    realm: LacanRealm.REAL,
    lacanConcept: '死驱力 (The Death Drive)',
    description: '对象征秩序的毁灭性突破，是那种“非此即彼”的纯粹决绝。',
    traditionalMeaning: '将星，肃杀，代表变革与孤立。',
    philosophicalInsight: '七杀是主体抛弃所有象征性身份，直接面对实在界真相的瞬间。',
    color: '#b91c1c'
  },
  {
    id: 'pojun',
    name: '破军',
    pinyin: 'Po Jun',
    realm: LacanRealm.REAL,
    lacanConcept: '付诸行动 (Passage to the Act)',
    description: '摧毁旧的幻象，通过暴力性的重生来填补匮乏。',
    traditionalMeaning: '耗星，开创，代表破坏与重建。',
    philosophicalInsight: '破军是通过彻底的“耗散”来否定象征界的主宰。',
    color: '#1e3a8a'
  }
];
