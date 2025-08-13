import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, Spin, Empty } from 'antd';
import { AnalyticsData } from '@/services/analytics';

interface AnalyticsChartProps {
  title: string;
  data?: AnalyticsData;
  loading?: boolean;
  height?: number;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  title,
  data,
  loading = false,
  height = 300,
}) => {
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
        top: '10%',
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
            color: '#1890ff',
            borderRadius: chartType === 'bar' ? [4, 4, 0, 0] : 0,
          },
          emphasis: {
            itemStyle: {
              color: '#40a9ff',
            },
          },
          lineStyle: chartType === 'line' ? {
            width: 3,
            color: '#1890ff',
          } : undefined,
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
    >
      <div style={{
        fontSize: '14px',
        fontWeight: 500,
        color: '#262626',
        marginBottom: '12px',
        textAlign: 'center',
      }}>
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
          <div style={{
            height: `${height}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
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

export default AnalyticsChart;
