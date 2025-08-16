import {
  AnalyticsData,
  getPhoneBrands,
  getResourceTypes,
  getUsersByResourceName,
} from '@/services/analytics';
import { Card, Empty, Select, Space, Spin } from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';

const { Option } = Select;

interface ResourceLoadChartProps {
  title: string;
  project: string;
  height?: number;
}

// 时间区间选项
const timeRangeOptions = [
  { label: '0-100ms', min: 0, max: 100 },
  { label: '100-200ms', min: 100, max: 200 },
  { label: '200-500ms', min: 200, max: 500 },
  { label: '500ms-1s', min: 500, max: 1000 },
  { label: '1-2s', min: 1000, max: 2000 },
  { label: '2-5s', min: 2000, max: 5000 },
  { label: '5-10s', min: 5000, max: 10000 },
  { label: '10s以上', min: 10000, max: 999999 },
];

interface PhoneBrand {
  value: string;
  name: string;
}

const ResourceLoadChart: React.FC<ResourceLoadChartProps> = ({
  title,
  project,
  height = 300,
}) => {
  const [data, setData] = useState<AnalyticsData | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [resourceTypes, setResourceTypes] = useState<string[]>([]);
  const [phoneBrands, setPhoneBrands] = useState<PhoneBrand[]>([]);

  // 选择的参数
  const [selectedType, setSelectedType] = useState<string>('js');
  const [selectedTimeRange, setSelectedTimeRange] = useState<{
    min: number;
    max: number;
  }>({ min: 200, max: 1000 });
  const [selectedBrandId, setSelectedBrandId] =
    useState<string>('2000000000123');

  // 获取资源类型列表
  const fetchResourceTypes = async () => {
    try {
      const response = await getResourceTypes();
      if (response.code === 200) {
        setResourceTypes(response.data);
        if (response.data.length > 0 && !response.data.includes(selectedType)) {
          setSelectedType(response.data[0]);
        }
      }
    } catch (error) {
      console.error('获取资源类型失败:', error);
    }
  };

  // 获取手机品牌列表
  const fetchPhoneBrands = async () => {
    try {
      const response = await getPhoneBrands();
      if (response.code === 200) {
        console.log('获取手机品牌成功:', response.data);

        setPhoneBrands(response.data);
        if (
          response.data.length > 0 &&
          !response.data.find((brand) => brand.id === selectedBrandId)
        ) {
          setSelectedBrandId(response.data[0].id);
        }
      }
    } catch (error) {
      console.error('获取手机品牌失败:', error);
    }
  };

  // 获取数据
  const fetchData = async () => {
    if (!project) return;

    setLoading(true);
    try {
      const response = await getUsersByResourceName(
        project,
        selectedType,
        selectedTimeRange.min,
        selectedTimeRange.max,
        selectedBrandId,
      );
      if (response.code === 200) {
        setData(response.data);
      } else {
        console.error('获取资源加载数据失败:', response.message);
      }
    } catch (error) {
      console.error('获取资源加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 参数变化处理
  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  const handleTimeRangeChange = (value: string) => {
    const range = timeRangeOptions.find(
      (option) => `${option.min}-${option.max}` === value,
    );
    if (range) {
      setSelectedTimeRange({ min: range.min, max: range.max });
    }
  };

  const handleBrandChange = (brandId: string) => {
    setSelectedBrandId(brandId);
  };

  // 初始化
  useEffect(() => {
    fetchResourceTypes();
    fetchPhoneBrands();
  }, []);

  // 项目或参数变化时重新获取数据
  useEffect(() => {
    if (project && selectedType && selectedBrandId) {
      fetchData();
    }
  }, [project, selectedType, selectedTimeRange, selectedBrandId]);

  const getOption = () => {
    if (!data) return {};

    // 根据数据量选择图表类型
    const chartType = data.x.length > 10 ? 'line' : 'bar';

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: chartType === 'line' ? 'line' : 'shadow',
        },
        formatter: (params: any) => {
          const param = Array.isArray(params) ? params[0] : params;
          return `${param.name}<br/>${param.seriesName}: ${param.value}人`;
        },
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data.x,
        axisLabel: {
          rotate: data.x.length > 6 ? 45 : 0,
          fontSize: 12,
          color: '#666',
          interval: data.x.length > 12 ? 'auto' : 0,
        },
        axisLine: {
          lineStyle: {
            color: '#e8e8e8',
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 12,
          color: '#666',
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0',
            type: 'dashed',
          },
        },
      },
      series: [
        {
          name: '人数',
          type: chartType,
          data: data.y,
          smooth: chartType === 'line',
          itemStyle: {
            color: '#722ed1',
            borderRadius: chartType === 'bar' ? [4, 4, 0, 0] : 0,
          },
          emphasis: {
            itemStyle: {
              color: '#9254de',
            },
          },
          lineStyle:
            chartType === 'line'
              ? {
                  width: 3,
                  color: '#722ed1',
                }
              : undefined,
          symbol: chartType === 'line' ? 'circle' : undefined,
          symbolSize: chartType === 'line' ? 6 : undefined,
        },
      ],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut',
    };
  };

  return (
    <Card
      size="small"
      style={{
        height: height + 120,
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
      bodyStyle={{ padding: '16px' }}
      headStyle={{
        borderBottom: '1px solid #f0f0f0',
        minHeight: '48px',
        padding: '0 16px',
      }}
      extra={
        <Space>
          <Select
            value={selectedType}
            onChange={handleTypeChange}
            style={{ width: 80 }}
            size="small"
            placeholder="类型"
          >
            {resourceTypes.map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
          <Select
            value={`${selectedTimeRange.min}-${selectedTimeRange.max}`}
            onChange={handleTimeRangeChange}
            style={{ width: 100 }}
            size="small"
            placeholder="时间"
          >
            {timeRangeOptions.map((option) => (
              <Option
                key={`${option.min}-${option.max}`}
                value={`${option.min}-${option.max}`}
              >
                {option.label}
              </Option>
            ))}
          </Select>
          <Select
            value={selectedBrandId}
            onChange={handleBrandChange}
            style={{ width: 100 }}
            size="small"
            placeholder="品牌"
          >
            {phoneBrands.map((brand) => (
              <Option key={brand.value} value={brand.value}>
                {brand.name}
              </Option>
            ))}
          </Select>
        </Space>
      }
    >
      <div
        style={{
          fontSize: '14px',
          fontWeight: 500,
          color: '#262626',
          marginBottom: '12px',
          textAlign: 'center',
        }}
      >
        {title}
      </div>
      <Spin spinning={loading}>
        {data && data.x.length > 0 ? (
          <ReactECharts
            option={getOption()}
            style={{ height: `${height}px` }}
            opts={{
              renderer: 'canvas',
              locale: 'ZH',
            }}
          />
        ) : !loading ? (
          <div
            style={{
              height: `${height}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无数据"
              style={{ margin: 0 }}
            />
          </div>
        ) : null}
      </Spin>
    </Card>
  );
};

export default ResourceLoadChart;
