export type GameType = 'bomb' | 'spy' | 'who_among_us' | 'speed' | 'pressure' | 'fake_answer' | 'fact_fiction' | 'distorted_word' | 'convincing_answer' | 'fake_memory' | 'who_caused_it' | 'forbidden_word';

export type CardTheme = 'classic' | 'notebook' | 'dark' | 'party' | 'minimal';

export interface Player {
  id: string;
  name: string;
  score: number;
  roundsWon: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  theme: 'light' | 'dark';
  gameTime: number;
  difficulty: 'سهل' | 'متوسط' | 'صعب';
  cardTheme: CardTheme;
  spiesCount: number;
  language: 'ar' | 'en';
}

export interface GameState {
  players: Player[];
  currentGame: GameType | null;
  phase: 'setup' | 'menu' | 'settings' | 'explanation' | 'passing' | 'playing' | 'voting' | 'results' | 'scoreboard' | 'winner';
  currentPlayerIndex: number;
  gameData: any;
  settings: GameSettings;
}

export const THEMES: Record<CardTheme, { bg: string; text: string; border: string; font: string; effect?: string }> = {
  classic: { bg: 'bg-white dark:bg-slate-900', text: 'text-slate-900 dark:text-white', border: 'border-slate-200 dark:border-slate-800', font: 'font-sans' },
  notebook: { bg: 'bg-[#fdf6e3]', text: 'text-[#586e75]', border: 'border-dashed border-[#93a1a1]/50', font: 'font-serif', effect: 'shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]' },
  dark: { bg: 'bg-black', text: 'text-white', border: 'border-slate-800', font: 'font-sans', effect: 'shadow-[0_0_80px_rgba(79,70,229,0.2)] border-indigo-500/30' },
  party: { bg: 'bg-gradient-to-br from-red-600 via-rose-600 to-orange-600', text: 'text-white', border: 'border-white/20', font: 'font-black', effect: 'shadow-2xl' },
  minimal: { bg: 'bg-white dark:bg-black', text: 'text-slate-800 dark:text-slate-100', border: 'border-slate-100 dark:border-slate-900', font: 'font-sans' },
};

export const FUNNY_QUOTES = [
  "يا عم انت بتفكر من طيزك؟ 😂",
  "ده دماغك محتاجة دماغ والله",
  "إجابة جامدة… بس حطها في ودنك👏",
  "انت داخل تلعب ولا بتلعب🤨 ؟",
  "ركز يا نجم انت فين 😂",
  "ده مش جواب ده محاولة 😂",
  "يا ابني ركز، شكلك شربت حاجة ساقعة كتير",
  "الإجابة دي محتاجة واسطة عشان تتقبل",
  "عاش يا بطل، بس دي مش المسابقة الصح",
  "يا ريتك سكت، كان شكلك أفخم",
  "انت بتجيب الثقة دي منين؟ 😂"
];

export const GAME_DETAILS: Record<GameType, { name: string; description: string; points: number; iconName?: string; rules?: string }> = {
  bomb: { 
    name: 'قنبلة اللمة', 
    description: 'جاوب بسرعة وسلم الموبايل قبل ما القنبلة تفرقع فيك!', 
    points: 10, 
    rules: 'اللعبة بتبدأ عند واحد، لازم يجاوب على السؤال ويسلم الموبايل للي بعده بسرعة. اللي القنبلة تفرقع فيه هو الخسران! خلي بالك الصوت عالي 😉' 
  },
  spy: { 
    name: 'جاسوس الجروب', 
    description: 'واحد فيكم مش عارف الكلمة، لازم يطنش ويحاول ميتكفش!', 
    points: 15, 
    rules: 'الكل هيشوف كلمة سرية إلا واحد (الجاسوس). في الآخر فيه تصويت سري عشان نكشفه!' 
  },
  who_among_us: { 
    name: 'مين فينا؟', 
    description: 'صوتوا لأكتر واحد ينطبق عليه السؤال ده!', 
    points: 5, 
    rules: 'هيظهر سؤال لوصف معين، والكل هيصوت لأكتر واحد شايفين إنه ينطبق عليه الوصف ده. الفضحية ببان بجد!' 
  },
  speed: { 
    name: 'تحدي الثواني', 
    description: 'جاوب 3 حاجات في 3 ثواني بس.. تقدر؟', 
    points: 10, 
    rules: 'تحدي بيمر على كل اللاعيبه، السرعة هي أهم حاجة!' 
  },
  pressure: { 
    name: 'تحت الضغط', 
    description: 'جاوب بسرعة والوقت بيجري وراك!', 
    points: 10, 
    rules: 'أسئلة سريعة ورا بعض، لازم تجاوب قبل ما الوقت يخلص. الضغط هو اللي هيحدد مين هيكمل!' 
  },
  fake_answer: { 
    name: 'القول المزور', 
    description: 'جاوب إجابة غلط خالص وحاول تضحك الناس!', 
    points: 5, 
    rules: 'سؤال هيظهر، ومطلوب منك تجاوب إجابة غلط تماماً بس تكون مضللة. لازم تقنعهم!' 
  },
  fact_fiction: { 
    name: 'حقيقة ولا كدب', 
    description: 'قول معلومة والناس تخمن دي بجد ولا بتشتغلهم؟', 
    points: 10, 
    rules: 'لاعب بيقول معلومة أو موقف حصل له، والباقي لازم يحزروا هل الكلام ده حقيقي ولا فبركة! فيه كارت سري بيطلع لكل واحد.' 
  },
  distorted_word: { 
    name: 'كلمة مشوهة', 
    description: 'الكلمة هتتغير من واحد للتاني.. شوفوا في الآخر وصلت لأيه!', 
    points: 15, 
    rules: 'أول لاعب بيشوف كلمة، وبيكتبها بشكل مختلف للي بعده، وهكذا.. في الآخر بنشوف الكلمة الأصلية وصلت لأيه!' 
  },
  convincing_answer: { 
    name: 'الجواب المقنع', 
    description: 'مين هيقدر يقنعكم بكذبته إنها الحقيقة؟', 
    points: 20, 
    rules: 'واحد معاه الإجابة الصح والباقي بيألفوا إجابات. حاول تختار الإجابة الصح من وسط التأليف، أو ألف أنت عشان تغشهم!' 
  },
  fake_memory: { name: 'ذاكرة مزورة', description: 'قصة واحدة بتفاصيل مختلفة.. مين اللي ذاكرته مضروبة؟', points: 15, rules: 'الكل بيسمع قصة واحدة، بس فيه واحد منهم هيسمع قصة بتفاصيل مختلفة بسيطة. لازم تكتشفوا مين هو!' },
  who_caused_it: { name: 'مين السبب؟', description: 'كارثة حصلت، وواحد فيكم هو السبب.. دافع عن نفسك!', points: 10, rules: 'قضية أو كارثة حصلت، وكل واحد بيحاول يدافع عن نفسه. واحد فيكم هو الجاني الحقيقي، حاولوا تكتشفوه!' },
  forbidden_word: { name: 'كلمة ممنوعة', description: 'اتكلم براحتك بس اوعى تقول الكلمة اللي على راسك!', points: 15, rules: 'كل واحد له كلمة ممنوعة ما يعرفهاش غيره. حاولوا تتكلموا وتخلوا التانيين يقولوا كلماتهم الممنوعة من غير ما تقع أنت!' },
};

export const CATEGORIES = {
  BOMB: [
    { text: "اسم بنت بحرف م", category: "عامة" }, { text: "فواكه لونها أحمر", category: "عامة" },
    { text: "عواصم عربية", category: "جغرافيا" }, { text: "ماركات سيارات", category: "عامة" },
    { text: "نادي كرة قدم مصري", category: "رياضة" }, { text: "لاعب كرة قدم عالمي", category: "رياضة" },
    { text: "أكلة مصرية شعبية", category: "عامة" }, { text: "حيوان مفترس", category: "عامة" },
    { text: "ماركة موبايلات", category: "عامة" }, { text: "مغني راب مشهور", category: "فن" },
    { text: "حاجة بتتحط في التلاجة", category: "عامة" }, { text: "كلمة بنقولها لما نتخض", category: "كلام مصري" },
    { text: "نوع حلويات شرقية", category: "أكل" }, { text: "مسلسل رمضاني قديم", category: "فن" }
  ],
  SPY: [
    { word: "بيتزا", category: "أكل" }, { word: "مدرسة", category: "أماكن" },
    { word: "طيار", category: "وظائف" }, { word: "أسد", category: "حيوانات" },
    { word: "سينما", category: "أماكن" }, { word: "كشري", category: "أكل" },
    { word: "تنس", category: "رياضة" }, { word: "كرة سلة", category: "رياضة" },
    { word: "قهوة", category: "مشروبات" }, { word: "مستشفى", category: "أماكن" },
    { word: "ميكروباص", category: "مواصلات" }, { word: "ميدان التحرير", category: "أماكن" }
  ],
  WHO_AMONG_US: [
    { text: "مين فينا ممكن ينام في المحاضرة؟", category: "عامة" },
    { text: "مين فينا أكتر واحد 'بيأفور'؟", category: "عامة" },
    { text: "مين فينا أكتر واحد بيحب الأكل؟", category: "عامة" },
    { text: "مين فينا ممكن يسافر فجأة؟", category: "عامة" },
    { text: "مين فينا أكتر واحد 'دحيح'؟", category: "دراسة" },
    { text: "مين فينا أكتر واحد بيحور؟", category: "عامة" },
    { text: "مين فينا أكتر واحد رياضي?", category: "رياضة" },
    { text: "مين فينا أكتر واحد 'فرايري'؟", category: "شلة" },
    { text: "مين فينا اللي 'دماغه فوتت'؟", category: "شلة" }
  ],
  SPEED: [
    { text: "أذكر 3 أسماء مدن ساحلية", category: "جغرافيا" },
    { text: "أذكر 3 أنواع موبايلات", category: "عامة" },
    { text: "أذكر 3 أسماء ممثلين كوميديين", category: "فن" },
    { text: "أذكر 3 لعيبة كورة مصريين", category: "رياضة" },
    { text: "أذكر 3 ماركات سيارات", category: "عامة" },
    { text: "أذكر 3 أنواع خضروات", category: "عامة" },
    { text: "أذكر 3 كلمات مصرية ملهاش معنى", category: "كلام مصري" }
  ],
  PRESSURE: [
    { text: "أذكر 3 أسماء فواكه", category: "عامة" },
    { text: "أذكر 3 ماركات سيارات", category: "عامة" },
    { text: "أذكر 3 دول أوروبية", category: "جغرافيا" },
    { text: "أذكر 3 لعيبة كورة", category: "رياضة" },
    { text: "أذكر 3 ألوان", category: "عامة" }
  ],
  FAKE_ANSWER: [
    { text: "أيه أغرب حاجة أكلتها؟", category: "عامة" },
    { text: "أيه أكتر موقف محرج حصلك؟", category: "عامة" },
    { text: "لو معاك مليون جنيه هتعمل أيه؟", category: "عامة" },
    { text: "أيه أكبر كدبة كدبتها؟", category: "عامة" }
  ],
  FACT_FICTION: [
    { text: "قول معلومة غريبة عن نفسك", category: "عامة" },
    { text: "قول موقف حصلك زمان", category: "عامة" },
    { text: "قول موهبة عندك", category: "عامة" }
  ],
  DISTORTED: [
    "طيارة ورق", "كوباية شاي", "قطة مغمضة", "ساندوتش كبدة", "عربية نقل", "فيل بينط", "بوابات الجنة", "عيش وملح"
  ],
  CONVINCING: [
    { q: "ليه السماء لونها أزرق؟", a: "بسبب تشتت أشعة الشمس في الغلاف الجوي" },
    { q: "ليه الفلفل بيحرق؟", a: "عشان فيه مادة اسمها الكابسيسين" },
    { q: "ليه بنحس بالجوع؟", a: "بسبب انخفاض سكر الدم وهرمون الجريلين" }
  ],
  MEMORY: [
    { 
      story: "كنا في الساحل وبناكل سمك، فجأة هجمت قطة وخطف السمكة الكبيرة من طبق محمد وجريت.",
      variants: [
        "كنا في الساحل وبناكل سمك، فجأة هجم كلب وخطف السمكة الكبيرة من طبق محمد وجري.",
        "كنا في الساحل وبناكل سمك، فجأة هجمت قطة وخطف السمكة الكبيرة من طبق أحمد وجريت."
      ]
    }
  ],
  CAUSED_IT: [
    "الكلمة السرية اتكشفت في عز الفرح!", "تورته عيد الميلاد وقعت في فستان العروسة!", "ميزانية الشلة ضاعت في سهرة واحدة!"
  ],
  FORBIDDEN: [
    "بجد", "يعني", "أصلاً", "بص", "عارف", "لا", "طبعاً"
  ]
};
