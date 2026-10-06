import type { Locale } from "./types";

export type LandingMessages = {
  metaTitleSuffix: string;
  metaDescriptionFallback: string;
  navHow: string;
  navCurriculum: string;
  seeHow: string;
  howEyebrow: string;
  howTitle: string;
  howLead: (name: string) => string;
  howSteps: readonly [
    { n: string; title: string; body: string },
    { n: string; title: string; body: string },
    { n: string; title: string; body: string },
  ];
  footerHome: string;
};

export type NavMessages = {
  howItWorks: string;
  curriculum: string;
  home: string;
  liveGold: string;
  whyThis: string;
  startLearning: string;
};

export type AffiliateCopy = {
  eyebrow: string;
  tagline: string;
  blurb: string;
  ctaLabel: string;
  footerNote: string;
};

export type Messages = {
  langLabel: string;
  landing: LandingMessages;
  nav: NavMessages;
  /** Face-brand marketing copy keyed by affiliate slug */
  affiliate: Record<string, AffiliateCopy>;
};

const en: Messages = {
  langLabel: "Language",
  landing: {
    metaTitleSuffix: "Stop chasing signals",
    metaDescriptionFallback: "learn to trade with judgment — not tip spam.",
    navHow: "How it works",
    navCurriculum: "Curriculum",
    seeHow: "See how it works",
    howEyebrow: "How it works",
    howTitle: "Three steps. Then you're in the room.",
    howLead: (name) =>
      `No guesswork. A straight path from first lesson to your seat with ${name}.`,
    howSteps: [
      {
        n: "01",
        title: "Learn the language",
        body: "Seven plain-English stations — direction, pairs, candles, supply & demand, and risk — so charts stop feeling like noise.",
      },
      {
        n: "02",
        title: "Prove it on the checklist",
        body: "Before you risk a dollar, tick every box. Discipline first. Excitement last.",
      },
      {
        n: "03",
        title: "Claim your seat",
        body: "Graduate, leave your details, and join the room — Telegram, WhatsApp, and the crew that actually teaches.",
      },
    ],
    footerHome: "Home",
  },
  nav: {
    howItWorks: "How it works",
    curriculum: "Curriculum",
    home: "Home",
    liveGold: "Live gold",
    whyThis: "Why this",
    startLearning: "Start Learning",
  },
  affiliate: {
    sara: {
      eyebrow: "Private trading education · XAUUSD & FX",
      tagline: "Stop chasing signals. Learn to trade with judgment.",
      blurb:
        "A clear path from zero to first checklist — then your seat with Sara’s group. No tip spam. No noise. Just the skills that keep accounts alive.",
      ctaLabel: "Start the path",
      footerNote: "Education for the SARA TRADING FX group. Not financial advice.",
    },
  },
};

const fr: Messages = {
  langLabel: "Langue",
  landing: {
    metaTitleSuffix: "Arrêtez de chasser les signaux",
    metaDescriptionFallback: "apprenez à trader avec jugement — pas du spam de tips.",
    navHow: "Comment ça marche",
    navCurriculum: "Programme",
    seeHow: "Voir comment ça marche",
    howEyebrow: "Comment ça marche",
    howTitle: "Trois étapes. Puis vous êtes dans la room.",
    howLead: (name) =>
      `Pas de flou. Un chemin direct de la première leçon à votre place avec ${name}.`,
    howSteps: [
      {
        n: "01",
        title: "Apprendre le langage",
        body: "Sept stations en langage clair — direction, paires, bougies, offre & demande, et risque — pour que les charts cessent d’être du bruit.",
      },
      {
        n: "02",
        title: "Le prouver sur la checklist",
        body: "Avant de risquer un euro, cochez chaque case. Discipline d’abord. Excitation ensuite.",
      },
      {
        n: "03",
        title: "Réclamer votre place",
        body: "Diplômez-vous, laissez vos coordonnées, et rejoignez la room — Telegram, WhatsApp, et l’équipe qui enseigne vraiment.",
      },
    ],
    footerHome: "Accueil",
  },
  nav: {
    howItWorks: "Comment ça marche",
    curriculum: "Programme",
    home: "Accueil",
    liveGold: "Or en direct",
    whyThis: "Pourquoi ça",
    startLearning: "Commencer",
  },
  affiliate: {
    sara: {
      eyebrow: "Formation trading privée · XAUUSD & FX",
      tagline: "Arrêtez de chasser les signaux. Apprenez à trader avec jugement.",
      blurb:
        "Un chemin clair du zéro à la première checklist — puis votre place dans le groupe de Sara. Pas de spam de tips. Pas de bruit. Juste les compétences qui gardent les comptes en vie.",
      ctaLabel: "Commencer le parcours",
      footerNote: "Formation pour le groupe SARA TRADING FX. Pas un conseil financier.",
    },
  },
};

const es: Messages = {
  langLabel: "Idioma",
  landing: {
    metaTitleSuffix: "Deja de perseguir señales",
    metaDescriptionFallback: "aprende a operar con criterio — no spam de tips.",
    navHow: "Cómo funciona",
    navCurriculum: "Temario",
    seeHow: "Ver cómo funciona",
    howEyebrow: "Cómo funciona",
    howTitle: "Tres pasos. Luego estás en la sala.",
    howLead: (name) =>
      `Sin adivinanzas. Un camino directo de la primera lección a tu sitio con ${name}.`,
    howSteps: [
      {
        n: "01",
        title: "Aprende el lenguaje",
        body: "Siete estaciones en lenguaje claro — dirección, pares, velas, oferta y demanda, y riesgo — para que los gráficos dejen de ser ruido.",
      },
      {
        n: "02",
        title: "Demuéstralo en la checklist",
        body: "Antes de arriesgar un dólar, marca cada casilla. Disciplina primero. Emoción después.",
      },
      {
        n: "03",
        title: "Reclama tu sitio",
        body: "Gradúate, deja tus datos y únete a la sala — Telegram, WhatsApp y el equipo que sí enseña.",
      },
    ],
    footerHome: "Inicio",
  },
  nav: {
    howItWorks: "Cómo funciona",
    curriculum: "Temario",
    home: "Inicio",
    liveGold: "Oro en vivo",
    whyThis: "Por qué esto",
    startLearning: "Empezar",
  },
  affiliate: {
    sara: {
      eyebrow: "Formación privada de trading · XAUUSD & FX",
      tagline: "Deja de perseguir señales. Aprende a operar con criterio.",
      blurb:
        "Un camino claro de cero a la primera checklist — luego tu sitio en el grupo de Sara. Sin spam de tips. Sin ruido. Solo las habilidades que mantienen las cuentas vivas.",
      ctaLabel: "Empezar el camino",
      footerNote: "Formación para el grupo SARA TRADING FX. No es consejo financiero.",
    },
  },
};

const ar: Messages = {
  langLabel: "اللغة",
  landing: {
    metaTitleSuffix: "توقف عن مطاردة الإشارات",
    metaDescriptionFallback: "تعلّم التداول بحكم — لا سبام نصائح.",
    navHow: "كيف يعمل",
    navCurriculum: "المنهج",
    seeHow: "شاهد كيف يعمل",
    howEyebrow: "كيف يعمل",
    howTitle: "ثلاث خطوات. ثم تكون في الغرفة.",
    howLead: (name) =>
      `بدون تخمين. مسار مباشر من الدرس الأول إلى مقعدك مع ${name}.`,
    howSteps: [
      {
        n: "01",
        title: "تعلّم اللغة",
        body: "سبع محطات بلغة واضحة — الاتجاه، الأزواج، الشموع، العرض والطلب، والمخاطر — حتى تتوقف الشارتات عن كونها ضوضاء.",
      },
      {
        n: "02",
        title: "أثبته على قائمة التحقق",
        body: "قبل أن تخاطر بدولار، ضع علامة على كل بند. الانضباط أولاً. الحماس آخراً.",
      },
      {
        n: "03",
        title: "احجز مقعدك",
        body: "تخرّج، اترك بياناتك، وانضم إلى الغرفة — تيليجرام وواتساب والفريق الذي يعلّم فعلاً.",
      },
    ],
    footerHome: "الرئيسية",
  },
  nav: {
    howItWorks: "كيف يعمل",
    curriculum: "المنهج",
    home: "الرئيسية",
    liveGold: "الذهب مباشرة",
    whyThis: "لماذا هذا",
    startLearning: "ابدأ التعلم",
  },
  affiliate: {
    sara: {
      eyebrow: "تعليم تداول خاص · XAUUSD والفوركس",
      tagline: "توقف عن مطاردة الإشارات. تعلّم التداول بحكم.",
      blurb:
        "مسار واضح من الصفر إلى أول قائمة تحقق — ثم مقعدك مع مجموعة سارة. بلا سبام نصائح. بلا ضوضاء. فقط المهارات التي تبقي الحسابات حيّة.",
      ctaLabel: "ابدأ المسار",
      footerNote: "تعليم لمجموعة SARA TRADING FX. ليس نصيحة مالية.",
    },
  },
};

export const MESSAGES: Record<Locale, Messages> = { en, fr, es, ar };

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale] ?? MESSAGES.en;
}

export function getAffiliateCopy(
  locale: Locale,
  slug: string,
  fallback?: Partial<AffiliateCopy>,
): AffiliateCopy {
  const fromDict = getMessages(locale).affiliate[slug];
  const enFallback = MESSAGES.en.affiliate[slug];
  return {
    eyebrow: fromDict?.eyebrow ?? fallback?.eyebrow ?? enFallback?.eyebrow ?? "",
    tagline: fromDict?.tagline ?? fallback?.tagline ?? enFallback?.tagline ?? "",
    blurb: fromDict?.blurb ?? fallback?.blurb ?? enFallback?.blurb ?? "",
    ctaLabel: fromDict?.ctaLabel ?? fallback?.ctaLabel ?? enFallback?.ctaLabel ?? "Start",
    footerNote:
      fromDict?.footerNote ?? fallback?.footerNote ?? enFallback?.footerNote ?? "",
  };
}
