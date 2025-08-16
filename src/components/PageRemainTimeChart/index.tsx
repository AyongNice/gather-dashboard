import { AnalyticsData, getUsersByPageRemainTime } from '@/services/analytics';
import { Card, Empty, Select, Spin } from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';

const { Option } = Select;

interface PageRemainTimeChartProps {
  title: string;
  project: string;
  height?: number;
}

// 时间区间选项
const durationOptions = [
  { label: '0-1秒', value: '0-1000' },
  { label: '1-2秒', value: '1000-2000' },
  { label: '2-3秒', value: '2000-3000' },
  { label: '3-5秒', value: '3000-5000' },
  { label: '5-10秒', value: '5000-10000' },
  { label: '10-30秒', value: '10000-30000' },
  { label: '30秒-1分钟', value: '30000-60000' },
  { label: '1-3分钟', value: '60000-180000' },
  { label: '3分钟以上', value: '180000-999999' },
];

const PageRemainTimeChart: React.FC<PageRemainTimeChartProps> = ({
  title,
  project,
  height = 300,
}) => {
  const [data, setData] = useState<AnalyticsData | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDuration, setSelectedDuration] = useState<string>('2000-3000');

  // 获取数据
  const fetchData = async (duration: string) => {
    if (!project) return;

    setLoading(true);
    try {
      const response = await getUsersByPageRemainTime(project, duration);
      if (response.code === 200) {
        setData(response.data);
      } else {
        console.error('获取页面停留时间数据失败:', response.message);
      }
    } catch (error) {
      console.error('获取页面停留时间数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 时间区间变化处理
  const handleDurationChange = (duration: string) => {
    setSelectedDuration(duration);
    fetchData(duration);
  };

  // 项目变化时重新获取数据
  useEffect(() => {
    if (project) {
      fetchData(selectedDuration);
    }
  }, [project]);

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
            color: '#52c41a',
            borderRadius: chartType === 'bar' ? [4, 4, 0, 0] : 0,
          },
          emphasis: {
            itemStyle: {
              color: '#73d13d',
            },
          },
          lineStyle:
            chartType === 'line'
              ? {
                  width: 3,
                  color: '#52c41a',
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
        height: height + 80,
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
        <Select
          value={selectedDuration}
          onChange={handleDurationChange}
          style={{ width: 120 }}
          size="small"
        >
          {durationOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
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

export default PageRemainTimeChart;
