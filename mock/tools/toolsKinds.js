import Mock from 'mockjs'
const List = [
  {
    id: '1001',
    pid: '0',
    name: '非物质文化遗产',//名称
    type: '1',//状态 1 正常  0锁定
    dsc: '非物质文化遗产分类',//描述
    createTime: '2019-03-20 15:57',
    timestamp: new Date(),//修改时间
    children: [
      {
        id: '10011',
        pid: '1001',
        name: '杂技',//名称
        type: '1',//状态
        dsc: '非物质文化遗产分类-杂技',//描述
        createTime: '2019-03-20 15:57',
        timestamp: new Date(),//修改时间
        children: []
      },
      {
        id: '10012',
        pid: '1001',
        name: '声乐',//名称
        type: '1',//状态
        dsc: '非物质文化遗产分类-声乐',//描述
        createTime: '2019-03-20 15:57',
        timestamp: new Date(),//修改时间
        children: []
      }]
  },
  {
    id: '1002',
    pid: '0',
    name: '物质文化遗产',//名称
    type: '1',//状态
    dsc: '非物质文化遗产分类',//描述
    createTime: '2019-03-20 15:57',
    timestamp: new Date(),//修改时间
    children: []
  },
]

export default {
  getList: config => {
    const { importance, type, title, page = 1, limit = 20, sort } = config.query

    let mockList = List.filter(item => {
      /*if (importance && item.importance !== +importance) return false
      if (type && item.type !== type) return false
      if (title && item.title.indexOf(title) < 0) return false*/
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },
  getKind: (config) => {
    const { id } = config.query
    for (const article of List) {
      if (article.id === +id) {
        return article
      }
    }
  },
  createKind: () => ({
    data: 'success'
  }),
  updateKind: () => ({
    data: 'success'
  })
}
