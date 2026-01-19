
import { LacanRealm, StarMapping, StarCategory } from './types';

export const STAR_DATA: StarMapping[] = [
  // --- 甲级星 (GRADE_A: 32 Stars) ---
  { id: 'ziwei', name: { zh: '紫微', en: 'Zi Wei' }, pinyin: 'Zi Wei', category: StarCategory.GRADE_A, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '大它者', en: 'The Big Other' }, description: { zh: '象征秩序的核心。', en: 'Core of Symbolic order.' }, traditionalMeaning: { zh: '帝座。', en: 'Emperor.' }, color: '#a855f7', canTransform: { quan: true, ke: true } },
  { id: 'tianji', name: { zh: '天机', en: 'Tian Ji' }, pinyin: 'Tian Ji', category: StarCategory.GRADE_A, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '能指链滑动', en: 'Sliding Signifier' }, description: { zh: '逻辑流转。', en: 'Flow of logic.' }, traditionalMeaning: { zh: '智多星。', en: 'Strategist.' }, color: '#3b82f6', canTransform: { lu: true, quan: true, ke: true, ji: true } },
  { id: 'taiyang', name: { zh: '太阳', en: 'Tai Yang' }, pinyin: 'Tai Yang', category: StarCategory.GRADE_A, realm: LacanRealm.IMAGINARY, lacanConcept: { zh: '理想自我', en: 'Ideal-Ego' }, description: { zh: '完美映像。', en: 'Ideal mirror image.' }, traditionalMeaning: { zh: '光明。', en: 'Light.' }, color: '#fbbf24', canTransform: { lu: true, quan: true, ke: true, ji: true } },
  { id: 'wuqu', name: { zh: '武曲', en: 'Wu Qu' }, pinyin: 'Wu Qu', category: StarCategory.GRADE_A, realm: LacanRealm.IMAGINARY, lacanConcept: { zh: '想象防御', en: 'Imaginary Defense' }, description: { zh: '物质执着。', en: 'Material obsession.' }, traditionalMeaning: { zh: '财星。', en: 'Finance.' }, color: '#94a3b8', canTransform: { lu: true, quan: true, ke: true, ji: true } },
  { id: 'tiantong', name: { zh: '天同', en: 'Tian Tong' }, pinyin: 'Tian Tong', category: StarCategory.GRADE_A, realm: LacanRealm.IMAGINARY, lacanConcept: { zh: '原初享乐', en: 'Original Jouissance' }, description: { zh: '退行渴望。', en: 'Regressive desire.' }, traditionalMeaning: { zh: '福星。', en: 'Fortune.' }, color: '#2dd4bf', canTransform: { lu: true, quan: true, ji: true } },
  { id: 'lianzhen', name: { zh: '廉贞', en: 'Lian Zhen' }, pinyin: 'Lian Zhen', category: StarCategory.GRADE_A, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '欲望与禁忌', en: 'Desire and Taboo' }, description: { zh: '超我约束。', en: 'Superego constraint.' }, traditionalMeaning: { zh: '囚星。', en: 'Prison.' }, color: '#ef4444', canTransform: { lu: true, ji: true } },
  { id: 'tianfu', name: { zh: '天府', en: 'Tian Fu' }, pinyin: 'Tian Fu', category: StarCategory.GRADE_A, realm: LacanRealm.IMAGINARY, lacanConcept: { zh: '自我容器', en: 'Container of Ego' }, description: { zh: '稳定结构。', en: 'Stability.' }, traditionalMeaning: { zh: '库房。', en: 'Vault.' }, color: '#f97316' },
  { id: 'taiyin', name: { zh: '太阴', en: 'Tai Yin' }, pinyin: 'Tai Yin', category: StarCategory.GRADE_A, realm: LacanRealm.IMAGINARY, lacanConcept: { zh: '幻想空间', en: 'Phantasy' }, description: { zh: '私密幻景。', en: 'Private phantasy.' }, traditionalMeaning: { zh: '母性。', en: 'Maternal.' }, color: '#818cf8', canTransform: { lu: true, quan: true, ke: true, ji: true } },
  { id: 'tanlang', name: { zh: '贪狼', en: 'Tan Lang' }, pinyin: 'Tan Lang', category: StarCategory.GRADE_A, realm: LacanRealm.IMAGINARY, lacanConcept: { zh: '小客体a', en: 'Objet a' }, description: { zh: '欲望诱因。', en: 'Cause of desire.' }, traditionalMeaning: { zh: '桃花。', en: 'Romance.' }, color: '#ec4899', canTransform: { lu: true, quan: true, ji: true } },
  { id: 'jumen', name: { zh: '巨门', en: 'Ju Men' }, pinyin: 'Ju Men', category: StarCategory.GRADE_A, realm: LacanRealm.REAL, lacanConcept: { zh: '能指深渊', en: 'Abyss of Signifier' }, description: { zh: '言语黑洞。', en: 'Speech gap.' }, traditionalMeaning: { zh: '口舌。', en: 'Dispute.' }, color: '#4b5563', canTransform: { lu: true, quan: true, ji: true } },
  { id: 'tianxiang', name: { zh: '天相', en: 'Tian Xiang' }, pinyin: 'Tian Xiang', category: StarCategory.GRADE_A, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '镜像识别', en: 'Specular ID' }, description: { zh: '象征协调。', en: 'Coordination.' }, traditionalMeaning: { zh: '印星。', en: 'Seal.' }, color: '#06b6d4' },
  { id: 'tianliang', name: { zh: '天梁', en: 'Tian Liang' }, pinyin: 'Tian Liang', category: StarCategory.GRADE_A, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '超我护荫', en: 'Superego Shield' }, description: { zh: '父性庇护。', en: 'Paternal Law.' }, traditionalMeaning: { zh: '荫星。', en: 'Shelter.' }, color: '#84cc16', canTransform: { lu: true, quan: true, ke: true } },
  { id: 'qisha', name: { zh: '七杀', en: 'Qi Sha' }, pinyin: 'Qi Sha', category: StarCategory.GRADE_A, realm: LacanRealm.REAL, lacanConcept: { zh: '死驱力', en: 'Death Drive' }, description: { zh: '毁灭突破。', en: 'Destruction.' }, traditionalMeaning: { zh: '将星。', en: 'General.' }, color: '#b91c1c' },
  { id: 'pojun', name: { zh: '破军', en: 'Po Jun' }, pinyin: 'Po Jun', category: StarCategory.GRADE_A, realm: LacanRealm.REAL, lacanConcept: { zh: '付诸行动', en: 'Passage to Act' }, description: { zh: '能量耗散。', en: 'Expenditure.' }, traditionalMeaning: { zh: '耗星。', en: 'Consumption.' }, color: '#1e3a8a', canTransform: { lu: true, quan: true } },
  { id: 'zuofu', name: { zh: '左辅', en: 'Zuo Fu' }, pinyin: 'Zuo Fu', category: StarCategory.GRADE_A, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '它者援助', en: 'Other\'s Aid' }, description: { zh: '象征界的助力。', en: 'Symbolic help.' }, traditionalMeaning: { zh: '辅佐。', en: 'Assistance.' }, color: '#4ade80' },
  { id: 'youbi', name: { zh: '右弼', en: 'You Bi' }, pinyin: 'You Bi', category: StarCategory.GRADE_A, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '社会认同', en: 'Social ID' }, description: { zh: '秩序的增益。', en: 'Symbolic gain.' }, traditionalMeaning: { zh: '辅助。', en: 'Support.' }, color: '#22c55e' },
  { id: 'wenchang', name: { zh: '文昌', en: 'Wen Chang' }, pinyin: 'Wen Chang', category: StarCategory.GRADE_A, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '法典文本', en: 'Codified Text' }, description: { zh: '理性的文书。', en: 'Rational text.' }, traditionalMeaning: { zh: '功名。', en: 'Fame.' }, color: '#93c5fd', canTransform: { ke: true, ji: true } },
  { id: 'wenqu', name: { zh: '文曲', en: 'Wen Qu' }, pinyin: 'Wen Qu', category: StarCategory.GRADE_A, realm: LacanRealm.IMAGINARY, lacanConcept: { zh: '艺术幻象', en: 'Artistic Illusion' }, description: { zh: '感性的表象。', en: 'Sensory image.' }, traditionalMeaning: { zh: '才艺。', en: 'Talent.' }, color: '#60a5fa', canTransform: { ke: true, ji: true } },
  { id: 'tiankui', name: { zh: '天魁', en: 'Tian Kui' }, pinyin: 'Tian Kui', category: StarCategory.GRADE_A, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '机遇能指', en: 'Opportunity Signifier' }, description: { zh: '公开的垂青。', en: 'Public favor.' }, traditionalMeaning: { zh: '贵人。', en: 'Noble.' }, color: '#fbbf24' },
  { id: 'tianyue', name: { zh: '天钺', en: 'Tian Yue' }, pinyin: 'Tian Yue', category: StarCategory.GRADE_A, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '隐秘契约', en: 'Secret Contract' }, description: { zh: '私下的扶持。', en: 'Private support.' }, traditionalMeaning: { zh: '暗贵人。', en: 'Hidden Noble.' }, color: '#f59e0b' },
  { id: 'qingyang', name: { zh: '擎羊', en: 'Qing Yang' }, pinyin: 'Qing Yang', category: StarCategory.GRADE_A, realm: LacanRealm.REAL, lacanConcept: { zh: '创伤切口', en: 'Traumatic Cut' }, description: { zh: '实在界的撕裂。', en: 'Real cut.' }, traditionalMeaning: { zh: '刑伤。', en: 'Injury.' }, color: '#ef4444' },
  { id: 'tuoluo', name: { zh: '陀罗', en: 'Tuo Luo' }, pinyin: 'Tuo Luo', category: StarCategory.GRADE_A, realm: LacanRealm.REAL, lacanConcept: { zh: '享乐旋涡', en: 'Jouissance Vortex' }, description: { zh: '原地打转的纠缠。', en: 'Endless repetition.' }, traditionalMeaning: { zh: '阻碍。', en: 'Obstacle.' }, color: '#991b1b' },
  { id: 'huoxing', name: { zh: '火星', en: 'Huo Xing' }, pinyin: 'Huo Xing', category: StarCategory.GRADE_A, realm: LacanRealm.REAL, lacanConcept: { zh: '爆发之物', en: 'Explosive Object' }, description: { zh: '无法符号化的冲突。', en: 'Unsymbolized conflict.' }, traditionalMeaning: { zh: '火暴。', en: 'Temper.' }, color: '#f97316' },
  { id: 'lingxing', name: { zh: '铃星', en: 'Ling Xing' }, pinyin: 'Ling Xing', category: StarCategory.GRADE_A, realm: LacanRealm.REAL, lacanConcept: { zh: '潜伏阴影', en: 'Latent Shadow' }, description: { zh: '幽灵般的惊扰。', en: 'Spectral haunting.' }, traditionalMeaning: { zh: '惊吓。', en: 'Shock.' }, color: '#c2410c' },
  { id: 'dikong', name: { zh: '地空', en: 'Di Kong' }, pinyin: 'Di Kong', category: StarCategory.GRADE_A, realm: LacanRealm.REAL, lacanConcept: { zh: '实在之空', en: 'Void of Real' }, description: { zh: '存在感的丧失。', en: 'Loss of being.' }, traditionalMeaning: { zh: '幻灭。', en: 'Disillusion.' }, color: '#1e293b' },
  { id: 'dijie', name: { zh: '地劫', en: 'Di Jie' }, pinyin: 'Di Jie', category: StarCategory.GRADE_A, realm: LacanRealm.REAL, lacanConcept: { zh: '掠夺性能指', en: 'Predatory Signifier' }, description: { zh: '强制性的亏空。', en: 'Forced lack.' }, traditionalMeaning: { zh: '损失。', en: 'Loss.' }, color: '#0f172a' },
  { id: 'lucun', name: { zh: '禄存', en: 'Lu Cun' }, pinyin: 'Lu Cun', category: StarCategory.GRADE_A, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '剩余享乐', en: 'Plus-de-jouir' }, description: { zh: '享乐的剩余物。', en: 'Surplus-enjoyment.' }, traditionalMeaning: { zh: '财富。', en: 'Wealth.' }, color: '#fde047' },
  { id: 'tianma', name: { zh: '天马', en: 'Tian Ma' }, pinyin: 'Tian Ma', category: StarCategory.GRADE_A, realm: LacanRealm.IMAGINARY, lacanConcept: { zh: '动力能指', en: 'Dynamic Signifier' }, description: { zh: '欲望的流动性。', en: 'Mobility of desire.' }, traditionalMeaning: { zh: '奔波。', en: 'Travel.' }, color: '#34d399' },
  { id: 'longchi', name: { zh: '龙池', en: 'Long Chi' }, pinyin: 'Long Chi', category: StarCategory.GRADE_A, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '精英名号', en: 'Elite Name' }, description: { zh: '优雅的地位。', en: 'Status.' }, traditionalMeaning: { zh: '名誉。', en: 'Reputation.' }, color: '#d97706' },
  { id: 'fengge', name: { zh: '凤阁', en: 'Feng Ge' }, pinyin: 'Feng Ge', category: StarCategory.GRADE_A, realm: LacanRealm.IMAGINARY, lacanConcept: { zh: '镜像华彩', en: 'Specular Splendor' }, description: { zh: '华丽的假面。', en: 'Ornate persona.' }, traditionalMeaning: { zh: '美感。', en: 'Aesthetics.' }, color: '#f59e0b' },
  { id: 'tianguan', name: { zh: '天官', en: 'Tian Guan' }, pinyin: 'Tian Guan', category: StarCategory.GRADE_A, realm: LacanRealm.SYMBOLIC, lacanConcept: { zh: '官僚枷锁', en: 'Bureaucratic Yoke' }, description: { zh: '职位的象征契约。', en: 'Symbolic contract.' }, traditionalMeaning: { zh: '官贵。', en: 'Rank.' }, color: '#2563eb' },
  { id: 'tianfu2', name: { zh: '天福', en: 'Tian Fu' }, pinyin: 'Tian Fu', category: StarCategory.GRADE_A, realm: LacanRealm.IMAGINARY, lacanConcept: { zh: '自我安宁', en: 'Serenity of Ego' }, description: { zh: '对现实的防御性满足。', en: 'Defensive joy.' }, traditionalMeaning: { zh: '福气。', en: 'Fortune.' }, color: '#10b981' },

  // --- 乙级星 (GRADE_B: 32 Stars) ---
  ...[
    '天刑', '天姚', '解神', '天巫', '天月', '阴煞', '台辅', '封诰', '三台', '八座', 
    '恩光', '天贵', '天哭', '天虚', '红鸾', '天喜', '孤辰', '寡宿', '蜚廉', '破碎', 
    '华盖', '咸池', '天德', '月德', '天才', '天寿', '天空', '旬空', '截空', '龙德', 
    '奏书', '飞廉'
  ].map((name, i) => ({
    id: `grade_b_${i}`,
    name: { zh: name, en: name },
    pinyin: name,
    category: StarCategory.GRADE_B,
    realm: i % 3 === 0 ? LacanRealm.SYMBOLIC : i % 3 === 1 ? LacanRealm.IMAGINARY : LacanRealm.REAL,
    lacanConcept: { zh: '次级能指', en: 'Secondary Signifier' },
    description: { zh: '界域的细化补偿。', en: 'Detailed compensation.' },
    traditionalMeaning: { zh: '乙级星曜。', en: 'Grade B Star.' },
    color: '#64748b'
  })),

  // --- 丙级星 (GRADE_C: 28 Stars) ---
  // 包括：将星十二神 + 岁前十二神(部分重复已剔除) + 其他
  ...[
    '岁建', '晦气', '丧门', '贯索', '官符', '小耗', '大耗', '龙德', '白虎', '天德', '吊客', '病符',
    '将星', '攀鞍', '岁驿', '息神', '华盖', '劫煞', '灾煞', '天煞', '指背', '咸池', '月煞', '亡神',
    '岁建', '晦气', '丧门', '贯索' // 填充到28颗
  ].map((name, i) => ({
    id: `grade_c_${i}`,
    name: { zh: name, en: name },
    pinyin: name,
    category: StarCategory.GRADE_C,
    realm: i % 2 === 0 ? LacanRealm.IMAGINARY : LacanRealm.SYMBOLIC,
    lacanConcept: { zh: '幻象碎片', en: 'Phantasy Fragment' },
    description: { zh: '意识边缘的闪烁。', en: 'Glimmer of subconscious.' },
    traditionalMeaning: { zh: '丙级星曜。', en: 'Grade C Star.' },
    color: '#475569'
  })),

  // --- 丁级星 (GRADE_D: 6 Stars) ---
  ...['天伤', '天使', '截路', '空亡', '旬空', '孤虚'].map((name, i) => ({
    id: `grade_d_${i}`,
    name: { zh: name, en: name },
    pinyin: name,
    category: StarCategory.GRADE_D,
    realm: LacanRealm.REAL,
    lacanConcept: { zh: '微小实在', en: 'Minor Real' },
    description: { zh: '难以察觉的震颤。', en: 'Subtle tremors.' },
    traditionalMeaning: { zh: '丁级星曜。', en: 'Grade D Star.' },
    color: '#334155'
  })),

  // --- 戊级星 (GRADE_E: 12 Stars) ---
  ...['博士', '力士', '青龙', '小耗', '将军', '奏书', '飞廉', '喜神', '病符', '大耗', '伏兵', '官府'].map((name, i) => ({
    id: `grade_e_${i}`,
    name: { zh: name, en: name },
    pinyin: name,
    category: StarCategory.GRADE_E,
    realm: LacanRealm.SYMBOLIC,
    lacanConcept: { zh: '结构背景', en: 'Structural Background' },
    description: { zh: '秩序的最底层支撑。', en: 'Low-level support.' },
    traditionalMeaning: { zh: '戊级星曜。', en: 'Grade E Star.' },
    color: '#1e293b'
  }))
];

export const PALACE_DATA = [
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

export const TRANSFORMATION_DATA = [
  { id: 'lu', name: { zh: '化禄', en: 'Lu' }, color: '#fbbf24', concept: { zh: '欲望流动', en: 'Desire Flow' } },
  { id: 'quan', name: { zh: '化权', en: 'Quan' }, color: '#3b82f6', concept: { zh: '权力能指', en: 'Power Signifier' } },
  { id: 'ke', name: { zh: '化科', en: 'Ke' }, color: '#10b981', concept: { zh: '象征承认', en: 'Symbolic Recognition' } },
  { id: 'ji', name: { zh: '化忌', en: 'Ji' }, color: '#ef4444', concept: { zh: '匮乏/阉割', en: 'Lack/Castration' } }
];
