import PageRemainTimeChart from '@/components/PageRemainTimeChart';
import ResourceLoadChart from '@/components/ResourceLoadChart';
import { getProjects } from '@/services/analytics';
import { PageContainer } from '@ant-design/pro-components';
import { Col, message, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';

const { Option } = Select;

const AccessPage: React.FC = () => {
  const [projects, setProjects] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [projectsLoading, setProjectsLoading] = useState<boolean>(false);

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

  // 项目选择变化
  const handleProjectChange = (project: string) => {
    setSelectedProject(project);
  };

  // 初始化
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <PageContainer
      title="页面停留时间分析"
      extra={
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
      }
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <PageRemainTimeChart
            title="按页面停留时间统计人数"
            project={selectedProject}
            height={400}
          />
        </Col>
        <Col span={24}>
          <ResourceLoadChart
            title="按资源名称统计人数"
            project={selectedProject}
            height={400}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AccessPage;
