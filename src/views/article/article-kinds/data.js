const data = [
  {
    id: '0',
    pid: '0',
    name: '文章分类', // 名称
    type: '1', // 状态 1 正常  0锁定
    dsc: '', // 描述
    createTime: '2019-03-20 15:57',
    timestamp: new Date(), // 修改时间
    children: [
      {
        id: '1001',
        pid: '0',
        name: '前端', // 名称
        type: '1', // 状态 1 正常  0锁定
        dsc: '前端', // 描述
        createTime: '2019-03-20 15:57',
        timestamp: new Date(), // 修改时间
        children: [
          {
            id: '10011',
            pid: '1001',
            name: 'HTML', // 名称
            type: '1', // 状态
            dsc: '', // 描述
            createTime: '2019-03-20 15:57',
            timestamp: new Date(), // 修改时间
            children: []
          },
          {
            id: '10012',
            pid: '1001',
            name: 'CSS', // 名称
            type: '1', // 状态
            dsc: '', // 描述
            createTime: '2019-03-20 15:57',
            timestamp: new Date(), // 修改时间
            children: []
          },
          {
            id: '10013',
            pid: '1001',
            name: 'JS', // 名称
            type: '1', // 状态
            dsc: '', // 描述
            createTime: '2019-03-20 15:57',
            timestamp: new Date(), // 修改时间
            children: []
          },,
          {
            id: '10014',
            pid: '1001',
            name: 'Vue', // 名称
            type: '1', // 状态
            dsc: '', // 描述
            createTime: '2019-03-20 15:57',
            timestamp: new Date(), // 修改时间
            children: []
          }
        ]
      },
      {
        id: '1002',
        pid: '0',
        name: '后端', // 名称
        type: '1', // 状态 1 正常  0锁定
        dsc: '', // 描述
        createTime: '2019-03-20 15:57',
        timestamp: new Date(), // 修改时间
        children: [
          {
            id: '10021',
            pid: '1001',
            name: 'Spring MVC', // 名称
            type: '1', // 状态
            dsc: '', // 描述
            createTime: '2019-03-20 15:57',
            timestamp: new Date(), // 修改时间
            children: []
          },
          {
            id: '10022',
            pid: '1001',
            name: 'SpringBoot', // 名称
            type: '1', // 状态
            dsc: '', // 描述
            createTime: '2019-03-20 15:57',
            timestamp: new Date(), // 修改时间
            children: []
          },
          {
            id: '10023',
            pid: '1001',
            name: 'SpringCloud', // 名称
            type: '1', // 状态
            dsc: '', // 描述
            createTime: '2019-03-20 15:57',
            timestamp: new Date(), // 修改时间
            children: []
          },
          {
            id: '10024',
            pid: '1001',
            name: '数据库', // 名称
            type: '1', // 状态
            dsc: '', // 描述
            createTime: '2019-03-20 15:57',
            timestamp: new Date(), // 修改时间
            children: []
          }
        ]
      },
      {
        id: '10030',
        pid: '0',
        name: '工具部署安装', // 名称
        type: '1', // 状态 1 正常  0锁定
        dsc: '', // 描述
        createTime: '2019-03-20 15:57',
        timestamp: new Date(), // 修改时间
        children: [
          {
            id: '10031',
            pid: '1001',
            name: '运行环境', // 名称
            type: '1', // 状态
            dsc: '', // 描述
            createTime: '2019-03-20 15:57',
            timestamp: new Date(), // 修改时间
            children: []
          },
          {
            id: '10032',
            pid: '1001',
            name: 'IDEA', // 名称
            type: '1', // 状态
            dsc: '', // 描述
            createTime: '2019-03-20 15:57',
            timestamp: new Date(), // 修改时间
            children: []
          }
        ]
      }

    ]

  }
]

export default data
