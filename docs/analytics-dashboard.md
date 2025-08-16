# 埋点数据统计仪表板

## 功能概述

埋点数据统计仪表板是一个用于展示用户行为分析数据的可视化界面，包含：

- **首页**: 提供 8 个不同维度的数据统计图表
- **Access 页面**: 专门展示页面停留时间分析和资源加载分析

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

#### 2.9 按页面停留时间统计人数

- **接口**: `/api/analytics/users/by-page-remain-time`
- **参数**: `project` (项目名), `duration` (时间区间)
- **图表类型**: 柱状图/折线图（自动切换）
- **特殊功能**: 图表右上角有时间区间选择下拉框

#### 2.10 按资源名称统计人数

- **接口**: `/api/analytics/users/resources/by-name`
- **参数**: `project` (项目名), `type` (资源类型), `min` (最小时间), `max` (最大时间), `brandId` (品牌 ID)
- **图表类型**: 柱状图/折线图（自动切换）
- **特殊功能**: 图表右上角有三个下拉框（资源类型、时间区间、手机品牌）

## 接口数据格式

### 请求示例

```
GET /api/analytics/users/by-hour?project=全埋点组件
GET /api/analytics/users/by-page-remain-time?project=王者荣耀&duration=2000-3000
GET /api/analytics/users/resources/by-name?project=王者荣耀&type=js&min=200&max=1000&brandId=2000000000123
GET /api/analytics/users/resources/types
GET /api/analytics/users/resources/phone-brands
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

### 时间区间参数说明

#### 页面停留时间

页面停留时间接口的 `duration` 参数支持以下格式：

- `0-1000`: 0-1 秒
- `1000-2000`: 1-2 秒
- `2000-3000`: 2-3 秒
- `3000-5000`: 3-5 秒
- `5000-10000`: 5-10 秒
- `10000-30000`: 10-30 秒
- `30000-60000`: 30 秒-1 分钟
- `60000-180000`: 1-3 分钟
- `180000-999999`: 3 分钟以上

#### 资源加载时间

资源加载接口的 `min` 和 `max` 参数支持以下格式：

- `0-100`: 0-100ms
- `100-200`: 100-200ms
- `200-500`: 200-500ms
- `500-1000`: 500ms-1s
- `1000-2000`: 1-2s
- `2000-5000`: 2-5s
- `5000-10000`: 5-10s
- `10000-999999`: 10s 以上

#### 资源类型

通过 `/api/analytics/users/resources/types` 接口获取，常见类型包括：

- `js`: JavaScript 文件
- `css`: CSS 样式文件
- `img`: 图片文件
- `font`: 字体文件
- `xhr`: XMLHttpRequest 请求
- `fetch`: Fetch API 请求

#### 手机品牌

通过 `/api/analytics/users/resources/phone-brands` 接口获取，返回格式：

```json
[
  { "id": "2000000000123", "name": "iPhone" },
  { "id": "2000000000124", "name": "华为" },
  { "id": "2000000000125", "name": "小米" }
]
```

## 技术实现

### 前端技术栈

- **React**: 组件化开发
- **TypeScript**: 类型安全
- **Ant Design**: UI 组件库
- **ECharts**: 图表可视化
- **Umi Max**: 前端框架

### 核心组件

- `AnalyticsChart`: 通用图表组件
- `PageRemainTimeChart`: 页面停留时间图表组件（带时间区间选择）
- `ResourceLoadChart`: 资源加载图表组件（带三个参数选择）
- `HomePage`: 主页面组件
- `AccessPage`: Access 页面组件
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

2. **访问页面**

   - 首页: `http://localhost:8001` - 查看 8 个维度的统计图表
   - Access 页面: `http://localhost:8001/access` - 查看页面停留时间分析

3. **选择项目** 在页面左上角的下拉框中选择要查看的项目

4. **查看数据**
   - 首页会自动加载并展示该项目的 8 个维度统计图表
   - Access 页面展示页面停留时间统计和资源加载统计
   - 页面停留时间图表：可通过右上角下拉框选择时间区间
   - 资源加载图表：可通过右上角三个下拉框选择资源类型、时间区间和手机品牌

## 自定义配置

### 添加新的统计维度

1. 在 `src/services/analytics.ts` 中添加新的 API 方法
2. 在 `src/pages/Home/index.tsx` 的 `chartConfigs` 数组中添加配置
3. 在后端添加对应的接口实现

### 修改图表样式

在 `src/components/AnalyticsChart/index.tsx` 中修改 `getOption` 方法的配置

### 调整布局

在 `src/pages/Home/index.less` 中修改样式配置
