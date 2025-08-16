import { request } from '@umijs/max';

// 接口返回数据类型
export interface AnalyticsData {
  x: string[];
  y: number[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 获取项目列表
export async function getProjects(): Promise<ApiResponse<string[]>> {
  return request('/api/analytics/users/projects', {
    method: 'GET',
  });
}

// 1. 按项目名纬度统计人数
export async function getUsersByProject(
  project: string,
): Promise<ApiResponse<AnalyticsData>> {
  return request('/api/analytics/users/by-project', {
    method: 'GET',
    params: { project },
  });
}

// 2. 按 business_data 统计人数
export async function getUsersByBusinessData(
  project: string,
): Promise<ApiResponse<AnalyticsData>> {
  return request('/api/analytics/users/by-business-data', {
    method: 'GET',
    params: { project },
  });
}

// 3. 按 system_type 统计人数
export async function getUsersBySystemType(
  project: string,
): Promise<ApiResponse<AnalyticsData>> {
  return request('/api/analytics/users/by-system-type', {
    method: 'GET',
    params: { project },
  });
}

// 4. 按 resolution 统计人数
export async function getUsersByResolution(
  project: string,
): Promise<ApiResponse<AnalyticsData>> {
  return request('/api/analytics/users/by-resolution', {
    method: 'GET',
    params: { project },
  });
}

// 5. 按 element_text 统计人数
export async function getUsersByElementText(
  project: string,
): Promise<ApiResponse<AnalyticsData>> {
  return request('/api/analytics/users/by-element-text', {
    method: 'GET',
    params: { project },
  });
}

// 6. 按 phone_brand 统计人数
export async function getUsersByPhoneBrand(
  project: string,
): Promise<ApiResponse<AnalyticsData>> {
  return request('/api/analytics/users/by-phone-brand', {
    method: 'GET',
    params: { project },
  });
}

// 7. 按 phone_version 统计人数
export async function getUsersByPhoneVersion(
  project: string,
): Promise<ApiResponse<AnalyticsData>> {
  return request('/api/analytics/users/by-phone-version', {
    method: 'GET',
    params: { project },
  });
}

// 8. 按 24小时纬度统计人数
export async function getUsersByHour(
  project: string,
): Promise<ApiResponse<AnalyticsData>> {
  return request('/api/analytics/users/by-hour', {
    method: 'GET',
    params: { project },
  });
}

// 9. 按页面停留时间统计人数
export async function getUsersByPageRemainTime(
  project: string,
  duration: string,
): Promise<ApiResponse<AnalyticsData>> {
  return request('/api/analytics/users/by-page-remain-time', {
    method: 'GET',
    params: { project, duration },
  });
}

// 10. 按资源名称统计人数
export async function getUsersByResourceName(
  project: string,
  type: string,
  min: number,
  max: number,
  brandId: string,
): Promise<ApiResponse<AnalyticsData>> {
  return request('/api/analytics/users/resources/by-name', {
    method: 'GET',
    params: { project, type, min, max, brandId },
  });
}

// 获取资源类型列表
export async function getResourceTypes(): Promise<ApiResponse<string[]>> {
  return request('/api/analytics/users/resources/types', {
    method: 'GET',
  });
}

// 获取手机品牌列表
export async function getPhoneBrands(): Promise<
  ApiResponse<Array<{ id: string; name: string }>>
> {
  return request('/api/analytics/users/resources/phone-brands', {
    method: 'GET',
  });
}
