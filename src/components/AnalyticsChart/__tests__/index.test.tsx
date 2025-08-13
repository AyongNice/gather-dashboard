import React from 'react';
import { render, screen } from '@testing-library/react';
import AnalyticsChart from '../index';
import { AnalyticsData } from '@/services/analytics';

// Mock ECharts
jest.mock('echarts-for-react', () => {
  return function MockReactECharts() {
    return <div data-testid="echarts-mock">ECharts Mock</div>;
  };
});

describe('AnalyticsChart', () => {
  const mockData: AnalyticsData = {
    x: ['A', 'B', 'C'],
    y: [10, 20, 30],
  };

  it('renders chart title correctly', () => {
    render(
      <AnalyticsChart
        title="测试图表"
        data={mockData}
        loading={false}
      />
    );

    expect(screen.getByText('测试图表')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <AnalyticsChart
        title="测试图表"
        data={mockData}
        loading={true}
      />
    );

    expect(document.querySelector('.ant-spin-spinning')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(
      <AnalyticsChart
        title="测试图表"
        loading={false}
      />
    );

    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });

  it('renders chart when data is provided', () => {
    render(
      <AnalyticsChart
        title="测试图表"
        data={mockData}
        loading={false}
      />
    );

    expect(screen.getByTestId('echarts-mock')).toBeInTheDocument();
  });

  it('applies custom height', () => {
    const customHeight = 400;
    render(
      <AnalyticsChart
        title="测试图表"
        data={mockData}
        loading={false}
        height={customHeight}
      />
    );

    const chartContainer = screen.getByTestId('echarts-mock').parentElement;
    expect(chartContainer).toHaveStyle(`height: ${customHeight}px`);
  });
});
