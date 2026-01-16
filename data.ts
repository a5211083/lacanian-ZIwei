
import { LacanRealm, StarMapping, StarCategory, Palace, Transformation } from './types';

export const STAR_DATA: StarMapping[] = [
  // --- 十四主星 (14 Main Stars) ---
  { id: 'ziwei', name: { zh: '紫微', en: 'Zi Wei' }, pinyin: 'Zi Wei', category: StarCategory.MAIN, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '大它者', en: 'The Big Other' }, description: { zh: '象征秩序的核心。', en: 'Core of Symbolic order.' }, traditionalMeaning: { zh: '帝座。', en: 'Emperor.' }, color: '#a855f7', canTransform: { quan: true, ke: true } },
  { id: 'tianji', name: { zh: '天机', en: 'Tian Ji' }, pinyin: 'Tian Ji', category: StarCategory.MAIN, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '能指链滑动', en: 'Sliding Signifier' }, description: { zh: '逻辑流转。', en: 'Flow of logic.' }, traditionalMeaning: { zh: '智多星。', en: 'Strategist.' }, color: '#3b82f6', canTransform: { lu: true, quan: true, ke: true, ji: true } },
  { id: 'taiyang', name: { zh: '太阳', en: 'Tai Yang' }, pinyin: 'Tai Yang', category: StarCategory.MAIN, realm: LacanRealm.IMAGINARY, lacanConcept: { zh: '理想自我', en: 'Ideal-Ego' }, description: { zh: '完美映像。', en: 'Ideal mirror image.' }, traditionalMeaning: { zh: '光明。', en: 'Light.' }, color: '#fbbf24', canTransform: { lu: true, quan: true, ke: true, ji: true } },
  { id: 'wuqu', name: { zh: '武曲', en: 'Wu Qu' }, pinyin: 'Wu Qu', category: StarCategory.MAIN, realm: LacanRealm.IMAGINARY, lacanConcept: { zh: '想象防御', en: 'Imaginary Defense' }, description: { zh: '物质执着。', en: 'Material obsession.' }, traditionalMeaning: { zh: '财星。', en: 'Finance.' }, color: '#94a3b8', canTransform: { lu: true, quan: true, ke: true, ji: true } },
  { id: 'tiantong', name: { zh: '天同', en: 'Tian Tong' }, pinyin: 'Tian Tong', category: StarCategory.MAIN, realm: LacanRealm.IMAGINARY, lacanConcept: { zh: '原初享乐', en: 'Original Jouissance' }, description: { zh: '退行渴望。', en: 'Regressive desire.' }, traditionalMeaning: { zh: '福星。', en: 'Fortune.' }, color: '#2dd4bf', canTransform: { lu: true, quan: true, ji: true } },
  { id: 'lianzhen', name: { zh: '廉贞', en: 'Lian Zhen' }, pinyin: 'Lian Zhen', category: StarCategory.MAIN, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '欲望与禁忌', en: 'Desire and Taboo' }, description: { zh: '超我约束。', en: 'Superego constraint.' }, traditionalMeaning: { zh: '囚星。', en: 'Prison.' }, color: '#ef4444', canTransform: { lu: true, ji: true } },
  { id: 'tianfu', name: { zh: '天府', en: 'Tian Fu' }, pinyin: 'Tian Fu', category: StarCategory.MAIN, realm: LacanRealm.IMAGINARY, lacanConcept: { zh: '自我容器', en: 'Container of Ego' }, description: { zh: '稳定结构。', en: 'Stability.' }, traditionalMeaning: { zh: '库房。', en: 'Vault.' }, color: '#f97316' },
  { id: 'taiyin', name: { zh: '太阴', en: 'Tai Yin' }, pinyin: 'Tai Yin', category: StarCategory.MAIN, realm: LacanRealm.IMAGINARY, lacanConcept: { zh: '幻想空间', en: 'Phantasy' }, description: { zh: '私密幻景。', en: 'Private phantasy.' }, traditionalMeaning: { zh: '母性。', en: 'Maternal.' }, color: '#818cf8', canTransform: { lu: true, quan: true, ke: true, ji: true } },
  { id: 'tanlang', name: { zh: '贪狼', en: 'Tan Lang' }, pinyin: 'Tan Lang', category: StarCategory.MAIN, realm: LacanRealm.IMAGINARY, lacanConcept: { zh: '小客体a', en: 'Objet a' }, description: { zh: '欲望诱因。', en: 'Cause of desire.' }, traditionalMeaning: { zh: '桃花。', en: 'Romance.' }, color: '#ec4899', canTransform: { lu: true, quan: true, ji: true } },
  { id: 'jumen', name: { zh: '巨门', en: 'Ju Men' }, pinyin: 'Ju Men', category: StarCategory.MAIN, realm: LacanRealm.REAL, lacanConcept: { zh: '能指深渊', en: 'Abyss of Signifier' }, description: { zh: '言语黑洞。', en: 'Speech gap.' }, traditionalMeaning: { zh: '口舌。', en: 'Dispute.' }, color: '#4b5563', canTransform: { lu: true, quan: true, ji: true } },
  { id: 'tianxiang', name: { zh: '天相', en: 'Tian Xiang' }, pinyin: 'Tian Xiang', category: StarCategory.MAIN, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '镜像识别', en: 'Specular ID' }, description: { zh: '象征协调。', en: 'Coordination.' }, traditionalMeaning: { zh: '印星。', en: 'Seal.' }, color: '#06b6d4' },
  { id: 'tianliang', name: { zh: '天梁', en: 'Tian Liang' }, pinyin: 'Tian Liang', category: StarCategory.MAIN, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '超我护荫', en: 'Superego Shield' }, description: { zh: '父性庇护。', en: 'Paternal Law.' }, traditionalMeaning: { zh: '荫星。', en: 'Shelter.' }, color: '#84cc16', canTransform: { lu: true, quan: true, ke: true } },
  { id: 'qisha', name: { zh: '七杀', en: 'Qi Sha' }, pinyin: 'Qi Sha', category: StarCategory.MAIN, realm: LacanRealm.REAL, lacanConcept: { zh: '死驱力', en: 'Death Drive' }, description: { zh: '毁灭突破。', en: 'Destruction.' }, traditionalMeaning: { zh: '将星。', en: 'General.' }, color: '#b91c1c' },
  { id: 'pojun', name: { zh: '破军', en: 'Po Jun' }, pinyin: 'Po Jun', category: StarCategory.MAIN, realm: LacanRealm.REAL, lacanConcept: { zh: '付诸行动', en: 'Passage to Act' }, description: { zh: '能量耗散。', en: 'Expenditure.' }, traditionalMeaning: { zh: '耗星。', en: 'Consumption.' }, color: '#1e3a8a', canTransform: { lu: true, quan: true } },

  // --- 14颗助星 (6吉+6煞+禄马) ---
  { id: 'wenqu', name: { zh: '文曲', en: 'Wen Qu' }, pinyin: 'Wen Qu', category: StarCategory.ASSISTANT, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '情感能指', en: 'Emotional Signifier' }, description: { zh: '点缀。', en: 'Decoration.' }, traditionalMeaning: { zh: '才艺。', en: 'Talent.' }, color: '#60a5fa', canTransform: { ke: true, ji: true } },
  { id: 'wenchang', name: { zh: '文昌', en: 'Wen Chang' }, pinyin: 'Wen Chang', category: StarCategory.ASSISTANT, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '契约文本', en: 'Contractual Text' }, description: { zh: '规范。', en: 'Rules.' }, traditionalMeaning: { zh: '功名。', en: 'Honor.' }, color: '#93c5fd', canTransform: { ke: true, ji: true } },
  { id: 'zuofu', name: { zh: '左辅', en: 'Zuo Fu' }, pinyin: 'Zuo Fu', category: StarCategory.ASSISTANT, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '它者援手', en: 'Other\'s Aid' }, description: { zh: '助力。', en: 'Aid.' }, traditionalMeaning: { zh: '辅佐。', en: 'Assist.' }, color: '#4ade80', canTransform: { ke: true } },
  { id: 'youbi', name: { zh: '右弼', en: 'You Bi' }, pinyin: 'You Bi', category: StarCategory.ASSISTANT, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '社会认同', en: 'Social ID' }, description: { zh: '增益。', en: 'Gain.' }, traditionalMeaning: { zh: '辅助。', en: 'Auxiliary.' }, color: '#22c55e', canTransform: { ke: true } },
  { id: 'tiankui', name: { zh: '天魁', en: 'Tian Kui' }, pinyin: 'Tian Kui', category: StarCategory.ASSISTANT, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '机遇能指', en: 'Opportunity' }, description: { zh: '偶然性。', en: 'Chance.' }, traditionalMeaning: { zh: '贵人。', en: 'Noble.' }, color: '#fbbf24' },
  { id: 'tianyue', name: { zh: '天钺', en: 'Tian Yue' }, pinyin: 'Tian Yue', category: StarCategory.ASSISTANT, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '隐秘认同', en: 'Hidden ID' }, description: { zh: '隐形庇护。', en: 'Hidden shield.' }, traditionalMeaning: { zh: '暗贵人。', en: 'Hidden Noble.' }, color: '#f59e0b' },
  { id: 'qingyang', name: { zh: '擎羊', en: 'Qing Yang' }, pinyin: 'Qing Yang', category: StarCategory.ASSISTANT, realm: LacanRealm.REAL, lacanConcept: { zh: '创伤切断', en: 'Traumatic Cut' }, description: { zh: '撕裂。', en: 'Violent rip.' }, traditionalMeaning: { zh: '刑伤。', en: 'Injury.' }, color: '#ef4444' },
  { id: 'tuoluo', name: { zh: '陀罗', en: 'Tuo Luo' }, pinyin: 'Tuo Luo', category: StarCategory.ASSISTANT, realm: LacanRealm.REAL, lacanConcept: { zh: '享乐旋涡', en: 'Jouissance Vortex' }, description: { zh: '原地打转。', en: 'Spinning.' }, traditionalMeaning: { zh: '阻碍。', en: 'Obstacle.' }, color: '#991b1b' },
  { id: 'huoxing', name: { zh: '火星', en: 'Huo Xing' }, pinyin: 'Huo Xing', category: StarCategory.ASSISTANT, realm: LacanRealm.REAL, lacanConcept: { zh: '爆发之物', en: 'Explosive Object' }, description: { zh: '不可控爆发。', en: 'Outburst.' }, traditionalMeaning: { zh: '暴躁。', en: 'Temper.' }, color: '#f97316' },
  { id: 'lingxing', name: { zh: '铃星', en: 'Ling Xing' }, pinyin: 'Ling Xing', category: StarCategory.ASSISTANT, realm: LacanRealm.REAL, lacanConcept: { zh: '幽灵之声', en: 'Spectral Sound' }, description: { zh: '潜伏焦虑。', en: 'Anxiety.' }, traditionalMeaning: { zh: '惊吓。', en: 'Shock.' }, color: '#c2410c' },
  { id: 'dikong', name: { zh: '地空', en: 'Di Kong' }, pinyin: 'Di Kong', category: StarCategory.ASSISTANT, realm: LacanRealm.REAL, lacanConcept: { zh: '实在之空', en: 'Void of Real' }, description: { zh: '虚无。', en: 'Nihilism.' }, traditionalMeaning: { zh: '幻灭。', en: 'Disillusion.' }, color: '#1e293b' },
  { id: 'dijie', name: { zh: '地劫', en: 'Di Jie' }, pinyin: 'Di Jie', category: StarCategory.ASSISTANT, realm: LacanRealm.REAL, lacanConcept: { zh: '掠夺能指', en: 'Predatory Signifier' }, description: { zh: '强制亏空。', en: 'Forced deficit.' }, traditionalMeaning: { zh: '损失。', en: 'Loss.' }, color: '#0f172a' },
  { id: 'lucun', name: { zh: '禄存', en: 'Lu Cun' }, pinyin: 'Lu Cun', category: StarCategory.ASSISTANT, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '剩余享乐', en: 'Plus-de-jouir' }, description: { zh: '保护价值。', en: 'Value.' }, traditionalMeaning: { zh: '稳固。', en: 'Stability.' }, color: '#fde047' },
  { id: 'tianma', name: { zh: '天马', en: 'Tian Ma' }, pinyin: 'Tian Ma', category: StarCategory.ASSISTANT, realm: LacanRealm.IMAGINARY, lacanConcept: { zh: '动力能指', en: 'Dynamic Signifier' }, description: { zh: '奔流。', en: 'Flow.' }, traditionalMeaning: { zh: '奔驰。', en: 'Speed.' }, color: '#34d399' },

  // --- 三十七杂曜精选 ---
  { id: 'hongluan', name: { zh: '红鸾', en: 'Hong Luan' }, pinyin: 'Hong Luan', category: StarCategory.MISC, realm: LacanRealm.IMAGINARY, lacanConcept: { zh: '爱情面纱', en: 'Veil of Eros' }, description: { zh: '迷恋。', en: 'Infatuation.' }, traditionalMeaning: { zh: '姻缘。', en: 'Marriage.' }, color: '#f472b6' },
  { id: 'tianxi', name: { zh: '天喜', en: 'Tian Xi' }, pinyin: 'Tian Xi', category: StarCategory.MISC, realm: LacanRealm.IMAGINARY, lacanConcept: { zh: '自恋之悦', en: 'Narcissistic Joy' }, description: { zh: '狂欢。', en: 'Joy.' }, traditionalMeaning: { zh: '喜庆。', en: 'Celebration.' }, color: '#fb7185' },
  { id: 'huagai', name: { zh: '华盖', en: 'Hua Gai' }, pinyin: 'Hua Gai', category: StarCategory.MISC, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '自闭屏障', en: 'Autistic Barrier' }, description: { zh: '孤岛。', en: 'Island.' }, traditionalMeaning: { zh: '孤独。', en: 'Solitude.' }, color: '#8b5cf6' }
];

export const PALACE_DATA: Palace[] = [
  { id: 'life', name: { zh: '命宫', en: 'Life' }, concept: { zh: '主体坐标', en: 'Subjective Coordinates' } },
  { id: 'siblings', name: { zh: '兄弟宫', en: 'Siblings' }, concept: { zh: '镜像竞争', en: 'Specular Rivalry' } },
  { id: 'spouse', name: { zh: '夫妻宫', en: 'Spouse' }, concept: { zh: '欲望投射', en: 'Projection of Desire' } },
  { id: 'children', name: { zh: '子女宫', en: 'Children' }, concept: { zh: '延续/小客体a', en: 'Continuation/Objet a' } },
  { id: 'wealth', name: { zh: '财帛宫', en: 'Wealth' }, concept: { zh: '物质替代', en: 'Material Substitution' } },
  { id: 'health', name: { zh: '疾厄宫', en: 'Health' }, concept: { zh: '躯体化实在', en: 'Somatized Real' } },
  { id: 'travel', name: { zh: '迁移宫', en: 'Travel' }, concept: { zh: '异域它者', en: 'Alien Other' } },
  { id: 'friends', name: { zh: '交友宫', en: 'Friends' }, concept: { zh: '它者的面孔', en: 'Faces of Big Other' } },
  { id: 'career', name: { zh: '官禄宫', en: 'Career' }, concept: { zh: '象征认同', en: 'Symbolic ID' } },
  { id: 'property', name: { zh: '田宅宫', en: 'Property' }, concept: { zh: '自我容器', en: 'Container of Ego' } },
  { id: 'happiness', name: { zh: '福德宫', en: 'Happiness' }, concept: { zh: '原初享乐', en: 'Original Jouissance' } },
  { id: 'parents', name: { zh: '父母宫', en: 'Parents' }, concept: { zh: '律法之源', en: 'Origin of Law' } }
];

export const TRANSFORMATION_DATA: Transformation[] = [
  { id: 'lu', name: { zh: '化禄', en: 'Lu' }, color: '#fbbf24', concept: { zh: '欲望流动', en: 'Desire Flow' } },
  { id: 'quan', name: { zh: '化权', en: 'Quan' }, color: '#3b82f6', concept: { zh: '权力能指', en: 'Power Signifier' } },
  { id: 'ke', name: { zh: '化科', en: 'Ke' }, color: '#10b981', concept: { zh: '象征承认', en: 'Symbolic Recognition' } },
  { id: 'ji', name: { zh: '化忌', en: 'Ji' }, color: '#ef4444', concept: { zh: '匮乏/阉割', en: 'Lack/Castration' } }
];
