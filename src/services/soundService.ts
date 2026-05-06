
type SoundName = 'click' | 'success' | 'fail' | 'bomb' | 'tick' | 'pop' | 'reveal' | 'whoosh' | 'warning' | 'wrong' | 'correct' | 'voting' | 'laugh' | 'shock';

class SoundService {
  private sounds: Record<SoundName, HTMLAudioElement | null> = {
    click: null,
    success: null,
    fail: null,
    bomb: null,
    tick: null,
    pop: null,
    reveal: null,
    whoosh: null,
    warning: null,
    wrong: null,
    correct: null,
    voting: null,
    laugh: null,
    shock: null,
  };

  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.sounds.click = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
      this.sounds.success = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
      this.sounds.fail = new Audio('https://assets.mixkit.co/active_storage/sfx/253/253-preview.mp3');
      this.sounds.bomb = new Audio('https://assets.mixkit.co/active_storage/sfx/1001/1001-preview.mp3');
      this.sounds.tick = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      this.sounds.pop = new Audio('https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3');
      this.sounds.reveal = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3');
      this.sounds.whoosh = new Audio('https://assets.mixkit.co/active_storage/sfx/2565/2565-preview.mp3');
      this.sounds.warning = new Audio('https://assets.mixkit.co/active_storage/sfx/991/991-preview.mp3');
      this.sounds.wrong = new Audio('https://assets.mixkit.co/active_storage/sfx/253/253-preview.mp3');
      this.sounds.correct = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
      this.sounds.voting = new Audio('https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3');
      this.sounds.laugh = new Audio('https://assets.mixkit.co/active_storage/sfx/2493/2493-preview.mp3');
      this.sounds.shock = new Audio('https://assets.mixkit.co/active_storage/sfx/2180/2180-preview.mp3');

      // Preload
      Object.values(this.sounds).forEach(s => {
        if (s) {
          s.load();
          s.volume = 0.5;
        }
      });
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  play(name: SoundName) {
    if (!this.enabled) return;
    const sound = this.sounds[name];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => { /* Ignore autoplay errors */ });
    }
  }
}

export const soundService = new SoundService();
