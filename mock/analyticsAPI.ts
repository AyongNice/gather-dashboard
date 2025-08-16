import { Request, Response } from 'express';
import * as http from 'http';

// 代理到真实接口的函数
const proxyToRealAPI = (url: string, params?: any): Promise<any> => {
  return new Promise((resolve) => {
    try {
      const queryString = params ? new URLSearchParams(params).toString() : '';
      const fullUrl = `${url}${queryString ? `?${queryString}` : ''}`;

      const options = {
        hostname: 'localhost',
        port: 8066,
        path: fullUrl,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            console.error('Error parsing JSON:', error);
            resolve({
              code: 200,
              message: '操作成功',
              data: { x: [], y: [] },
            });
          }
        });
      });

      req.on('error', (error) => {
        console.error('Error calling real API:', error);
        resolve({
          code: 200,
          message: '操作成功',
          data: { x: [], y: [] },
        });
      });

      req.setTimeout(5000, () => {
        req.destroy();
        resolve({
          code: 200,
          message: '操作成功',
          data: { x: [], y: [] },
        });
      });

      req.end();
    } catch (error) {
      console.error('Error in proxyToRealAPI:', error);
      resolve({
        code: 200,
        message: '操作成功',
        data: { x: [], y: [] },
      });
    }
  });
};

export default {
  // 获取项目列表
  'GET /api/analytics/users/projects': async (req: Request, res: Response) => {
    try {
      const data = await proxyToRealAPI('/api/analytics/users/projects');
      res.json(data);
    } catch (error) {
      res.json({
        code: 200,
        message: '操作成功',
        data: ['全埋点组件'], // 默认项目
      });
    }
  },

  // 按项目名统计人数
  'GET /api/analytics/users/by-project': async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { project } = req.query;
      const data = await proxyToRealAPI('/api/analytics/users/by-project', {
        project,
      });
      res.json(data);
    } catch (error) {
      res.json({
        code: 200,
        message: '操作成功',
        data: { x: [], y: [] },
      });
    }
  },

  // 按 business_data 统计人数
  'GET /api/analytics/users/by-business-data': async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { project } = req.query;
      const data = await proxyToRealAPI(
        '/api/analytics/users/by-business-data',
        { project },
      );
      res.json(data);
    } catch (error) {
      res.json({
        code: 200,
        message: '操作成功',
        data: { x: [], y: [] },
      });
    }
  },

  // 按 system_type 统计人数
  'GET /api/analytics/users/by-system-type': async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { project } = req.query;
      const data = await proxyToRealAPI('/api/analytics/users/by-system-type', {
        project,
      });
      res.json(data);
    } catch (error) {
      res.json({
        code: 200,
        message: '操作成功',
        data: { x: [], y: [] },
      });
    }
  },

  // 按 resolution 统计人数
  'GET /api/analytics/users/by-resolution': async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { project } = req.query;
      const data = await proxyToRealAPI('/api/analytics/users/by-resolution', {
        project,
      });
      res.json(data);
    } catch (error) {
      res.json({
        code: 200,
        message: '操作成功',
        data: { x: [], y: [] },
      });
    }
  },

  // 按 element_text 统计人数
  'GET /api/analytics/users/by-element-text': async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { project } = req.query;
      const data = await proxyToRealAPI(
        '/api/analytics/users/by-element-text',
        { project },
      );
      res.json(data);
    } catch (error) {
      res.json({
        code: 200,
        message: '操作成功',
        data: { x: [], y: [] },
      });
    }
  },

  // 按 phone_brand 统计人数
  'GET /api/analytics/users/by-phone-brand': async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { project } = req.query;
      const data = await proxyToRealAPI('/api/analytics/users/by-phone-brand', {
        project,
      });
      res.json(data);
    } catch (error) {
      res.json({
        code: 200,
        message: '操作成功',
        data: { x: [], y: [] },
      });
    }
  },

  // 按 phone_version 统计人数
  'GET /api/analytics/users/by-phone-version': async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { project } = req.query;
      const data = await proxyToRealAPI(
        '/api/analytics/users/by-phone-version',
        { project },
      );
      res.json(data);
    } catch (error) {
      res.json({
        code: 200,
        message: '操作成功',
        data: { x: [], y: [] },
      });
    }
  },

  // 按 24小时统计人数
  'GET /api/analytics/users/by-hour': async (req: Request, res: Response) => {
    try {
      const { project } = req.query;
      const data = await proxyToRealAPI('/api/analytics/users/by-hour', {
        project,
      });
      res.json(data);
    } catch (error) {
      res.json({
        code: 200,
        message: '操作成功',
        data: { x: [], y: [] },
      });
    }
  },

  // 按页面停留时间统计人数
  'GET /api/analytics/users/by-page-remain-time': async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { project, duration } = req.query;
      const data = await proxyToRealAPI(
        '/api/analytics/users/by-page-remain-time',
        {
          project,
          duration,
        },
      );
      res.json(data);
    } catch (error) {
      res.json({
        code: 200,
        message: '操作成功',
        data: { x: [], y: [] },
      });
    }
  },

  // 按资源名称统计人数
  'GET /api/analytics/users/resources/by-name': async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { project, type, min, max, brandId } = req.query;
      const data = await proxyToRealAPI(
        '/api/analytics/users/resources/by-name',
        {
          project,
          type,
          min,
          max,
          brandId,
        },
      );
      res.json(data);
    } catch (error) {
      res.json({
        code: 200,
        message: '操作成功',
        data: { x: [], y: [] },
      });
    }
  },

  // 获取资源类型列表
  'GET /api/analytics/users/resources/types': async (
    req: Request,
    res: Response,
  ) => {
    try {
      const data = await proxyToRealAPI('/api/analytics/users/resources/types');
      res.json(data);
    } catch (error) {
      res.json({
        code: 200,
        message: '操作成功',
        data: ['js', 'css', 'img', 'font', 'xhr', 'fetch'],
      });
    }
  },

  // 获取手机品牌列表
  'GET /api/analytics/users/resources/phone-brands': async (
    req: Request,
    res: Response,
  ) => {
    try {
      const data = await proxyToRealAPI(
        '/api/analytics/users/resources/phone-brands',
      );
      res.json(data);
    } catch (error) {
      res.json({
        code: 200,
        message: '操作成功',
        data: [
          { id: '2000000000123', name: 'iPhone' },
          { id: '2000000000124', name: '华为' },
          { id: '2000000000125', name: '小米' },
          { id: '2000000000126', name: 'OPPO' },
          { id: '2000000000127', name: 'vivo' },
          { id: '2000000000128', name: '三星' },
        ],
      });
    }
  },
};
