// 打印模版管理数据持久化工具函数
import { Template } from '../types';

// 打印模版数据存储键名
const TEMPLATES_STORAGE_KEY = 'print_template_templates';
const REPORT_TEMPLATES_STORAGE_KEY = 'print_template_report_templates';

/**
 * 保存模版列表到localStorage
 */
export const saveTemplatesToStorage = (templates: Template[]): void => {
  try {
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('保存模版到localStorage失败:', error);
  }
};

/**
 * 从localStorage加载模版列表
 */
export const loadTemplatesFromStorage = (): Template[] => {
  try {
    const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('从localStorage加载模版失败:', error);
  }
  return [];
};

/**
 * 保存报表模版列表到localStorage
 */
export const saveReportTemplatesToStorage = (templates: Template[]): void => {
  try {
    localStorage.setItem(REPORT_TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('保存报表模版到localStorage失败:', error);
  }
};

/**
 * 从localStorage加载报表模版列表
 */
export const loadReportTemplatesFromStorage = (): Template[] => {
  try {
    const stored = localStorage.getItem(REPORT_TEMPLATES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('从localStorage加载报表模版失败:', error);
  }
  return [];
};

/**
 * 初始化默认业务打印模版（如果localStorage中没有数据）
 */
export const initializeDefaultTemplates = (): Template[] => {
  const existing = loadTemplatesFromStorage();
  
  // 如果已有数据，直接返回
  if (existing.length > 0) {
    return existing;
  }
  
  // 初始化默认模版
  const defaultTemplates: Template[] = [
    {
      id: '1',
      name: '采购到货通知单模版',
      module: '采购模块',
      dataSource: '采购订单+物料信息',
      updateTime: '2024-11-28 15:30:25',
      lastUpdateUser: '张三',
      status: 'enabled' as const,
      content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${'${templateName}'}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .content { margin-top: 20px; }
        .footer { margin-top: 40px; text-align: center; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${'${companyName}'}</h1>
        <h2>${'${templateName}'}</h2>
        <p>日期：${'${date}'}</p>
    </div>
    
    <div class="content">
        <#if purchaseOrder?has_content>
            <h3>采购订单信息</h3>
            <p>订单号：${'${purchaseOrder.orderNo}'}</p>
            <p>供应商：${'${purchaseOrder.supplierName}'}</p>
            <p>采购日期：${'${purchaseOrder.purchaseDate}'}</p>
            
            <table>
                <thead>
                    <tr>
                        <th>序号</th>
                        <th>物料名称</th>
                        <th>规格型号</th>
                        <th>数量</th>
                        <th>单位</th>
                        <th>单价</th>
                        <th>金额</th>
                    </tr>
                </thead>
                <tbody>
                    <#list purchaseOrder.items as item>
                    <tr>
                        <td>${'${item_index + 1}'}</td>
                        <td>${'${item.materialName}'}</td>
                        <td>${'${item.specification}'}</td>
                        <td>${'${item.quantity}'}</td>
                        <td>${'${item.unit}'}</td>
                        <td>${'${item.unitPrice}'}</td>
                        <td>${'${item.amount}'}</td>
                    </tr>
                    </#list>
                </tbody>
            </table>
            
            <p style="text-align: right; font-weight: bold; margin-top: 20px;">
                总计金额：${'${purchaseOrder.totalAmount}'} 元
            </p>
        <#else>
            <p style="text-align: center; color: #999;">暂无采购订单数据</p>
        </#if>
    </div>
    
    <div class="footer">
        <p>生成时间：${'${generateTime}'}</p>
        <p>${'${footerInfo}'}</p>
    </div>
</body>
</html>`
    },
    {
      id: '2',
      name: '销售出库单模版',
      module: '销售模块',
      dataSource: '销售订单+库存信息',
      updateTime: '2024-11-28 14:20:15',
      lastUpdateUser: '李四',
      status: 'enabled' as const,
      content: `<!-- 销售出库单模版内容 -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${'${templateName}'}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .content { margin-top: 20px; }
        .footer { margin-top: 40px; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${'${companyName}'}</h1>
        <h2>${'${templateName}'}</h2>
    </div>
    
    <div class="content">
        <#if salesOrder?has_content>
            <h3>销售出库信息</h3>
            <p>订单号：${'${salesOrder.orderNo}'}</p>
            <p>客户：${'${salesOrder.customerName}'}</p>
            <p>出库日期：${'${salesOrder.outboundDate}'}</p>
            
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>序号</th>
                        <th>商品名称</th>
                        <th>数量</th>
                        <th>单价</th>
                        <th>金额</th>
                    </tr>
                </thead>
                <tbody>
                    <#list salesOrder.items as item>
                    <tr>
                        <td>${'${item_index + 1}'}</td>
                        <td>${'${item.productName}'}</td>
                        <td>${'${item.quantity}'}</td>
                        <td>${'${item.unitPrice}'}</td>
                        <td>${'${item.amount}'}</td>
                    </tr>
                    </#list>
                </tbody>
            </table>
        <#else>
            <p style="text-align: center; color: #999;">暂无销售订单数据</p>
        </#if>
    </div>
    
    <div class="footer">
        <p>生成时间：${'${generateTime}'}</p>
    </div>
</body>
</html>`
    }
  ];
  
  // 保存到localStorage
  saveTemplatesToStorage(defaultTemplates);
  return defaultTemplates;
};

/**
 * 初始化默认报表打印模版
 */
export const initializeDefaultReportTemplates = (): Template[] => {
  const existing = loadReportTemplatesFromStorage();
  
  // 如果已有数据，直接返回
  if (existing.length > 0) {
    return existing;
  }
  
  // 初始化默认报表模版
  const defaultReportTemplates: Template[] = [
    {
      id: 'report1',
      name: '采购汇总报表',
      module: '采购模块',
      dataSource: '采购数据+供应商信息',
      updateTime: '2024-11-28 16:00:00',
      lastUpdateUser: '系统管理员',
      status: 'enabled' as const,
      content: `<!-- 采购汇总报表模版 -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>采购汇总报表</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .summary { margin: 20px 0; padding: 15px; background-color: #f9f9f9; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${'${companyName}'}</h1>
        <h2>采购汇总报表</h2>
        <p>统计周期：${'${startDate}'} 至 ${'${endDate}'}</p>
    </div>
    
    <div class="summary">
        <h3>汇总信息</h3>
        <p>采购订单总数：${'${totalOrders}'}</p>
        <p>采购总金额：${'${totalAmount}'} 元</p>
        <p>平均订单金额：${'${averageAmount}'} 元</p>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>供应商</th>
                <th>订单数量</th>
                <th>采购金额</th>
                <th>占比</th>
            </tr>
        </thead>
        <tbody>
            <#list supplierSummary as supplier>
            <tr>
                <td>${'${supplier.name}'}</td>
                <td>${'${supplier.orderCount}'}</td>
                <td>${'${supplier.amount}'} 元</td>
                <td>${'${supplier.percentage}'}%</td>
            </tr>
            </#list>
        </tbody>
    </table>
    
    <div style="margin-top: 40px; text-align: center; color: #666;">
        <p>生成时间：${'${generateTime}'}</p>
        <p>报表生成人：${'${generatedBy}'}</p>
    </div>
</body>
</html>`
    }
  ];
  
  // 保存到localStorage
  saveReportTemplatesToStorage(defaultReportTemplates);
  return defaultReportTemplates;
};

/**
 * 清除所有模版数据（主要用于测试）
 */
export const clearAllTemplates = (): void => {
  try {
    localStorage.removeItem(TEMPLATES_STORAGE_KEY);
    localStorage.removeItem(REPORT_TEMPLATES_STORAGE_KEY);
  } catch (error) {
    console.error('清除模版数据失败:', error);
  }
};

/**
 * 生成新的模版ID
 */
export const generateNewTemplateId = (existingTemplates: Template[]): string => {
  if (existingTemplates.length === 0) {
    return '1';
  }
  const maxId = Math.max(...existingTemplates.map(t => parseInt(t.id)));
  return (maxId + 1).toString();
};

/**
 * 生成新的报表模版ID
 */
export const generateNewReportTemplateId = (existingTemplates: Template[]): string => {
  if (existingTemplates.length === 0) {
    return 'report1';
  }
  const reportIds = existingTemplates.filter(t => t.id.startsWith('report')).map(t => 
    parseInt(t.id.replace('report', ''))
  );
  const maxId = reportIds.length > 0 ? Math.max(...reportIds) : 0;
  return `report${maxId + 1}`;
};
