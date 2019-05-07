<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" :placeholder="$t('遗产名称')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.organization" :placeholder="$t('保护机构')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select
        v-model="listQuery.protectLevel"
        :placeholder="$t('保护级别')"
        clearable
        class="filter-item"
        style="width: 130px"
        @change="handleFilter"
      >
        <el-option v-for="item in protectLevelOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select
        v-model="listQuery.protectStatus"
        :placeholder="$t('保存状态')"
        clearable
        class="filter-item"
        style="width: 130px"
        @change="handleFilter"
      >
        <el-option v-for="item in protectStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('搜索') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('新增') }}</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('导出') }}</el-button>
    </div>
    <div class="ttable" style="float: left; margin-right: 15px">
      <div class="app-container">
        <tree-table
          ref="TreeTable"
          :data="treeData"
          :default-expand-all="true"
          :columns="columns"
          border
          default-children="children"
        />
      </div>
    </div>
    <div class="etable">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 78%;margin-top: 20px;"
        @sort-change="sortChange"
      >
        <el-table-column :label="$t('遗产点名称')" prop="name" align="center" min-width="95">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('管理机构')" prop="name" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.organization }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('保护级别')" prop="protectLevel" width="100px" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.protectLevel==='a'">市级</el-tag>
            <el-tag v-else-if="scope.row.protectLevel==='b'">省级</el-tag>
            <el-tag v-else-if="scope.row.protectLevel==='c'">国家级</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('保护状况')"prop="protectStatus" width="100px" align="center">
          <template slot-scope="scope">
            <el-tag v-if=" scope.row.protectStatus==='a'" type="danger">较差</el-tag>
            <el-tag v-else-if=" scope.row.protectStatus==='b'" type="info">一般</el-tag>
            <el-tag v-else-if=" scope.row.protectStatus==='c'" type="success">良好</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('创建时间')" width="150px" sortable="custom" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作')" align="center" width="300" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">{{ $t('查看') }}</el-button>
            <el-button size="mini" type="success" @click="handleUpdate(scope.row)">{{ $t('修改') }}</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('删除') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
        <el-form-item :label="$t('遗产名称')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item :label="$t('公布时间')" prop="publishedTime">
          <el-input v-model="temp.publishedTime" />
        </el-form-item>
        <el-form-item :label="$t('公布批次')" prop="publishedBatch">
          <el-input v-model="temp.publishedBatch" />
        </el-form-item>
        <el-form-item :label="$t('经度')" prop="position">
          <el-input v-model="temp.position[0]" />
        </el-form-item>
        <el-form-item :label="$t('纬度')" prop="position">
          <el-input v-model="temp.position[1]" />
        </el-form-item>
        <el-form-item :label="$t('管理机构')" prop="organization">
          <el-input v-model="temp.organization" />
        </el-form-item>
        <el-form-item :label="$t('保护级别')" prop="protectLevel">
          <el-select v-model="temp.protectLevel" class="filter-item" placeholder="请选择">
            <el-option v-for="item in protectLevelOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('保护现状')" prop="protectStatus">
          <el-select v-model="temp.protectStatus" class="filter-item" placeholder="请选择">
            <el-option v-for="item in protectStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('海拔高度')" prop="altitude">
          <el-input v-model="temp.altitude" />
        </el-form-item>
        <el-form-item :label="$t('所有权')" prop="owner">
          <el-input v-model="temp.owner" />
        </el-form-item>
        <el-form-item :label="$t('所在省市')" prop="provinces">
          <el-cascader
            v-model="temp.provinces"
            expand-trigger="hover"
            :options="provinceOptions"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item :label="$t('现在地址')" prop="location">
          <el-input v-model="temp.location" />
        </el-form-item>
        <el-form-item :label="$t('本体图片')" prop="image">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('两线图')" prop="image">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('简要说明')" prop="intro">
          <el-input v-model="temp.intro" type="textarea" />
        </el-form-item>
        <el-form-item :label="$t('现存状况')" prop="preservationStatus">
          <el-input v-model="temp.preservationStatus" type="textarea" />
        </el-form-item>
        <el-form-item :label="$t('保护范围')" prop="protectScope">
          <el-input v-model="temp.protectScope" type="textarea" />
        </el-form-item>
        <el-form-item :label="$t('建设控制地带')" prop="developmentControlArea">
          <el-input v-model="temp.developmentControlArea" type="textarea" />
        </el-form-item>
        <el-form-item :label="$t('地理位置')" prop="geographicPosition">
          <el-input v-model="temp.geographicPosition" type="textarea" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('确认') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

  </div>
</template>

<script>
import { fetchInfoList, fetchInfo, createInfo, updateInfo } from '@/api/tools/tools'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import treeTable from '@/components/TreeTable'

const protectLevelOptions = [
  { key: 'a', display_name: '市级' },
  { key: 'b', display_name: '省级' },
  { key: 'c', display_name: '国家级' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const protectLevelKeyValue = protectLevelOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const protectStatusOptions = [
  { key: 'a', display_name: '较差' },
  { key: 'b', display_name: '一般' },
  { key: 'c', display_name: '良好' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const protectStatusKeyValue = protectStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'BaseInfo',
  components: { Pagination, treeTable },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    protectLevelsFilter(type) {
      return protectLevelKeyValue[type]
    }

  },
  data() {
    return {
      provinceOptions: [
        {
          'value': '110000',
          'label': '北京',
          'ssqename': '',
          'children': [
            {
              'value': '110100',
              'label': '市辖区',
              'ssqename': '',
              'children': [
                {
                  'value': '110101',
                  'label': '东城区',
                  'ssqename': ''
                },
                {
                  'value': '110102',
                  'label': '西城区',
                  'ssqename': ''
                },
                {
                  'value': '110103',
                  'label': '崇文区',
                  'ssqename': ''
                },
                {
                  'value': '110104',
                  'label': '宣武区',
                  'ssqename': ''
                },
                {
                  'value': '110105',
                  'label': '朝阳区',
                  'ssqename': ''
                },
                {
                  'value': '110106',
                  'label': '丰台区',
                  'ssqename': ''
                },
                {
                  'value': '110107',
                  'label': '石景山区',
                  'ssqename': ''
                },
                {
                  'value': '110108',
                  'label': '海淀区',
                  'ssqename': ''
                },
                {
                  'value': '110109',
                  'label': '门头沟区',
                  'ssqename': ''
                },
                {
                  'value': '110111',
                  'label': '房山区',
                  'ssqename': ''
                },
                {
                  'value': '110112',
                  'label': '通州区',
                  'ssqename': ''
                },
                {
                  'value': '110113',
                  'label': '顺义区',
                  'ssqename': ''
                },
                {
                  'value': '110114',
                  'label': '昌平区',
                  'ssqename': ''
                },
                {
                  'value': '110115',
                  'label': '大兴区',
                  'ssqename': ''
                },
                {
                  'value': '110116',
                  'label': '平谷区',
                  'ssqename': ''
                },
                {
                  'value': '110117',
                  'label': '怀柔区',
                  'ssqename': ''
                }
              ]

            },
            {
              'value': '110200',
              'label': '市辖县',
              'ssqename': '',
              'children': [
                {
                  'value': '110228',
                  'label': '密云县',
                  'ssqename': ''
                },
                {
                  'value': '110229',
                  'label': '延庆县',
                  'ssqename': ''
                }
              ]
            }
          ]

        },
        {
          'value': '120000',
          'label': '天津',
          'ssqename': '',
          'children': [
            {
              'value': '120100',
              'label': '市辖区',
              'ssqename': '',
              'children': [
                {
                  'value': '120101',
                  'label': '和平区',
                  'ssqename': ''
                },
                {
                  'value': '120102',
                  'label': '河东区',
                  'ssqename': ''
                },
                {
                  'value': '120103',
                  'label': '河西区',
                  'ssqename': ''
                },
                {
                  'value': '120104',
                  'label': '南开区',
                  'ssqename': ''
                },
                {
                  'value': '120105',
                  'label': '河北区',
                  'ssqename': ''
                },
                {
                  'value': '120106',
                  'label': '红桥区',
                  'ssqename': ''
                },
                {
                  'value': '120107',
                  'label': '塘沽区',
                  'ssqename': ''
                },
                {
                  'value': '120108',
                  'label': '汉沽区',
                  'ssqename': ''
                },
                {
                  'value': '120109',
                  'label': '大港区',
                  'ssqename': ''
                },
                {
                  'value': '120110',
                  'label': '东丽区',
                  'ssqename': ''
                },
                {
                  'value': '120111',
                  'label': '西青区',
                  'ssqename': ''
                },
                {
                  'value': '120112',
                  'label': '津南区',
                  'ssqename': ''
                },
                {
                  'value': '120113',
                  'label': '北辰区',
                  'ssqename': ''
                },
                {
                  'value': '120114',
                  'label': '武清区',
                  'ssqename': ''
                },
                {
                  'value': '120115',
                  'label': '宝坻区',
                  'ssqename': ''
                }
              ]
            },
            {
              'value': '120200',
              'label': '市辖县',
              'ssqename': '',
              'children': [
                {
                  'value': '120221',
                  'label': '宁河县',
                  'ssqename': ''
                },
                {
                  'value': '120223',
                  'label': '静海县',
                  'ssqename': ''
                },
                {
                  'value': '120225',
                  'label': '蓟县',
                  'ssqename': ''
                }
              ]
            }

          ]

        },
        {
          'value': '130000',
          'label': '河北省',
          'ssqename': '',
          'children': [
            {
              'value': '130100',
              'label': '石家庄市',
              'ssqename': '',
              'children': [
                {
                  'value': '130102',
                  'label': '长安区',
                  'ssqename': ''
                },
                {
                  'value': '130103',
                  'label': '桥东区',
                  'ssqename': ''
                },
                {
                  'value': '130104',
                  'label': '桥西区',
                  'ssqename': ''
                },
                {
                  'value': '130105',
                  'label': '新华区',
                  'ssqename': ''
                },
                {
                  'value': '130107',
                  'label': '井陉矿区',
                  'ssqename': ''
                },
                {
                  'value': '130108',
                  'label': '裕华区',
                  'ssqename': ''
                },
                {
                  'value': '130121',
                  'label': '井陉县',
                  'ssqename': ''
                },
                {
                  'value': '130123',
                  'label': '正定县',
                  'ssqename': ''
                },
                {
                  'value': '130124',
                  'label': '栾城县',
                  'ssqename': ''
                },
                {
                  'value': '130125',
                  'label': '行唐县',
                  'ssqename': ''
                },
                {
                  'value': '130126',
                  'label': '灵寿县',
                  'ssqename': ''
                },
                {
                  'value': '130127',
                  'label': '高邑县',
                  'ssqename': ''
                },
                {
                  'value': '130128',
                  'label': '深泽县',
                  'ssqename': ''
                },
                {
                  'value': '130129',
                  'label': '赞皇县',
                  'ssqename': ''
                },
                {
                  'value': '130130',
                  'label': '无极县',
                  'ssqename': ''
                },
                {
                  'value': '130131',
                  'label': '平山县',
                  'ssqename': ''
                },
                {
                  'value': '130132',
                  'label': '元氏县',
                  'ssqename': ''
                },
                {
                  'value': '130133',
                  'label': '赵县',
                  'ssqename': ''
                },
                {
                  'value': '130181',
                  'label': '辛集市',
                  'ssqename': ''
                },
                {
                  'value': '130182',
                  'label': '藁城市',
                  'ssqename': ''
                },
                {
                  'value': '130183',
                  'label': '晋州市',
                  'ssqename': ''
                },
                {
                  'value': '130184',
                  'label': '新乐市',
                  'ssqename': ''
                },
                {
                  'value': '130185',
                  'label': '鹿泉市',
                  'ssqename': ''
                }
              ]
            },
            {
              'value': '130200',
              'label': '唐山市',
              'ssqename': '',

              'children': [
                {
                  'value': '130202',
                  'label': '路南区',
                  'ssqename': ''
                },
                {
                  'value': '130203',
                  'label': '路北区',
                  'ssqename': ''
                },
                {
                  'value': '130204',
                  'label': '古冶区',
                  'ssqename': ''
                },
                {
                  'value': '130205',
                  'label': '开平区',
                  'ssqename': ''
                },
                {
                  'value': '130206',
                  'label': '新区',
                  'ssqename': ''
                },
                {
                  'value': '130221',
                  'label': '丰润县',
                  'ssqename': ''
                },
                {
                  'value': '130223',
                  'label': '滦县',
                  'ssqename': ''
                },
                {
                  'value': '130224',
                  'label': '滦南县',
                  'ssqename': ''
                },
                {
                  'value': '130225',
                  'label': '乐亭县',
                  'ssqename': ''
                },
                {
                  'value': '130227',
                  'label': '迁西县',
                  'ssqename': ''
                },
                {
                  'value': '130229',
                  'label': '玉田县',
                  'ssqename': ''
                },
                {
                  'value': '130230',
                  'label': '唐海县',
                  'ssqename': ''
                },
                {
                  'value': '130281',
                  'label': '遵化市',
                  'ssqename': ''
                },
                {
                  'value': '130282',
                  'label': '丰南市',
                  'ssqename': ''
                },
                {
                  'value': '130283',
                  'label': '迁安市',
                  'ssqename': ''
                }
              ]

            },
            {
              'value': '130300',
              'label': '秦皇岛市',
              'ssqename': '',

              'children': [
                {
                  'value': '130302',
                  'label': '海港区',
                  'ssqename': ''
                },
                {
                  'value': '130303',
                  'label': '山海关区',
                  'ssqename': ''
                },
                {
                  'value': '130304',
                  'label': '北戴河区',
                  'ssqename': ''
                },
                {
                  'value': '130321',
                  'label': '青龙满族自治县',
                  'ssqename': ''
                },
                {
                  'value': '130322',
                  'label': '昌黎县',
                  'ssqename': ''
                },
                {
                  'value': '130323',
                  'label': '抚宁县',
                  'ssqename': ''
                },
                {
                  'value': '130324',
                  'label': '卢龙县',
                  'ssqename': ''
                }
              ]

            },
            {
              'value': '130400',
              'label': '邯郸市',
              'ssqename': '',
              'children': [
                {
                  'value': '130402',
                  'label': '邯山区',
                  'ssqename': ''
                },
                {
                  'value': '130403',
                  'label': '丛台区',
                  'ssqename': ''
                },
                {
                  'value': '130404',
                  'label': '复兴区',
                  'ssqename': ''
                },
                {
                  'value': '130406',
                  'label': '峰峰矿区',
                  'ssqename': ''
                },
                {
                  'value': '130421',
                  'label': '邯郸县',
                  'ssqename': ''
                },
                {
                  'value': '130423',
                  'label': '临漳县',
                  'ssqename': ''
                },
                {
                  'value': '130424',
                  'label': '成安县',
                  'ssqename': ''
                },
                {
                  'value': '130425',
                  'label': '大名县',
                  'ssqename': ''
                },
                {
                  'value': '130426',
                  'label': '涉县',
                  'ssqename': ''
                },
                {
                  'value': '130427',
                  'label': '磁县',
                  'ssqename': ''
                },
                {
                  'value': '130428',
                  'label': '肥乡县',
                  'ssqename': ''
                },
                {
                  'value': '130429',
                  'label': '永年县',
                  'ssqename': ''
                },
                {
                  'value': '130430',
                  'label': '邱县',
                  'ssqename': ''
                },
                {
                  'value': '130431',
                  'label': '鸡泽县',
                  'ssqename': ''
                },
                {
                  'value': '130432',
                  'label': '广平县',
                  'ssqename': ''
                },
                {
                  'value': '130433',
                  'label': '馆陶县',
                  'ssqename': ''
                },
                {
                  'value': '130434',
                  'label': '魏县',
                  'ssqename': ''
                },
                {
                  'value': '130435',
                  'label': '曲周县',
                  'ssqename': ''
                },
                {
                  'value': '130481',
                  'label': '武安市',
                  'ssqename': ''
                }
              ]

            },
            {
              'value': '130500',
              'label': '邢台市',
              'ssqename': '',
              'children': [
                {
                  'value': '130502',
                  'label': '桥东区',
                  'ssqename': ''
                },
                {
                  'value': '130503',
                  'label': '桥西区',
                  'ssqename': ''
                },
                {
                  'value': '130521',
                  'label': '邢台县',
                  'ssqename': ''
                },
                {
                  'value': '130522',
                  'label': '临城县',
                  'ssqename': ''
                },
                {
                  'value': '130523',
                  'label': '内丘县',
                  'ssqename': ''
                },
                {
                  'value': '130524',
                  'label': '柏乡县',
                  'ssqename': ''
                },
                {
                  'value': '130525',
                  'label': '隆尧县',
                  'ssqename': ''
                },
                {
                  'value': '130526',
                  'label': '任县',
                  'ssqename': ''
                },
                {
                  'value': '130527',
                  'label': '南和县',
                  'ssqename': ''
                },
                {
                  'value': '130528',
                  'label': '宁晋县',
                  'ssqename': ''
                },
                {
                  'value': '130529',
                  'label': '巨鹿县',
                  'ssqename': ''
                },
                {
                  'value': '130530',
                  'label': '新河县',
                  'ssqename': ''
                },
                {
                  'value': '130531',
                  'label': '广宗县',
                  'ssqename': ''
                },
                {
                  'value': '130532',
                  'label': '平乡县',
                  'ssqename': ''
                },
                {
                  'value': '130533',
                  'label': '威县',
                  'ssqename': ''
                },
                {
                  'value': '130534',
                  'label': '清河县',
                  'ssqename': ''
                },
                {
                  'value': '130535',
                  'label': '临西县',
                  'ssqename': ''
                },
                {
                  'value': '130581',
                  'label': '南宫市',
                  'ssqename': ''
                },
                {
                  'value': '130582',
                  'label': '沙河市',
                  'ssqename': ''
                }
              ]

            },
            {
              'value': '130600',
              'label': '保定市',
              'ssqename': '',

              'children': [
                {
                  'value': '130602',
                  'label': '新市区',
                  'ssqename': ''
                },
                {
                  'value': '130603',
                  'label': '北市区',
                  'ssqename': ''
                },
                {
                  'value': '130604',
                  'label': '南市区',
                  'ssqename': ''
                },
                {
                  'value': '130621',
                  'label': '满城县',
                  'ssqename': ''
                },
                {
                  'value': '130622',
                  'label': '清苑县',
                  'ssqename': ''
                },
                {
                  'value': '130623',
                  'label': '涞水县',
                  'ssqename': ''
                },
                {
                  'value': '130624',
                  'label': '阜平县',
                  'ssqename': ''
                },
                {
                  'value': '130625',
                  'label': '徐水县',
                  'ssqename': ''
                },
                {
                  'value': '130626',
                  'label': '定兴县',
                  'ssqename': ''
                },
                {
                  'value': '130627',
                  'label': '唐县',
                  'ssqename': ''
                },
                {
                  'value': '130628',
                  'label': '高阳县',
                  'ssqename': ''
                },
                {
                  'value': '130629',
                  'label': '容城县',
                  'ssqename': ''
                },
                {
                  'value': '130630',
                  'label': '涞源县',
                  'ssqename': ''
                },
                {
                  'value': '130631',
                  'label': '望都县',
                  'ssqename': ''
                },
                {
                  'value': '130632',
                  'label': '安新县',
                  'ssqename': ''
                },
                {
                  'value': '130633',
                  'label': '易县',
                  'ssqename': ''
                },
                {
                  'value': '130634',
                  'label': '曲阳县',
                  'ssqename': ''
                },
                {
                  'value': '130635',
                  'label': '蠡县',
                  'ssqename': ''
                },
                {
                  'value': '130636',
                  'label': '顺平县',
                  'ssqename': ''
                },
                {
                  'value': '130637',
                  'label': '博野县',
                  'ssqename': ''
                },
                {
                  'value': '130638',
                  'label': '雄县',
                  'ssqename': ''
                },
                {
                  'value': '130681',
                  'label': '涿州市',
                  'ssqename': ''
                },
                {
                  'value': '130682',
                  'label': '定州市',
                  'ssqename': ''
                },
                {
                  'value': '130683',
                  'label': '安国市',
                  'ssqename': ''
                },
                {
                  'value': '130684',
                  'label': '高碑店市',
                  'ssqename': ''
                }
              ]

            },
            {
              'value': '130700',
              'label': '张家口市',
              'ssqename': '',

              'children': [
                {
                  'value': '130702',
                  'label': '桥东区',
                  'ssqename': ''
                },
                {
                  'value': '130703',
                  'label': '桥西区',
                  'ssqename': ''
                },
                {
                  'value': '130705',
                  'label': '宣化区',
                  'ssqename': ''
                },
                {
                  'value': '130706',
                  'label': '下花园区',
                  'ssqename': ''
                },
                {
                  'value': '130721',
                  'label': '宣化县',
                  'ssqename': ''
                },
                {
                  'value': '130722',
                  'label': '张北县',
                  'ssqename': ''
                },
                {
                  'value': '130723',
                  'label': '康保县',
                  'ssqename': ''
                },
                {
                  'value': '130724',
                  'label': '沽源县',
                  'ssqename': ''
                },
                {
                  'value': '130725',
                  'label': '尚义县',
                  'ssqename': ''
                },
                {
                  'value': '130726',
                  'label': '蔚县',
                  'ssqename': ''
                },
                {
                  'value': '130727',
                  'label': '阳原县',
                  'ssqename': ''
                },
                {
                  'value': '130728',
                  'label': '怀安县',
                  'ssqename': ''
                },
                {
                  'value': '130729',
                  'label': '万全县',
                  'ssqename': ''
                },
                {
                  'value': '130730',
                  'label': '怀来县',
                  'ssqename': ''
                },
                {
                  'value': '130731',
                  'label': '涿鹿县',
                  'ssqename': ''
                },
                {
                  'value': '130732',
                  'label': '赤城县',
                  'ssqename': ''
                },
                {
                  'value': '130733',
                  'label': '崇礼县',
                  'ssqename': ''
                }
              ]

            },
            {
              'value': '130800',
              'label': '承德市',
              'ssqename': '',

              'children': [
                {
                  'value': '130802',
                  'label': '双桥区',
                  'ssqename': ''
                },
                {
                  'value': '130803',
                  'label': '双滦区',
                  'ssqename': ''
                },
                {
                  'value': '130804',
                  'label': '鹰手营子矿区',
                  'ssqename': ''
                },
                {
                  'value': '130821',
                  'label': '承德县',
                  'ssqename': ''
                },
                {
                  'value': '130822',
                  'label': '兴隆县',
                  'ssqename': ''
                },
                {
                  'value': '130823',
                  'label': '平泉县',
                  'ssqename': ''
                },
                {
                  'value': '130824',
                  'label': '滦平县',
                  'ssqename': ''
                },
                {
                  'value': '130825',
                  'label': '隆化县',
                  'ssqename': ''
                },
                {
                  'value': '130826',
                  'label': '丰宁满族自治县',
                  'ssqename': ''
                },
                {
                  'value': '130827',
                  'label': '宽城满族自治县',
                  'ssqename': ''
                },
                {
                  'value': '130828',
                  'label': '围场满族蒙古族自治县',
                  'ssqename': ''
                }
              ]

            },
            {
              'value': '130900',
              'label': '沧州市',
              'ssqename': '',

              'children': [
                {
                  'value': '130902',
                  'label': '新华区',
                  'ssqename': ''
                },
                {
                  'value': '130903',
                  'label': '运河区',
                  'ssqename': ''
                },
                {
                  'value': '130921',
                  'label': '沧县',
                  'ssqename': ''
                },
                {
                  'value': '130922',
                  'label': '青县',
                  'ssqename': ''
                },
                {
                  'value': '130923',
                  'label': '东光县',
                  'ssqename': ''
                },
                {
                  'value': '130924',
                  'label': '海兴县',
                  'ssqename': ''
                },
                {
                  'value': '130925',
                  'label': '盐山县',
                  'ssqename': ''
                },
                {
                  'value': '130926',
                  'label': '肃宁县',
                  'ssqename': ''
                },
                {
                  'value': '130927',
                  'label': '南皮县',
                  'ssqename': ''
                },
                {
                  'value': '130928',
                  'label': '吴桥县',
                  'ssqename': ''
                },
                {
                  'value': '130929',
                  'label': '献县',
                  'ssqename': ''
                },
                {
                  'value': '130930',
                  'label': '孟村回族自治县',
                  'ssqename': ''
                },
                {
                  'value': '130981',
                  'label': '泊头市',
                  'ssqename': ''
                },
                {
                  'value': '130982',
                  'label': '任丘市',
                  'ssqename': ''
                },
                {
                  'value': '130983',
                  'label': '黄骅市',
                  'ssqename': ''
                },
                {
                  'value': '130984',
                  'label': '河间市',
                  'ssqename': ''
                }
              ]

            },
            {
              'value': '131000',
              'label': '廊坊市',
              'ssqename': '',

              'children': [
                {
                  'value': '131002',
                  'label': '安次区',
                  'ssqename': ''
                },
                {
                  'value': '131003',
                  'label': '广阳区',
                  'ssqename': ''
                },
                {
                  'value': '131022',
                  'label': '固安县',
                  'ssqename': ''
                },
                {
                  'value': '131023',
                  'label': '永清县',
                  'ssqename': ''
                },
                {
                  'value': '131024',
                  'label': '香河县',
                  'ssqename': ''
                },
                {
                  'value': '131025',
                  'label': '大城县',
                  'ssqename': ''
                },
                {
                  'value': '131026',
                  'label': '文安县',
                  'ssqename': ''
                },
                {
                  'value': '131028',
                  'label': '大厂回族自治县',
                  'ssqename': ''
                },
                {
                  'value': '131081',
                  'label': '霸州市',
                  'ssqename': ''
                },
                {
                  'value': '131082',
                  'label': '三河市',
                  'ssqename': ''
                }
              ]

            },
            {
              'value': '131100',
              'label': '衡水市',
              'ssqename': '',

              'children': [
                {
                  'value': '131102',
                  'label': '桃城区',
                  'ssqename': ''
                },
                {
                  'value': '131121',
                  'label': '枣强县',
                  'ssqename': ''
                },
                {
                  'value': '131122',
                  'label': '武邑县',
                  'ssqename': ''
                },
                {
                  'value': '131123',
                  'label': '武强县',
                  'ssqename': ''
                },
                {
                  'value': '131124',
                  'label': '饶阳县',
                  'ssqename': ''
                },
                {
                  'value': '131125',
                  'label': '安平县',
                  'ssqename': ''
                },
                {
                  'value': '131126',
                  'label': '故城县',
                  'ssqename': ''
                },
                {
                  'value': '131127',
                  'label': '景县',
                  'ssqename': ''
                },
                {
                  'value': '131128',
                  'label': '阜城县',
                  'ssqename': ''
                },
                {
                  'value': '131181',
                  'label': '冀州市',
                  'ssqename': ''
                },
                {
                  'value': '131182',
                  'label': '深州市',
                  'ssqename': ''
                }
              ]

            }

          ]

        },
        {
          'value': '140000',
          'label': '山西省',
          'ssqename': '',
          'children': [
            {
              'value': '140100',
              'label': '太原市',
              'ssqename': '',
              'children': [
                {
                  'value': '140105',
                  'label': '小店区',
                  'ssqename': ''
                },
                {
                  'value': '140106',
                  'label': '迎泽区',
                  'ssqename': ''
                },
                {
                  'value': '140107',
                  'label': '杏花岭区',
                  'ssqename': ''
                },
                {
                  'value': '140108',
                  'label': '尖草坪区',
                  'ssqename': ''
                },
                {
                  'value': '140109',
                  'label': '万柏林区',
                  'ssqename': ''
                },
                {
                  'value': '140110',
                  'label': '晋源区',
                  'ssqename': ''
                },
                {
                  'value': '140121',
                  'label': '清徐县',
                  'ssqename': ''
                },
                {
                  'value': '140122',
                  'label': '阳曲县',
                  'ssqename': ''
                },
                {
                  'value': '140123',
                  'label': '娄烦县',
                  'ssqename': ''
                },
                {
                  'value': '140181',
                  'label': '古交市',
                  'ssqename': ''
                }
              ]
            },
            {
              'value': '140200',
              'label': '大同市',
              'ssqename': '',
              'children': [
                {
                  'value': '140202',
                  'label': '城区',
                  'ssqename': ''
                },
                {
                  'value': '140203',
                  'label': '矿区',
                  'ssqename': ''
                },
                {
                  'value': '140211',
                  'label': '南郊区',
                  'ssqename': ''
                },
                {
                  'value': '140212',
                  'label': '新荣区',
                  'ssqename': ''
                },
                {
                  'value': '140221',
                  'label': '阳高县',
                  'ssqename': ''
                },
                {
                  'value': '140222',
                  'label': '天镇县',
                  'ssqename': ''
                },
                {
                  'value': '140223',
                  'label': '广灵县',
                  'ssqename': ''
                },
                {
                  'value': '140224',
                  'label': '灵丘县',
                  'ssqename': ''
                },
                {
                  'value': '140225',
                  'label': '浑源县',
                  'ssqename': ''
                },
                {
                  'value': '140226',
                  'label': '左云县',
                  'ssqename': ''
                },
                {
                  'value': '140227',
                  'label': '大同县',
                  'ssqename': ''
                }
              ]
            },
            {
              'value': '140300',
              'label': '阳泉市',
              'ssqename': '',
              'children': [
                {
                  'value': '140302',
                  'label': '城区',
                  'ssqename': ''
                },
                {
                  'value': '140303',
                  'label': '矿区',
                  'ssqename': ''
                },
                {
                  'value': '140311',
                  'label': '郊区',
                  'ssqename': ''
                },
                {
                  'value': '140321',
                  'label': '平定县',
                  'ssqename': ''
                },
                {
                  'value': '140322',
                  'label': '盂县',
                  'ssqename': ''
                }
              ]
            },
            {
              'value': '140400',
              'label': '长治市',
              'ssqename': '',
              'children': [
                {
                  'value': '140402',
                  'label': '城区',
                  'ssqename': ''
                },
                {
                  'value': '140411',
                  'label': '郊区',
                  'ssqename': ''
                },
                {
                  'value': '140421',
                  'label': '长治县',
                  'ssqename': ''
                },
                {
                  'value': '140423',
                  'label': '襄垣县',
                  'ssqename': ''
                },
                {
                  'value': '140424',
                  'label': '屯留县',
                  'ssqename': ''
                },
                {
                  'value': '140425',
                  'label': '平顺县',
                  'ssqename': ''
                },
                {
                  'value': '140426',
                  'label': '黎城县',
                  'ssqename': ''
                },
                {
                  'value': '140427',
                  'label': '壶关县',
                  'ssqename': ''
                },
                {
                  'value': '140428',
                  'label': '长子县',
                  'ssqename': ''
                },
                {
                  'value': '140429',
                  'label': '武乡县',
                  'ssqename': ''
                },
                {
                  'value': '140430',
                  'label': '沁县',
                  'ssqename': ''
                },
                {
                  'value': '140431',
                  'label': '沁源县',
                  'ssqename': ''
                },
                {
                  'value': '140481',
                  'label': '潞城市',
                  'ssqename': ''
                }
              ]
            },
            {
              'value': '140500',
              'label': '晋城市',
              'ssqename': '',

              'children': [
                {
                  'value': '140502',
                  'label': '城区',
                  'ssqename': ''
                },
                {
                  'value': '140521',
                  'label': '沁水县',
                  'ssqename': ''
                },
                {
                  'value': '140522',
                  'label': '阳城县',
                  'ssqename': ''
                },
                {
                  'value': '140524',
                  'label': '陵川县',
                  'ssqename': ''
                },
                {
                  'value': '140525',
                  'label': '泽州县',
                  'ssqename': ''
                },
                {
                  'value': '140581',
                  'label': '高平市',
                  'ssqename': ''
                }
              ]
            },
            {
              'value': '140600',
              'label': '朔州市',
              'ssqename': '',

              'children': [
                {
                  'value': '140602',
                  'label': '朔城区',
                  'ssqename': ''
                },
                {
                  'value': '140603',
                  'label': '平鲁区',
                  'ssqename': ''
                },
                {
                  'value': '140621',
                  'label': '山阴县',
                  'ssqename': ''
                },
                {
                  'value': '140622',
                  'label': '应县',
                  'ssqename': ''
                },
                {
                  'value': '140623',
                  'label': '右玉县',
                  'ssqename': ''
                },
                {
                  'value': '140624',
                  'label': '怀仁县',
                  'ssqename': ''
                }
              ]
            },
            {
              'value': '140700',
              'label': '晋中市',
              'ssqename': '',

              'children': [
                {
                  'value': '140702',
                  'label': '榆次区',
                  'ssqename': ''
                },
                {
                  'value': '140721',
                  'label': '榆社县',
                  'ssqename': ''
                },
                {
                  'value': '140722',
                  'label': '左权县',
                  'ssqename': ''
                },
                {
                  'value': '140723',
                  'label': '和顺县',
                  'ssqename': ''
                },
                {
                  'value': '140724',
                  'label': '昔阳县',
                  'ssqename': ''
                },
                {
                  'value': '140725',
                  'label': '寿阳县',
                  'ssqename': ''
                },
                {
                  'value': '140726',
                  'label': '太谷县',
                  'ssqename': ''
                },
                {
                  'value': '140727',
                  'label': '祁县',
                  'ssqename': ''
                },
                {
                  'value': '140728',
                  'label': '平遥县',
                  'ssqename': ''
                },
                {
                  'value': '140729',
                  'label': '灵石县',
                  'ssqename': ''
                },
                {
                  'value': '140781',
                  'label': '介休市',
                  'ssqename': ''
                }
              ]
            },
            {
              'value': '140800',
              'label': '运城市',
              'ssqename': '',

              'children': [
                {
                  'value': '140802',
                  'label': '盐湖区',
                  'ssqename': ''
                },
                {
                  'value': '140821',
                  'label': '临猗县',
                  'ssqename': ''
                },
                {
                  'value': '140822',
                  'label': '万荣县',
                  'ssqename': ''
                },
                {
                  'value': '140823',
                  'label': '闻喜县',
                  'ssqename': ''
                },
                {
                  'value': '140824',
                  'label': '稷山县',
                  'ssqename': ''
                },
                {
                  'value': '140825',
                  'label': '新绛县',
                  'ssqename': ''
                },
                {
                  'value': '140826',
                  'label': '绛县',
                  'ssqename': ''
                },
                {
                  'value': '140827',
                  'label': '垣曲县',
                  'ssqename': ''
                },
                {
                  'value': '140828',
                  'label': '夏县',
                  'ssqename': ''
                },
                {
                  'value': '140829',
                  'label': '平陆县',
                  'ssqename': ''
                },
                {
                  'value': '140830',
                  'label': '芮城县',
                  'ssqename': ''
                },
                {
                  'value': '140881',
                  'label': '永济市',
                  'ssqename': ''
                },
                {
                  'value': '140882',
                  'label': '河津市',
                  'ssqename': ''
                }
              ]
            },
            {
              'value': '140900',
              'label': '忻州市',
              'ssqename': '',

              'children': [
                {
                  'value': '140902',
                  'label': '忻府区',
                  'ssqename': ''
                },
                {
                  'value': '140921',
                  'label': '定襄县',
                  'ssqename': ''
                },
                {
                  'value': '140922',
                  'label': '五台县',
                  'ssqename': ''
                },
                {
                  'value': '140923',
                  'label': '代县',
                  'ssqename': ''
                },
                {
                  'value': '140924',
                  'label': '繁峙县',
                  'ssqename': ''
                },
                {
                  'value': '140925',
                  'label': '宁武县',
                  'ssqename': ''
                },
                {
                  'value': '140926',
                  'label': '静乐县',
                  'ssqename': ''
                },
                {
                  'value': '140927',
                  'label': '神池县',
                  'ssqename': ''
                },
                {
                  'value': '140928',
                  'label': '五寨县',
                  'ssqename': ''
                },
                {
                  'value': '140929',
                  'label': '岢岚县',
                  'ssqename': ''
                },
                {
                  'value': '140930',
                  'label': '河曲县',
                  'ssqename': ''
                },
                {
                  'value': '140931',
                  'label': '保德县',
                  'ssqename': ''
                },
                {
                  'value': '140932',
                  'label': '偏关县',
                  'ssqename': ''
                },
                {
                  'value': '140981',
                  'label': '原平市',
                  'ssqename': ''
                }
              ]
            },
            {
              'value': '141000',
              'label': '临汾市',
              'ssqename': '',

              'children': [
                {
                  'value': '141002',
                  'label': '尧都区',
                  'ssqename': ''
                },
                {
                  'value': '141021',
                  'label': '曲沃县',
                  'ssqename': ''
                },
                {
                  'value': '141022',
                  'label': '翼城县',
                  'ssqename': ''
                },
                {
                  'value': '141023',
                  'label': '襄汾县',
                  'ssqename': ''
                },
                {
                  'value': '141024',
                  'label': '洪洞县',
                  'ssqename': ''
                },
                {
                  'value': '141025',
                  'label': '古县',
                  'ssqename': ''
                },
                {
                  'value': '141026',
                  'label': '安泽县',
                  'ssqename': ''
                },
                {
                  'value': '141027',
                  'label': '浮山县',
                  'ssqename': ''
                },
                {
                  'value': '141028',
                  'label': '吉县',
                  'ssqename': ''
                },
                {
                  'value': '141029',
                  'label': '乡宁县',
                  'ssqename': ''
                },
                {
                  'value': '141030',
                  'label': '大宁县',
                  'ssqename': ''
                },
                {
                  'value': '141031',
                  'label': '隰县',
                  'ssqename': ''
                },
                {
                  'value': '141032',
                  'label': '永和县',
                  'ssqename': ''
                },
                {
                  'value': '141033',
                  'label': '蒲县',
                  'ssqename': ''
                },
                {
                  'value': '141034',
                  'label': '汾西县',
                  'ssqename': ''
                },
                {
                  'value': '141081',
                  'label': '侯马市',
                  'ssqename': ''
                },
                {
                  'value': '141082',
                  'label': '霍州市',
                  'ssqename': ''
                }
              ]
            },
            {
              'value': '142300',
              'label': '吕梁地区',
              'ssqename': '',

              'children': [
                {
                  'value': '142301',
                  'label': '孝义市',
                  'ssqename': ''
                },
                {
                  'value': '142302',
                  'label': '离石市',
                  'ssqename': ''
                },
                {
                  'value': '142303',
                  'label': '汾阳市',
                  'ssqename': ''
                },
                {
                  'value': '142322',
                  'label': '文水县',
                  'ssqename': ''
                },
                {
                  'value': '142323',
                  'label': '交城县',
                  'ssqename': ''
                },
                {
                  'value': '142325',
                  'label': '兴县',
                  'ssqename': ''
                },
                {
                  'value': '142326',
                  'label': '临县',
                  'ssqename': ''
                },
                {
                  'value': '142327',
                  'label': '柳林县',
                  'ssqename': ''
                },
                {
                  'value': '142328',
                  'label': '石楼县',
                  'ssqename': ''
                },
                {
                  'value': '142329',
                  'label': '岚县',
                  'ssqename': ''
                },
                {
                  'value': '142330',
                  'label': '方山县',
                  'ssqename': ''
                },
                {
                  'value': '142332',
                  'label': '中阳县',
                  'ssqename': ''
                },
                {
                  'value': '142333',
                  'label': '交口县',
                  'ssqename': ''
                }
              ]
            }
          ]
        }
      ],
      props: {
        value: 'label',
        children: 'cities'
      },
      filterText: '',
      columns: [
        {
          label: '分类名称',
          key: 'name',
          expand: true,
          width: 220,
          align: 'left'
        }
      ],
      treeData: [
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
          children: [
          ]
        }
      ],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        protectLevel: undefined,
        protectStatus: undefined,
        organization: undefined,
        sort: '+id'
      },
      protectStatusOptions,
      protectLevelOptions,
      sortOptions: [{ label: '时间 增序', key: '+id' }, { label: '时间 倒序', key: '-id' }],
      showReviewer: false,
      dialogImageUrl: '',
      dialogVisible: false,
      temp: {
        id: undefined,
        name: '', // 名称
        protectLevel: '', // 保护级别
        protectStatus: '', // 保护现状
        protectScope: '', // 保护范围
        publishedTime: '', // 公布时代
        publishedBatch: '', // 公布批次
        position: [], // 经纬度
        altitude: '', // 海拔高度
        organization: '',
        owner: '', // 所有者
        location: '', // 现在地址
        provinces: [],
        images: ['', '', ''],
        twoLinesImg: '',
        intro: '政府公布为第六批省级文物保护单位', // 简介
        preservationStatus: '', // 现存状况
        developmentControlArea: '', // 建设控制地带
        geographicPosition: '', // 地理位置
        createDate: new Date(),
        updateDate: new Date()
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      dialogPvVisible: false,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        location: [{ required: true, message: '现地址不能为空', trigger: 'blur' }]

      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleRemove(file, fileList) { // 图片移除
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) { // 图片预览
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    getList() {
      this.listLoading = true
      fetchInfoList(this.listQuery).then(response => {
        this.list = response.items
        this.total = response.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '', // 名称
        createDate: new Date(),
        protectLevel: '', // 保护级别
        protectStatus: '', // 保护现状
        protectScope: '', // 保护范围
        publishedTime: '', // 公布时代
        publishedBatch: '', // 公布批次
        position: [], // 经纬度
        altitude: '', // 海拔高度
        organization: '',
        owner: '', // 所有者
        location: '', // 现在地址
        provinces: [],
        images: ['', '', ''],
        twoLinesImg: '',
        intro: '政府公布为第六批省级文物保护单位', // 简介
        preservationStatus: '', // 现存状况
        developmentControlArea: '', // 建设控制地带
        geographicPosition: ''// 地理位置
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'admin'
          createInfo(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.updateDate = new Date(this.temp.updateDate)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.updateDate =new Date() // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateInfo(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '名称', // 名称
          '创建时间',
          '保护级别', // 保护级别
          '保护现状', // 保护现状
          '保护范围', // 保护范围
          '公布时代', // 公布时代
          '公布批次', // 公布批次
          '经纬度', // 经纬度
          '海拔高度', // 海拔高度
          '保管机构',
          '所有者', // 所有者
          '现在地址', // 现在地址
          '省市区',
          '简介:', // 简介
          '现存状况', // 现存状况
          '建设控制地带', // 建设控制地带
          '地理地址']
        const filterVal = [
          'name', // 名称
          'createDate:',
          'protectLevel', // 保护级别
          'protectStatus', // 保护现状
          'protectScope', // 保护范围
          'publishedTime', // 公布时代
          'publishedBatch', // 公布批次
          'position', // 经纬度
          'altitude', // 海拔高度
          'organization',
          'owner', // 所有者
          'location', // 现在地址
          'provinces',
          'intro:', // 简介
          'preservationStatus', // 现存状况
          'developmentControlArea', // 建设控制地带
          'geographicPosition']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'file-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    handleChange(val) {
    }
  }
}
</script>
