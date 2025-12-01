// 数据持久化工具函数
import { DataSource } from '../types';

// 数据源数据存储键名
const DATA_SOURCES_STORAGE_KEY = 'print_template_data_sources';

/**
 * 保存数据源列表到localStorage
 */
export const saveDataSourcesToStorage = (dataSources: DataSource[]): void => {
  try {
    localStorage.setItem(DATA_SOURCES_STORAGE_KEY, JSON.stringify(dataSources));
  } catch (error) {
    console.error('保存数据源到localStorage失败:', error);
  }
};

/**
 * 从localStorage加载数据源列表
 */
export const loadDataSourcesFromStorage = (): DataSource[] => {
  try {
    const stored = localStorage.getItem(DATA_SOURCES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('从localStorage加载数据源失败:', error);
  }
  return [];
};

/**
 * 初始化默认数据源（如果localStorage中没有数据）
 */
export const initializeDefaultDataSources = (): DataSource[] => {
  const existing = loadDataSourcesFromStorage();
  
  // 如果已有数据，直接返回
  if (existing.length > 0) {
    return existing;
  }
  
  // 初始化默认数据
  const defaultDataSources: DataSource[] = [
    {
      id: 1,
      name: '采购订单数据源',
      businessModule: '采购模块',
      description: '用于采购订单的打印模版',
      status: '启用',
      selectedObjects: [
        { id: 1, objectName: '采购申请单', alias: 'pr', isCollection: false },
        { id: 2, objectName: '采购订单', alias: 'po', isCollection: true }
      ],
      updateTime: '2025/12/01 10:30',
      updateUser: '张三'
    },
    {
      id: 2,
      name: '销售出库数据源',
      businessModule: '销售模块',
      description: '用于销售出库的打印模版',
      status: '启用',
      selectedObjects: [
        { id: 3, objectName: '销售订单', alias: 'so', isCollection: true },
        { id: 4, objectName: '库存信息', alias: 'stock', isCollection: false }
      ],
      updateTime: '2025/11/30 15:45',
      updateUser: '李四'
    },
    {
      id: 3,
      name: '库存盘点数据源',
      businessModule: '库存模块',
      description: '用于库存盘点单的打印模版',
      status: '禁用',
      selectedObjects: [
        { id: 5, objectName: '盘点单', alias: 'inv', isCollection: true },
        { id: 6, objectName: '物料信息', alias: 'material', isCollection: true }
      ],
      updateTime: '2025/11/29 09:20',
      updateUser: '王五'
    },
  ];
  
  // 保存到localStorage
  saveDataSourcesToStorage(defaultDataSources);
  return defaultDataSources;
};

/**
 * 清除所有数据源数据（主要用于测试）
 */
export const clearAllDataSources = (): void => {
  try {
    localStorage.removeItem(DATA_SOURCES_STORAGE_KEY);
  } catch (error) {
    console.error('清除数据源数据失败:', error);
  }
};

/**
 * 生成新的数据源ID
 */
export const generateNewDataSourceId = (existingDataSources: DataSource[]): number => {
  if (existingDataSources.length === 0) {
    return 1;
  }
  const maxId = Math.max(...existingDataSources.map(ds => ds.id));
  return maxId + 1;
};
