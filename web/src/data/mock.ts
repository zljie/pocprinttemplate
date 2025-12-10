export type DataSource = {
  id: string;
  name: string;
  module: string;
  origin: string;
  updatedAt: string;
  lastEditor: string;
  status: "启用" | "禁用";
  objects: string[];
};

export type ParamObject = {
  id: string;
  group: string; // 采购管理/销售管理/库存管理/财务管理/人力资源
  code: string; // PurchaseOrderDTO -> purchaseOrder
  name: string;
  origin: string; // ERP标准产品/CRM系统/...
  fields: Array<{ category: string; type: string; code: string; name: string; length?: number; required?: boolean; collection?: boolean }>;
};

export type Template = {
  id: string;
  name: string;
  code: string;
  module: string;
  dataSourceName: string;
  paper: string; // A4 纵向等
  updatedAt: string;
  lastEditor: string;
  status: "启用" | "禁用";
};

export const paramObjects: ParamObject[] = [
  {
    id: "po",
    group: "采购管理",
    code: "PurchaseOrderDTO",
    name: "采购订单",
    origin: "ERP标准产品",
    fields: [
      { category: "基本", type: "string", code: "orderNo", name: "订单号", required: true },
      { category: "基本", type: "date", code: "orderDate", name: "下单日期" },
      { category: "供应商", type: "string", code: "supplierName", name: "供应商名称" },
      { category: "明细", type: "collection", code: "items", name: "订单明细", collection: true },
    ],
  },
  {
    id: "pr",
    group: "采购管理",
    code: "PurchaseRequisitionDTO",
    name: "采购申请单",
    origin: "ERP标准产品",
    fields: [
      { category: "基本", type: "string", code: "reqNo", name: "申请单号", required: true },
      { category: "基本", type: "date", code: "reqDate", name: "申请日期" },
      { category: "申请人", type: "string", code: "applicant", name: "申请人" },
    ],
  },
  {
    id: "materialInfo",
    group: "库存管理",
    code: "MaterialInfoDTO",
    name: "物料信息",
    origin: "ERP标准产品",
    fields: [
      { category: "基本", type: "string", code: "materialCode", name: "物料编码", required: true },
      { category: "基本", type: "string", code: "materialName", name: "物料名称" },
      { category: "库存", type: "number", code: "stockQty", name: "库存数量" },
    ],
  },
];

export const dataSources: DataSource[] = [
  {
    id: "ds-001",
    name: "采购管理-采购单数据源",
    module: "采购模块",
    origin: "采购订单 | 物料信息",
    updatedAt: "2025/11/28 17:15",
    lastEditor: "张三",
    status: "启用",
    objects: ["po", "materialInfo"],
  },
  {
    id: "ds-002",
    name: "销售出库数据源",
    module: "销售模块",
    origin: "销售订单",
    updatedAt: "2025/11/25 10:20",
    lastEditor: "李四",
    status: "启用",
    objects: ["pr"],
  },
  {
    id: "ds-003",
    name: "库存盘点数据源",
    module: "库存模块",
    origin: "盘点单",
    updatedAt: "2025/11/18 09:00",
    lastEditor: "王五",
    status: "禁用",
    objects: ["materialInfo"],
  },
];

export const templates: Template[] = [
  {
    id: "tpl-001",
    name: "采购管理通用单据模版",
    code: "OQDD",
    module: "采购模块",
    dataSourceName: "采购订单+物料信息",
    paper: "A4 - 竖纸张",
    updatedAt: "2025/11/28 17:15",
    lastEditor: "张三",
    status: "启用",
  },
  {
    id: "tpl-ARR-DEMO",
    name: "到货通知单示例模版",
    code: "DEMO-ARR-001",
    module: "采购模块",
    dataSourceName: "EMM_ArrivalNoticeDetail + Collect",
    paper: "A4 - 横纸张",
    updatedAt: "2025/12/10 09:00",
    lastEditor: "系统示例",
    status: "启用",
  },
];
