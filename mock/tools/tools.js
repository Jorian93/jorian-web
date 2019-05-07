import Mock from 'mockjs'
const List = []
const count = 50


for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id:'@guid',
    name: '总督漕运属'+i, //名称
    'type|1':['','','',''],
    createDate: +Mock.Random.date('T'),
    updateDate: Mock.Random.date('T') ,
    'protectLevel|1': [ 'a','b','c'],//保护级别 0国家级 1省级 2市级
    'protectStatus|1': ['a','b','c'],//保护现状 0良好 1一般 2较差
    protectScope:'保 护 范 围：东、西、北面以总督漕运属围墙为界,南面延伸至新建山门为界。 建设控制地带：东、西、北自保国寺使用的山林界向外延伸100米，南到塘河沿线',//保护范围
    publishedTime:'清朝',//公布时代
    publishedBatch:'第'+i+'批',//公布批次
    position:[121.00081,30.02812],//经纬度
    altitude:(100+i)*10,//海拔高度
    'organization|1':['宁波市文保所','淮安市文保所'],
    owner:'国家',//所有者
    location:'宁波文保所',//现在地址
    provinces:['130000','130100','130102'],
    images:['','',''],
    twoLinesImg:'',
    intro:'宁波水利航运遗址碑之甬东天后宫碑位于庆安会馆内，庆安会馆地处宁波市江东区江东北路156号。建于宋代（1911年）的天妃宫，系宁波最早的天后宫，位于今江厦街（已毁）。现存的天后宫位于宁波市区三江口的东岸，故称为“甬东天后宫”。碑铭写于1884年，赐同进士出身知州衔江西建吕县知县郭董沛撰文，赐进士出身二品顶戴江苏补用道前翰林院庶吉士仁和杨鸿元书丹，赐同进士出身直袁宣化府前翰林院检讨镇海郑贤坊篆额，赐士出身同知衔浙江郭县泰州朱庆请检枝上石。2011年被浙江省人民政府公布为第六批省级文物保护单位',//简介
    preservationStatus:'现存状况良好',//现存状况
    developmentControlArea:'自保护范围向外各延伸100米，所构成的封闭区域，占地面积214087平方米',//建设控制地带
    geographicPosition:'庆安会馆位于宁波市区三江口的东岸，故称为“甬东天后宫”。'//地理位置
  }))
}

export default {
  getList: config => {
    const { protectLevel, protectStatus, organization,name, page = 1, limit = 20, sort } = config.query

    let mockList = List.filter(item => {
      if (protectLevel && item.protectLevel !== protectLevel) return false
      if (protectStatus && item.protectStatus !== protectStatus) return false

      if (name && item.name.indexOf(name) < 0) return false
      if (organization && item.organization.indexOf(organization) < 0) return false

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
  getInfo: (config) => {
    const { id } = config.query
    for (const article of List) {
      if (article.id === +id) {
        return article
      }
    }
  },
  createInfo: () => ({
    data: 'success'
  }),
  updateInfo: () => ({
    data: 'success'
  })
}
