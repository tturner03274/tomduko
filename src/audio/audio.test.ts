import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  configureSound,
  disposeAudio,
  getSoundSettings,
  playSound,
  setSoundEnabled,
  setSoundVolume,
  unlockAudio,
  type SoundCue,
} from './audio';

class MockAudioParam {
  value = 0;
  cancelScheduledValues = vi.fn();
  setTargetAtTime = vi.fn();
  setValueAtTime = vi.fn();
  exponentialRampToValueAtTime = vi.fn();
}

class MockGain {
  gain = new MockAudioParam();
  connect = vi.fn();
  disconnect = vi.fn();
}

class MockOscillator {
  static instances: MockOscillator[] = [];

  frequency = new MockAudioParam();
  type: OscillatorType = 'sine';
  onended: (() => void) | null = null;
  connect = vi.fn();
  disconnect = vi.fn();
  start = vi.fn();
  stop = vi.fn();

  constructor() {
    MockOscillator.instances.push(this);
  }
}

class MockAudioContext {
  static instances: MockAudioContext[] = [];

  state: AudioContextState = 'suspended';
  currentTime = 10;
  destination = {} as AudioDestinationNode;
  gains: MockGain[] = [];
  resume = vi.fn(async () => {
    this.state = 'running';
  });
  close = vi.fn(async () => {
    this.state = 'closed';
  });

  constructor() {
    MockAudioContext.instances.push(this);
  }

  createGain() {
    const gain = new MockGain();
    this.gains.push(gain);
    return gain as unknown as GainNode;
  }

  createOscillator() {
    return new MockOscillator() as unknown as OscillatorNode;
  }
}

const installAudioContext = () => {
  Object.defineProperty(window, 'AudioContext', {
    configurable: true,
    value: MockAudioContext,
  });
};

describe('Tomduko audio', () => {
  beforeEach(async () => {
    await disposeAudio();
    MockAudioContext.instances = [];
    MockOscillator.instances = [];
    installAudioContext();
    configureSound({ enabled: true, volume: 0.58 });
  });

  afterEach(async () => {
    await disposeAudio();
    vi.restoreAllMocks();
  });

  it('is lazy and resumes a single shared context', async () => {
    expect(MockAudioContext.instances).toHaveLength(0);

    expect(await unlockAudio()).toBe(true);
    expect(await unlockAudio()).toBe(true);

    expect(MockAudioContext.instances).toHaveLength(1);
    expect(MockAudioContext.instances[0].resume).toHaveBeenCalledTimes(1);
  });

  it('synthesises every named cue locally', async () => {
    const cues: SoundCue[] = [
      'select',
      'place',
      'note',
      'error',
      'undo',
      'hint',
      'pause',
      'complete',
      'achievement',
    ];

    for (const cue of cues) expect(await playSound(cue)).toBe(true);

    expect(MockAudioContext.instances).toHaveLength(1);
    expect(MockOscillator.instances.length).toBeGreaterThan(cues.length);
    expect(MockOscillator.instances.every((oscillator) => oscillator.start.mock.calls.length === 1)).toBe(true);
  });

  it('clamps volume and mutes both future and active audio', async () => {
    await unlockAudio();
    const audioContext = MockAudioContext.instances[0];
    const master = audioContext.gains[0];

    setSoundVolume(4);
    expect(getSoundSettings().volume).toBe(1);
    expect(master.gain.setTargetAtTime).toHaveBeenLastCalledWith(1, 10, 0.018);

    setSoundEnabled(false);
    expect(master.gain.setTargetAtTime).toHaveBeenLastCalledWith(0, 10, 0.018);
    expect(await playSound('place')).toBe(false);

    setSoundVolume(Number.NaN);
    expect(getSoundSettings().volume).toBe(0.58);
  });

  it('is a graceful no-op when Web Audio is unavailable', async () => {
    await disposeAudio();
    Reflect.deleteProperty(window, 'AudioContext');
    Reflect.deleteProperty(window, 'webkitAudioContext');

    await expect(unlockAudio()).resolves.toBe(false);
    await expect(playSound('complete')).resolves.toBe(false);
  });

  it('stops voices and closes the context on disposal', async () => {
    await playSound('complete');
    const audioContext = MockAudioContext.instances[0];
    const voices = [...MockOscillator.instances];

    await disposeAudio();

    expect(audioContext.close).toHaveBeenCalledOnce();
    expect(voices.every((voice) => voice.stop.mock.calls.length >= 2)).toBe(true);
  });
});
