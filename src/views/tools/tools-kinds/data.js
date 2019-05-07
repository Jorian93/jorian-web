const data = [
  {
    id: '1001',
    pid: '0',
    name: '非物质文化遗产', // 名称
    type: '1', // 状态 1 正常  0锁定
    dsc: '非物质文化遗产分类', // 描述
    createTime: '2019-03-20 15:57',
    timestamp: new Date(), // 修改时间
    children: [
      {
        id: '10011',
        pid: '1001',
        name: '杂技', // 名称
        type: '1', // 状态
        dsc: '非物质文化遗产分类-杂技', // 描述
        createTime: '2019-03-20 15:57',
        timestamp: new Date(), // 修改时间
        children: []
      },
      {
        id: '10012',
        pid: '1001',
        name: '声乐', // 名称
        type: '1', // 状态
        dsc: '非物质文化遗产分类-声乐', // 描述
        createTime: '2019-03-20 15:57',
        timestamp: new Date(), // 修改时间
        children: []
      }]
  },
  {
    id: '1002',
    pid: '0',
    name: '物质文化遗产', // 名称
    type: '1', // 状态
    dsc: '非物质文化遗产分类', // 描述
    createTime: '2019-03-20 15:57',
    timestamp: new Date(), // 修改时间
    children: []
  }
]

export default data
