
import { LacanRealm, StarMapping, StarCategory, Palace, Transformation } from './types';

export const PALACE_DATA: Palace[] = [
  { id: 'life', name: { zh: '命宫', en: 'Life' }, lacanMapping: { zh: '主体/自我', en: 'The Subject/Ego' }, description: { zh: '主体在象征界中的坐标，自我认同的源点。', en: 'The coordinates of the subject in the Symbolic, the source of ego identity.' } },
  { id: 'siblings', name: { zh: '兄弟宫', en: 'Siblings' }, lacanMapping: { zh: '镜像他者', en: 'Specular Other' }, description: { zh: '同辈、镜像阶段的竞争与认同。', en: 'Peers, competition and identification in the mirror stage.' } },
  { id: 'spouse', name: { zh: '夫妻宫', en: 'Spouse' }, lacanMapping: { zh: '大它者的欲望', en: "The Other's Desire" }, description: { zh: '主体寻找缺失的一环，欲望的投射地。', en: 'Where the subject seeks the missing link, the site of desire projection.' } },
  { id: 'children', name: { zh: '子女宫', en: 'Children' }, lacanMapping: { zh: '升华/再造', en: 'Sublimation/Recreation' }, description: { zh: '主体的创造性产出与未来的投射。', en: 'Creative output and future projections of the subject.' } },
  { id: 'wealth', name: { zh: '财帛宫', en: 'Wealth' }, lacanMapping: { zh: '小客体a的获取', en: 'Gaining Objet Petit a' }, description: { zh: '欲望的动力来源，对物质/价值的获取与执着。', en: 'Driving force of desire, acquisition and obsession with material/value.' } },
  { id: 'health', name: { zh: '疾厄宫', en: 'Health' }, lacanMapping: { zh: '实在界之躯', en: 'The Real Body' }, description: { zh: '肉体作为实在界的体现，无法被符号化的痛苦。', en: 'The body as an embodiment of the Real, pain that escapes symbolization.' } },
  { id: 'travel', name: { zh: '迁移宫', en: 'Travel' }, lacanMapping: { zh: '外部象征界', en: 'External Symbolic' }, description: { zh: '在社会公共领域中的表现与遭遇。', en: 'Performance and encounters in the public social sphere.' } },
  { id: 'friends', name: { zh: '交友宫', en: 'Friends' }, lacanMapping: { zh: '众数大它者', en: 'Plural Big Others' }, description: { zh: '众人的评价，社会契约与符号认同。', en: 'Evaluation by the masses, social contracts, and symbolic identification.' } },
  { id: 'career', name: { zh: '官禄宫', en: 'Career' }, lacanMapping: { zh: '符号授权', en: 'Symbolic Mandate' }, description: { zh: '主体在象征秩序中的位置与职责。', en: 'The subject’s position and duty in the Symbolic order.' } },
  { id: 'property', name: { zh: '田宅宫', en: 'Property' }, lacanMapping: { zh: '想象的容器', en: 'Imaginary Container' }, description: { zh: '内在的安全感，作为自我的最后防线。', en: 'Internal security, the ego’s last line of defense.' } },
  { id: 'happiness', name: { zh: '福德宫', en: 'Happiness' }, lacanMapping: { zh: '超我的享乐', en: 'Superego Jouissance' }, description: { zh: '潜意识的福报或债务，精神世界的底色。', en: 'Subconscious rewards or debts, the background of the spiritual world.' } },
  { id: 'parents', name: { zh: '父母宫', en: 'Parents' }, lacanMapping: { zh: '原初大它者/父之名', en: 'Primordial Other / Name-of-the-Father' }, description: { zh: '律法的起源，主体诞生的先决条件。', en: 'The origin of Law, the prerequisite for the subject’s birth.' } },
];

export const TRANSFORMATION_DATA: Transformation[] = [
  { id: 'lu', name: { zh: '化禄', en: 'Lu' }, lacanMapping: { zh: '剩余享乐/溢出', en: 'Surplus Jouissance' }, color: '#10b981' },
  { id: 'quan', name: { zh: '化权', en: 'Quan' }, lacanMapping: { zh: '能指的统治力', en: 'Signifier Power' }, color: '#3b82f6' },
  { id: 'ke', name: { zh: '化科', en: 'Ke' }, lacanMapping: { zh: '符号知名度', en: 'Symbolic Fame' }, color: '#a855f7' },
  { id: 'ji', name: { zh: '化忌', en: 'Ji' }, lacanMapping: { zh: '匮乏/阉割', en: 'Lack/Castration' }, color: '#ef4444' },
];

// Mapping stars to which transformations they support (Lu, Quan, Ke, Ji)
export const STAR_TRANSFORMATIONS: Record<string, string[]> = {
  ziwei: ['quan', 'ke'],
  tianji: ['lu', 'quan', 'ke', 'ji'],
  taiyang: ['lu', 'quan', 'ji'],
  wuqu: ['lu', 'quan', 'ke', 'ji'],
  tiantong: ['lu', 'quan', 'ji'],
  lianzhen: ['lu', 'ji'],
  tianfu: [],
  taiyin: ['lu', 'quan', 'ke', 'ji'],
  tanlang: ['lu', 'quan', 'ji'],
  jumen: ['lu', 'quan', 'ji'],
  tianxiang: [],
  tianliang: ['lu', 'quan', 'ke'],
  qisha: [],
  pojun: ['lu', 'quan'],
  wenchang: ['ji'],
  wenqu: ['ke', 'ji'],
  zuofu: ['ke'],
  youbi: ['ke']
};

export const STAR_DATA: StarMapping[] = [
  // --- 14 Main Stars ---
  {
    id: 'ziwei',
    name: { zh: '紫微', en: 'Zi Wei' },
    pinyin: 'Zi Wei',
    category: StarCategory.MAIN,
    realm: LacanRealm.SYMBOLIC,
    lacanConcept: { zh: '大它者', en: 'The Big Other' },
    description: { 
      zh: '象征秩序的核心，作为律法之源的主体参照点。', 
      en: 'The core of the Symbolic order, the reference point of the Law.' 
    },
    traditionalMeaning: { 
      zh: '帝座，至尊，代表领导力与尊贵。', 
      en: 'The Emperor, representing leadership and nobility.' 
    },
    philosophicalInsight: { 
      zh: '紫微是象征界的锚点，主体通过认同它获得合法性。', 
      en: 'The anchor of the Symbolic, where the subject gains legitimacy through identification.' 
    },
    color: '#a855f7'
  },
  {
    id: 'tianji',
    name: { zh: '天机', en: 'Tian Ji' },
    pinyin: 'Tian Ji',
    category: StarCategory.MAIN,
    realm: LacanRealm.SYMBOLIC,
    lacanConcept: { zh: '能指链的滑动', en: 'Sliding of the Signifier' },
    description: { 
      zh: '思维的流转，象征系统中不断变动的逻辑。', 
      en: 'The flow of thought, the shifting logic within the Symbolic system.' 
    },
    traditionalMeaning: { 
      zh: '智多星，善变，代表智慧与机巧。', 
      en: 'The Strategist, representing wisdom and changeability.' 
    },
    philosophicalInsight: { 
      zh: '智慧并非真相，而是能指在系统中的无尽延宕。', 
      en: 'Wisdom is not truth, but the endless deferral of the signifier.' 
    },
    color: '#3b82f6'
  },
  {
    id: 'taiyang',
    name: { zh: '太阳', en: 'Tai Yang' },
    pinyin: 'Tai Yang',
    category: StarCategory.MAIN,
    realm: LacanRealm.IMAGINARY,
    lacanConcept: { zh: '理想自我', en: 'Ideal-Ego' },
    description: { 
      zh: '在镜像阶段通过他者目光构建的完美形象。', 
      en: 'The perfect image constructed through the gaze of the other in the mirror stage.' 
    },
    traditionalMeaning: { 
      zh: '光明，显赫，博爱。', 
      en: 'Light, prominence, and altruism.' 
    },
    philosophicalInsight: { 
      zh: '太阳的灼热是认同的眩光，掩盖了主体的匮乏。', 
      en: 'The sun’s heat is the glare of identification, masking the subject’s lack.' 
    },
    color: '#fbbf24'
  },
  {
    id: 'wuqu',
    name: { zh: '武曲', en: 'Wu Qu' },
    pinyin: 'Wu Qu',
    category: StarCategory.MAIN,
    realm: LacanRealm.IMAGINARY,
    lacanConcept: { zh: '想象的防御', en: 'Imaginary Defense' },
    description: { 
      zh: '对物质力量的执着，抵御虚无的坚硬外壳。', 
      en: 'Obsession with material power, a hard shell against nothingness.' 
    },
    traditionalMeaning: { 
      zh: '财星，刚毅，决断。', 
      en: 'Finance, fortitude, and decisiveness.' 
    },
    philosophicalInsight: { 
      zh: '武曲象征主体在物质世界寻找支点，防止滑向焦虑。', 
      en: 'A pivot in the material world to prevent the slide into Real anxiety.' 
    },
    color: '#94a3b8'
  },
  {
    id: 'tiantong',
    name: { zh: '天同', en: 'Tian Tong' },
    pinyin: 'Tian Tong',
    category: StarCategory.MAIN,
    realm: LacanRealm.IMAGINARY,
    lacanConcept: { zh: '原初享乐', en: 'Original Jouissance' },
    description: { 
      zh: '对母体融合与零度张力的退行性渴望。', 
      en: 'Regressive desire for fusion with the maternal body.' 
    },
    traditionalMeaning: { 
      zh: '福星，慵懒，享乐。', 
      en: 'Fortune, leisure, and enjoyment.' 
    },
    philosophicalInsight: { 
      zh: '天同是主体对“失去的乐园”的不断回溯。', 
      en: 'The constant recursive search for the "Lost Paradise".' 
    },
    color: '#2dd4bf'
  },
  {
    id: 'lianzhen',
    name: { zh: '廉贞', en: 'Lian Zhen' },
    pinyin: 'Lian Zhen',
    category: StarCategory.MAIN,
    realm: LacanRealm.SYMBOLIC,
    lacanConcept: { zh: '欲望与禁忌', en: 'Desire and Taboo' },
    description: { 
      zh: '超我的严苛与欲望在秩序边缘的博弈。', 
      en: 'The struggle between Superego rigor and desire at the edge of order.' 
    },
    traditionalMeaning: { 
      zh: '囚星，纪律，次桃花。', 
      en: 'Prison, discipline, and secondary romance.' 
    },
    philosophicalInsight: { 
      zh: '廉贞展示了秩序如何通过禁忌维持欲望。', 
      en: 'How the Symbolic order maintains desire through prohibition.' 
    },
    color: '#ef4444'
  },
  {
    id: 'tianfu',
    name: { zh: '天府', en: 'Tian Fu' },
    pinyin: 'Tian Fu',
    category: StarCategory.MAIN,
    realm: LacanRealm.IMAGINARY,
    lacanConcept: { zh: '自我的容器', en: 'Container of the Ego' },
    description: { 
      zh: '试图通过积累来填补本体论的空洞。', 
      en: 'Attempting to fill the ontological void through accumulation.' 
    },
    traditionalMeaning: { 
      zh: '库房，稳重，守成。', 
      en: 'Vault, stability, and preservation.' 
    },
    philosophicalInsight: { 
      zh: '天府是自我构建的避风港。', 
      en: 'The ego’s constructed safe harbor.' 
    },
    color: '#f97316'
  },
  {
    id: 'taiyin',
    name: { zh: '太阴', en: 'Tai Yin' },
    pinyin: 'Tai Yin',
    category: StarCategory.MAIN,
    realm: LacanRealm.IMAGINARY,
    lacanConcept: { zh: '幻想空间', en: 'Phantasy Space' },
    description: { 
      zh: '私密的映射，为主体提供栖息的幻景。', 
      en: 'Private mapping providing a phantasmatic habitat for the subject.' 
    },
    traditionalMeaning: { 
      zh: '母性，宁静，田宅。', 
      en: 'Maternal, tranquility, and property.' 
    },
    philosophicalInsight: { 
      zh: '太阴是避开实在界恐怖的屏幕。', 
      en: 'The screen that veils the horror of the Real.' 
    },
    color: '#818cf8'
  },
  {
    id: 'tanlang',
    name: { zh: '贪狼', en: 'Tan Lang' },
    pinyin: 'Tan Lang',
    category: StarCategory.MAIN,
    realm: LacanRealm.IMAGINARY,
    lacanConcept: { zh: '小客体a', en: 'Objet Petit a' },
    description: { 
      zh: '欲望的诱因，那在缺失处闪烁的对象。', 
      en: 'The cause of desire, the object shimmering in the place of lack.' 
    },
    traditionalMeaning: { 
      zh: '桃花，贪欲，修道。', 
      en: 'Romance, greed, and spiritual practice.' 
    },
    philosophicalInsight: { 
      zh: '贪狼代表欲望本身作为动力的“匮乏”。', 
      en: 'Desire itself as the driving force of "lack".' 
    },
    color: '#ec4899'
  },
  {
    id: 'jumen',
    name: { zh: '巨门', en: 'Ju Men' },
    pinyin: 'Ju Men',
    category: StarCategory.MAIN,
    realm: LacanRealm.REAL,
    lacanConcept: { zh: '能指的深渊', en: 'Abyss of the Signifier' },
    description: { 
      zh: '言语无法填补的空穴，焦虑之源。', 
      en: 'The hole words cannot fill, the source of anxiety.' 
    },
    traditionalMeaning: { 
      zh: '口舌，疑虑，暗星。', 
      en: 'Dispute, suspicion, and darkness.' 
    },
    philosophicalInsight: { 
      zh: '巨门是象征秩序中那道漏气的裂缝。', 
      en: 'The leak in the structure of the Symbolic order.' 
    },
    color: '#4b5563'
  },
  {
    id: 'tianxiang',
    name: { zh: '天相', en: 'Tian Xiang' },
    pinyin: 'Tian Xiang',
    category: StarCategory.MAIN,
    realm: LacanRealm.SYMBOLIC,
    lacanConcept: { zh: '镜像识别', en: 'Specular Identification' },
    description: { 
      zh: '象征秩序得以契合的胶水。', 
      en: 'The glue that holds the Symbolic order together.' 
    },
    traditionalMeaning: { 
      zh: '印星，协调，文书。', 
      en: 'Seal, coordination, and documentation.' 
    },
    philosophicalInsight: { 
      zh: '天相通过形式完美掩盖结构缺陷。', 
      en: 'Masking structural flaws through formal perfection.' 
    },
    color: '#06b6d4'
  },
  {
    id: 'tianliang',
    name: { zh: '天梁', en: 'Tian Liang' },
    pinyin: 'Tian Liang',
    category: StarCategory.MAIN,
    realm: LacanRealm.SYMBOLIC,
    lacanConcept: { zh: '超我保护', en: 'Superego Protection' },
    description: { 
      zh: '通过建立道德律法来缓解原罪感。', 
      en: 'Mitigating guilt through the establishment of moral law.' 
    },
    traditionalMeaning: { 
      zh: '荫星，保护，解厄。', 
      en: 'Shelter, protection, and relief.' 
    },
    philosophicalInsight: { 
      zh: '天梁是文明赋予个体的道德屏障。', 
      en: 'The moral shield granted by civilization.' 
    },
    color: '#84cc16'
  },
  {
    id: 'qisha',
    name: { zh: '七杀', en: 'Qi Sha' },
    pinyin: 'Qi Sha',
    category: StarCategory.MAIN,
    realm: LacanRealm.REAL,
    lacanConcept: { zh: '死驱力', en: 'Death Drive' },
    description: { 
      zh: '对象征秩序的毁灭性突破。', 
      en: 'Destructive breakthrough of the Symbolic order.' 
    },
    traditionalMeaning: { 
      zh: '将星，肃杀，变革。', 
      en: 'General, austerity, and revolution.' 
    },
    philosophicalInsight: { 
      zh: '七杀是直面“它者不存在”的瞬间。', 
      en: 'The moment of facing the non-existence of the Other.' 
    },
    color: '#b91c1c'
  },
  {
    id: 'pojun',
    name: { zh: '破军', en: 'Po Jun' },
    pinyin: 'Po Jun',
    category: StarCategory.MAIN,
    realm: LacanRealm.REAL,
    lacanConcept: { zh: '付诸行动', en: 'Passage to the Act' },
    description: { 
      zh: '通过彻底的耗散来否定统治。', 
      en: 'Negating rule through total expenditure.' 
    },
    traditionalMeaning: { 
      zh: '耗星，先锋，重建。', 
      en: 'Consumption, pioneer, and reconstruction.' 
    },
    philosophicalInsight: { 
      zh: '破军是以自我湮灭为代价的主动进攻。', 
      en: 'An active assault at the cost of self-annihilation.' 
    },
    color: '#1e3a8a'
  },

  // --- 14 Assistant Stars ---
  {
    id: 'zuofu',
    name: { zh: '左辅', en: 'Zuo Fu' },
    pinyin: 'Zuo Fu',
    category: StarCategory.ASSISTANT,
    realm: LacanRealm.IMAGINARY,
    lacanConcept: { zh: '镜像认同', en: 'Specular Identification' },
    description: { zh: '来自同伴的支持。', en: 'Support from peers.' },
    traditionalMeaning: { zh: '平辈助力。', en: 'Help from contemporaries.' },
    philosophicalInsight: { zh: '左辅修补了主体初期的支离破碎感。', en: 'Mending the early fragmentation of the subject.' },
    color: '#a5f3fc'
  },
  {
    id: 'youbi',
    name: { zh: '右弼', en: 'You Bi' },
    pinyin: 'You Bi',
    category: StarCategory.ASSISTANT,
    realm: LacanRealm.IMAGINARY,
    lacanConcept: { zh: '自我理想投射', en: 'Projected Ego-Ideal' },
    description: { zh: '对能力的幻想性肯定。', en: 'Phantasmatic affirmation of capability.' },
    traditionalMeaning: { zh: '异性助力。', en: 'Help from opposite sex.' },
    philosophicalInsight: { zh: '右弼是自我的辅助性幻象。', en: 'The ego’s auxiliary phantasy.' },
    color: '#a78bfa'
  },
  {
    id: 'wenchang',
    name: { zh: '文昌', en: 'Wen Chang' },
    pinyin: 'Wen Chang',
    category: StarCategory.ASSISTANT,
    realm: LacanRealm.SYMBOLIC,
    lacanConcept: { zh: '主人能指', en: 'Master Signifier' },
    description: { zh: '被赋予权威的文字。', en: 'Authoritative text.' },
    traditionalMeaning: { zh: '科甲，文书。', en: 'Academics, literature.' },
    philosophicalInsight: { zh: '文昌是进入象征界的入场券。', en: 'The ticket to enter the Symbolic realm.' },
    color: '#60a5fa'
  },
  {
    id: 'wenqu',
    name: { zh: '文曲', en: 'Wen Qu' },
    pinyin: 'Wen Qu',
    category: StarCategory.ASSISTANT,
    realm: LacanRealm.SYMBOLIC,
    lacanConcept: { zh: '知识的享乐', en: 'Jouissance in Knowledge' },
    description: { zh: '能指链中的韵律。', en: 'Rhythm in the signifier chain.' },
    traditionalMeaning: { zh: '才艺，口才。', en: 'Arts, eloquence.' },
    philosophicalInsight: { zh: '文曲是理性的诗意化表达。', en: 'The poetic expression of rationality.' },
    color: '#34d399'
  },
  {
    id: 'tiankui',
    name: { zh: '天魁', en: 'Tian Kui' },
    pinyin: 'Tian Kui',
    category: StarCategory.ASSISTANT,
    realm: LacanRealm.SYMBOLIC,
    lacanConcept: { zh: '理想它者', en: 'Ideal Other' },
    description: { zh: '象征秩序中的引导。', en: 'Guidance in the Symbolic order.' },
    traditionalMeaning: { zh: '贵人，明助。', en: 'Benefactor, overt help.' },
    philosophicalInsight: { zh: '天魁是对全知父性的渴望。', en: 'The longing for an omniscient father.' },
    color: '#fbbf24'
  },
  {
    id: 'tianyue',
    name: { zh: '天钺', en: 'Tian Yue' },
    pinyin: 'Tian Yue',
    category: StarCategory.ASSISTANT,
    realm: LacanRealm.SYMBOLIC,
    lacanConcept: { zh: '象征机遇', en: 'Symbolic Opportunity' },
    description: { zh: '缝隙中闪现的机会。', en: 'Chances flashing in the gaps.' },
    traditionalMeaning: { zh: '贵人，暗助。', en: 'Benefactor, subtle help.' },
    philosophicalInsight: { zh: '天钺是象征界的偶然奖赏。', en: 'Occasional rewards from the Symbolic order.' },
    color: '#f472b6'
  },
  {
    id: 'qingyang',
    name: { zh: '擎羊', en: 'Qing Yang' },
    pinyin: 'Qing Yang',
    category: StarCategory.ASSISTANT,
    realm: LacanRealm.REAL,
    lacanConcept: { zh: '阉割之刃', en: 'Blade of Castration' },
    description: { zh: '进入象征界的代价。', en: 'The cost of entering the Symbolic.' },
    traditionalMeaning: { zh: '刑伤，冲动。', en: 'Injury, impulse.' },
    philosophicalInsight: { zh: '擎羊是划开原初享乐的一刀。', en: 'The cut that severs primal jouissance.' },
    color: '#dc2626'
  },
  {
    id: 'tuoluo',
    name: { zh: '陀罗', en: 'Tuo Luo' },
    pinyin: 'Tuo Luo',
    category: StarCategory.ASSISTANT,
    realm: LacanRealm.REAL,
    lacanConcept: { zh: '症状螺旋', en: 'Spiral of Symptom' },
    description: { zh: '创伤周围的重复循环。', en: 'Repetitive loop around trauma.' },
    traditionalMeaning: { zh: '拖延，阻碍。', en: 'Delay, obstacle.' },
    philosophicalInsight: { zh: '陀罗是死驱力的体现。', en: 'A manifestation of the death drive.' },
    color: '#64748b'
  },
  {
    id: 'huoxing',
    name: { zh: '火星', en: 'Huo Xing' },
    pinyin: 'Huo Xing',
    category: StarCategory.ASSISTANT,
    realm: LacanRealm.REAL,
    lacanConcept: { zh: '享乐爆发', en: 'Outburst of Jouissance' },
    description: { zh: '不可控的情绪爆发。', en: 'Uncontrollable emotional outburst.' },
    traditionalMeaning: { zh: '暴躁，动荡。', en: 'Irascibility, instability.' },
    philosophicalInsight: { zh: '火星是失去语言控制的时刻。', en: 'The moment language fails control.' },
    color: '#f97316'
  },
  {
    id: 'lingxing',
    name: { zh: '铃星', en: 'Ling Xing' },
    pinyin: 'Ling Xing',
    category: StarCategory.ASSISTANT,
    realm: LacanRealm.REAL,
    lacanConcept: { zh: '超我回响', en: 'Superego Echo' },
    description: { zh: '隐秘的自我惩罚。', en: 'Subtle self-punishment.' },
    traditionalMeaning: { zh: '焦虑，隐患。', en: 'Anxiety, hidden trouble.' },
    philosophicalInsight: { zh: '铃星是超我尖锐的指责。', en: 'The sharp accusation of the Superego.' },
    color: '#4338ca'
  },
  {
    id: 'dikong',
    name: { zh: '地空', en: 'Di Kong' },
    pinyin: 'Di Kong',
    category: StarCategory.ASSISTANT,
    realm: LacanRealm.REAL,
    lacanConcept: { zh: '原初匮乏', en: 'Original Lack' },
    description: { zh: '核心处的黑洞。', en: 'The black hole at the core.' },
    traditionalMeaning: { zh: '空亡，消解。', en: 'Void, dissolution.' },
    philosophicalInsight: { zh: '地空揭示欲望的核心是空。', en: 'Revealing the core of desire is void.' },
    color: '#0f172a'
  },
  {
    id: 'dijie',
    name: { zh: '地劫', en: 'Di Jie' },
    pinyin: 'Di Jie',
    category: StarCategory.ASSISTANT,
    realm: LacanRealm.REAL,
    lacanConcept: { zh: '欲望截断', en: 'Severing of Desire' },
    description: { zh: '幻想屏幕的撕裂。', en: 'Tearing of the phantasy screen.' },
    traditionalMeaning: { zh: '破财，波折。', en: 'Loss, setback.' },
    philosophicalInsight: { zh: '地劫是遭遇它者不存在的瞬间。', en: 'The moment of encountering the non-existence of the Other.' },
    color: '#451a03'
  },
  {
    id: 'lucun',
    name: { zh: '禄存', en: 'Lu Cun' },
    pinyin: 'Lu Cun',
    category: StarCategory.ASSISTANT,
    realm: LacanRealm.IMAGINARY,
    lacanConcept: { zh: '剩余享乐', en: 'Surplus Jouissance' },
    description: { zh: '平衡的盈余。', en: 'Surplus for balance.' },
    traditionalMeaning: { zh: '财禄，稳固。', en: 'Wealth, stability.' },
    philosophicalInsight: { zh: '禄存是维持平衡的“多余”。', en: 'The "excess" that maintains balance.' },
    color: '#fb7185'
  },
  {
    id: 'tianma',
    name: { zh: '天马', en: 'Tian Ma' },
    pinyin: 'Tian Ma',
    category: StarCategory.ASSISTANT,
    realm: LacanRealm.SYMBOLIC,
    lacanConcept: { zh: '转喻运动', en: 'Metonymic Movement' },
    description: { zh: '欲望跳跃的过程。', en: 'The process of desire leaping.' },
    traditionalMeaning: { zh: '奔波，变动。', en: 'Hustle, change.' },
    philosophicalInsight: { zh: '天马是欲望的引擎。', en: 'The engine of desire.' },
    color: '#fbbf24'
  },

  // --- Misc Stars (Selection) ---
  {
    id: 'hongluan',
    name: { zh: '红鸾', en: 'Hong Luan' },
    pinyin: 'Hong Luan',
    category: StarCategory.MISC,
    realm: LacanRealm.IMAGINARY,
    lacanConcept: { zh: '镜像绽放', en: 'Bloom of the Mirror' },
    description: { zh: '对“美”的初次捕获。', en: 'The first capture of "beauty".' },
    traditionalMeaning: { zh: '婚配，人缘。', en: 'Marriage, popularity.' },
    philosophicalInsight: { zh: '红鸾是迷人的幻象。', en: 'A charming phantasm.' },
    color: '#fda4af'
  },
  {
    id: 'yinsha',
    name: { zh: '阴煞', en: 'Yin Sha' },
    pinyin: 'Yin Sha',
    category: StarCategory.MISC,
    realm: LacanRealm.REAL,
    lacanConcept: { zh: '诡异', en: 'The Uncanny' },
    description: { zh: '实在界的鬼魅入侵。', en: 'The spectral intrusion of the Real.' },
    traditionalMeaning: { zh: '邪祟，小人。', en: 'Malice, interference.' },
    philosophicalInsight: { zh: '阴煞是令人不安的真相。', en: 'The disturbing truth.' },
    color: '#1e293b'
  }
];
