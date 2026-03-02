'use client';

class SoundManager {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playRingback() {
    this.init();
    if (!this.ctx) return;

    // Create a pleasant repeating ring sound (US standard-ish: 440Hz + 480Hz)
    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.frequency.value = 440;
    osc2.frequency.value = 480;

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    // Ring pattern: 2s on, 4s off
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    
    // Loop for 30 seconds
    for (let i = 0; i < 5; i++) {
      const start = now + i * 6;
      gain.gain.linearRampToValueAtTime(0.1, start + 0.1);
      gain.gain.setValueAtTime(0.1, start + 2);
      gain.gain.linearRampToValueAtTime(0, start + 2.1);
    }

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 30);
    osc2.stop(now + 30);

    this.osc = osc1; // Keep ref to stop
    this.gain = gain;
  }

  playIncoming() {
    this.init();
    if (!this.ctx) return;

    // Pleasant melodic ringtone
    // E5, G#5, B5, E6 pattern (E Major arpeggio)
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    // Envelope
    gain.gain.setValueAtTime(0, now);
    
    const notes = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6
    
    // Play loop 4 times
    for (let loop = 0; loop < 6; loop++) {
      const loopStart = now + loop * 2.5;
      
      notes.forEach((freq, index) => {
        const time = loopStart + index * 0.15;
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.linearRampToValueAtTime(0.15, time + 0.05);
        gain.gain.linearRampToValueAtTime(0.05, time + 0.12);
      });
      
      // Fade out at end of phrase
      gain.gain.linearRampToValueAtTime(0, loopStart + 1.5);
    }

    osc.start(now);
    osc.stop(now + 15);
    
    this.osc = osc;
    this.gain = gain;
  }

  playBusy() {
    this.init();
    if (!this.ctx) return;

    // Busy signal: 480Hz + 620Hz, 0.5s on, 0.5s off
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.frequency.value = 480;
    osc2.frequency.value = 620;

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);

    // Beep 3 times then stop
    for (let i = 0; i < 3; i++) {
      const start = now + i * 1;
      gain.gain.setValueAtTime(0.1, start);
      gain.gain.setValueAtTime(0.1, start + 0.5);
      gain.gain.setValueAtTime(0, start + 0.51);
    }

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 3);
    osc2.stop(now + 3);
  }

  playEndCall() {
    this.init();
    if (!this.ctx) return;
    
    // Simple descending tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);
    
    osc.start(now);
    osc.stop(now + 0.3);
  }

  stop() {
    if (this.osc) {
      try {
        this.osc.stop();
        this.osc.disconnect();
      } catch (e) {}
      this.osc = null;
    }
    if (this.gain) {
        this.gain.disconnect();
        this.gain = null;
    }
  }
}

export const soundManager = new SoundManager();
