// Procedural Web Audio API engine sound synthesizer with graceful fallback.
// Works completely offline with zero broken audio files while allowing optional MP3 override.

class EngineAudioController {
  constructor() {
    this.ctx = null;
    this.oscLow = null;
    this.oscMid = null;
    this.oscHarmonic = null;
    this.masterGain = null;
    this.filter = null;
    this.isPlaying = false;
    this.isMuted = false;
  }

  ensureContext() {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  startEngine(initialRpm = 950) {
    const ctx = this.ensureContext();
    if (!ctx || this.isPlaying) return;

    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now);
      filter.Q.setValueAtTime(3.2, now);

      masterGain.gain.setValueAtTime(0.001, now);
      // Crank & bark flare
      masterGain.gain.exponentialRampToValueAtTime(this.isMuted ? 0.0001 : 0.14, now + 0.18);
      masterGain.gain.exponentialRampToValueAtTime(this.isMuted ? 0.0001 : 0.075, now + 0.75);

      const oscLow = ctx.createOscillator();
      const oscMid = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();

      oscLow.type = 'sawtooth';
      oscMid.type = 'triangle';
      oscHarmonic.type = 'sawtooth';

      const baseFreq = this.rpmToFreq(initialRpm);
      oscLow.frequency.setValueAtTime(baseFreq * 1.9, now);
      oscLow.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.65);

      oscMid.frequency.setValueAtTime(baseFreq * 3.8, now);
      oscMid.frequency.exponentialRampToValueAtTime(baseFreq * 2, now + 0.65);

      oscHarmonic.frequency.setValueAtTime(baseFreq * 5.7, now);
      oscHarmonic.frequency.exponentialRampToValueAtTime(baseFreq * 3, now + 0.65);

      oscLow.connect(filter);
      oscMid.connect(filter);
      oscHarmonic.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      oscLow.start(now);
      oscMid.start(now);
      oscHarmonic.start(now);

      this.oscLow = oscLow;
      this.oscMid = oscMid;
      this.oscHarmonic = oscHarmonic;
      this.masterGain = masterGain;
      this.filter = filter;
      this.isPlaying = true;
    } catch {
      this.isPlaying = false;
    }
  }

  updateRpm(rpm) {
    if (!this.isPlaying || !this.ctx || !this.oscLow) return;
    const now = this.ctx.currentTime;
    const baseFreq = this.rpmToFreq(rpm);
    this.oscLow.frequency.setTargetAtTime(baseFreq, now, 0.05);
    this.oscMid.frequency.setTargetAtTime(baseFreq * 2.0, now, 0.05);
    this.oscHarmonic.frequency.setTargetAtTime(baseFreq * 3.0, now, 0.05);
    this.filter.frequency.setTargetAtTime(180 + (rpm / 9200) * 1400, now, 0.06);
    if (!this.isMuted) {
      const targetGain = 0.06 + (rpm / 9200) * 0.1;
      this.masterGain.gain.setTargetAtTime(targetGain, now, 0.06);
    }
  }

  setMuted(muted) {
    this.isMuted = Boolean(muted);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0.0001 : 0.08, this.ctx.currentTime, 0.05);
    }
  }

  stopEngine() {
    if (!this.isPlaying || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(0.0001, now, 0.08);
      const low = this.oscLow;
      const mid = this.oscMid;
      const harm = this.oscHarmonic;
      setTimeout(() => {
        try {
          low?.stop();
          mid?.stop();
          harm?.stop();
        } catch {
          // already stopped
        }
      }, 260);
    } catch {
      // ignore cleanup error
    } finally {
      this.isPlaying = false;
      this.oscLow = null;
      this.oscMid = null;
      this.oscHarmonic = null;
      this.masterGain = null;
      this.filter = null;
    }
  }

  rpmToFreq(rpm) {
    const clamped = Math.max(800, Math.min(9500, rpm));
    return 38 + ((clamped - 800) / 8700) * 210;
  }
}

export const engineAudio = new EngineAudioController();
