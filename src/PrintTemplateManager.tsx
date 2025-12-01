import React, { useState, useEffect } from 'react';
import { ConfigProvider, Layout, Menu, Button, Table, Input, Select, Space, Tag, Modal, Form, message, Switch, Tabs } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import SimpleMonacoEditor from './components/SimpleMonacoEditor';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate, useLocation, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { 
  FileTextOutlined, 
  DatabaseOutlined, 
  BarChartOutlined, 
  HistoryOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CodeOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import type { DataSource, ParameterObject, SelectedObject, BusinessModule, Template } from './types';
import { initializeDefaultDataSources, saveDataSourcesToStorage, generateNewDataSourceId } from './utils/storage';
import { initializeDefaultTemplates, saveTemplatesToStorage, generateNewTemplateId } from './utils/templateStorage';
import { initializeDefaultReportTemplates, saveReportTemplatesToStorage, generateNewReportTemplateId } from './utils/templateStorage';

const { Header, Sider, Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;

// 模拟数据源
const mockDataSources: DataSource[] = [
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

// 模拟参数对象数据
const mockParameterObjects: ParameterObject[] = [
  {
    id: 1,
    group: "采购管理", 
    code: "PurchaseRequisitionDTO",
    name: "采购申请单",
    project: "ERP标准产品", 
    source: "erp_system",
    fields: [
      { id: 1, category: "基础类型", fieldType: "字符串", code: "requisitionNo", name: "申请单号", length: 50, decimalPlaces: 0, isCollection: false, required: true },
      { id: 2, category: "基础类型", fieldType: "长整型", code: "quantity", name: "数量", length: null, decimalPlaces: 0, isCollection: false, required: true },
      { id: 3, category: "对象类型", fieldType: "对象", code: "supplier", name: "供应商", length: null, decimalPlaces: 0, isCollection: false, required: false },
      { id: 4, category: "基础类型", fieldType: "日期", code: "requisitionDate", name: "申请日期", length: null, decimalPlaces: 0, isCollection: false, required: true }
    ]
  },
  {
    id: 2,
    group: "采购管理", 
    code: "PurchaseOrderDTO",
    name: "采购订单",
    project: "ERP标准产品", 
    source: "erp_system",
    fields: [
      { id: 5, category: "基础类型", fieldType: "字符串", code: "orderNo", name: "订单号", length: 50, decimalPlaces: 0, isCollection: false, required: true },
      { id: 6, category: "对象类型", fieldType: "对象", code: "supplier", name: "供应商", length: null, decimalPlaces: 0, isCollection: false, required: true },
      { id: 7, category: "集合类型", fieldType: "集合", code: "items", name: "订单明细", length: null, decimalPlaces: 0, isCollection: true, required: true }
    ]
  },
  {
    id: 3,
    group: "销售管理", 
    code: "SalesOrderDTO",
    name: "销售订单",
    project: "ERP标准产品", 
    source: "erp_system",
    fields: [
      { id: 8, category: "基础类型", fieldType: "字符串", code: "orderNo", name: "订单号", length: 50, decimalPlaces: 0, isCollection: false, required: true },
      { id: 9, category: "对象类型", fieldType: "对象", code: "customer", name: "客户", length: null, decimalPlaces: 0, isCollection: false, required: true },
      { id: 10, category: "集合类型", fieldType: "集合", code: "items", name: "订单明细", length: null, decimalPlaces: 0, isCollection: true, required: true }
    ]
  },
  {
    id: 4,
    group: "库存管理", 
    code: "InventoryInfoDTO",
    name: "库存信息",
    project: "ERP标准产品", 
    source: "erp_system",
    fields: [
      { id: 11, category: "基础类型", fieldType: "字符串", code: "materialCode", name: "物料编码", length: 50, decimalPlaces: 0, isCollection: false, required: true },
      { id: 12, category: "基础类型", fieldType: "长整型", code: "quantity", name: "库存数量", length: null, decimalPlaces: 0, isCollection: false, required: true },
      { id: 13, category: "基础类型", fieldType: "小数", code: "unitPrice", name: "单价", length: 10, decimalPlaces: 2, isCollection: false, required: true }
    ]
  },
  {
    id: 5,
    group: "库存管理", 
    code: "InventoryCountDTO",
    name: "盘点单",
    project: "ERP标准产品", 
    source: "erp_system",
    fields: [
      { id: 14, category: "基础类型", fieldType: "字符串", code: "countNo", name: "盘点单号", length: 50, decimalPlaces: 0, isCollection: false, required: true },
      { id: 15, category: "基础类型", fieldType: "日期", code: "countDate", name: "盘点日期", length: null, decimalPlaces: 0, isCollection: false, required: true },
      { id: 16, category: "集合类型", fieldType: "集合", code: "details", name: "盘点明细", length: null, decimalPlaces: 0, isCollection: true, required: true }
    ]
  },
  {
    id: 6,
    group: "采购管理", 
    code: "MaterialInfoDTO",
    name: "物料信息",
    project: "ERP标准产品", 
    source: "erp_system",
    fields: [
      { id: 17, category: "基础类型", fieldType: "字符串", code: "materialCode", name: "物料编码", length: 50, decimalPlaces: 0, isCollection: false, required: true },
      { id: 18, category: "基础类型", fieldType: "字符串", code: "materialName", name: "物料名称", length: 200, decimalPlaces: 0, isCollection: false, required: true },
      { id: 19, category: "基础类型", fieldType: "字符串", code: "specification", name: "规格型号", length: 200, decimalPlaces: 0, isCollection: false, required: false }
    ]
  }
];

// 菜单项配置
const menuItems = [
  {
    key: 'business',
    icon: <FileTextOutlined />,
    label: '业务打印模版',
    children: [
      {
        key: 'business-manage',
        label: '打印模版管理',
      },
      {
        key: 'business-datasource',
        label: '数据源管理',
      },
    ],
  },
  {
    key: 'report',
    icon: <BarChartOutlined />,
    label: '报表打印模版',
    children: [
      {
        key: 'report-manage',
        label: '打印模版管理',
      },
      {
        key: 'report-datasource',
        label: '数据源管理',
      },
    ],
  },
  {
    key: 'logs',
    icon: <HistoryOutlined />,
    label: '模版调用日志',
  },
];

// 业务模块选项
const businessModules: BusinessModule[] = [
  { value: '采购模块', label: '采购模块' },
  { value: '销售模块', label: '销售模块' },
  { value: '仓储模块', label: '仓储模块' },
  { value: '财务模块', label: '财务模块' },
  { value: '人力资源模块', label: '人力资源模块' }
];

// 分组筛选选项
const groupFilters = [
  { value: 'all', label: '全部分组' },
  { value: '采购管理', label: '采购管理' },
  { value: '销售管理', label: '销售管理' },
  { value: '库存管理', label: '库存管理' },
  { value: '财务管理', label: '财务管理' },
  { value: '人力资源', label: '人力资源' }
];

// 来源筛选选项
const sourceFilters = [
  { value: 'all', label: '全部来源' },
  { value: 'ERP标准产品', label: 'ERP标准产品' },
  { value: 'CRM系统', label: 'CRM系统' },
  { value: '财务系统', label: '财务系统' },
  { value: '第三方集成', label: '第三方集成' }
];

// 主应用组件
const PrintTemplateManager: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState('business-manage');
  const [dataSources, setDataSources] = useState<DataSource[]>(initializeDefaultDataSources);
  const [templates, setTemplates] = useState<Template[]>(initializeDefaultTemplates);
  const [reportTemplates, setReportTemplates] = useState<Template[]>(initializeDefaultReportTemplates);
  
  // 数据源状态更新时同步保存到localStorage
  const updateDataSources = (updater: DataSource[] | ((prev: DataSource[]) => DataSource[])) => {
    setDataSources(prev => {
      const newData = typeof updater === 'function' ? updater(prev) : updater;
      // 同步保存到localStorage
      saveDataSourcesToStorage(newData);
      return newData;
    });
  };
  
  // 业务模版状态更新时同步保存到localStorage
  const updateTemplates = (updater: Template[] | ((prev: Template[]) => Template[])) => {
    setTemplates(prev => {
      const newData = typeof updater === 'function' ? updater(prev) : updater;
      // 同步保存到localStorage
      saveTemplatesToStorage(newData);
      return newData;
    });
  };
  
  // 报表模版状态更新时同步保存到localStorage
  const updateReportTemplates = (updater: Template[] | ((prev: Template[]) => Template[])) => {
    setReportTemplates(prev => {
      const newData = typeof updater === 'function' ? updater(prev) : updater;
      // 同步保存到localStorage
      saveReportTemplatesToStorage(newData);
      return newData;
    });
  };
  
  // 数据源列表页面状态
  const [searchText, setSearchText] = useState('');
  const [selectedBusinessModule, setSelectedBusinessModule] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // 数据源编辑页面状态
  const [selectedObjects, setSelectedObjects] = useState<SelectedObject[]>([]);
  const [selectedParameterObject, setSelectedParameterObject] = useState<ParameterObject | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editingDataSource, setEditingDataSource] = useState<DataSource | null>(null);

  // 参数对象选择状态
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [searchParameter, setSearchParameter] = useState('');

  // 设置活跃菜单项
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/data-source-management/create') || path.includes('/data-source-management/edit/')) {
      setActiveKey('business-datasource');
    } else if (path.includes('/data-source-management')) {
      setActiveKey('business-datasource');
    } else if (path.includes('/business-manage')) {
      setActiveKey('business-manage');
    }
  }, [location.pathname]);

  // 处理菜单点击
  const handleMenuClick = (key: string) => {
    console.log('Menu clicked:', key);
    setActiveKey(key);
    switch (key) {
      case 'business-manage':
        navigate('/business-manage');
        break;
      case 'business-datasource':
        navigate('/data-source-management');
        break;
      case 'report-manage':
        navigate('/report-manage');
        break;
      case 'report-datasource':
        navigate('/report-datasource');
        break;
      case 'logs':
        navigate('/logs');
        break;
    }
  };

  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            background: '#001529',
          }}
        >
          <div
            style={{
              height: 32,
              margin: 16,
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: collapsed ? '12px' : '14px',
              fontWeight: 'bold',
            }}
          >
            {!collapsed ? '打印模版管理' : 'P'}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[activeKey]}
            items={menuItems}
            onClick={({ key }) => handleMenuClick(key)}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: '0 16px',
              background: '#fff',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {collapsed ? <MenuUnfoldOutlined onClick={() => setCollapsed(!collapsed)} /> : <MenuFoldOutlined onClick={() => setCollapsed(!collapsed)} />}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span>系统管理员</span>
            </div>
          </Header>
          <Content
            style={{
              margin: '16px',
              background: '#fff',
              borderRadius: '8px',
              padding: '24px',
              minHeight: 'calc(100vh - 112px)',
            }}
          >
            <Routes>
              <Route path="/business-manage" element={
                <BusinessTemplateManage 
                  templates={templates}
                  setTemplates={updateTemplates}
                />
              } />
              <Route path="/data-source-management" element={
                <DataSourceManagement 
                  dataSources={dataSources}
                  setDataSources={updateDataSources}
                  searchText={searchText}
                  setSearchText={setSearchText}
                  selectedBusinessModule={selectedBusinessModule}
                  setSelectedBusinessModule={setSelectedBusinessModule}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                />
              } />
              <Route path="/data-source-management/create" element={
                <DataSourceEdit 
                  dataSources={dataSources}
                  setDataSources={updateDataSources}
                  editingDataSource={null}
                  onBack={() => navigate('/data-source-management')}
                />
              } />
              <Route path="/data-source-management/edit/:id" element={
                <DataSourceEdit 
                  dataSources={dataSources}
                  setDataSources={updateDataSources}
                  editingDataSource={null}
                  onBack={() => navigate('/data-source-management')}
                />
              } />
              <Route path="/report-manage" element={
                <ReportTemplateManage 
                  templates={reportTemplates}
                  setTemplates={updateReportTemplates}
                />
              } />
              <Route path="/report-datasource" element={
                <DataSourceManagement 
                  dataSources={dataSources}
                  setDataSources={updateDataSources}
                  searchText={searchText}
                  setSearchText={setSearchText}
                  selectedBusinessModule={selectedBusinessModule}
                  setSelectedBusinessModule={setSelectedBusinessModule}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                />
              } />
              <Route path="/logs" element={<LogsPage />} />
              <Route path="/" element={<Navigate to="/business-manage" replace />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

// 业务模版管理页面
const BusinessTemplateManage: React.FC<{
  templates: Template[];
  setTemplates: (updater: Template[] | ((prev: Template[]) => Template[])) => void;
}> = ({ templates, setTemplates }) => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [templateContent, setTemplateContent] = useState('');
  const [activeEditorTab, setActiveEditorTab] = useState('template');
  const [form] = Form.useForm();

  const filteredTemplates = templates.filter(template =>
    template.name.includes(searchText) || 
    template.module.includes(searchText)
  );

  const handleAdd = () => {
    setEditingTemplate(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    form.setFieldsValue({
      name: template.name,
      module: template.module,
      dataSource: template.dataSource
    });
    setIsModalVisible(true);
  };

  const handleDelete = (template: Template) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除模版"${template.name}"吗？`,
      onOk: () => {
        setTemplates(prev => prev.filter(item => item.id !== template.id));
        message.success('删除成功');
      },
    });
  };

  const handleEditorOpen = (template: Template) => {
    setEditingTemplate(template);
    setTemplateContent(template.content || '');
    setIsEditorVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const now = new Date().toLocaleString('zh-CN');
      
      if (editingTemplate) {
        // 更新现有模版
        setTemplates(prev => prev.map(template => 
          template.id === editingTemplate.id 
            ? { ...template, updateTime: now, lastUpdateUser: '系统管理员', ...values }
            : template
        ));
        message.success('更新成功');
      } else {
        // 创建新模版
        const newTemplate: Template = {
          id: generateNewTemplateId(templates),
          name: values.name,
          module: values.module,
          dataSource: values.dataSource,
          updateTime: now,
          lastUpdateUser: '系统管理员',
          status: 'enabled',
          content: '<div>新模版内容</div>',
        };
        setTemplates(prev => [...prev, newTemplate]);
        message.success('创建成功');
      }
      setIsModalVisible(false);
    });
  };

  const handleSaveContent = () => {
    if (editingTemplate) {
      setTemplates(prev => prev.map(template => 
        template.id === editingTemplate.id 
          ? { ...template, content: templateContent }
          : template
      ));
      message.success('模版内容保存成功');
      setIsEditorVisible(false);
    }
  };

  const renderPreview = () => {
    const processedContent = templateContent
      .replace(/\$\{companyName\}/g, '示例公司')
      .replace(/\$\{templateName\}/g, editingTemplate?.name || '模版预览')
      .replace(/\$\{date\}/g, new Date().toLocaleDateString('zh-CN'))
      .replace(/\$\{generateTime\}/g, new Date().toLocaleString('zh-CN'))
      .replace(/\$\{footerInfo\}/g, 'xxx信息科技公司版权所有 © 2025');

    return (
      <div 
        dangerouslySetInnerHTML={{ __html: processedContent }}
        style={{ 
          padding: '20px', 
          backgroundColor: '#fff',
          minHeight: '500px',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          overflow: 'auto'
        }}
      />
    );
  };

  const columns = [
    {
      title: '模版名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '业务模块',
      dataIndex: 'module',
      key: 'module',
    },
    {
      title: '数据源',
      dataIndex: 'dataSource',
      key: 'dataSource',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '最后更新人',
      dataIndex: 'lastUpdateUser',
      key: 'lastUpdateUser',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'enabled' ? 'green' : 'red'}>
          {status === 'enabled' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: Template) => (
        <Space>
          <Button 
            type="link" 
            icon={<CodeOutlined />} 
            onClick={() => handleEditorOpen(record)}
          >
            编辑模版
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Search
            placeholder="搜索模版名称"
            allowClear
            style={{ width: 200 }}
            onSearch={setSearchText}
          />
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          新增
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredTemplates}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      {/* 模版基本信息编辑对话框 */}
      <Modal
        title={editingTemplate ? '编辑模版' : '新增模版'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="模版名称" name="name" rules={[{ required: true, message: '请输入模版名称' }]}>
            <Input placeholder="请输入模版名称" />
          </Form.Item>
          <Form.Item label="业务模块" name="module" rules={[{ required: true, message: '请选择业务模块' }]}>
            <Select 
              placeholder="请选择业务模块"
              options={[
                { value: '采购模块', label: '采购模块' },
                { value: '销售模块', label: '销售模块' },
                { value: '库存模块', label: '库存模块' },
                { value: '财务模块', label: '财务模块' }
              ]}
            />
          </Form.Item>
          <Form.Item label="数据源" name="dataSource" rules={[{ required: true, message: '请选择数据源' }]}>
            <Select 
              placeholder="请选择数据源"
              options={[
                { value: '采购订单+物料信息', label: '采购订单+物料信息' },
                { value: '销售订单+库存信息', label: '销售订单+库存信息' },
                { value: '库存数据+盘点信息', label: '库存数据+盘点信息' },
                { value: '客户信息+交易记录', label: '客户信息+交易记录' }
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Monaco Editor 模版编辑对话框 */}
      <Modal
        title={`编辑模版: ${editingTemplate?.name || ''}`}
        open={isEditorVisible}
        onOk={handleSaveContent}
        onCancel={() => setIsEditorVisible(false)}
        width={1200}
        footer={[
          <Button key="cancel" onClick={() => setIsEditorVisible(false)}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveContent}>
            保存
          </Button>
        ]}
      >
        <div style={{ height: '600px' }}>
          <Tabs 
            activeKey={activeEditorTab} 
            onChange={setActiveEditorTab}
            style={{ height: '100%' }}
          >
            <TabPane tab="模版编辑" key="template">
              <SimpleMonacoEditor
                height="550px"
                language="html"
                theme="vs-light"
                value={templateContent}
                onChange={(value) => setTemplateContent(value || '')}
                loading={
                  <div style={{ 
                    height: '550px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px'
                  }}>
                    <div>正在加载编辑器...</div>
                  </div>
                }
                error={<div style={{ 
                  height: '550px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#fff2f0',
                  border: '1px solid #ffccc7',
                  borderRadius: '4px',
                  color: '#cf1322'
                }}>
                  编辑器加载失败，请刷新页面重试
                </div>}
              />
            </TabPane>
            <TabPane tab="预览" key="preview">
              <div style={{ height: '550px', overflow: 'auto' }}>
                {renderPreview()}
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    </div>
  );
};

// 数据源管理列表页组件
interface DataSourceManagementProps {
  dataSources: DataSource[];
  setDataSources: (updater: DataSource[] | ((prev: DataSource[]) => DataSource[])) => void;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  selectedBusinessModule: string;
  setSelectedBusinessModule: React.Dispatch<React.SetStateAction<string>>;
  selectedStatus: string;
  setSelectedStatus: React.Dispatch<React.SetStateAction<string>>;
}

const DataSourceManagement: React.FC<DataSourceManagementProps> = ({
  dataSources,
  setDataSources,
  searchText,
  setSearchText,
  selectedBusinessModule,
  setSelectedBusinessModule,
  selectedStatus,
  setSelectedStatus
}) => {
  const navigate = useNavigate();

  // 筛选数据源
  const filteredDataSources = dataSources.filter(source => {
    const nameMatch = source.name.toLowerCase().includes(searchText.toLowerCase());
    const moduleMatch = selectedBusinessModule === 'all' || source.businessModule === selectedBusinessModule;
    const statusMatch = selectedStatus === 'all' || source.status === selectedStatus;
    return nameMatch && moduleMatch && statusMatch;
  });

  // 表格列配置
  const columns = [
    {
      title: '数据源名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: DataSource, b: DataSource) => a.name.localeCompare(b.name),
    },
    {
      title: '业务模块',
      dataIndex: 'businessModule',
      key: 'businessModule',
      filters: businessModules.filter(m => m.value !== 'all').map(m => ({ text: m.label, value: m.value })),
      onFilter: (value: any, record: DataSource) => record.businessModule === value,
    },
    {
      title: '数据源',
      key: 'dataSource',
      render: (_: any, record: DataSource) => {
        const objectsText = record.selectedObjects.map(obj => obj.objectName).join('+');
        return <span>{objectsText}</span>;
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      sorter: (a: DataSource, b: DataSource) => new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime(),
    },
    {
      title: '最后更新人',
      dataIndex: 'updateUser',
      key: 'updateUser',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: DataSource) => (
        <Switch
          checked={status === '启用'}
          onChange={(checked) => {
            const newStatus = checked ? '启用' : '禁用';
            setDataSources(prev => prev.map(source => 
              source.id === record.id ? { ...source, status: newStatus } : source
            ));
          }}
        />
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: DataSource) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => console.log('查看详情', record.id)}
          >
            查看详情
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => navigate(`/data-source-management/edit/${record.id}`)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: `确定要删除数据源"${record.name}"吗？`,
                onOk: () => {
                  setDataSources(prev => prev.filter(source => source.id !== record.id));
                  message.success('删除成功');
                },
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Search
            placeholder="搜索数据源名称"
            allowClear
            style={{ width: 200 }}
            onSearch={setSearchText}
          />
          <Select
            value={selectedBusinessModule}
            onChange={setSelectedBusinessModule}
            style={{ width: 120 }}
            options={[
              { value: 'all', label: '全部模块' },
              ...businessModules.map(module => ({ value: module.value, label: module.label }))
            ]}
          />
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: 100 }}
            options={[
              { value: 'all', label: '全部状态' },
              { value: '启用', label: '启用' },
              { value: '禁用', label: '禁用' }
            ]}
          />
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => navigate('/data-source-management/create')}
        >
          新增
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredDataSources}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />
    </div>
  );
};

// 数据源编辑页面组件
interface DataSourceEditProps {
  dataSources: DataSource[];
  setDataSources: (updater: DataSource[] | ((prev: DataSource[]) => DataSource[])) => void;
  editingDataSource: DataSource | null;
  onBack: () => void;
}

const DataSourceEdit: React.FC<DataSourceEditProps> = ({
  dataSources,
  setDataSources,
  editingDataSource,
  onBack
}) => {
  const navigate = useNavigate();
  const params = useParams();
  const editId = params.id;
  const [form] = Form.useForm();
  const [currentEditingDataSource, setCurrentEditingDataSource] = useState<DataSource | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<SelectedObject[]>(
    currentEditingDataSource ? currentEditingDataSource.selectedObjects : []
  );
  const [selectedParameterObject, setSelectedParameterObject] = useState<ParameterObject | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [searchParameter, setSearchParameter] = useState('');
  const [activeObjectDetailTab, setActiveObjectDetailTab] = useState('basic');

  // 初始化编辑模式数据
  useEffect(() => {
    if (editId && editId !== 'create') {
      const targetDataSource = dataSources.find(ds => ds.id === parseInt(editId));
      if (targetDataSource) {
        setCurrentEditingDataSource(targetDataSource);
        // 设置表单初始值
        form.setFieldsValue({
          name: targetDataSource.name,
          businessModule: targetDataSource.businessModule,
          description: targetDataSource.description,
          status: targetDataSource.status === '启用'
        });
      }
    } else {
      // 新建模式，清空表单
      form.resetFields();
      setCurrentEditingDataSource(null);
    }
  }, [editId, dataSources, form]);

  // 同步selectedObjects状态
  useEffect(() => {
    if (currentEditingDataSource) {
      setSelectedObjects(currentEditingDataSource.selectedObjects);
    } else {
      setSelectedObjects([]);
    }
  }, [currentEditingDataSource]);

  // 筛选参数对象
  const filteredParameterObjects = mockParameterObjects.filter(obj => {
    const groupMatch = selectedGroup === 'all' || obj.group === selectedGroup;
    const sourceMatch = selectedSource === 'all' || obj.project === selectedSource;
    const searchMatch = !searchParameter || 
      obj.code.toLowerCase().includes(searchParameter.toLowerCase()) ||
      obj.name.toLowerCase().includes(searchParameter.toLowerCase());
    return groupMatch && sourceMatch && searchMatch;
  });

  // 处理对象详情点击
  const handleObjectDetailClick = (obj: ParameterObject) => {
    setSelectedParameterObject(obj);
  };

  // 处理参数对象选择
  const handleParameterObjectSelect = (obj: ParameterObject) => {
    const existingObject = selectedObjects.find(o => o.objectName === obj.name);
    if (existingObject) {
      message.warning('该参数对象已经选择');
      return;
    }
    const newObject: SelectedObject = {
      id: obj.id,
      objectName: obj.name,
      alias: obj.code.charAt(0).toLowerCase(),
      isCollection: false
    };
    setSelectedObjects(prev => [...prev, newObject]);
  };

  // 处理已选对象删除
  const handleSelectedObjectRemove = (objectId: number) => {
    setSelectedObjects(prev => prev.filter(o => o.id !== objectId));
  };

  // 处理对象别名修改
  const handleAliasChange = (objectId: number, newAlias: string) => {
    setSelectedObjects(prev => prev.map(o => 
      o.id === objectId ? { ...o, alias: newAlias } : o
    ));
  };

  // 处理拖拽结束
  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    try {
      const items = Array.from(selectedObjects);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setSelectedObjects(items);
    } catch (error) {
      console.error('拖拽排序失败:', error);
    }
  };

  // 处理集合开关
  const handleCollectionChange = (objectId: number, isCollection: boolean) => {
    setSelectedObjects(prev => prev.map(o => 
      o.id === objectId ? { ...o, isCollection } : o
    ));
  };

  // 处理保存
  const handleSave = () => {
    form.validateFields().then(values => {
      const now = new Date().toLocaleString('zh-CN');
      
      if (currentEditingDataSource) {
        // 更新数据源
        const updatedDataSource: DataSource = {
          ...currentEditingDataSource,
          name: values.name,
          businessModule: values.businessModule,
          description: values.description || '',
          status: values.status ? '启用' : '禁用',
          selectedObjects,
          updateTime: now,
          updateUser: '系统管理员'
        };
        setDataSources(prev => prev.map(source => 
          source.id === currentEditingDataSource.id ? updatedDataSource : source
        ));
        message.success('数据源更新成功');
      } else {
        // 创建新数据源
        const newDataSource: DataSource = {
          id: generateNewDataSourceId(dataSources),
          name: values.name,
          businessModule: values.businessModule,
          description: values.description || '',
          status: values.status ? '启用' : '禁用',
          selectedObjects,
          updateTime: now,
          updateUser: '系统管理员'
        };
        setDataSources(prev => [...prev, newDataSource]);
        message.success('数据源创建成功');
      }
      
      onBack();
    });
  };

  return (
    <div>
      {/* 顶部导航和操作 */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Button icon={<ArrowLeftOutlined />} onClick={onBack} style={{ marginRight: '16px' }}>
            返回
          </Button>
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {currentEditingDataSource ? '编辑数据源' : '创建数据源'}
          </span>
        </div>
        <div>
          <Button onClick={onBack} style={{ marginRight: '8px' }}>取消</Button>
          <Button type="primary" onClick={handleSave}>保存</Button>
        </div>
      </div>

      {/* 模版基础信息区 */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px', fontWeight: 'bold' }}>数据源基础信息</div>
        <Form form={form} layout="vertical" initialValues={{
          name: editingDataSource?.name || '',
          businessModule: editingDataSource?.businessModule || '采购模块',
          description: editingDataSource?.description || '',
          status: editingDataSource?.status === '启用'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <Form.Item
              label="数据源名称"
              name="name"
              rules={[{ required: true, message: '请输入数据源名称' }]}
            >
              <Input placeholder="请输入数据源名称" />
            </Form.Item>
            <Form.Item
              label="业务模块"
              name="businessModule"
              rules={[{ required: true, message: '请选择业务模块' }]}
            >
              <Select 
                placeholder="请选择业务模块"
                options={businessModules.map(module => ({ value: module.value, label: module.label }))}
              />
            </Form.Item>
            <Form.Item
              label="描述"
              name="description"
            >
              <Input.TextArea placeholder="请输入描述信息" rows={2} />
            </Form.Item>
            <Form.Item
              label="状态"
              name="status"
              valuePropName="checked"
            >
              <Switch checkedChildren="启用" unCheckedChildren="禁用" />
            </Form.Item>
          </div>
        </Form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* 区域1：参数对象选择区 */}
        <div>
          <div style={{ marginBottom: '16px', fontWeight: 'bold' }}>参数对象列表</div>
          
          {/* 筛选器 */}
          <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Select
              value={selectedGroup}
              onChange={setSelectedGroup}
              style={{ width: 120 }}
              options={groupFilters.map(filter => ({ value: filter.value, label: filter.label }))}
            />
            <Select
              value={selectedSource}
              onChange={setSelectedSource}
              style={{ width: 140 }}
              options={sourceFilters.map(filter => ({ value: filter.value, label: filter.label }))}
            />
            <Input.Search
              placeholder="请输入编码或名称"
              style={{ width: 200 }}
              value={searchParameter}
              onChange={(e) => setSearchParameter(e.target.value)}
              onSearch={() => {}}
            />
            <Button icon={<SearchOutlined />}>Q</Button>
            <Button icon={<ReloadOutlined />}>C</Button>
          </div>

          {/* 参数对象列表表格 */}
          <Table
            size="small"
            pagination={false}
            dataSource={filteredParameterObjects}
            rowKey="id"
            columns={[
              {
                title: '序号',
                width: 60,
                render: (_, __, index) => index + 1,
              },
              {
                title: '所属分组',
                dataIndex: 'group',
                width: 100,
              },
              {
                title: '编码',
                dataIndex: 'code',
                width: 140,
              },
              {
                title: '名称',
                dataIndex: 'name',
                width: 120,
              },
              {
                title: '所属项目',
                dataIndex: 'project',
                width: 100,
              },
              {
                title: '来源',
                dataIndex: 'source',
                width: 80,
              },
              {
                title: '操作',
                width: 80,
                render: (_, record: ParameterObject) => (
                  <Space>
                    <Button
                      size="small"
                      onClick={() => handleObjectDetailClick(record)}
                    >
                      详情
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => handleParameterObjectSelect(record)}
                    >
                      选择
                    </Button>
                  </Space>
                ),
              },
            ]}
          />
        </div>

        {/* 区域2：已选参数对象配置区 */}
        <div>
          <div style={{ marginBottom: '16px', fontWeight: 'bold' }}>
            已选参数对象
            <span style={{ marginLeft: '8px', fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
              (支持拖拽排序)
            </span>
          </div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="selected-objects">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ border: '1px solid #d9d9d9', borderRadius: '4px', padding: '8px' }}
                >
                  {selectedObjects.map((record, index) => (
                    <Draggable
                      key={record.id}
                      draggableId={record.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="draggable-item"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr 1fr',
                            gap: '16px',
                            alignItems: 'center',
                            padding: '8px',
                            marginBottom: '4px',
                            backgroundColor: snapshot.isDragging ? '#f0f0f0' : '#fafafa',
                            border: '1px solid #d9d9d9',
                            borderRadius: '4px',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div
                              {...provided.dragHandleProps}
                              style={{ 
                                width: '16px', 
                                height: '16px', 
                                backgroundColor: '#ccc', 
                                borderRadius: '2px', 
                                marginRight: '8px',
                                cursor: 'grab'
                              }}
                            />
                            <span style={{ fontWeight: 'bold' }}>{record.objectName}</span>
                          </div>
                          <Input
                            value={record.alias}
                            onChange={(e) => handleAliasChange(record.id, e.target.value)}
                            placeholder="输入别名"
                          />
                          <Switch
                            checkedChildren="是"
                            unCheckedChildren="否"
                            checked={record.isCollection}
                            onChange={(checked) => handleCollectionChange(record.id, checked)}
                          />
                          <Button
                            type="link"
                            danger
                            onClick={() => handleSelectedObjectRemove(record.id)}
                          >
                            移除
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {/* 区域3：对象详情编辑器 */}
      {selectedParameterObject && (
        <div style={{ marginTop: '24px' }}>
          <div style={{ marginBottom: '16px', fontWeight: 'bold' }}>
            {selectedParameterObject.code} 编辑参数对象 - {selectedParameterObject.code}/{selectedParameterObject.name}
          </div>
          <div style={{ border: '1px solid #d9d9d9', borderRadius: '6px' }}>
            <div style={{ borderBottom: '1px solid #d9d9d9', padding: '8px 16px' }}>
              <Space>
                <Button 
                  type={activeObjectDetailTab === 'basic' ? 'primary' : 'default'}
                  onClick={() => setActiveObjectDetailTab('basic')}
                >
                  基本信息
                </Button>
                <Button 
                  type={activeObjectDetailTab === 'fields' ? 'primary' : 'default'}
                  onClick={() => setActiveObjectDetailTab('fields')}
                >
                  业务字段
                </Button>
              </Space>
            </div>
            <div style={{ padding: '16px' }}>
              {activeObjectDetailTab === 'basic' ? (
                <div>
                  <p><strong>对象描述：</strong>{selectedParameterObject.name}</p>
                  <p><strong>版本：</strong>1.0</p>
                  <p><strong>创建时间：</strong>2024-01-01 10:00:00</p>
                  <p><strong>所属分组：</strong>{selectedParameterObject.group}</p>
                  <p><strong>编码：</strong>{selectedParameterObject.code}</p>
                  <p><strong>名称：</strong>{selectedParameterObject.name}</p>
                  <p><strong>所属项目：</strong>{selectedParameterObject.project}</p>
                  <p><strong>来源：</strong>{selectedParameterObject.source}</p>
                </div>
              ) : (
                <Table
                  size="small"
                  pagination={false}
                  dataSource={selectedParameterObject.fields}
                  rowKey="id"
                  columns={[
                    {
                      title: '序号',
                      width: 60,
                      render: (_, __, index) => index + 1,
                    },
                    {
                      title: '类别',
                      dataIndex: 'category',
                      width: 100,
                    },
                    {
                      title: '字段类型',
                      dataIndex: 'fieldType',
                      width: 100,
                    },
                    {
                      title: '编码',
                      dataIndex: 'code',
                      width: 120,
                    },
                    {
                      title: '名称',
                      dataIndex: 'name',
                      width: 100,
                    },
                    {
                      title: '长度',
                      dataIndex: 'length',
                      width: 80,
                      render: (length: number | null) => length || '-',
                    },
                    {
                      title: '小数位数',
                      dataIndex: 'decimalPlaces',
                      width: 90,
                    },
                    {
                      title: '是否集合',
                      dataIndex: 'isCollection',
                      width: 80,
                      render: (isCollection: boolean) => (
                        <Tag color={isCollection ? 'blue' : 'default'}>
                          {isCollection ? '是' : '否'}
                        </Tag>
                      ),
                    },
                    {
                      title: '必填',
                      dataIndex: 'required',
                      width: 60,
                      render: (required: boolean) => (
                        <Tag color={required ? 'red' : 'default'}>
                          {required ? '是' : '否'}
                        </Tag>
                      ),
                    },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 报表模版管理页面
const ReportTemplateManage: React.FC<{
  templates: Template[];
  setTemplates: (updater: Template[] | ((prev: Template[]) => Template[])) => void;
}> = ({ templates, setTemplates }) => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [templateContent, setTemplateContent] = useState('');
  const [activeEditorTab, setActiveEditorTab] = useState('template');
  const [form] = Form.useForm();

  const filteredTemplates = templates.filter(template =>
    template.name.includes(searchText) || 
    template.module.includes(searchText)
  );

  const handleAdd = () => {
    setEditingTemplate(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    form.setFieldsValue({
      name: template.name,
      module: template.module,
      dataSource: template.dataSource
    });
    setIsModalVisible(true);
  };

  const handleDelete = (template: Template) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除报表模版"${template.name}"吗？`,
      onOk: () => {
        setTemplates(prev => prev.filter(item => item.id !== template.id));
        message.success('删除成功');
      },
    });
  };

  const handleEditorOpen = (template: Template) => {
    setEditingTemplate(template);
    setTemplateContent(template.content || '');
    setIsEditorVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const now = new Date().toLocaleString('zh-CN');
      
      if (editingTemplate) {
        // 更新现有模版
        setTemplates(prev => prev.map(template => 
          template.id === editingTemplate.id 
            ? { ...template, updateTime: now, lastUpdateUser: '系统管理员', ...values }
            : template
        ));
        message.success('更新成功');
      } else {
        // 创建新模版
        const newTemplate: Template = {
          id: generateNewReportTemplateId(templates),
          name: values.name,
          module: values.module,
          dataSource: values.dataSource,
          updateTime: now,
          lastUpdateUser: '系统管理员',
          status: 'enabled',
          content: '<div>新报表模版内容</div>',
        };
        setTemplates(prev => [...prev, newTemplate]);
        message.success('创建成功');
      }
      setIsModalVisible(false);
    });
  };

  const handleSaveContent = () => {
    if (editingTemplate) {
      setTemplates(prev => prev.map(template => 
        template.id === editingTemplate.id 
          ? { ...template, content: templateContent }
          : template
      ));
      message.success('报表模版内容保存成功');
      setIsEditorVisible(false);
    }
  };

  const renderPreview = () => {
    const processedContent = templateContent
      .replace(/\$\{companyName\}/g, '示例公司')
      .replace(/\$\{templateName\}/g, editingTemplate?.name || '报表模版预览')
      .replace(/\$\{date\}/g, new Date().toLocaleDateString('zh-CN'))
      .replace(/\$\{generateTime\}/g, new Date().toLocaleString('zh-CN'))
      .replace(/\$\{footerInfo\}/g, 'xxx信息科技公司版权所有 © 2025');

    return (
      <div 
        dangerouslySetInnerHTML={{ __html: processedContent }}
        style={{ 
          padding: '20px', 
          backgroundColor: '#fff',
          minHeight: '500px',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          overflow: 'auto'
        }}
      />
    );
  };

  const columns = [
    {
      title: '模版名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '业务模块',
      dataIndex: 'module',
      key: 'module',
    },
    {
      title: '数据源',
      dataIndex: 'dataSource',
      key: 'dataSource',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '最后更新人',
      dataIndex: 'lastUpdateUser',
      key: 'lastUpdateUser',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'enabled' ? 'green' : 'red'}>
          {status === 'enabled' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: Template) => (
        <Space>
          <Button 
            type="link" 
            icon={<CodeOutlined />} 
            onClick={() => handleEditorOpen(record)}
          >
            编辑模版
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Search
            placeholder="搜索报表模版名称"
            allowClear
            style={{ width: 200 }}
            onSearch={setSearchText}
          />
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          新增
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredTemplates}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      {/* 报表模版基本信息编辑对话框 */}
      <Modal
        title={editingTemplate ? '编辑报表模版' : '新增报表模版'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="模版名称" name="name" rules={[{ required: true, message: '请输入模版名称' }]}>
            <Input placeholder="请输入模版名称" />
          </Form.Item>
          <Form.Item label="业务模块" name="module" rules={[{ required: true, message: '请选择业务模块' }]}>
            <Select 
              placeholder="请选择业务模块"
              options={[
                { value: '采购模块', label: '采购模块' },
                { value: '销售模块', label: '销售模块' },
                { value: '库存模块', label: '库存模块' },
                { value: '财务模块', label: '财务模块' }
              ]}
            />
          </Form.Item>
          <Form.Item label="数据源" name="dataSource" rules={[{ required: true, message: '请选择数据源' }]}>
            <Select 
              placeholder="请选择数据源"
              options={[
                { value: '采购数据+供应商信息', label: '采购数据+供应商信息' },
                { value: '销售数据+客户信息', label: '销售数据+客户信息' },
                { value: '库存数据+库存信息', label: '库存数据+库存信息' },
                { value: '财务数据+账务信息', label: '财务数据+账务信息' }
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Monaco Editor 报表模版编辑对话框 */}
      <Modal
        title={`编辑报表模版: ${editingTemplate?.name || ''}`}
        open={isEditorVisible}
        onOk={handleSaveContent}
        onCancel={() => setIsEditorVisible(false)}
        width={1200}
        footer={[
          <Button key="cancel" onClick={() => setIsEditorVisible(false)}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveContent}>
            保存
          </Button>
        ]}
      >
        <div style={{ height: '600px' }}>
          <Tabs 
            activeKey={activeEditorTab} 
            onChange={setActiveEditorTab}
            style={{ height: '100%' }}
          >
            <TabPane tab="模版编辑" key="template">
              <SimpleMonacoEditor
                height="550px"
                language="html"
                theme="vs-light"
                value={templateContent}
                onChange={(value) => setTemplateContent(value || '')}
                loading={
                  <div style={{ 
                    height: '550px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px'
                  }}>
                    <div>正在加载编辑器...</div>
                  </div>
                }
                error={<div style={{ 
                  height: '550px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#fff2f0',
                  border: '1px solid #ffccc7',
                  borderRadius: '4px',
                  color: '#cf1322'
                }}>
                  编辑器加载失败，请刷新页面重试
                </div>}
              />
            </TabPane>
            <TabPane tab="预览" key="preview">
              <div style={{ height: '550px', overflow: 'auto' }}>
                {renderPreview()}
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    </div>
  );
};

// 日志页面
const LogsPage: React.FC = () => {
  return (
    <div>
      <h2>模版调用日志</h2>
      <p>此功能正在开发中，敬请期待。</p>
    </div>
  );
};

export default PrintTemplateManager;