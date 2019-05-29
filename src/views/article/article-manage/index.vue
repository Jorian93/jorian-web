<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        :placeholder="$t('文件名称')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.fileType"
        :placeholder="$t('文件类型')"
        style="width: 140px"
        clearable
        class="filter-item"
        @change="handleFilter"
      >
        <el-option v-for="item in fileTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select
        v-model="listQuery.medium"
        :placeholder="$t('介质类型')"
        style="width: 140px"
        clearable
        class="filter-item"
        @change="handleFilter"
      >
        <el-option v-for="item in mediumOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('搜索') }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('新增') }}
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >{{ $t('导出') }}
      </el-button>
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">{{ $t('table.reviewer') }}</el-checkbox>-->
    </div>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="140px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item :label="$t('档案名称')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item :label="$t('档案编号')" prop="fileNum">
          <el-input v-model="temp.fileNum" />
        </el-form-item>
        <el-form-item :label="$t('档案类型')" prop="fileType">
          <el-select v-model="temp.fileType" class="filter-item" placeholder="请选择">
            <el-option v-for="item in fileTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('存储介质')" prop="medium">
          <el-select v-model="temp.medium" class="filter-item" placeholder="请选择">
            <el-option v-for="item in mediumOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('档案分类')" prop="docType">
          <el-select v-model="temp.docType" class="filter-item" placeholder="请选择">
            <el-option v-for="item in mediumOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('所在省市')" prop="provinces">
          <el-cascader
            v-model="temp.provinces"
            expand-trigger="hover"
            :options="provinceOptions"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item :label="$t('经度')" prop="position">
          <el-input v-model="temp.position[0]" />
        </el-form-item>
        <el-form-item :label="$t('纬度')" prop="position">
          <el-input v-model="temp.position[1]" />
        </el-form-item>
        <el-form-item :label="$t('所属遗产点')" prop="heritage">
          <el-input v-model="temp.heritage.name" />
        </el-form-item>
        <el-form-item :label="$t('作者')" prop="author">
          <el-input v-model="temp.author" />
        </el-form-item>
        <el-form-item :label="$t('发文撰写单位')" prop="writeUnit">
          <el-input v-model="temp.writeUnit" />
        </el-form-item>
        <el-form-item :label="$t('撰写年代')" prop="writeTime">
          <el-input v-model="temp.writeTime" />
        </el-form-item>
        <el-form-item :label="$t('用途说明')" prop="usedfor">
          <el-input v-model="temp.usedfor" type="textarea" />
        </el-form-item>
        <el-form-item :label="$t('内容摘要')" prop="intro">
          <el-input v-model="temp.intro" type="textarea" />
        </el-form-item>
        <el-form-item :label="$t('图片')" prop="images">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :v-model="temp.images"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('相关链接')" prop="link">
          <el-input v-model="temp.link" />
        </el-form-item>
        <el-form-item :label="$t('档案编制人')" prop="compilationAuthor">
          <el-input v-model="temp.compilationAuthor" />
        </el-form-item>
        <el-form-item :label="$t('档案编制时间')" prop="compilationTime">
          <el-date-picker v-model="temp.compilationTime" type="datetime" placeholder="请选择时间" />
        </el-form-item>
        <el-form-item :label="$t('档案审定人')" prop="validator">
          <el-input v-model="temp.validator" />
        </el-form-item>
        <el-form-item :label="$t('档案审定时间')" prop="validateTime">
          <el-date-picker v-model="temp.validateTime" type="datetime" placeholder="请选择时间" />
        </el-form-item>
        <el-form-item :label="$t('档案编制单位')" prop="compilationUnit">
          <el-input v-model="temp.compilationUnit" />
        </el-form-item>
        <el-form-item :label="$t('档案存放单位')" prop="storage">
          <el-input v-model="temp.storage" />
        </el-form-item>
        <el-form-item :label="$t('纸质编码')" prop="paperNum">
          <el-input v-model="temp.paperNum" />
        </el-form-item>
        <el-form-item :label="$t('档案密级')" prop="securityLevel">
          <el-select v-model="temp.securityLevel" class="filter-item" placeholder="请选择">
            <el-option
              v-for="item in securityLevelOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('数字化责任人')" prop="digitalOwner">
          <el-input v-model="temp.digitalOwner" />
        </el-form-item>
        <el-form-item :label="$t('数字化设备')" prop="digitalDevice">
          <el-select v-model="temp.digitalDevice" class="filter-item" placeholder="请选择">
            <el-option
              v-for="item in digitalDeviceOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('数字化时间')" prop="digitalTime">
          <el-date-picker v-model="temp.digitalTime" type="datetime" placeholder="请选择时间" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('确认') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, createArticle, updateArticle } from '@/api/article/article'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import treeTable from '@/components/TreeTable'

const fileTypeOptions = [
  { key: '0', display_name: '文字' },
  { key: '1', display_name: '图片' },
  { key: '2', display_name: '音频' },
  { key: '3', display_name: '视频' }
]
const mediumOptions = [
  { key: '0', display_name: '电子' },
  { key: '1', display_name: '纸质' },
  { key: '2', display_name: '电子加纸质' }
]
const securityLevelOptions = [
  { key: '0', display_name: '机密' },
  { key: '1', display_name: '内部' },
  { key: '2', display_name: '外部' }
]
const digitalDeviceOptions = [
  { key: '0', display_name: '扫描仪' },
  { key: '1', display_name: '照相机' },
  { key: '2', display_name: '录音机' }
]

export default {
  name: 'ComplexTable',
  components: { Pagination, treeTable },
  directives: { waves },
  filters: {
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
      filterText: '',
      columns: [
        {
          label: '分类名称',
          key: 'name',
          expand: true,
          align: 'left',
          width: 220
        }
      ],
      treeData: data,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        fileType: undefined,
        medium: undefined,
        status: '1',
        sort: '+id'
      },
      fileTypeOptions,
      mediumOptions,
      securityLevelOptions,
      digitalDeviceOptions,
      sortOptions: [{ label: '时间 增序', key: '+id' }, { label: '时间 倒序', key: '-id' }],
      temp: {
        id: '',
        name: '',
        fileNum: 'GZ-', // 文件编
        fileType: '', // 文件类型
        docType: {// 所属分类
          id: '',
          name: ''
        },
        provinces: [], // /省市
        heritage: {
          id: '',
          name: '安庆大院'
        },
        medium: '', // 存储媒介
        author: '', // 作者
        writeUnit: '', // 撰写单位
        intro: '', // 内容摘要
        usedfor: '', // 用途
        writeTime: '', // 撰写年代
        source: '0',
        images: [],
        position: [],
        link: '', // 相关链接
        compilationAuthor: '', // 编制人员
        compilationTime: '', // 编制时间
        compilationUnit: '', // 编制单位
        storage: '',
        validator: '', // 审定人
        validateTime: '', // 审定时间
        paperNum: 'PA-', // 纸质编码
        createDate: new Date(), // 创建时间
        updateDate: new Date(), // 修改时间
        securityLevel: '', // 密级0,机密 1 内部 2外部
        digitalOwner: '', // 数字化责任人
        digitalTime: new Date(),
        digitalDevice: '',
        status: '1'// 档案状态0已销毁 1正常 2待销毁审核
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogImageUrl: '',
      dialogVisible: false,
      textMap: {
        update: '修改',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {

        name: [{ required: true, message: '文件名称为必填', trigger: 'blur' }],
        fileNum: [{ required: true, message: '文件名称为必填', trigger: 'blur' }], // 文件编
        fileType: [{ required: true, message: '类型必须选择', trigger: 'change' }], // 文件类型
        docType: [{ required: true, message: 'type is required', trigger: 'change' }],
        heritage: [{ required: true, message: '文件名称为必填', trigger: 'blur' }],
        medium: [{ required: true, message: '类型必须选择', trigger: 'change' }], // 存储媒介
        author: [{ required: true, message: '文件名称为必填', trigger: 'blur' }], // 作者
        writeUnit: [{ required: true, message: '文件名称为必填', trigger: 'blur' }], // 撰写单位
        intro: [{ required: true, message: '文件名称为必填', trigger: 'blur' }], // 内容摘要
        usedfor: [{ required: true, message: '文件名称为必填', trigger: 'blur' }], // 用途
        writeTime: [{ required: true, message: '文件名称为必填', trigger: 'blur' }], // 撰写年代
        position: [{ required: true, message: '文件名称为必填', trigger: 'blur' }],
        link: [{ required: true, message: '文件名称为必填', trigger: 'blur' }], // 相关链接
        compilationAuthor: [{ required: true, message: '文件名称为必填', trigger: 'blur' }], // 编制人员
        compilationTime: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        compilationUnit: [{ required: true, message: '文件名称为必填', trigger: 'blur' }], // 编制单位
        storage: [{ required: true, message: '文件名称为必填', trigger: 'blur' }],
        validator: [{ required: true, message: '文件名称为必填', trigger: 'blur' }], // 审定人
        paperNum: [{ required: true, message: '文件名称为必填', trigger: 'blur' }], // 纸质编码
        securityLevel: [{ required: true, message: '类型必须选择', trigger: 'change' }], // 密级0,机密 1 内部 2外部
        digitalOwner: [{ required: true, message: '文件名称为必填', trigger: 'blur' }], // 数字化责任人
        digitalDevice: [{ required: true, message: '类型必须选择', trigger: 'change' }]
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
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
        id: '',
        name: '',
        fileNum: 'GZ-', // 文件编
        fileType: '', // 文件类型
        docType: {// 所属分类
          id: '',
          name: ''
        },
        provinces: [], // /省市
        heritage: {
          id: '',
          name: '安庆大院'
        },
        medium: '', // 存储媒介
        author: '', // 作者
        writeUnit: '', // 撰写单位
        intro: '', // 内容摘要
        usedfor: '', // 用途
        writeTime: '', // 撰写年代
        source: '0',
        images: [],
        position: [],
        link: '', // 相关链接
        compilationAuthor: '', // 编制人员
        compilationTime: '', // 编制时间
        compilationUnit: '', // 编制单位
        storage: '',
        validator: '', // 审定人
        validateTime: '', // 审定时间
        paperNum: 'PA-', // 纸质编码
        createDate: new Date(), // 创建时间
        updateDate: new Date(),
        securityLevel: '', // 密级0,机密 1 内部 2外部
        digitalOwner: '', // 数字化责任人
        digitalTime: new Date(),
        digitalDevice: '',
        status: '1'// 档案状态0已销毁 1正常 2待销毁审核
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
          createArticle(this.temp).then(() => {
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
      this.dialogStatus = 'update'
      this.temp.updateDate = new Date(this.temp.updateDate)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
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
      this.temp = Object.assign({}, row)
      this.temp.status = '2'
      const tempData = Object.assign({}, this.temp)
      // 后台将状态改为2，待审核
      updateArticle(tempData).then(response => {
        this.list = response.items
        this.total = response.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
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
            '档案名称',
            '文件编号', // 文件编
            '文件类型', // 文件类型
            '文件分类', // 所属分类,
            '所属省市', // /省市
            '所属遗产点',
            '存储媒介', // 存储媒介
            '作者', // 作者
            '撰写单位', // 撰写单位
            '内容摘要', // 内容摘要
            '用途', // 用途
            '撰写年代', // 撰写年代
            '来源',
            '坐标',
            '相关链接', // 相关链接
            '编制人员', // 编制人员
            '编制时间', // 编制时间
            '编制单位', // 编制单位
            '保存单位',
            '审定人', // 审定人
            '审定时间', // 审定时间
            '纸质编码', // 纸质编码
            '创建时间', // 创建时间
            '更新时间',
            '保密等级', // 密级0,机密 1 内部 2外部
            '数字化责任人', // 数字化责任人
            '数字化时间',
            '数字化设备',
            '档案状态'// 档案状态0已销毁 1正常 2待销毁审核
          ]
          const filterVal = [
            'name',
            'fileNum', // 文件编
            'fileType', // 文件类型
            'docType.name', // 所属分类,
            'provinces', // /省市
            'heritage.name',
            'medium', // 存储媒介
            'author', // 作者
            'writeUnit', // 撰写单位
            'intro', // 内容摘要
            'usedfor', // 用途
            'writeTime', // 撰写年代
            'source',
            'position',
            'link', // 相关链接
            'compilationAuthor', // 编制人员
            'compilationTime', // 编制时间
            'compilationUnit', // 编制单位
            'storage',
            'validator', // 审定人
            'validateTime', // 审定时间
            'paperNum', // 纸质编码
            'createDate', // 创建时间
            'updateDate',
            'securityLevel', // 密级0,机密 1 内部 2外部
            'digitalOwner', // 数字化责任人
            'digitalTime',
            'digitalDevice',
            'status'// 档案状态0已销毁 1正常 2待销毁审核
          ]
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
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

    },
    handleNodeClick(value, data,) {
      alert(value)
    }

  }

}
</script>
