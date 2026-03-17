// ==================== 矿石系统 ====================
function checkOreCollection() {
    const playerRect = getPlayerCollisionBox();
    
    for (let block of blocks) {
        if (!block.visible) continue;
        if (block.ore === 0 || block.oreCollected) continue;
        
        const oreRect = {
            x: block.centerX - 20,
            y: block.centerY - 20,
            width: 40,
            height: 40
        };
        
        if (rectCollision(playerRect, oreRect)) {
            block.oreCollected = true;
            AudioManager.playChin();
            
            const oreKey = ORES[block.ore]?.key;
            if (oreKey && state.inventory[oreKey] !== undefined) {
                state.inventory[oreKey]++;
                
                const oreData = ORES[block.ore];
                showOreNotification(
                    `${oreData.name} +1`,
                    state.player.headX + state.currentHeadImage.width / 2,
                    state.player.bodyY + 100
                );
            }
        }
    }
}

// 矿石收集提示
function showOreNotification(message, x, y) {
    state.oreNotification = {
        message: message,
        x: x,
        y: y,
        timer: 30,
        alpha: 1,
        offsetY: 0
    };
}

function updateOreNotification() {
    if (state.oreNotification) {
        state.oreNotification.timer--;
        state.oreNotification.alpha = state.oreNotification.timer / 30;
        state.oreNotification.offsetY -= 0.3;
        
        if (state.oreNotification.timer <= 0) {
            state.oreNotification = null;
        }
    }
}

function drawOreNotification() {
    if (!state.oreNotification) return;
    
    const notif = state.oreNotification;
    const screenY = notif.y - state.cameraOffset + notif.offsetY;
    
    ctx.save();
    ctx.globalAlpha = notif.alpha;
    ctx.font = 'bold 18px "幼圆", "黑体", monospace';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeText(notif.message, notif.x, screenY);
    ctx.fillStyle = '#FFD700';
    ctx.fillText(notif.message, notif.x, screenY);
    ctx.restore();
}

// 绘制矿石
function drawOres() {
    for (let block of blocks) {
        if (!block.visible) continue;
        if (block.ore === 0 || block.oreCollected) continue;
        
        const oreData = ORES[block.ore];
        if (!oreData) continue;
        
        const screenY = block.centerY - state.cameraOffset - 20;
        if (screenY + 40 < 0 || screenY > canvas.height) continue;
        
        const oreImage = images[oreData.image];
        if (!oreImage) continue;
        
        ctx.drawImage(oreImage, block.centerX - 20, screenY, 40, 40);
    }
}