// ==================== 商店系统 ====================

function checkShopProximity() {
    if (!state.shop.shopY) {
        state.shop.shopY = state.horizonY - 103;
    }
    
    const playerCenterX = state.player.bodyX + state.currentBodyImage.width / 2;
    const shopCenterX = state.shop.shopX + state.shop.shopWidth / 2;
    const distance = Math.abs(playerCenterX - shopCenterX);
    
    return distance < 100 && !state.shop.isOpen;
}

function toggleShop() {
    if (!state.shop.isOpen) {
        const playerCenterX = state.player.bodyX + state.currentBodyImage.width / 2;
        const shopCenterX = state.shop.shopX + state.shop.shopWidth / 2;
        const distance = Math.abs(playerCenterX - shopCenterX);
        
        if (distance < 100) {
            state.shop.isOpen = true;
            state.shop.animTarget = 1;
            state.shop.scrollOffset = 0;
            state.shop.selectedOre = null;
            state.shop.selectedItem = null;
            AudioManager.playOpen();
        }
    } else {
        state.shop.isOpen = false;
        state.shop.animTarget = 0;
        AudioManager.playUse();
    }
}

function sellOre() {
    if (!state.shop.selectedOre) return;
    
    const oreType = state.shop.selectedOre.type;
    const oreData = ORES[oreType];
    if (!oreData) return;
    
    const oreKey = oreData.key;
    const price = oreData.price;
    const oreName = oreData.name;
    
    if (state.inventory[oreKey] > 0) {
        state.inventory[oreKey]--;
        state.totalGold += price;
        AudioManager.playChin();
        showNotification(`出售${oreName}获得了${price}金币`, 'success');
    }
    
    if (state.inventory[oreKey] === 0) {
        state.shop.selectedOre = null;
    }
}

function buyItem() {
    if (!state.shop.selectedItem) return;
    
    const item = state.shop.shopItems[state.shop.selectedItem.index];
    if (state.totalGold >= item.price) {
        state.totalGold -= item.price;
        
        if (state.items[item.id] !== undefined) {
            state.items[item.id]++;
        }
        AudioManager.playChin();
        showNotification(`购买${item.name}支付了${item.price}金币`, 'success');
    } else {
        AudioManager.playBubu();
        showNotification('没有足够的钱', 'error');
    }
}

function handleShopScroll(delta) {
    if (!state.shop.isOpen) return;
    state.shop.scrollOffset += delta;
    state.shop.scrollOffset = Math.max(0, Math.min(state.shop.scrollOffset, state.shop.maxScroll));
}

function handleShopClick(x, y) {
    if (!state.shop.isOpen) return;
    
    const shopX = canvas.width / 2 - 450;
    const shopY = canvas.height / 2 - 350;
    const shopWidth = 900;
    const shopHeight = 700;
    const gridSize = 100;
    
    const buttonY = shopY + shopHeight - 80;
    if (x >= shopX + 120 && x <= shopX + 280 && y >= buttonY && y <= buttonY + 50) {
        sellOre();
        return;
    }

    if (x >= shopX + shopWidth / 2 + 120 && x <= shopX + shopWidth / 2 + 280 && 
        y >= buttonY && y <= buttonY + 50) {
        buyItem();
        return;
    }
    
    const gridStartX = shopX + 50;
    const gridStartY = shopY + 150;
    
    const availableOres = [];
    for (let type in ORES) {
        const oreType = parseInt(type);
        const oreData = ORES[oreType];
        const count = state.inventory[oreData.key] || 0;
        
        if (count > 0) {
            availableOres.push({ type: oreType, key: oreData.key });
        }
    }

    for (let i = 0; i < availableOres.length; i++) {
        const oreX = gridStartX + (i % 3) * (gridSize + 20);
        const oreY = gridStartY + Math.floor(i / 3) * (gridSize + 40) - state.shop.scrollOffset;
        
        if (x >= oreX - 10 && x <= oreX + gridSize + 10 && 
            y >= oreY - 10 && y <= oreY + gridSize + 40) {
            const oreData = availableOres[i];
            
            if (state.inventory[oreData.key] > 0) {
                state.shop.selectedOre = { type: oreData.type, index: i };
                state.shop.selectedItem = null;
            }
            return;
        }
    }
    
    const itemGridStartX = shopX + shopWidth / 2 + 50;
    const itemGridStartY = shopY + 150;
    
    for (let i = 0; i < state.shop.shopItems.length; i++) {
        const itemX = itemGridStartX + (i % 3) * (gridSize + 20);
        const itemY = itemGridStartY + Math.floor(i / 3) * (gridSize + 40) - state.shop.scrollOffset;
        
        if (x >= itemX - 10 && x <= itemX + gridSize + 10 && 
            y >= itemY - 10 && y <= itemY + gridSize + 40) {
            state.shop.selectedItem = { id: state.shop.shopItems[i].id, index: i };
            state.shop.selectedOre = null;
            return;
        }
    }
}

// 绘制商店界面
function drawShop() {
    if (!state.shop.isOpen && state.shop.animScale === 0) return;
    
    const shopX = canvas.width / 2 - 450;
    const shopY = canvas.height / 2 - 350;
    const shopWidth = 900;
    const shopHeight = 700;
    const r = 20;

    // 应用缩放动画
    ctx.save();
    const scale = state.shop.animScale;
    if (scale < 1) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.translate(centerX, centerY);
        ctx.scale(scale, scale);
        ctx.translate(-centerX, -centerY);
    }

    // 绘制商店背景
    ctx.fillStyle = 'rgba(186, 186, 186, 0.8)';
    drawRoundedRect(shopX, shopY, shopWidth, shopHeight, r);
    ctx.fill();

    // 绘制三层边框
    drawTripleBorder(shopX, shopY, shopWidth, shopHeight, r);
    
    // 商店标题
    ctx.save();
    ctx.font = 'bold 48px "Arial", "Arial", monospace';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#f0227d';
    ctx.lineWidth = 8;
    ctx.strokeText('R i N G', canvas.width / 2, shopY + 65);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('R i N G', canvas.width / 2, shopY + 65);
    ctx.textAlign = 'left';
    ctx.restore();
    
    // 分隔线
    ctx.strokeStyle = '#f0227d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(shopX + shopWidth / 2, shopY + 90);
    ctx.lineTo(shopX + shopWidth / 2, shopY + shopHeight - 80);
    ctx.stroke();
    
    // 左侧标题
    ctx.save();
    ctx.font = 'bold 32px "幼圆", "黑体", monospace';
    ctx.strokeStyle = '#f0227d';
    ctx.lineWidth = 6;
    ctx.strokeText('所持物品', shopX + 40, shopY + 120);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('所持物品', shopX + 40, shopY + 120);
    ctx.restore();
    
    ctx.strokeStyle = '#f0227d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(shopX + 40, shopY + 140);
    ctx.lineTo(shopX + shopWidth / 2 - 40, shopY + 140);
    ctx.stroke();
    
    // 矿石卡片网格
    const gridStartX = shopX + 60;
    const gridStartY = shopY + 160;
    const gridSize = 80;
    const cellPadding = 20;
    const cardWidth = gridSize + 20;
    const cardHeight = gridSize + 50;
    const verticalSpacing = 20;

    // 裁剪区域
    ctx.save();
    ctx.beginPath();
    ctx.rect(shopX + 10, shopY + 150, shopWidth - 40, shopHeight - 250);
    ctx.clip();

    // 过滤出有数量的矿石
    const availableOres = [];
    for (let type in ORES) {
        const oreType = parseInt(type);
        const oreData = ORES[oreType];
        const count = state.inventory[oreData.key] || 0;
        
        if (count > 0) {
            availableOres.push({
                type: oreType,
                name: oreData.name,
                price: oreData.price,
                count: count,
                icon: images[oreData.image]
            });
        }
    }

    // 绘制矿石卡片
    for (let i = 0; i < availableOres.length; i++) {
        const ore = availableOres[i];
        const x = gridStartX + (i % 3) * (cardWidth + cellPadding);
        const y = gridStartY + Math.floor(i / 3) * (cardHeight + verticalSpacing) - state.shop.scrollOffset;
        const cardR = 10;

        const isSelected = state.shop.selectedOre && state.shop.selectedOre.type === ore.type;
        drawCard(x, y, cardWidth, cardHeight, cardR, isSelected);

        const iconX = x + (cardWidth - gridSize) / 2;
        ctx.drawImage(ore.icon, iconX - 5, y + 5, gridSize, gridSize);
        
        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = 'bold 14px "幼圆", "黑体", monospace';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeText(ore.name, x + cardWidth / 2 - 5, y + gridSize + 20);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(ore.name, x + cardWidth / 2 - 5, y + gridSize + 20);

        ctx.fillStyle = '#000000';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`x${ore.count}`, x + cardWidth / 2 + 30, y + 10);
        
        ctx.fillStyle = '#ff6161';
        ctx.fillText(`${ore.price}G`, x + cardWidth / 2 - 5, y + gridSize + 38);
        ctx.restore();
    }
    
    ctx.restore(); // 恢复裁剪
    
    // 右侧标题
    ctx.save();
    ctx.font = 'bold 32px "幼圆", "黑体", monospace';
    ctx.strokeStyle = '#f0227d';
    ctx.lineWidth = 6;
    ctx.strokeText('售货机', shopX + shopWidth / 2 + 40, shopY + 120);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('售货机', shopX + shopWidth / 2 + 40, shopY + 120);
    ctx.restore();
    
    ctx.strokeStyle = '#f0227d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(shopX + shopWidth / 2 + 40, shopY + 140);
    ctx.lineTo(shopX + shopWidth - 40, shopY + 140);
    ctx.stroke();
    
    // 道具卡片网格
    const itemGridStartX = shopX + shopWidth / 2 + 60;
    const itemGridStartY = shopY + 160;
    
    // 裁剪区域
    ctx.save();
    ctx.beginPath();
    ctx.rect(shopX + shopWidth / 2 + 10, shopY + 150, shopWidth / 2 - 40, shopHeight - 250);
    ctx.clip();

    // 绘制道具卡片
    for (let i = 0; i < state.shop.shopItems.length; i++) {
        const item = state.shop.shopItems[i];
        const x = itemGridStartX + (i % 3) * (cardWidth + cellPadding);
        const y = itemGridStartY + Math.floor(i / 3) * (cardHeight + verticalSpacing) - state.shop.scrollOffset;
        const cardR = 10;

        const isSelected = state.shop.selectedItem && state.shop.selectedItem.index === i;
        drawCard(x, y, cardWidth, cardHeight, cardR, isSelected);

        const iconX = x + (cardWidth - gridSize) / 2;
        ctx.drawImage(item.icon, iconX - 5, y + 5, gridSize, gridSize);
        
        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = 'bold 14px "幼圆", "黑体", monospace';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeText(item.name, x + cardWidth / 2 - 5, y + gridSize + 20);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(item.name, x + cardWidth / 2 - 5, y + gridSize + 20);
        
        ctx.fillStyle = '#ff6161';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`${item.price}G`, x + cardWidth / 2 - 5, y + gridSize + 38);
        ctx.restore();
    }
    
    ctx.restore(); // 恢复裁剪
    
    // 滚动条
    const totalOreRows = Math.ceil(availableOres.length / 3);
    const totalItemRows = Math.ceil(state.shop.shopItems.length / 3);
    const maxRows = Math.max(totalOreRows, totalItemRows);
    state.shop.maxScroll = Math.max(0, (maxRows - 3) * (cardHeight + verticalSpacing));

    if (state.shop.maxScroll > 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(shopX + shopWidth - 25, shopY + 150, 10, 300);
        
        const scrollPercent = state.shop.scrollOffset / state.shop.maxScroll;
        const thumbHeight = Math.max(40, 300 * (3 / maxRows));
        const thumbY = shopY + 150 + scrollPercent * (300 - thumbHeight);
        
        ctx.fillStyle = '#f0227d';
        ctx.fillRect(shopX + shopWidth - 27, thumbY, 14, thumbHeight);
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(shopX + shopWidth - 27, thumbY, 14, thumbHeight);
    }

    // 按钮
    const buttonY = shopY + shopHeight - 80;
    const btnR = 10;

    // 出售按钮
    drawButton(shopX + 120, buttonY, 160, 50, btnR, '出 售');
    
    // 购买按钮
    drawButton(shopX + shopWidth / 2 + 120, buttonY, 160, 50, btnR, '购 买');

    ctx.restore(); // 恢复缩放动画
}