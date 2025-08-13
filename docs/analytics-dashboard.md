# 埋点数据统计仪表板

## 功能概述

埋点数据统计仪表板是一个用于展示用户行为分析数据的可视化界面，提供了 8 个不同维度的数据统计图表。

## 功能特性

### 1. 项目选择

- 左上角提供项目下拉选择框
- 支持切换不同项目查看对应的统计数据
- 项目列表通过 `/api/analytics/users/projects` 接口获取

### 2. 8 个统计维度

#### 2.1 按项目名统计人数

- **接口**: `/api/analytics/users/by-project`
- **参数**: `project` (项目名)
- **图表类型**: 柱状图

#### 2.2 按业务数据统计人数

- **接口**: `/api/analytics/users/by-business-data`
- **参数**: `project` (项目名)
- **图表类型**: 柱状图

#### 2.3 按系统类型统计人数

- **接口**: `/api/analytics/users/by-system-type`
- **参数**: `project` (项目名)
- **图表类型**: 柱状图

#### 2.4 按分辨率统计人数

- **接口**: `/api/analytics/users/by-resolution`
- **参数**: `project` (项目名)
- **图表类型**: 柱状图

#### 2.5 按元素文本统计人数

- **接口**: `/api/analytics/users/by-element-text`
- **参数**: `project` (项目名)
- **图表类型**: 柱状图

#### 2.6 按手机品牌统计人数

- **接口**: `/api/analytics/users/by-phone-brand`
- **参数**: `project` (项目名)
- **图表类型**: 柱状图

#### 2.7 按手机版本统计人数

- **接口**: `/api/analytics/users/by-phone-version`
- **参数**: `project` (项目名)
- **图表类型**: 柱状图

#### 2.8 按 24 小时统计人数

- **接口**: `/api/analytics/users/by-hour`
- **参数**: `project` (项目名)
- **图表类型**: 折线图（数据点较多时自动切换）

## 接口数据格式

### 请求示例

```
GET /api/analytics/users/by-hour?project=全埋点组件
```

### 响应格式

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "x": ["09", "10", "11", "14"],
    "y": [1, 1, 1, 1]
  }
}
```

### 数据字段说明

- `code`: 响应状态码，200 表示成功
- `message`: 响应消息
- `data.x`: X 轴数据（标签数组）
- `data.y`: Y 轴数据（数值数组）

## 技术实现

### 前端技术栈

- **React**: 组件化开发
- **TypeScript**: 类型安全
- **Ant Design**: UI 组件库
- **ECharts**: 图表可视化
- **Umi Max**: 前端框架

### 核心组件

- `AnalyticsChart`: 通用图表组件
- `HomePage`: 主页面组件
- `analytics.ts`: API 服务层

### 响应式设计

- 支持不同屏幕尺寸自适应
- 移动端友好的图表展示
- 自动调整图表类型和布局

## 使用说明

1. **启动项目**

   ```bash
   npm run dev
   ```

2. **访问页面** 打开浏览器访问 `http://localhost:8001`

3. **选择项目** 在页面左上角的下拉框中选择要查看的项目

4. **查看数据** 页面会自动加载并展示该项目的 8 个维度统计图表

## 自定义配置

### 添加新的统计维度

1. 在 `src/services/analytics.ts` 中添加新的 API 方法
2. 在 `src/pages/Home/index.tsx` 的 `chartConfigs` 数组中添加配置
3. 在后端添加对应的接口实现

### 修改图表样式

在 `src/components/AnalyticsChart/index.tsx` 中修改 `getOption` 方法的配置

### 调整布局

在 `src/pages/Home/index.less` 中修改样式配置
