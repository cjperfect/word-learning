# VocabFlow AI 2.0

一个具备"未来感"的英语学习工作台。通过极致的动效反馈（Framer Motion）与高阶审美 UI（Tailwind CSS），配合智谱 GLM-4 的深度语言分析，提升单词与句子的记录意愿与记忆深度。

## 技术栈

- **前端**: Next.js 14+ (App Router), Tailwind CSS, Framer Motion
- **后端**: NestJS, Prisma ORM
- **数据库**: MySQL
- **AI**: 智谱 GLM-4 API

## 项目结构

```
english-note/
├── frontend/          # Next.js 前端应用
├── backend/           # NestJS 后端服务
└── docs/              # 项目文档
```

## 快速开始

### 1. 数据库设置

确保 MySQL 服务运行，然后创建数据库：

```sql
CREATE DATABASE learning_english;
```

### 2. 后端设置

```bash
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env，填入你的智谱 API 密钥

# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev --name init

# 启动后端服务
npm run start:dev
```

后端服务将运行在 `http://localhost:3001`

### 3. 前端设置

```bash
cd frontend

# 安装依赖
npm install

# 启动前端服务
npm run dev
```

前端应用将运行在 `http://localhost:3000`

## 环境变量

### 后端 (.env)

```
DATABASE_URL="mysql://root:root@localhost:3306/learning_english"
ZHIPU_API_KEY="your_api_key_here"
PORT=3001
```

## 核心功能

### 1. 8-下划线矩阵输入

- 页面中心横向排列 8 个独立的输入框
- **空格流转**: 按空格键自动跳到下一个输入框
- **回车聚合**: 按回车键保存所有输入为一条记录
- 脉冲动画反馈

### 2. Bento Grid 布局

- 按日期分组显示记录
- 长句子横跨两列，短单词占据单列
- 悬停光晕效果
- 平滑展开/收起动画

### 3. AI 深度分析

- 点击记录卡片触发 AI 分析
- 使用智谱 GLM-4 模型
- 返回：
  - 词性
  - 中文释义
  - 词源/词根分析
  - 好莱坞对白风格例句
  - 记忆技巧

### 4. 视觉设计

- 赛博极简主义 + 玻璃拟态 (Glassmorphism)
- 动态网格背景
- 交互渐变色
- Framer Motion 动效

## API 端点

### 后端 API

- `POST /vocab/create` - 创建新记录
- `GET /vocab/list` - 获取所有记录（按日期分组）
- `GET /vocab/:id` - 获取单条记录
- `POST /vocab/analyze/:id` - AI 分析记录
- `DELETE /vocab/:id` - 删除记录

## 开发指南

### 运行测试

```bash
# 后端测试
cd backend
npm run test

# 前端测试
cd frontend
npm run test
```

### 构建生产版本

```bash
# 后端
cd backend
npm run build

# 前端
cd frontend
npm run build
```

## 注意事项

1. 确保 MySQL 服务运行在 `localhost:3306`
2. 智谱 API 密钥需要在 [智谱开放平台](https://open.bigmodel.cn/) 获取
3. 后端默认端口 3001，前端默认端口 3000
4. CORS 已配置允许前端访问后端

## 许可证

MIT License

## 致谢

- UI 设计灵感来源于 Glassmorphism 和 Bento Grid 设计趋势
- AI 模型由智谱 AI 提供
- 动效库使用 Framer Motion
