export type AdTone = 'gradient' | 'peach' | 'sky' | 'mint';

export interface AdCreative {
  id: string;
  title: string;
  tagline: string;
  tone: AdTone;
  cta: string;
  url?: string;
  kind: 'parody' | 'paid';
}

export const AD_POOL: AdCreative[] = [
  {
    id: 'shipnote',
    title: 'Shipnote',
    tagline: 'For all your shipping needs',
    tone: 'peach',
    cta: 'Deploy',
    kind: 'parody',
  },
  {
    id: 'mint-deploys',
    title: 'Mint Deploys',
    tagline: 'Deploys so smooth they\'re minty',
    tone: 'mint',
    cta: 'Deploy',
    kind: 'parody',
  },
  {
    id: 'standup-bot',
    title: 'StandupBot',
    tagline: 'Because someone has to ask',
    tone: 'sky',
    cta: 'Start',
    kind: 'parody',
  },
  {
    id: 'pip-guard',
    title: 'PIPGuard',
    tagline: 'Protect your PIPs',
    tone: 'gradient',
    cta: 'Secure',
    kind: 'parody',
  },
  {
    id: 'synergy-ai',
    title: 'Synergy.ai',
    tagline: 'We have synergy',
    tone: 'gradient',
    cta: 'Learn More',
    kind: 'parody',
  },
  {
    id: 'vest-watch',
    title: 'Vest Watch',
    tagline: 'Your RSUs, monitored',
    tone: 'peach',
    cta: 'View',
    kind: 'parody',
  },
  {
    id: '$400-keyboard',
    title: '$400 Keyboard',
    tagline: 'Because your keyboard costs more than some cars',
    tone: 'gradient',
    cta: 'Buy',
    kind: 'parody',
  },
  {
    id: 'zero-code-ai',
    title: 'Zero-Code AI',
    tagline: 'AI so smart it writes its own prompts',
    tone: 'sky',
    cta: 'Generate',
    kind: 'parody',
  },
  {
    id: 'place-ad',
    title: 'Place ad',
    tagline: 'Your startup here. Seen by every player in the war room.',
    tone: 'gradient',
    cta: 'See how it works',
    kind: 'paid',
  },
]