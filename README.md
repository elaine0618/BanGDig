# BanGDig
BanGDream's DigTomori Game (挖地小灯)
## 当前为半成品
代码改昏厥了，先传个存档，慢慢改 <br><br>
**素材主要来自Bestdori，经过本人二次修改而成**
### 已实现功能
- 商店系统
- 道具系统
- 挖矿玩法（使用地图分布）
- 玩家数值（HP、能量值）
- 游戏开始结束流程
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
### 尚未实现部分
- 具体游玩配置
- 打怪玩法：攻击、格挡、等级系统（暂未确定是否加入）
- NPC玩法：任务、奖励、好感度、时间系统（暂未确定是否加入）
- 经营玩法：金币收入、雇员、时间系统（暂未确定是否加入）
