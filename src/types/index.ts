// 参数对象接口
export interface ParameterObject {
  id: number;
  group: string;
  code: string;
  name: string;
  project: string;
  source: string;
  fields: ParameterObjectField[];
}

// 字段接口
export interface ParameterObjectField {
  id: number;
  category: string;
  fieldType: string;
  code: string;
  name: string;
  length: number | null;
  decimalPlaces: number;
  isCollection: boolean;
  required: boolean;
}

// 已选择的对象接口
export interface SelectedObject {
  id: number;
  objectName: string;
  alias: string;
  isCollection: boolean;
}

// 数据源接口
export interface DataSource {
  id: number;
  name: string;
  businessModule: string;
  description: string;
  status: string;
  selectedObjects: SelectedObject[];
  updateTime: string;
  updateUser: string;
}

// 业务模块选项
export interface BusinessModule {
  value: string;
  label: string;
}

// 数据源分组筛选选项
export interface DataSourceGroupFilter {
  value: string;
  label: string;
}

// 数据源来源筛选选项
export interface DataSourceSourceFilter {
  value: string;
  label: string;
}

// 打印模版接口
export interface Template {
  id: string;
  name: string;
  module: string;
  dataSource: string;
  updateTime: string;
  lastUpdateUser: string;
  status: 'enabled' | 'disabled';
  content: string;
}