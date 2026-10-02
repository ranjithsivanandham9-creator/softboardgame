import * as React from 'react'
import Avatar from './Avatar'

export type AvatarId = 'dev' | 'intern' | 'vp' | 'leet' | 'pm' | 'pe'
export type AvatarEmotion = 'idle' | 'happy' | 'shock' | 'smug' | 'sweat' | 'laid_off' | 'win'

const avatarNames: Record<AvatarId, string> = {
  dev: 'Burned-Out Dev',
  intern: 'Grindset Intern',
  vp: 'Buzzword VP',
  leet: 'Leetcode Maxxer',
  pm: 'Vibe-Coding PM',
  pe: 'Principal Eng',
}

const avatarColors: Record<AvatarId, string> = {
  dev: '#3B2F5E',
  intern: '#12483B',
  vp: '#42324F',
  leet: '#4A2530',
  pm: '#3E3A1E',
  pe: '#173B4D',
}

export function AvatarStory() {
  const emotions: AvatarEmotion[] = ['idle', 'happy', 'shock', 'smug', 'sweat', 'laid_off', 'win']
  const ids: AvatarId[] = ['dev', 'intern', 'vp', 'leet', 'pm', 'pe']
  const sizes = [100, 200, 300]

  return (
    <div>
      {ids.map(id => (
        <div key={id} className="space-y-4">
          <h3 className="text-h2 text-center text-[var(--text)]">
            {avatarNames[id]}
          </h3>
          {emotions.map(emo => (
            <div key={emo} className="flex items-center gap-2">
              <Avatar id={id} emotion={emo} size={200} />
              <span className="text-caption text-[var(--muted)] dark:text-[var(--muted)]">
                {emo}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// Also export individual stories for each avatar
export const DevStories = () => (
  <div>
    <h3 className="text-h2 text-center text-[var(--text)]">The Burned-Out Dev</h3>
    {['idle', 'happy', 'shock', 'smug', 'sweat', 'laid_off', 'win'].map(emo => (
      <div key={emo} className="flex items-center gap-2">
        <Avatar id="dev" emotion={emo} size={200} />
        <span className="text-caption">{emo}</span>
      </div>
    ))}
  </h3>
)

export const InternStories = () => (
  <div>
    <h3 className="text-h2 text-center text-[var(--text)]">The Grindset Intern</h3>
    {['idle', 'happy', 'shock', 'smug', 'sweat', 'laid_off', 'win'].map(emo => (
      <div key={emo} className="flex items-center gap-2">
        <Avatar id="intern" emotion={emo} size={200} />
        <span className="text-caption">{emo}</span>
      </div>
    ))}
  </h3>
)

export const VpStories = () => (
  <div>
    <h3 className="text-h2 text-center text-[var(--text)]">The Buzzword VP</h3>
    {['idle', 'happy', 'shock', 'smug', 'sweat', 'laid_off', 'win'].map(emo => (
      <div key={emo} className="flex items-center gap-2">
        <Avatar id="vp" emotion={emo} size={200} />
        <span className="text-caption">{emo}</span>
      </div>
    ))}
  </h3>
)

export const LeetStories = () => (
  <div>
    <h3 className="text-h2 text-center text-[var(--text)]">The Leetcode Maxxer</h3>
    {['idle', 'happy', 'shock', 'smug', 'sweat', 'laid_off', 'win'].map(emo => (
      <div key={emo} className="flex items-center gap-2">
        <Avatar id="leet" emotion={emo} size={200} />
        <span className="text-caption">{emo}</span>
      </div>
    ))}
  </h3>
)

export const PmStories = () => (
  <div>
    <h3 className="text-h2 text-center text-[var(--text)]">The Vibe-Coding PM</h3>
    {['idle', 'happy', 'shock', 'smug', 'sweat', 'laid_off', 'win'].map(emo => (
      <div key={emo} className="flex items-center gap-2">
        <Avatar id="pm" emotion={emo} size={200} />
        <span className="text-caption">{emo}</span>
      </div>
    ))}
  </h3>
)

export const PeStories = () => (
  <div>
    <h3 className="text-h2 text-center text-[var(--text)]">Principal Eng Who Left in 2019</h3>
    {['idle', 'happy', 'shock', 'smug', 'sweat', 'laid_off', 'win'].map(emo => (
      <div key={emo} className="flex items-center gap-2">
        <Avatar id="pe" emotion={emo} size={200} />
        <span className="text-caption">{emo}</span>
      </div>
    ))}
  </h3>
)