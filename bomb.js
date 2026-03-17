// ==================== 炸弹系统 ====================

// 更新炸弹
function updateBomb() {
    if (!state.bombActive) return;
    
    const bomb = state.bombActive;
    bomb.vy += CONFIG.gravity;
    bomb.y += bomb.vy;
    
    const bombRect = {
        x: bomb.x,
        y: bomb.y,
        width: 30,
        height: 30
    };
    
    for (let block of blocks) {
        if (block.state === 3) continue;
        if (!block.visible) continue;
        
        const blockRect = {
            x: block.x,
            y: block.y,
            width: block.width,
            height: block.height
        };
        
        if (rectCollision(bombRect, blockRect)) {
            bomb.y = block.y - 30;
            bomb.vy = 0;
            break;
        }
    }
    
    bomb.timer--;
    bomb.animationFrame = (bomb.animationFrame + 1) % 30;
    
    if (bomb.timer <= 0) {
        AudioManager.playBoom();
        explodeBomb();
    }
}

// 炸弹爆炸
function explodeBomb() {
    if (!state.bombActive) return;
    
    const bomb = state.bombActive;
    const bombCenterX = bomb.x + 15;
    const bombCenterY = bomb.y + 15;
    
    let bombRow = -1, bombCol = -1;
    for (let block of blocks) {
        if (bombCenterX >= block.x && bombCenterX <= block.x + block.width &&
            bombCenterY >= block.y && bombCenterY <= block.y + block.height) {
            bombRow = block.globalRow;
            bombCol = block.col;
            break;
        }
    }
    
    if (bombRow !== -1 && bombCol !== -1) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        
        for (let [dr, dc] of directions) {
            const targetRow = bombRow + dr;
            const targetCol = bombCol + dc;
            
            for (let block of blocks) {
                if (block.globalRow === targetRow && block.col === targetCol) {
                    const blockType = block.type.types;
                    
                    // 不可炸开
                    if (blockType === 4) continue;
                    // 可以炸开
                    block.state = 3;
                    break;
                }
            }
        }
    }
    
    state.bombExplosions.push({
        x: bomb.x - 10,
        y: bomb.y - 20,
        frame: 0,
        timer: 15
    });
    
    state.bombActive = null;
}

// 更新爆炸特效
function updateExplosions() {
    for (let i = state.bombExplosions.length - 1; i >= 0; i--) {
        const explosion = state.bombExplosions[i];
        explosion.timer--;
        
        if (explosion.timer <= 0) {
            explosion.frame++;
            explosion.timer = 15;
            
            if (explosion.frame >= 3) {
                state.bombExplosions.splice(i, 1);
            }
        }
    }
}

// 绘制炸弹
function drawBomb() {
    if (state.bombActive) {
        const bomb = state.bombActive;
        const screenY = bomb.y - state.cameraOffset;
        ctx.drawImage(images.item001, bomb.x, screenY);
    }
}

// 绘制爆炸特效
function drawExplosions() {
    for (let explosion of state.bombExplosions) {
        const screenY = explosion.y - state.cameraOffset;
        let boomImage;
        
        switch(explosion.frame) {
            case 0: boomImage = images.boom1; break;
            case 1: boomImage = images.boom2; break;
            case 2: boomImage = images.boom3; break;
            default: continue;
        }
        
        ctx.drawImage(boomImage, explosion.x, screenY);
    }
}