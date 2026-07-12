/**
 * Tomduko's local sound palette.
 *
 * Everything is synthesised with Web Audio: there are no media downloads and
 * no decode delay. The AudioContext is deliberately created only after a cue
 * or `unlockAudio` call, which keeps module import safe during SSR and tests.
 */

export type SoundCue =
  | 'select'
  | 'place'
  | 'note'
  | 'error'
  | 'undo'
  | 'hint'
  | 'pause'
  | 'complete'
  | 'achievement';

export interface SoundSettings {
  enabled: boolean;
  /** A normalised value between 0 (silent) and 1 (full). */
  volume: number;
}

type AudioContextWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

type Tone = {
  delay: number;
  duration: number;
  frequency: number;
  endFrequency?: number;
  gain: number;
  type?: OscillatorType;
};

const DEFAULT_SETTINGS: SoundSettings = {
  enabled: true,
  volume: 0.58,
};

const MIN_GAIN = 0.0001;
const ATTACK_SECONDS = 0.008;

let settings: SoundSettings = { ...DEFAULT_SETTINGS };
let context: AudioContext | null = null;
let masterGain: GainNode | null = null;
const activeSources = new Set<OscillatorNode>();

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getAudioContextConstructor = (): typeof AudioContext | null => {
  if (typeof window === 'undefined') return null;

  const audioWindow = window as AudioContextWindow;
  return audioWindow.AudioContext ?? audioWindow.webkitAudioContext ?? null;
};

const setMasterLevel = (level: number) => {
  if (!context || !masterGain || context.state === 'closed') return;

  const now = context.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setTargetAtTime(level, now, 0.018);
};

const createAudioGraph = (): boolean => {
  if (context && masterGain && context.state !== 'closed') return true;

  const AudioContextClass = getAudioContextConstructor();
  if (!AudioContextClass) return false;

  try {
    context = new AudioContextClass();
    masterGain = context.createGain();
    masterGain.gain.value = settings.enabled ? settings.volume : 0;
    masterGain.connect(context.destination);
    return true;
  } catch {
    context = null;
    masterGain = null;
    return false;
  }
};

const playTone = (tone: Tone, startTime: number) => {
  if (!context || !masterGain || context.state !== 'running') return;

  try {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const beginsAt = startTime + tone.delay;
    const endsAt = beginsAt + tone.duration;
    const attackEndsAt = Math.min(endsAt, beginsAt + ATTACK_SECONDS);

    oscillator.type = tone.type ?? 'sine';
    oscillator.frequency.setValueAtTime(tone.frequency, beginsAt);
    if (tone.endFrequency && tone.endFrequency !== tone.frequency) {
      oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(1, tone.endFrequency),
        endsAt,
      );
    }

    envelope.gain.setValueAtTime(MIN_GAIN, beginsAt);
    envelope.gain.exponentialRampToValueAtTime(
      Math.max(MIN_GAIN, tone.gain),
      attackEndsAt,
    );
    envelope.gain.exponentialRampToValueAtTime(MIN_GAIN, endsAt);

    oscillator.connect(envelope);
    envelope.connect(masterGain);
    activeSources.add(oscillator);

    oscillator.onended = () => {
      activeSources.delete(oscillator);
      oscillator.disconnect();
      envelope.disconnect();
    };

    oscillator.start(beginsAt);
    oscillator.stop(endsAt + 0.01);
  } catch {
    // A partially implemented Web Audio API should never interrupt gameplay.
  }
};

const cueTones: Record<SoundCue, readonly Tone[]> = {
  select: [
    { delay: 0, duration: 0.055, frequency: 740, gain: 0.032, type: 'sine' },
    { delay: 0.012, duration: 0.04, frequency: 1480, gain: 0.012, type: 'sine' },
  ],
  place: [
    { delay: 0, duration: 0.095, frequency: 520, endFrequency: 610, gain: 0.052 },
    { delay: 0.035, duration: 0.12, frequency: 880, gain: 0.035, type: 'triangle' },
  ],
  note: [
    { delay: 0, duration: 0.07, frequency: 930, endFrequency: 820, gain: 0.026, type: 'triangle' },
  ],
  error: [
    { delay: 0, duration: 0.15, frequency: 155, endFrequency: 118, gain: 0.052, type: 'triangle' },
    { delay: 0.025, duration: 0.13, frequency: 205, endFrequency: 164, gain: 0.026, type: 'sine' },
  ],
  undo: [
    { delay: 0, duration: 0.12, frequency: 610, endFrequency: 390, gain: 0.038, type: 'sine' },
    { delay: 0.04, duration: 0.1, frequency: 305, gain: 0.018, type: 'triangle' },
  ],
  hint: [
    { delay: 0, duration: 0.16, frequency: 660, gain: 0.035, type: 'sine' },
    { delay: 0.07, duration: 0.18, frequency: 880, gain: 0.041, type: 'sine' },
    { delay: 0.14, duration: 0.25, frequency: 1320, endFrequency: 1480, gain: 0.031, type: 'triangle' },
  ],
  pause: [
    { delay: 0, duration: 0.14, frequency: 520, endFrequency: 440, gain: 0.035, type: 'sine' },
    { delay: 0.075, duration: 0.16, frequency: 390, endFrequency: 330, gain: 0.026, type: 'sine' },
  ],
  complete: [
    { delay: 0, duration: 0.22, frequency: 523.25, gain: 0.045, type: 'triangle' },
    { delay: 0.11, duration: 0.23, frequency: 659.25, gain: 0.048, type: 'triangle' },
    { delay: 0.22, duration: 0.25, frequency: 783.99, gain: 0.052, type: 'triangle' },
    { delay: 0.34, duration: 0.28, frequency: 1046.5, gain: 0.058, type: 'sine' },
    { delay: 0.47, duration: 0.72, frequency: 1318.51, endFrequency: 1396.91, gain: 0.044, type: 'sine' },
    { delay: 0.48, duration: 0.7, frequency: 523.25, gain: 0.025, type: 'triangle' },
    { delay: 0.48, duration: 0.7, frequency: 783.99, gain: 0.026, type: 'triangle' },
  ],
  achievement: [
    { delay: 0, duration: 0.18, frequency: 587.33, gain: 0.042, type: 'triangle' },
    { delay: 0.09, duration: 0.19, frequency: 739.99, gain: 0.046, type: 'triangle' },
    { delay: 0.18, duration: 0.23, frequency: 880, gain: 0.051, type: 'triangle' },
    { delay: 0.29, duration: 0.52, frequency: 1174.66, gain: 0.047, type: 'sine' },
    { delay: 0.3, duration: 0.5, frequency: 587.33, gain: 0.022, type: 'sine' },
  ],
};

/**
 * Creates/resumes Web Audio. Call this from a pointer or keyboard interaction
 * when an eager unlock is useful (particularly on iOS).
 */
export const unlockAudio = async (): Promise<boolean> => {
  if (!settings.enabled || !createAudioGraph() || !context) return false;

  try {
    if (context.state === 'suspended') await context.resume();
    return context.state === 'running';
  } catch {
    return false;
  }
};

/** Plays one of Tomduko's short UI cues, failing silently when audio is absent. */
export const playSound = async (cue: SoundCue): Promise<boolean> => {
  if (!settings.enabled || !cueTones[cue]) return false;
  if (!(await unlockAudio()) || !context) return false;

  const startTime = context.currentTime + 0.006;
  cueTones[cue].forEach((tone) => playTone(tone, startTime));
  return true;
};

export const getSoundSettings = (): Readonly<SoundSettings> => ({ ...settings });

export const getSoundEnabled = () => settings.enabled;

export const getSoundVolume = () => settings.volume;

export const setSoundEnabled = (enabled: boolean) => {
  settings = { ...settings, enabled };
  setMasterLevel(enabled ? settings.volume : 0);
};

export const setSoundVolume = (volume: number) => {
  const safeVolume = Number.isFinite(volume) ? clamp(volume, 0, 1) : DEFAULT_SETTINGS.volume;
  settings = { ...settings, volume: safeVolume };
  setMasterLevel(settings.enabled ? safeVolume : 0);
};

export const configureSound = (next: Partial<SoundSettings>) => {
  if (typeof next.volume === 'number') setSoundVolume(next.volume);
  if (typeof next.enabled === 'boolean') setSoundEnabled(next.enabled);
  return getSoundSettings();
};

/** Stops current cues and releases the shared AudioContext. */
export const disposeAudio = async (): Promise<void> => {
  const audioContext = context;

  activeSources.forEach((source) => {
    source.onended = null;
    try {
      source.stop();
      source.disconnect();
    } catch {
      // The voice may already have finished.
    }
  });
  activeSources.clear();

  try {
    masterGain?.disconnect();
  } catch {
    // The graph may already be disconnected.
  }

  context = null;
  masterGain = null;

  if (audioContext && audioContext.state !== 'closed') {
    try {
      await audioContext.close();
    } catch {
      // Closing audio is best-effort during page teardown.
    }
  }
};
