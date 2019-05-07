import Mock from 'mockjs'

const List = [
  {
    id: '0',
    pid: '0',
    name: '遗产智能监测云平台',//名称
    type: '1',//状态 1 正常  0锁定
    dsc: '',//描述
    url: '/home',
    isVerify:'0',
    permission:'[home]',
    icon:'#xk6523',
    createTime: new Date(),
    updateDate: new Date(),//修改时间
    children: [
      {
        id: '1004',
        pid: '0',
        name: '首页',//名称
        type: '1',//状态 1 正常  0锁定
        dsc: '非物质文化遗产分类',//描述
        url: '/home',
        isVerify:'0',
        permission:'[home]',
        icon:'#xk6523',
        createTime: '2019-03-20 15:57',
        updateDate: new Date(),//修改时间
        children:[]
      },
      {
        id: '1001',
        pid: '0',
        name: '系统管理',//名称
        type: '1',//状态 1 正常  0锁定
        dsc: '',//描述
        url: '/system',
        isVerify:'0',
        permission:'[sytem]',
        icon:'#xk6523',
        createTime: '2019-03-20 15:57',
        updateDate: new Date(),//修改时间
        children: [
          {
            id: '10011',
            pid: '1001',
            name: '用户管理',//名称
            type: '1',//状态 1 正常  0锁定
            dsc: '',//描述
            url: '/system',
            isVerify:'0',
            permission:'[sytem]',
            icon:'#xk6523',
            createTime: '2019-03-20 15:57',
            updateDate: new Date(),//修改时间
            children: []
          },
          {
            id: '10012',
            pid: '1001',
            name: '角色管理',//名称
            type: '1',//状态 1 正常  0锁定
            dsc: '',//描述
            url: '/system',
            isVerify:'0',
            permission:'[sytem]',
            icon:'#xk6523',
            createTime: '2019-03-20 15:57',
            updateDate: new Date(),//修改时间
            children: []
          },
          {
            id: '10013',
            pid: '1001',
            name: '资源管理',//名称
            type: '1',//状态 1 正常  0锁定
            dsc: '',//描述
            url: '/system',
            isVerify:'0',
            permission:'[sytem]',
            icon:'#xk6523',
            createTime: '2019-03-20 15:57',
            updateDate: new Date(),//修改时间
            children: []
          }
        ]
      },
    ]
  }
]


export default [
  {
    url: '/resource/list',
    type: 'get',
    response: config => {
      const { page = 1, limit = 20, sort} = config.query
      let mockList = List.filter(item => {
        //过滤正常的
      /*  if (item.status !== '1') return false
        if (medium && item.medium !== medium) return false
        if (fileType && item.fileType !== fileType) return false
        if (name && item.name.indexOf(name) < 0) return false*/
        return true
      })
      if (sort === '-id') {
        mockList = mockList.reverse()
      }
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code:200,
        msg:"操作成功",
        data:{
          total: mockList.length,
          items: mockList
        }
      }
    }
  },
  {
    url: '/resource/',
    type: 'get',
    response: (config) => {
      const {id} = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code:200,
            msg:"操作成功",
            data:{
              article: article
            }
          }
        }
      }
    }
  },
  {
    url: '/resource',
    type: 'post',
    response: () => ({
        code:200,
        msg:"操作成功",
        data:{
        }
    })
  },
  {
    url: '/resource/',
    type: 'patch',
    response: (config) => {
      const {id, page = 1, limit = 20} = config.query
      for (const article of List) {
        if (article.id === +id) {
          article.status = '2'
          let mockList = List.filter(item => {
            //过滤正常的
            if (item.status !== '1') return false
            return true
          })

          if (sort === '-id') {
            mockList = mockList.reverse()
          }

          const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

          return {
            code:200,
            msg:"操作成功",
            data:{
              items: pageList
            }
          }


        }
      }

    }
  }
]

