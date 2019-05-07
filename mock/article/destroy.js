import Mock from 'mockjs'

const List = []
const count = 20
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@guid',
    'name|1': ['考古遗产保护与管理宪章' + i, '国际古遗迹保护与修复' + i],
    fileNum: 'GZ-' + '@integer(10000)',//文件编号
    'fileType|1': ['0', '1', '2', '3'],//文件类型 文字 图片 音频 视频
    docType: {
      id: '1111110',
      name: '国际公约'
    },
    provinces: ['130000','130100','130102'],///省市
    heritage: {
      id: 'asd145efse',
      name: '庆安会馆'
    },
    'medium|1': ['0', '1', '2'],//媒介 电子 纸质 电子加纸质
    'source|1': ['0', '1'], //录入，扫描
    author: '@cname',//作者
    writeUnit: '国际古迹遗址理事会',//撰写单位
    intro: '保护遗产遗迹，历史地区宪章',//内容摘要
    usedfor: '遗产说明和介绍',//用途
    writeTime: '1822' + i,//撰写年代
    position: ['110.00145', '30.1125'],
    images: [],
    link: 'www.baidu.com',//相关链接
    compilationAuthor: '@cname',//编制人员
    compilationTime: '@datetime',//编制时间
    compilationUnit: '宁波文保所',//编制单位
    storage: '宁波文保所',
    validator: '@cname',//审定人
    validateTime: '@datetime',//审定时间
    paperNum: 'PA-' + '@integer(10000)',//纸质编码
    createDate: '@datetime',//创建时间
    updateDate: '@datetime',
    'securityLevel|1': ['0', '1', '2'],//密级0,机密 1 内部 2外部
    digitalOwner: '@cname',//数字化责任人
    'digitalDevice|1': ['0'], //数字化设备 0扫描仪
    digitalTime: '@datetime',//数字化时间
    'status|1': ['0', '1', '2'],//档案状态0已销毁 1正常 2待销毁审核
    suggestion:'',
  }))
}

export default {
  getList: config => {
    const {status,medium, fileType, name, page = 1, limit = 20, sort} = config.query

    let mockList = List.filter(item => {
      //去掉正常的
      if (item.status == '1') return false
      if (status && item.status !== status) return false
      if (medium && item.medium !== medium) return false
      if (fileType && item.fileType !== fileType) return false
      if (name && item.name.indexOf(name) < 0) return false
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
  getDestroy: (config) => {
    const { id } = config.query
    for (const article of List) {
      if (article.id === +id) {
        return article
      }
    }
  },
  updateDestroy: () => ({
    data: 'success'
  })
}
