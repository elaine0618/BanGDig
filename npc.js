// ==================== NPC系统 ====================

// NPC状态常量
const NPC_STATE = {
    STANDING: 'standing',  // 站立
    WALKING: 'walking',    // 行走
    LEAVING: 'leaving',    // 离开画面
    RETURNING: 'returning', // 返回画面
    TALKING: 'talking'     // 对话中
};

// NPC方向常量
const NPC_DIR = {
    LEFT: 'left',
    RIGHT: 'right'
};

// 对话选项
const DIALOG_OPTIONS = {
    TASK: 0,
    HELP: 1,
    CANCEL: 2
};

// 任务状态常量
const TASK_STATE = {
    NOT_STARTED: 'not_started',  // 未接取
    IN_PROGRESS: 'in_progress',  // 进行中
    COMPLETED: 'completed'       // 已完成
};

// NPC类
class NPC {
    constructor(id, name, config) {
        this.id = id;
        this.name = name;
        this.headImage = config.headImage;
        this.bodyImage = config.bodyImage;
        this.headLeftImage = config.headLeftImage;
        this.headRightImage = config.headRightImage;
        this.bodyLeftImages = config.bodyLeftImages;
        this.bodyRightImages = config.bodyRightImages;
        
        // 位置
        this.x = 0;
        this.y = 0;
        
        // 状态
        this.state = NPC_STATE.STANDING;
        this.direction = NPC_DIR.RIGHT;
        this.frame = 0;
        this.animationSpeed = 12;
        this.moveSpeed = 1;
        
        // 计时器
        this.stateTimer = 0;
        this.animationTimer = 0;
        
        // 可见性
        this.visible = true;
        
        // 对话相关
        this.dialogVisible = false;
        this.selectedOption = 0;
        this.dialogState = 'menu'; // 'menu', 'help', 'task_detail', 'task_submit'
        
        // 好感度系统
        this.friendship = 0; // 好感度 0-100
        
        // 任务系统 - 按顺序进行
        this.tasks = [
            {
                id: 1,
                name: '收集铁矿',
                requiredItem: 'k004',
                requiredCount: 2,
                friendshipReward: 10,
                itemReward: null,
                state: TASK_STATE.NOT_STARTED
            },
            {
                id: 2,
                name: '收集煤炭',
                requiredItem: 'k004',
                requiredCount: 6,
                friendshipReward: 15,
                itemReward: { id: 'e_cdb', count: 1 },
                state: TASK_STATE.NOT_STARTED
            },
            {
                id: 3,
                name: '收集铜矿',
                requiredItem: 'k004',
                requiredCount: 10,
                friendshipReward: 20,
                itemReward: { id: 'h_coffee', count: 1 },
                state: TASK_STATE.NOT_STARTED
            }
        ];
        
        // 当前正在查看的任务
        this.currentTask = null;
        
        // 初始位置（地平线上）
        this.resetPosition();
    }
    
    // 重置位置到地平线上
    resetPosition() {
        this.x = canvas.width / 2 - 200;
        this.y = state.horizonY - this.bodyImage.height - this.headImage.height;
        this.state = NPC_STATE.STANDING;
        this.direction = NPC_DIR.RIGHT;
        this.stateTimer = Math.floor(Math.random() * 180) + 300; // 5-8秒
        this.dialogVisible = false;
    }
    
    // 检查玩家是否在面前
    isPlayerNearby(playerX, playerY) {
        const distance = Math.abs(playerX - (this.x + this.headImage.width / 2));
        return distance < 100 && Math.abs(playerY - this.y) < 50;
    }
    
    // 开始对话
    startTalking() {
        this.state = NPC_STATE.TALKING;
        this.dialogVisible = true;
        this.selectedOption = 0;
        this.dialogState = 'menu';
    }
    
    // 获取当前可用的任务（按顺序的第一个未完成任务）
    getCurrentTask() {
        for (let task of this.tasks) {
            if (task.state === TASK_STATE.NOT_STARTED || task.state === TASK_STATE.IN_PROGRESS) {
                return task;
            }
        }
        return null;
    }
    
    // 结束对话
    stopTalking() {
        this.state = NPC_STATE.STANDING;
        this.dialogVisible = false;
        this.stateTimer = Math.floor(Math.random() * 180) + 300;
    }
    
    // 更新NPC状态
    update() {
        if (!this.visible) {
            if (this.stateTimer <= 0) {
                this.returnToScreen();
            } else {
                this.stateTimer--;
            }
            return;
        }
        
        // 对话状态不更新移动逻辑
        if (this.state === NPC_STATE.TALKING) return;
        
        switch(this.state) {
            case NPC_STATE.STANDING:
                this.updateStanding();
                break;
            case NPC_STATE.WALKING:
                this.updateWalking();
                break;
            case NPC_STATE.LEAVING:
                this.updateLeaving();
                break;
            case NPC_STATE.RETURNING:
                this.updateReturning();
                break;
        }
        
        this.animationTimer++;
    }
    
    // 站立状态更新
    updateStanding() {
        this.stateTimer--;
        if (this.stateTimer <= 0) {
            const action = Math.random();
            if (action < 0.3) {
                this.state = NPC_STATE.WALKING;
                this.stateTimer = Math.floor(Math.random() * 60) + 120;
            } else {
                this.state = NPC_STATE.STANDING;
                this.stateTimer = Math.floor(Math.random() * 120) + 180;
            }
        }
    }
    
    // 行走状态更新
    updateWalking() {
        if (this.direction === NPC_DIR.RIGHT) {
            this.x += this.moveSpeed;
        } else {
            this.x -= this.moveSpeed;
        }
        
        this.stateTimer--;
        if (this.stateTimer <= 0) {
            this.state = NPC_STATE.STANDING;
            this.stateTimer = Math.floor(Math.random() * 120) + 240;
        }
    }
    
    // 离开状态更新
    updateLeaving() {
        if (this.direction === NPC_DIR.RIGHT) {
            this.x += this.moveSpeed * 1.5;
            if (this.x > canvas.width + 100) {
                this.visible = false;
                this.stateTimer = Math.floor(Math.random() * 180) + 300;
            }
        } else {
            this.x -= this.moveSpeed * 1.5;
            if (this.x < -200) {
                this.visible = false;
                this.stateTimer = Math.floor(Math.random() * 180) + 300;
            }
        }
    }
    
    // 返回状态更新
    updateReturning() {
        if (this.direction === NPC_DIR.RIGHT) {
            this.x += this.moveSpeed * 1.5;
            if (this.x > canvas.width / 2 - 200) {
                this.state = NPC_STATE.STANDING;
                this.stateTimer = Math.floor(Math.random() * 180) + 300;
            }
        } else {
            this.x -= this.moveSpeed * 1.5;
            if (this.x < canvas.width / 2 - 200) {
                this.state = NPC_STATE.STANDING;
                this.stateTimer = Math.floor(Math.random() * 180) + 300;
            }
        }
    }
    
    // 从画面外回来
    returnToScreen() {
        this.visible = true;
        this.state = NPC_STATE.RETURNING;
        this.direction = Math.random() > 0.5 ? NPC_DIR.RIGHT : NPC_DIR.LEFT;
        
        if (this.direction === NPC_DIR.RIGHT) {
            this.x = -100;
        } else {
            this.x = canvas.width + 100;
        }
    }
    
    // 处理对话选择
    handleDialogSelect() {
        if (this.dialogState === 'menu') {
            if (this.selectedOption === 0) {
                // 第一个选项是任务名称
                this.currentTask = this.getCurrentTask();
                if (this.currentTask) {
                    if (this.currentTask.state === TASK_STATE.NOT_STARTED) {
                        this.dialogState = 'task_detail';
                    } else if (this.currentTask.state === TASK_STATE.IN_PROGRESS) {
                        this.dialogState = 'task_submit';
                    }
                } else {
                    showNotification('所有任务已完成！', 'success');
                }
            } else if (this.selectedOption === 1) {
                this.dialogState = 'help';
            } else if (this.selectedOption === 2) {
                this.stopTalking();
            }
        } else if (this.dialogState === 'help') {
            this.dialogState = 'menu';
            this.selectedOption = 0;
        } else if (this.dialogState === 'task_detail') {
            // 任务详情页面 - 接取或取消
            if (this.selectedOption === 0) {
                // 接取任务
                if (this.currentTask) {
                    this.currentTask.state = TASK_STATE.IN_PROGRESS;
                    showNotification(`已接取任务: ${this.currentTask.name}`, 'success');
                    this.dialogState = 'menu';
                    this.selectedOption = 0;
                }
            } else {
                // 取消
                this.dialogState = 'menu';
                this.selectedOption = 0;
            }
        } else if (this.dialogState === 'task_submit') {
            // 提交任务页面 - 提交或取消
            if (this.selectedOption === 0) {
                this.submitTask();
            } else {
                // 取消
                this.dialogState = 'menu';
                this.selectedOption = 0;
            }
        }
    }
    
    // 提交任务
    submitTask() {
        if (!this.currentTask) return;
        
        const task = this.currentTask;
        const itemKey = task.requiredItem;
        const requiredCount = task.requiredCount;
        
        // 检查是否有足够的物品
        if (state.inventory[itemKey] >= requiredCount) {
            // 扣除物品
            state.inventory[itemKey] -= requiredCount;
            
            // 增加好感度
            this.friendship += task.friendshipReward;
            if (this.friendship > 100) this.friendship = 100;
            
            // 发放道具奖励
            if (task.itemReward) {
                const rewardId = task.itemReward.id;
                const rewardCount = task.itemReward.count;
                if (state.items[rewardId] !== undefined) {
                    state.items[rewardId] += rewardCount;
                    // 检查上限
                    if (state.items[rewardId] > 99) state.items[rewardId] = 99;
                }
            }
            
            // 标记任务完成
            task.state = TASK_STATE.COMPLETED;
            
            showNotification(`任务完成！好感度+${task.friendshipReward}`, 'success');
            
            // 返回主菜单
            this.dialogState = 'menu';
            this.selectedOption = 0;
        } else {
            showNotification('物品不足，无法提交任务', 'error');
        }
    }
    
    // 绘制对话框
    drawDialog(ctx, cameraOffset) {
        if (!this.dialogVisible) return;
        
        const screenY = this.y - cameraOffset;
        const dialogX = this.x + this.headImage.width + 20;
        const dialogY = screenY - 30;
        const dialogWidth = 280;
        let dialogHeight = 200;
        
        // 根据状态调整高度
        if (this.dialogState === 'menu') {
            dialogHeight = 180;
        } else if (this.dialogState === 'help') {
            dialogHeight = 260;
        } else if (this.dialogState === 'task_detail') {
            dialogHeight = 260;
        } else if (this.dialogState === 'task_submit') {
            dialogHeight = 260;
        }
        
        // 对话框背景
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(dialogX, dialogY, dialogWidth, dialogHeight, 10);
        ctx.fill();
        
        // 对话框边框
        ctx.strokeStyle = '#f0227d';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        if (this.dialogState === 'menu') {
            // 主菜单
            ctx.fillStyle = '#333333';
            ctx.font = 'bold 18px "幼圆", "黑体", monospace';
            ctx.fillText('爱音斯坦博士', dialogX + 20, dialogY + 30);
            
            // 显示好感度
            ctx.font = '12px "幼圆", "黑体", monospace';
            ctx.fillStyle = '#f0227d';
            ctx.fillText(`好感度: ${this.friendship}`, dialogX + dialogWidth - 100, dialogY + 25);
            
            // 分隔线
            ctx.strokeStyle = '#f0227d';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(dialogX + 20, dialogY + 40);
            ctx.lineTo(dialogX + dialogWidth - 20, dialogY + 40);
            ctx.stroke();
            
            // 获取当前任务
            const currentTask = this.getCurrentTask();
            const taskName = currentTask ? currentTask.name : '所有任务已完成';
            
            // 菜单选项
            const options = [
                { text: taskName, y: dialogY + 70 },
                { text: '游戏说明', y: dialogY + 105 },
                { text: '取消', y: dialogY + 140 }
            ];
            
            options.forEach((option, index) => {
                // 选中效果
                if (index === this.selectedOption) {
                    ctx.fillStyle = '#f0227d';
                    ctx.beginPath();
                    ctx.roundRect(dialogX + 15, option.y - 15, dialogWidth - 30, 25, 5);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                } else {
                    ctx.fillStyle = '#333333';
                }
                
                // 选项文字
                ctx.font = '16px "幼圆", "黑体", monospace';
                ctx.fillText(option.text, dialogX + 30, option.y);
            });
		} else if (this.dialogState === 'help') {
			// 游戏说明页面
			ctx.fillStyle = '#333333';
			ctx.font = 'bold 18px "幼圆", "黑体", monospace';
			ctx.fillText('基本介绍', dialogX + 20, dialogY + 30);
			
			// 分隔线
			ctx.strokeStyle = '#f0227d';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(dialogX + 20, dialogY + 40);
			ctx.lineTo(dialogX + dialogWidth - 20, dialogY + 40);
			ctx.stroke();
			
			// 说明文本 - 分行显示，自动换行
			ctx.font = '14px "幼圆", "黑体", monospace';
			ctx.fillStyle = '#333333';
			
			// 原有的排版格式，但每个长文本会自动换行
			const helpLines = [
				'1.使用方向键往地下挖土',
				'2.商店可以交易各种道具物品',
				'3.星星冲击可以炸开岩石，放置后数秒就会爆炸',
				'4.注意能量值，需要及时回到地面上补充，否则就会困在地下'
			];
			
			let currentY = dialogY + 70;
			const maxWidth = dialogWidth - 40; // 左右边距
			
			helpLines.forEach((line) => {
				// 如果当前行宽度超过最大宽度，则自动换行
				if (ctx.measureText(line).width > maxWidth) {
					let tempLine = '';
					for (let char of line) {
						const testLine = tempLine + char;
						if (ctx.measureText(testLine).width > maxWidth) {
							ctx.fillText(tempLine, dialogX + 20, currentY);
							currentY += 28;
							tempLine = char;
						} else {
							tempLine = testLine;
						}
					}
					if (tempLine) {
						ctx.fillText(tempLine, dialogX + 20, currentY);
						currentY += 28;
					}
				} else {
					ctx.fillText(line, dialogX + 20, currentY);
					currentY += 28;
				}
			});
			
			// 左下角提示
			ctx.font = '12px "幼圆", "黑体", monospace';
			ctx.fillStyle = '#f0227d';
			ctx.fillText('空格返回', dialogX + 20, dialogY + dialogHeight - 20);

        } else if (this.dialogState === 'task_detail') {
            // 任务详情 - 接取页面
            if (!this.currentTask) return;
            
            const task = this.currentTask;
            
            ctx.fillStyle = '#333333';
            ctx.font = 'bold 18px "幼圆", "黑体", monospace';
            ctx.fillText(task.name, dialogX + 20, dialogY + 30);
            
            // 分隔线
            ctx.strokeStyle = '#f0227d';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(dialogX + 20, dialogY + 40);
            ctx.lineTo(dialogX + dialogWidth - 20, dialogY + 40);
            ctx.stroke();
            
            ctx.font = '14px "幼圆", "黑体", monospace';
            ctx.fillStyle = '#333333';
            
            let currentY = dialogY + 70;
            
            // 第一行：需要物品（标题）
            ctx.fillStyle = '#333333';
            ctx.font = 'bold 14px "幼圆", "黑体", monospace';
            ctx.fillText('需要物品', dialogX + 20, currentY);
            currentY += 22;
            
            // 查找对应的矿石信息
            let itemName = task.requiredItem;
            let itemIcon = null;
            for (let type in ORES) {
                if (ORES[type].key === task.requiredItem) {
                    itemName = ORES[type].name;
                    itemIcon = images[ORES[type].image];
                    break;
                }
            }
            
            const currentCount = state.inventory[task.requiredItem] || 0;
            
            // 绘制物品图标和数量（包含当前拥有）
            if (itemIcon) {
                ctx.drawImage(itemIcon, dialogX + 20, currentY - 16, 20, 20);
            }
            ctx.font = '14px "幼圆", "黑体", monospace';
            ctx.fillStyle = '#333333';
            ctx.fillText(`${itemName} x${task.requiredCount} (拥有 ${currentCount})`, dialogX + 45, currentY);
            currentY += 22;
            
			// 第二行：任务奖励（标题）
			ctx.fillStyle = '#333333';
			ctx.font = 'bold 14px "幼圆", "黑体", monospace';
			ctx.fillText('任务奖励', dialogX + 20, currentY);
			currentY += 22;

			// 判断是否有道具奖励
			if (task.itemReward) {
				// 查找道具信息
				let rewardItemName = task.itemReward.id;
				let rewardIcon = null;
				if (ITEMS[task.itemReward.id]) {
					rewardItemName = ITEMS[task.itemReward.id].name;
					rewardIcon = images[ITEMS[task.itemReward.id].icon];
				}
				
				// 绘制奖励图标和数量
				if (rewardIcon) {
					ctx.drawImage(rewardIcon, dialogX + 20, currentY - 16, 20, 20);
				}
				ctx.font = '14px "幼圆", "黑体", monospace';
				ctx.fillStyle = '#333333';
				ctx.fillText(`${rewardItemName} x${task.itemReward.count}`, dialogX + 45, currentY);
			} else {
				// 无奖励
				ctx.font = '14px "幼圆", "黑体", monospace';
				ctx.fillStyle = '#333333';
				ctx.fillText('无', dialogX + 20, currentY);
			}
			currentY += 22;
            // 选项
            const options = [
                { text: '接取任务', y: dialogY + dialogHeight - 60 },
                { text: '取消', y: dialogY + dialogHeight - 30 }
            ];
            
            options.forEach((option, index) => {
                if (index === this.selectedOption) {
                    ctx.fillStyle = '#f0227d';
                    ctx.beginPath();
                    ctx.roundRect(dialogX + 15, option.y - 15, dialogWidth - 30, 25, 5);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                } else {
                    ctx.fillStyle = '#333333';
                }
                
                ctx.font = '14px "幼圆", "黑体", monospace';
                ctx.fillText(option.text, dialogX + 30, option.y);
            });
        } else if (this.dialogState === 'task_submit') {
            // 任务提交页面
            if (!this.currentTask) return;
            
            const task = this.currentTask;
            
            ctx.fillStyle = '#333333';
            ctx.font = 'bold 18px "幼圆", "黑体", monospace';
            ctx.fillText(task.name, dialogX + 20, dialogY + 30);
            
            // 分隔线
            ctx.strokeStyle = '#f0227d';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(dialogX + 20, dialogY + 40);
            ctx.lineTo(dialogX + dialogWidth - 20, dialogY + 40);
            ctx.stroke();
            
            ctx.font = '14px "幼圆", "黑体", monospace';
            ctx.fillStyle = '#333333';
            
            let currentY = dialogY + 70;
            
            // 第一行：需要物品（标题）
            ctx.fillStyle = '#333333';
            ctx.font = 'bold 14px "幼圆", "黑体", monospace';
            ctx.fillText('需要物品', dialogX + 20, currentY);
            currentY += 22;
            
            // 查找对应的矿石信息
            let itemName = task.requiredItem;
            let itemIcon = null;
            for (let type in ORES) {
                if (ORES[type].key === task.requiredItem) {
                    itemName = ORES[type].name;
                    itemIcon = images[ORES[type].image];
                    break;
                }
            }
            
            const currentCount = state.inventory[task.requiredItem] || 0;
            
            // 绘制物品图标和数量
            if (itemIcon) {
                ctx.drawImage(itemIcon, dialogX + 20, currentY - 16, 20, 20);
            }
            ctx.font = '14px "幼圆", "黑体", monospace';
            ctx.fillStyle = '#333333';
            ctx.fillText(`${itemName} x${task.requiredCount} (拥有 ${currentCount})`, dialogX + 45, currentY);
            currentY += 22;
            
			// 第二行：任务奖励（标题）
			ctx.fillStyle = '#333333';
			ctx.font = 'bold 14px "幼圆", "黑体", monospace';
			ctx.fillText('任务奖励', dialogX + 20, currentY);
			currentY += 22;

			// 判断是否有道具奖励
			if (task.itemReward) {
				// 查找道具信息
				let rewardItemName = task.itemReward.id;
				let rewardIcon = null;
				if (ITEMS[task.itemReward.id]) {
					rewardItemName = ITEMS[task.itemReward.id].name;
					rewardIcon = images[ITEMS[task.itemReward.id].icon];
				}
				
				// 绘制奖励图标和数量
				if (rewardIcon) {
					ctx.drawImage(rewardIcon, dialogX + 20, currentY - 16, 20, 20);
				}
				ctx.font = '14px "幼圆", "黑体", monospace';
				ctx.fillStyle = '#333333';
				ctx.fillText(`${rewardItemName} x${task.itemReward.count}`, dialogX + 45, currentY);
			} else {
				// 无奖励
				ctx.font = '14px "幼圆", "黑体", monospace';
				ctx.fillStyle = '#333333';
				ctx.fillText('无', dialogX + 20, currentY);
			}
			currentY += 22;
            
            // 选项
            const options = [
                { text: '提交任务', y: dialogY + dialogHeight - 60 },
                { text: '取消', y: dialogY + dialogHeight - 30 }
            ];
            
            options.forEach((option, index) => {
                if (index === this.selectedOption) {
                    ctx.fillStyle = '#f0227d';
                    ctx.beginPath();
                    ctx.roundRect(dialogX + 15, option.y - 15, dialogWidth - 30, 25, 5);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                } else {
                    ctx.fillStyle = '#333333';
                }
                
                ctx.font = '14px "幼圆", "黑体", monospace';
                ctx.fillText(option.text, dialogX + 30, option.y);
            });
        }
    }
    
    // 绘制NPC
    draw(ctx, cameraOffset) {
        if (!this.visible) return;
        
        const screenY = this.y - cameraOffset;
        
        let headImg, bodyImg;
        
        if (this.state === NPC_STATE.TALKING) {
            // 对话状态使用正面图片，静止不动
            headImg = this.headImage;
            bodyImg = this.bodyImage;
        } else if (this.state === NPC_STATE.WALKING || this.state === NPC_STATE.LEAVING || this.state === NPC_STATE.RETURNING) {
            if (this.direction === NPC_DIR.RIGHT) {
                headImg = this.headRightImage;
                const frameIndex = Math.floor(this.animationTimer / this.animationSpeed) % this.bodyRightImages.length;
                bodyImg = this.bodyRightImages[frameIndex];
            } else {
                headImg = this.headLeftImage;
                const frameIndex = Math.floor(this.animationTimer / this.animationSpeed) % this.bodyLeftImages.length;
                bodyImg = this.bodyLeftImages[frameIndex];
            }
        } else {
            headImg = this.headImage;
            bodyImg = this.bodyImage;
        }
        
        const bodyX = this.x + (headImg.width - bodyImg.width) / 2;
        
        ctx.drawImage(bodyImg, bodyX, screenY + headImg.height);
        ctx.drawImage(headImg, this.x, screenY);
        
        // 绘制对话框
        this.drawDialog(ctx, cameraOffset);
    }
}

// 辅助函数：自动换行
function wrapText(text, maxWidth) {
    const words = text.split('');
    const lines = [];
    let currentLine = '';
    
    for (let char of words) {
        const testLine = currentLine + char;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine.length > 0) {
            lines.push(currentLine);
            currentLine = char;
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine) {
        lines.push(currentLine);
    }
    return lines;
}

// ==================== NPC管理器 ====================
const NPCManager = {
    npcs: [],
    interactionCooldown: 0,
    
    // 初始化NPC
    init: function() {
        const ano = new NPC('ano', 'ano', {
            headImage: images.ano_head_01,
            bodyImage: images.ano_body_01,
            headLeftImage: images.ano_head_left,
            headRightImage: images.ano_head_right,
            bodyLeftImages: [images.ano_body_left_01, images.ano_body_left_02, images.ano_body_left_01],
            bodyRightImages: [images.ano_body_right_01, images.ano_body_right_02, images.ano_body_right_01]
        });
        
        this.npcs.push(ano);
    },
    
    // 更新所有NPC
    update: function() {
        if (this.interactionCooldown > 0) {
            this.interactionCooldown--;
        }
        
        for (let npc of this.npcs) {
            npc.update();
        }
    },
    
    // 绘制所有NPC
    draw: function(ctx, cameraOffset) {
        for (let npc of this.npcs) {
            npc.draw(ctx, cameraOffset);
        }
    },
    
    // 检查NPC交互
    checkInteraction: function(playerX, playerY) {
        if (this.interactionCooldown > 0) return null;
        
        for (let npc of this.npcs) {
            if (npc.visible && npc.isPlayerNearby(playerX, playerY)) {
                return npc;
            }
        }
        return null;
    },
    
    // 空格键交互
    handleSpace: function() {
        for (let npc of this.npcs) {
            if (npc.dialogVisible) {
                npc.handleDialogSelect();
                return true;
            }
        }
        return false;
    },
    
    // 方向键选择
    handleDialogNavigation: function(direction) {
        for (let npc of this.npcs) {
            if (!npc.dialogVisible) continue;
            
            if (npc.dialogState === 'menu') {
                if (direction === 'up') {
                    npc.selectedOption = (npc.selectedOption - 1 + 3) % 3;
                } else if (direction === 'down') {
                    npc.selectedOption = (npc.selectedOption + 1) % 3;
                }
                return true;
            } else if (npc.dialogState === 'task_detail' || npc.dialogState === 'task_submit') {
                if (direction === 'up') {
                    npc.selectedOption = (npc.selectedOption - 1 + 2) % 2;
                } else if (direction === 'down') {
                    npc.selectedOption = (npc.selectedOption + 1) % 2;
                }
                return true;
            }
        }
        return false;
    },
    
    // 重置所有NPC
    reset: function() {
        for (let npc of this.npcs) {
            npc.resetPosition();
        }
        this.interactionCooldown = 0;
    }
};