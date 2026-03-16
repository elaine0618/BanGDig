// ==================== 音效系统 ====================
const AudioManager = {
    sounds: {
        chin: null,
        www: null,
        bgm: null,
        bubu: null,
        itemuse: null,
        playeropen: null,
        boom: null
    },
    initialized: false,
    muted: false,
    bgmStarted: false,
    
    init: function() {
        if (this.initialized) return;
        
        this.sounds.chin = new Audio('audios/chin.mp3');
        this.sounds.www = new Audio('audios/www.mp3');
        this.sounds.bgm = new Audio('audios/bgm.mp3');
        this.sounds.bubu = new Audio('audios/bubu.mp3');
        this.sounds.boom = new Audio('audios/boom.mp3');
        this.sounds.itemuse = new Audio('audios/itemuse.mp3');
        this.sounds.playeropen = new Audio('audios/playeropen.mp3');
        
        this.sounds.bgm.loop = true;
        
        this.initialized = true;
        console.log('音效系统初始化完成');
    },
    
    // 播放音效
    playChin: function() {
        if (this.muted) return;
        if (this.sounds.chin) {
            const sound = this.sounds.chin.cloneNode();
            sound.volume = 1;
            sound.play().catch(e => console.log('音效播放失败:', e));
        }
    },
    playBubu: function() {
        if (this.muted) return;
        if (this.sounds.bubu) {
            const sound = this.sounds.bubu.cloneNode();
            sound.volume = 0.2;
            sound.play().catch(e => console.log('音效播放失败:', e));
        }
    },
    playUse: function() {
        if (this.muted) return;
        if (this.sounds.itemuse) {
            const sound = this.sounds.itemuse.cloneNode();
            sound.volume = 0.3;
            sound.play().catch(e => console.log('音效播放失败:', e));
        }
    },
    playOpen: function() {
        if (this.muted) return;
        if (this.sounds.playeropen) {
            const sound = this.sounds.playeropen.cloneNode();
            sound.volume = 0.3;
            sound.play().catch(e => console.log('音效播放失败:', e));
        }
    },
    playBoom: function() {
        if (this.muted) return;
        if (this.sounds.boom) {
            const sound = this.sounds.boom.cloneNode();
            sound.volume = 0.3;
            sound.play().catch(e => console.log('音效播放失败:', e));
        }
    },
    
    playWww: function() {
        if (this.muted) return;
        if (this.sounds.www) {
            const sound = this.sounds.www.cloneNode();
            sound.volume = 0.2;
            sound.play().catch(e => console.log('音效播放失败:', e));
        }
    },
    
    // 尝试启动背景音乐（需要在用户交互后调用）
    startBgm: function() {
        if (this.muted) return;
        if (!this.bgmStarted && this.sounds.bgm) {
            this.sounds.bgm.volume = 0.3;
            this.sounds.bgm.play()
                .then(() => {
                    this.bgmStarted = true;
                    console.log('背景音乐已启动');
                })
                .catch(e => console.log('背景音乐启动失败:', e));
        }
    },
    
    // 暂停背景音乐
    pauseBgm: function() {
        if (this.sounds.bgm) {
            this.sounds.bgm.pause();
        }
    },
    
    stopAll: function() {
        if (this.sounds.chin) this.sounds.chin.pause();
        if (this.sounds.www) this.sounds.www.pause();
        if (this.sounds.bgm) this.sounds.bgm.pause();
        if (this.sounds.bubu) this.sounds.bgm.pause();
        if (this.sounds.boom) this.sounds.bgm.pause();
    },
    
    setMuted: function(muted) {
        this.muted = muted;
        if (this.sounds.bgm) {
            this.sounds.bgm.muted = muted;
        }
    },
    
    setVolume: function(type, volume) {
        if (this.sounds[type]) {
            this.sounds[type].volume = volume;
        }
    }
};

AudioManager.init();