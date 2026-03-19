// ==================== 绘制工具 ====================

// 绘制圆角矩形
function drawRoundedRect(x, y, w, h, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    return ctx;
}

// 绘制三层描边边框（白-粉-白）
function drawTripleBorder(x, y, w, h, radius, isSelected = false) {
    // 白色内边框
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    drawRoundedRect(x + 2, y + 2, w - 4, h - 4, radius - 2);
    ctx.stroke();

    // 粉色中边框
    ctx.strokeStyle = '#f0227d';
    ctx.lineWidth = 4;
    drawRoundedRect(x + 6, y + 6, w - 12, h - 12, radius - 6);
    ctx.stroke();

    // 白色外边框
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    drawRoundedRect(x + 10, y + 10, w - 20, h - 20, radius - 10);
    ctx.stroke();
}

// 绘制卡片背景和边框（用于商店卡片）
function drawCard(x, y, width, height, radius, isSelected = false) {
    // 卡片背景
    ctx.fillStyle = '#bababa';
    drawRoundedRect(x - 5, y - 5, width, height, radius);
    ctx.fill();

    // 白色内边框
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    drawRoundedRect(x - 5, y - 5, width, height, radius);
    ctx.stroke();

    // 外边框（金色或黑色）
    ctx.strokeStyle = isSelected ? '#FFD700' : '#000000';
    ctx.lineWidth = isSelected ? 3 : 2;
    drawRoundedRect(x - 5, y - 5, width, height, radius);
    ctx.stroke();
}

// 绘制按钮（三层描边）
function drawButton(x, y, width, height, radius, text) {
    // 白色外边框
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    drawRoundedRect(x, y, width, height, radius);
    ctx.stroke();

    // 黑色中边框
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    drawRoundedRect(x + 2, y + 2, width - 4, height - 4, radius - 1);
    ctx.stroke();

    // 白色内边框
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    drawRoundedRect(x + 4, y + 4, width - 8, height - 8, radius - 2);
    ctx.stroke();

    // 按钮文字
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = 'bold 24px "幼圆", "黑体", monospace';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeText(text, x + width / 2, y + 35);
    ctx.fillStyle = '#000000';
    ctx.fillText(text, x + width / 2, y + 35);
    ctx.restore();
}

// ==================== 进度条绘制 ====================

// 绘制能量/生命进度条
function drawProgressBar(iconX, iconY, iconSize, value, maxValue, barWidth, barHeight, barColor) {
    const barX = iconX + iconSize + 10;
    const barY = iconY + (iconSize - barHeight) / 2;
    const percent = Math.min(1, Math.max(0, value / maxValue));

    // 进度条背景
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    // 进度条填充
    ctx.fillStyle = barColor;
    ctx.fillRect(barX, barY, barWidth * percent, barHeight);

    // 重新描边（覆盖填充区域）
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
}

// 绘制能量图标和进度条
function drawOxygenBar(iconX, iconY, iconSize, oxygen, barWidth, barHeight) {
    ctx.drawImage(images.gameitem01, iconX, iconY, iconSize, iconSize);
    drawProgressBar(iconX, iconY, iconSize, oxygen, 100, barWidth, barHeight, '#00FFFF');
}

// 绘制生命图标和进度条
function drawHealthBar(iconX, iconY, iconSize, hp, barWidth, barHeight) {
    ctx.drawImage(images.gameitem02, iconX, iconY, iconSize, iconSize);
    drawProgressBar(iconX, iconY, iconSize, hp, 100, barWidth, barHeight, '#FF4444');
}

// ==================== 道具栏绘制 ====================

// 绘制道具栏
function drawItemBar(startX, startY, cellSize, cols, padding, currentPage, maxPage, items, itemCounts) {
    // 绘制翻页控件
    const pageCtrlX = startX - 40;
    const pageCtrlY = startY + cellSize / 2 - 20;
    const triangleSize = 10;
    
    // 上三角
    ctx.fillStyle = currentPage > 0 ? '#f0227d' : '#808080';
    ctx.beginPath();
    ctx.moveTo(pageCtrlX + triangleSize, pageCtrlY);
    ctx.lineTo(pageCtrlX + triangleSize * 2, pageCtrlY + triangleSize);
    ctx.lineTo(pageCtrlX, pageCtrlY + triangleSize);
    ctx.closePath();
    ctx.fill();
    
    // 页码
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px "幼圆", "黑体", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${currentPage + 1}`, pageCtrlX + triangleSize, pageCtrlY + triangleSize * 3 - 3);
    
    // 下三角
    ctx.fillStyle = currentPage < maxPage ? '#f0227d' : '#808080';
    ctx.beginPath();
    ctx.moveTo(pageCtrlX + triangleSize, pageCtrlY + triangleSize * 4 + 5);
    ctx.lineTo(pageCtrlX + triangleSize * 2, pageCtrlY + triangleSize * 3 + 5);
    ctx.lineTo(pageCtrlX, pageCtrlY + triangleSize * 3 + 5);
    ctx.closePath();
    ctx.fill();

    // 绘制格子
    for (let col = 0; col < cols; col++) {
        const x = startX + col * (cellSize + padding);
        const y = startY;
        
        // 绘制格子边框
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cellSize, cellSize);
        
        const index = currentPage * cols + col;
        
        if (index < items.length) {
            const item = items[index];
            const count = itemCounts[item.id] || 0;
            
            if (item.icon) {
                ctx.drawImage(item.icon, x + 5, y + 5, cellSize - 10, cellSize - 10);
            }
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`x${count}`, x + cellSize / 2 + 5, y + cellSize - 5);
        }
        
        // 绘制数字快捷键提示
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`${col + 1}`, x + 2, y + 15);
    }
    ctx.textAlign = 'left';
}

// ==================== 提示框绘制 ====================

// 绘制通用提示框
function drawNotification() {
    if (!state.notification.visible) return;
    
    const notifX = canvas.width / 2 - 150;
    const notifY = canvas.height / 2 - 50;
    const notifWidth = 300;
    const notifHeight = 60;
    
    ctx.globalAlpha = state.notification.alpha;
    ctx.font = 'bold 30px "幼圆", "黑体", monospace';
    ctx.textAlign = 'center';
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeText(state.notification.message, canvas.width / 2, notifY + 38);
    
    ctx.fillStyle = '#f0227d';
    ctx.fillText(state.notification.message, canvas.width / 2, notifY + 38);
    
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
}

// 绘制矿石收集提示
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
// ==================== 提示框逻辑 ====================

function showNotification(message, type = 'success') {
    state.notification.message = message;
    state.notification.type = type;
    state.notification.visible = true;
    state.notification.timer = 60;
    state.notification.alpha = 0;
}

function updateNotification() {
    if (state.notification.visible) {
        if (state.notification.timer > 50) {
            state.notification.alpha = Math.min(1, (60 - state.notification.timer) / 10);
        }
        else if (state.notification.timer < 10) {
            state.notification.alpha = state.notification.timer / 10;
        }
        else {
            state.notification.alpha = 1;
        }
        
        state.notification.timer--;
        if (state.notification.timer <= 0) {
            state.notification.visible = false;
            state.notification.alpha = 0;
        }
    }
}

// ==================== 游戏结束画面 ====================
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.font = 'bold 64px "幼圆", "黑体", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FF4444';
    ctx.fillText('游戏结束', canvas.width / 2, canvas.height / 2 - 50);
    ctx.restore();
    
    const btnX = canvas.width / 2 - 150;
    const btnY = canvas.height / 2 + 50;
    drawButton(btnX, btnY, 300, 60, 15, '重新开始');
}

// ==================== 游戏开始画面 ====================
function drawGameStart() {
    ctx.drawImage(images.gamestart, 0, 0, canvas.width, canvas.height);
    // 闪烁效果
    const blinkAlpha = (Math.sin(Date.now() * 0.005) + 1) / 2;
    // 提示文字
    ctx.save();
    ctx.font = 'bold 38px "幼圆", "黑体", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 10;
    ctx.globalAlpha = blinkAlpha;
    ctx.fillText('按下任意键进入', canvas.width / 2, canvas.height - 100);
    ctx.restore();
}