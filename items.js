// ==================== 道具系统 ====================
// 道具使用函数
function useBomb() {
    if (state.items.bomb <= 0) return;
    if (state.bombActive) return;
    state.items.bomb--;
    AudioManager.playUse();
    
    const bombX = state.player.headX + state.currentHeadImage.width / 2 - 15;
    const bombY = state.player.headY - 30;
    
    state.bombActive = {
        x: bombX,
        y: bombY,
        vy: 0,
        timer: 120,
        animationFrame: 0
    };
}

function useHCoffee() {
    if (state.items.h_coffee <= 0) return;
    state.items.h_coffee--;
    AudioManager.playUse();
    state.hp = Math.min(OXYGEN_CONFIG.iteminti.max, state.hp + OXYGEN_CONFIG.iteminti.h_coffee_recover);
    showNotification(`使用${ITEMS.h_coffee.name}恢复了${OXYGEN_CONFIG.iteminti.h_coffee_recover}点体力`, 'success');
}

function useENlp() {
    if (state.items.e_nlp <= 0) return;
    state.items.e_nlp--;
    AudioManager.playUse();
    state.oxygen = Math.min(OXYGEN_CONFIG.surfaceValue, state.oxygen + OXYGEN_CONFIG.iteminti.e_nlp_recover);
    showNotification(`使用${ITEMS.e_nlp.name}恢复了${OXYGEN_CONFIG.iteminti.e_nlp_recover}点能量`, 'success');
}

function useECdb() {
    if (state.items.e_cdb <= 0) return;
    state.items.e_cdb--;
    AudioManager.playUse();
    state.oxygen = Math.min(OXYGEN_CONFIG.surfaceValue, state.oxygen + OXYGEN_CONFIG.iteminti.e_cdb_recover);
    showNotification(`使用${ITEMS.e_cdb.name}恢复了${OXYGEN_CONFIG.iteminti.e_cdb_recover}点能量`, 'success');
}

// 道具翻页
function prevItemPage() {
    if (state.currentItemPage > 0) {
        state.currentItemPage--;
        AudioManager.playBubu();
    }
}

function nextItemPage() {
    if (state.currentItemPage < state.maxItemPage) {
        state.currentItemPage++;
        AudioManager.playBubu();
    }
}