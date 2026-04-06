# BanGDig
BanGDream's DigTomori Game (挖地小灯)
## 项目为模板框架，需要具体补充配置
**素材主要来自Bestdori，经过本人二次修改而成**
### 已实现功能
- 商店系统
- 道具系统
- 挖矿玩法（使用地图分布）
- 玩家数值（HP、能量值）
- 游戏开始结束流程
- NPC玩法：任务、奖励、好感度
### 配置说明
- 加入新矿石：config.js 修改ORES、images以及图片src路径
- 加入新地块：config.js 修改BLOCK_TYPES、images以及图片src路径
- 加入新道具：
  1. config.js 修改ITEMS、images以及图片src路径
  2. items.js 加入新方法、index.html 按键映射
  3. 数值相关：config.js 修改OXYGEN_CONFIG.iteminti
- 矿石分布：config.js 修改ORE_LAYOUT
- 地块分布：config.js 修改MAP_LAYOUT
- 挖掘速度：config.js 修改CONFIG.miningSpeed
- 初始属性：index.html 修改state
