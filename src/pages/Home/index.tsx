import AnalyticsChart from '@/components/AnalyticsChart';
import {
  AnalyticsData,
  getProjects,
  getUsersByBusinessData,
  getUsersByElementText,
  getUsersByHour,
  getUsersByPhoneBrand,
  getUsersByPhoneVersion,
  getUsersByProject,
  getUsersByResolution,
  getUsersBySystemType,
} from '@/services/analytics';
import { PageContainer } from '@ant-design/pro-components';
import { Col, Row, Select, message } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.less';

const { Option } = Select;

interface ChartData {
  [key: string]: AnalyticsData | undefined;
}

interface LoadingState {
  [key: string]: boolean;
}

const HomePage: React.FC = () => {
  const [projects, setProjects] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [chartData, setChartData] = useState<ChartData>({});
  const [loading, setLoading] = useState<LoadingState>({});
  const [projectsLoading, setProjectsLoading] = useState<boolean>(false);

  // 图表配置
  const chartConfigs = [
    { key: 'project', title: '按项目名统计人数', api: getUsersByProject },
    {
      key: 'businessData',
      title: '按业务数据统计人数',
      api: getUsersByBusinessData,
    },
    {
      key: 'systemType',
      title: '按系统类型统计人数',
      api: getUsersBySystemType,
    },
    { key: 'resolution', title: '按分辨率统计人数', api: getUsersByResolution },
    {
      key: 'elementText',
      title: '按元素文本统计人数',
      api: getUsersByElementText,
    },
    {
      key: 'phoneBrand',
      title: '按手机品牌统计人数',
      api: getUsersByPhoneBrand,
    },
    {
      key: 'phoneVersion',
      title: '按手机版本统计人数',
      api: getUsersByPhoneVersion,
    },
    { key: 'hour', title: '按24小时统计人数', api: getUsersByHour },
  ];

  // 获取项目列表
  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const response = await getProjects();
      if (response.code === 200) {
        setProjects(response.data);
        if (response.data.length > 0) {
          setSelectedProject(response.data[0]);
        }
      } else {
        message.error('获取项目列表失败');
      }
    } catch (error) {
      message.error('获取项目列表失败');
      console.error('Error fetching projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  // 获取单个图表数据
  const fetchChartData = async (
    config: (typeof chartConfigs)[0],
    project: string,
  ) => {
    if (!project) return;

    setLoading((prev) => ({ ...prev, [config.key]: true }));
    try {
      const response = await config.api(project);
      if (response.code === 200) {
        setChartData((prev) => ({ ...prev, [config.key]: response.data }));
      } else {
        message.error(`获取${config.title}失败`);
      }
    } catch (error) {
      message.error(`获取${config.title}失败`);
      console.error(`Error fetching ${config.key} data:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [config.key]: false }));
    }
  };

  // 获取所有图表数据
  const fetchAllChartData = async (project: string) => {
    if (!project) return;

    const promises = chartConfigs.map((config) =>
      fetchChartData(config, project),
    );
    await Promise.all(promises);
  };

  // 项目选择变化
  const handleProjectChange = (project: string) => {
    setSelectedProject(project);
    setChartData({}); // 清空之前的数据
    fetchAllChartData(project);
  };

  // 初始化
  useEffect(() => {
    fetchProjects();
  }, []);

  // 当选中项目变化时，获取数据
  useEffect(() => {
    if (selectedProject) {
      fetchAllChartData(selectedProject);
    }
  }, [selectedProject]);

  return (
    <div className="analytics-dashboard">
      <PageContainer
        title="埋点数据统计"
        extra={
          <div className="project-selector">
            <Select
              style={{ width: 200 }}
              placeholder="选择项目"
              value={selectedProject}
              onChange={handleProjectChange}
              loading={projectsLoading}
              disabled={projectsLoading}
            >
              {projects.map((project) => (
                <Option key={project} value={project}>
                  {project}
                </Option>
              ))}
            </Select>
          </div>
        }
      >
        <div className="chart-container">
          <Row gutter={[16, 16]}>
            {chartConfigs.map((config) => (
              <Col xs={16} sm={12} lg={8} xl={6} key={config.key}>
                <AnalyticsChart
                  title={config.title}
                  data={chartData[config.key]}
                  loading={loading[config.key]}
                  height={280}
                />
              </Col>
            ))}
          </Row>
        </div>
      </PageContainer>
    </div>
  );
};

export default HomePage;
