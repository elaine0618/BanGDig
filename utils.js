// ==================== 辅助方法 ====================
function alignBodyToHead() {
    state.player.bodyX = state.player.headX + (state.currentHeadImage.width - state.currentBodyImage.width) / 2;
    state.player.bodyY = state.player.headY + state.currentHeadImage.height;
}

function setHeadX(newX) {
    state.player.headX = newX;
    alignBodyToHead();
}

function getPlayerCollisionBox() {
    return {
        x: state.player.bodyX,
        y: state.player.bodyY,
        width: state.currentBodyImage.width,
        height: state.currentBodyImage.height
    };
}

function rectCollision(r1, r2) {
    return r1.x < r2.x + r2.width &&
           r1.x + r1.width > r2.x &&
           r1.y < r2.y + r2.height &&
           r1.y + r1.height > r2.y;
}

// ==================== 深度和镜头计算 ====================
function updateDepth() {
    const bodyCenterY = state.player.bodyY + state.currentBodyImage.height / 2;
    
    if (bodyCenterY <= state.horizonY) {
        state.player.depth = 0;
    } else {
        const depth = Math.floor((bodyCenterY - state.horizonY) / CONFIG.blockSize) + 1;
        state.player.depth = Math.max(0, depth);
    }
    
    updateVisibleRows();
}

function updateVisibleRows() {
    const targetVisibleRow = Math.min(
        CONFIG.initialVisibleRows - 1 + state.player.depth,
        CONFIG.totalRows - 1
    );
    
    if (targetVisibleRow > state.maxVisibleRow) {
        for (let block of blocks) {
            if (block.globalRow <= targetVisibleRow) {
                block.visible = true;
            }
        }
        state.maxVisibleRow = targetVisibleRow;
    }
}

function updateCamera() {
    const targetOffset = state.player.depth * CONFIG.blockSize;
    const maxOffset = (CONFIG.totalRows - 1) * CONFIG.blockSize;
    state.targetCameraOffset = Math.min(targetOffset, maxOffset);
    
    if (state.player.depth === 0) {
        state.targetCameraOffset = 0;
    }
    
    if (state.cameraOffset < state.targetCameraOffset) {
        state.cameraOffset = Math.min(
            state.cameraOffset + CONFIG.cameraSpeed,
            state.targetCameraOffset
        );
    } else if (state.cameraOffset > state.targetCameraOffset) {
        state.cameraOffset = Math.max(
            state.cameraOffset - CONFIG.cameraSpeed,
            state.targetCameraOffset
        );
    }
}

// ==================== 移动方法 ====================
function tryMove(dx, dy) {
    const newBodyX = state.player.bodyX + dx;
    const newBodyY = state.player.bodyY + dy;
    const newHeadX = newBodyX - (state.currentHeadImage.width - state.currentBodyImage.width) / 2;
    const newHeadY = newBodyY - state.currentHeadImage.height;
    
    const newPlayerRect = {
        x: newBodyX,
        y: newBodyY,
        width: state.currentBodyImage.width,
        height: state.currentBodyImage.height
    };
    
    if (!checkPlayerBlockCollision(newPlayerRect)) {
        state.player.headX = newHeadX;
        state.player.headY = newHeadY;
        state.player.bodyX = newBodyX;
        state.player.bodyY = newBodyY;
        return true;
    }
    return false;
}

function moveLeft() {
    for (let i = 0; i < CONFIG.moveSpeed; i++) {
        if (!tryMove(-1, 0)) break;
    }
}

function moveRight() {
    for (let i = 0; i < CONFIG.moveSpeed; i++) {
        if (!tryMove(1, 0)) break;
    }
}

// ==================== 自动吸附到当前地块中心 ====================
function snapToCurrentBlockCenter() {
    if (!state.player.grounded) return;
    
    const playerCenterX = state.player.headX + state.currentHeadImage.width / 2;
    let nearestCol = 0;
    let minDistance = Infinity;

    for (let col = 0; col < CONFIG.blockCols; col++) {
        const blockCenterX = col * CONFIG.blockSize + CONFIG.blockSize / 2;
        const distance = Math.abs(playerCenterX - blockCenterX);
        if (distance < minDistance) {
            minDistance = distance;
            nearestCol = col;
        }
    }

    const targetCenterX = nearestCol * CONFIG.blockSize + CONFIG.blockSize / 2;
    const newHeadX = targetCenterX - state.currentHeadImage.width / 2;
    setHeadX(newHeadX);
}

// ==================== 三种独立的抖动 ====================
function updateDrillShake() {
    if (state.isDrilling && state.player.grounded && state.currentDrillImage) {
        state.drillShakeOffset += CONFIG.drillShakeSpeed * state.drillShakeDirection;
        if (Math.abs(state.drillShakeOffset) >= CONFIG.drillShakeAmount) {
            state.drillShakeDirection *= -1;
        }
        
        state.playerShakeOffset += CONFIG.playerShakeSpeed * state.playerShakeDirection;
        if (Math.abs(state.playerShakeOffset) >= CONFIG.drillShakeAmount) {
            state.playerShakeDirection *= -1;
        }
        
        state.screenShakeOffset += CONFIG.screenShakeSpeed * state.screenShakeDirection;
        if (Math.abs(state.screenShakeOffset) >= CONFIG.screenShakeAmount) {
            state.screenShakeDirection *= -1;
        }
    }
}

// ==================== 边界限制 ====================
function applyBoundaryLimits() {
    if (state.player.headX < 0) {
        setHeadX(0);
    }
    if (state.player.headX + state.currentHeadImage.width > canvas.width) {
        setHeadX(canvas.width - state.currentHeadImage.width);
    }

    if (state.player.headY < 0) {
        state.player.headY = 0;
        state.player.bodyY = state.currentHeadImage.height;
        if (state.player.vy < 0) state.player.vy = 0;
    }
}

// ==================== 玩家挖掘相关 ====================
function checkDirectionHasBlock(dir) {
    if (!state.player.grounded) return false;
    
    let drillX, drillY;
    const drillImage = dir === 'left' ? images.zuantouLeft : 
                      dir === 'right' ? images.zuantouRight : 
                      images.zuantou;
    
    if (dir === 'down') {
        drillX = state.player.bodyX + (state.currentBodyImage.width - drillImage.width) / 2;
        drillY = state.player.bodyY + state.currentBodyImage.height - 10 - CONFIG.downDrillOffset;
    } else if (dir === 'left') {
        drillX = state.player.bodyX - drillImage.width + 10;
        drillY = state.player.bodyY + (state.currentBodyImage.height - drillImage.height) / 2 - CONFIG.sideDrillOffset;
    } else if (dir === 'right') {
        drillX = state.player.bodyX + state.currentBodyImage.width - 10;
        drillY = state.player.bodyY + (state.currentBodyImage.height - drillImage.height) / 2 - CONFIG.sideDrillOffset;
    } else {
        return false;
    }
    
    const drillRect = {
        x: drillX,
        y: drillY,
        width: drillImage.width,
        height: drillImage.height
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

        if (rectCollision(drillRect, blockRect)) {
            return true;
        }
    }
    return false;
}

function startDrilling(dir) {
    if (state.isDrilling && state.drillDirection === dir) return;
    
    state.isDrilling = true;
    state.drillDirection = dir;
    state.isFlying = false;
    
    switch(dir) {
        case 'down':
            state.currentDrillImage = images.zuantou;
            state.currentBodyImage = images.body;
            break;
        case 'left':
            state.currentDrillImage = images.zuantouLeft;
            state.currentBodyImage = images.bodyLeftZ;
            break;
        case 'right':
            state.currentDrillImage = images.zuantouRight;
            state.currentBodyImage = images.bodyRightZ;
            break;
    }
    
    updateDirection();
    state.animationFrame = 0;
    
    state.drillShakeDirection = 1;
    state.drillShakeOffset = 0;
    state.playerShakeDirection = 1;
    state.playerShakeOffset = 0;
    state.screenShakeDirection = 1;
    state.screenShakeOffset = 0;
    
    performMining();
}

function stopDrilling() {
    if (state.isDrilling) {
        state.isDrilling = false;
        state.drillDirection = null;
        state.currentDrillImage = null;
        state.drillShakeOffset = 0;
        state.playerShakeOffset = 0;
        state.screenShakeOffset = 0;
        state.currentMiningBlock = null;
        state.miningProgress = 0;
        state.currentBodyImage = images.body;
        updateDirection();
    }
}

function performMining() {
    if (!state.isDrilling || !state.player.grounded || !state.currentDrillImage) return;
    
    const collidedBlock = checkDrillCollision(state.drillDirection);
    if (collidedBlock) {
        mineBlock(collidedBlock, state, CONFIG, AudioManager, stopDrilling);
    } else {
        stopDrilling();
    }
}

function checkDrillCollision(direction) {
    if (!state.isDrilling || !state.player.grounded || !state.currentDrillImage) return null;

    let drillX, drillY;
    const drillImage = state.currentDrillImage;
    
    if (direction === 'down') {
        drillX = state.player.bodyX + (state.currentBodyImage.width - drillImage.width) / 2;
        drillY = state.player.bodyY + state.currentBodyImage.height - 10 - CONFIG.downDrillOffset;
    } else if (direction === 'left') {
        drillX = state.player.bodyX - drillImage.width + 10;
        drillY = state.player.bodyY + (state.currentBodyImage.height - drillImage.height) / 2 - CONFIG.sideDrillOffset;
    } else if (direction === 'right') {
        drillX = state.player.bodyX + state.currentBodyImage.width - 10;
        drillY = state.player.bodyY + (state.currentBodyImage.height - drillImage.height) / 2 - CONFIG.sideDrillOffset;
    } else {
        return null;
    }
    
    const drillRect = {
        x: drillX,
        y: drillY,
        width: drillImage.width,
        height: drillImage.height
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

        if (rectCollision(drillRect, blockRect)) {
            return block;
        }
    }
    return null;
}

// ==================== 动画方法 ====================
function updateAnimation() {
    if (!state.isDrilling) {
        if (state.direction === 'left') {
            const frames = [images.bodyLeft1, images.bodyLeft2, images.bodyLeft3];
            state.animationFrame = (state.animationFrame + 1) % (CONFIG.animationSpeed * frames.length);
            const frameIndex = Math.floor(state.animationFrame / CONFIG.animationSpeed);
            state.currentBodyImage = frames[frameIndex];
        } else if (state.direction === 'right') {
            const frames = [images.bodyRight1, images.bodyRight2, images.bodyRight3];
            state.animationFrame = (state.animationFrame + 1) % (CONFIG.animationSpeed * frames.length);
            const frameIndex = Math.floor(state.animationFrame / CONFIG.animationSpeed);
            state.currentBodyImage = frames[frameIndex];
        } else {
            state.currentBodyImage = images.body;
            state.animationFrame = 0;
        }
    }
    alignBodyToHead();
}

// ==================== 方向更新 ====================
function updateDirection() {
    if (state.leftPressed) {
        state.direction = 'left';
        state.currentHeadImage = images.headLeft;
    } else if (state.rightPressed) {
        state.direction = 'right';
        state.currentHeadImage = images.headRight;
    } else if (state.downPressed && !state.isDrilling) {
        state.direction = 'down';
        state.currentHeadImage = images.head1;
    } else if (state.isFlying) {
        state.direction = 'up';
        state.currentHeadImage = images.head2;
    } else if (state.isDrilling) {
        if (state.drillDirection === 'down') {
            state.direction = 'down';
            state.currentHeadImage = images.head3;
        } else if (state.drillDirection === 'left') {
            state.direction = 'left';
            state.currentHeadImage = images.headLeft;
        } else if (state.drillDirection === 'right') {
            state.direction = 'right';
            state.currentHeadImage = images.headRight;
        }
    } else {
        state.direction = 'up';
        state.currentHeadImage = images.head1;
    }
    alignBodyToHead();
}

// ==================== 状态切换方法 ====================
function startFlying() {
    if (!state.isFlying) {
        state.isFlying = true;
        state.isDrilling = false;
        state.drillDirection = null;
        state.currentDrillImage = null;
        state.drillShakeOffset = 0;
        state.playerShakeOffset = 0;
        state.screenShakeOffset = 0;
        state.currentMiningBlock = null;
        state.miningProgress = 0;
        updateDirection();
    }
}

function stopFlying() {
    if (state.isFlying) {
        state.isFlying = false;
        updateDirection();
    }
}

function checkAndStartDrilling() {
    if (!state.player.grounded) return;
    if (!state.aPressed) return;
    
    let dir = null;
    if (state.leftPressed && !state.rightPressed && !state.downPressed) {
        dir = 'left';
    } else if (state.rightPressed && !state.leftPressed && !state.downPressed) {
        dir = 'right';
    } else if (state.downPressed && !state.leftPressed && !state.rightPressed) {
        dir = 'down';
    }
    
    if (dir) {
        if (dir === 'down') {
            snapToCurrentBlockCenter();
        }
        
        const hasBlock = checkDirectionHasBlock(dir);
        if (hasBlock) {
            startDrilling(dir);
        }
    }
}

function startMovingLeft() {
    state.leftPressed = true;
    checkAndStartDrilling();
    updateDirection();
}

function stopMovingLeft() {
    state.leftPressed = false;
    if (state.isDrilling) {
        stopDrilling();
    }
    updateDirection();
}

function startMovingRight() {
    state.rightPressed = true;
    checkAndStartDrilling();
    updateDirection();
}

function stopMovingRight() {
    state.rightPressed = false;
    if (state.isDrilling) {
        stopDrilling();
    }
    updateDirection();
}

function startMovingDown() {
    state.downPressed = true;
    checkAndStartDrilling();
    updateDirection();
}

function stopMovingDown() {
    state.downPressed = false;
    if (state.isDrilling) {
        stopDrilling();
    }
    updateDirection();
}

// ==================== 碰撞检测 ====================
function checkPlayerBlockCollision(playerRect) {
    for (let block of blocks) {
        if (block.state === 3) continue;
        if (!block.visible) continue;
        
        const blockRect = {
            x: block.x,
            y: block.y,
            width: block.width,
            height: block.height
        };
        
        if (rectCollision(playerRect, blockRect)) {
            return true;
        }
    }
    return false;
}

// ==================== 物理方法 ====================
function applyVerticalCollision() {
    const playerRect = getPlayerCollisionBox();
    let grounded = false;
    
    for (let block of blocks) {
        if (block.state === 3) continue;
        if (!block.visible) continue;
        
        const blockRect = {
            x: block.x,
            y: block.y,
            width: block.width,
            height: block.height
        };
        
        if (rectCollision(playerRect, blockRect)) {
            const overlapTop = playerRect.y + playerRect.height - blockRect.y;
            const overlapBottom = blockRect.y + blockRect.height - playerRect.y;
            
            if (overlapTop < overlapBottom && state.player.vy >= 0) {
                state.player.bodyY = blockRect.y - playerRect.height;
                state.player.headY = state.player.bodyY - state.currentHeadImage.height;
                state.player.vy = 0;
                grounded = true;
            }
        }
        
        if (Math.abs(playerRect.y + playerRect.height - blockRect.y) < 1 &&
            playerRect.x < blockRect.x + blockRect.width &&
            playerRect.x + playerRect.width > blockRect.x) {
            grounded = true;
            state.player.vy = 0;
        }
    }
    
    state.player.grounded = grounded;
    return grounded;
}

function applyPhysics() {
    if (state.player.grounded && !state.isFlying) {
        state.player.vy = 0;
        
        const playerRect = getPlayerCollisionBox();
        let onGround = false;
        
        for (let block of blocks) {
            if (block.state === 3) continue;
            if (!block.visible) continue;
            
            const blockRect = {
                x: block.x,
                y: block.y,
                width: block.width,
                height: block.height
            };
            
            if (Math.abs(playerRect.y + playerRect.height - blockRect.y) < 2 &&
                playerRect.x < blockRect.x + blockRect.width &&
                playerRect.x + playerRect.width > blockRect.x) {
                onGround = true;
                break;
            }
        }
        
        if (!onGround) {
            state.player.grounded = false;
        }
    } else {
        if (state.isFlying) {
            state.player.vy += CONFIG.flyForce;
        }

        state.player.vy += CONFIG.gravity;
        state.player.vy -= state.player.vy * CONFIG.airResistance;
        
        if (state.player.vy < CONFIG.maxUpSpeed) state.player.vy = CONFIG.maxUpSpeed;
        if (state.player.vy > CONFIG.maxDownSpeed) state.player.vy = CONFIG.maxDownSpeed;
        
        if (state.player.vy !== 0) {
            const step = state.player.vy > 0 ? 1 : -1;
            const steps = Math.abs(Math.floor(state.player.vy));
            
            for (let i = 0; i < steps; i++) {
                if (!tryMove(0, step)) {
                    state.player.vy = 0;
                    break;
                }
            }
            
            const remaining = state.player.vy - steps * step;
            if (remaining !== 0) {
                tryMove(0, remaining);
            }
        }
    }
}