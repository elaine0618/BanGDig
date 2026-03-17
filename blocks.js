// ==================== 地块系统 ====================

// 初始化所有地块
function initAllBlocks(state, blocks, CONFIG, MAP_LAYOUT, ORE_LAYOUT, BLOCK_TYPES, BLOCK_TYPE_MAP) {
    const newBlocks = [];
    const startY = state.horizonY + 2;
    
    for (let row = 0; row < CONFIG.totalRows; row++) {
        const layoutRow = MAP_LAYOUT[row];
        const oreRow = ORE_LAYOUT[row] || [];
        
        for (let col = 0; col < CONFIG.blockCols; col++) {
            const blockTypeId = layoutRow[col] || BLOCK_TYPES.NORMAL.id;
            const blockType = BLOCK_TYPE_MAP[blockTypeId];
            const oreType = oreRow[col] || 0;
            const x = col * CONFIG.blockSize;
            const y = startY + row * CONFIG.blockSize;
            
            // 根据地块类型确定初始状态
            let initialState = 1;
            if (blockTypeId === BLOCK_TYPES.EMPTY.id) {
                initialState = 3;
            }
            
            const blockProps = {
                x, y,
                width: CONFIG.blockSize,
                height: CONFIG.blockSize,
                row, col,
                globalRow: row,
                centerX: x + CONFIG.blockSize / 2,
                centerY: y + CONFIG.blockSize / 2,
                typeId: blockTypeId,
                type: blockType,
                state: initialState,
                progress: 0,
                visible: row < CONFIG.initialVisibleRows,
                ore: oreType,
                oreCollected: false
            };
            
            newBlocks.push(blockProps);
        }
    }
    return newBlocks;
}

// 根据图片张数自动计算阈值
function calculateThresholds(block, CONFIG) {
    const imagesCount = block.type.images.length;
    
    // 如果只有一张图片，不需要阈值
    if (imagesCount <= 1) return null;
    
    // 自动计算阈值：将进度平均分配到各个状态
    const thresholds = [];
    for (let i = 1; i < imagesCount; i++) {
        thresholds.push(Math.floor((i / imagesCount) * CONFIG.maxProgress));
    }
    return thresholds;
}

// 挖掘地块
function mineBlock(block, state, CONFIG, AudioManager, stopDrillingCallback) {
    // 空地块
    if (block.state === 3) {
        return;
    }
    
    // 终点地块
    if (block.type.types === 4) {
        AudioManager.playBubu();
        return;
    }
    
    // 石头地块
    if (block.type.types === 3) {
        AudioManager.playBubu();
        return;
    }
    
    // 可挖掘的地块
    if (block.type.types === 1 || block.type.types === 5) {
        AudioManager.playWww();
    } else {
        return;
    }
    
    if (state.currentMiningBlock !== block) {
        state.currentMiningBlock = block;
        state.miningProgress = block.progress;
    }
    
    if (block.state === 1 || block.state === 2) {
        state.miningProgress += CONFIG.miningSpeed;
        block.progress = state.miningProgress;
        
        // 获取阈值
        const thresholds = calculateThresholds(block, CONFIG);
        
        if (thresholds) {
            // 根据阈值更新状态
            for (let i = thresholds.length - 1; i >= 0; i--) {
                if (state.miningProgress >= thresholds[i]) {
                    block.state = i + 2;
                    break;
                }
            }
        }
        
        // 挖掘完成
        if (state.miningProgress >= CONFIG.maxProgress) {
            block.state = 3;
            state.currentMiningBlock = null;
            state.miningProgress = 0;
            stopDrillingCallback();
        }
    }
}
// 绘制地块
function drawBlocks(blocks, ctx, images, state, CONFIG) {
    for (let block of blocks) {
        if (!block.visible) continue;
        
        const screenY = block.y - state.cameraOffset;
        if (screenY + block.height < 0 || screenY > state.canvasHeight) continue;
        
        let image;
        const type = block.type;
        
        if (type.images.length === 1) {
            image = images[type.images[0]];
        } else {
            const stateIndex = Math.min(block.state - 1, type.images.length - 1);
            image = images[type.images[stateIndex]];
        }
        
        if (image) {
            ctx.drawImage(image, block.x, screenY, CONFIG.blockSize, CONFIG.blockSize);
        }
    }
}