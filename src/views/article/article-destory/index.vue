<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        :placeholder="$t('档案名称')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.status" :placeholder="$t('审核状态')" clearable style="width: 105px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('搜索') }}
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

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top: 20px;"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('档案名称')" prop="id" align="center" min-width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('文件类型')" width="90px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.fileType==='0'">文字</span>
          <span v-else-if="scope.row.fileType==='1'">图片</span>
          <span v-else-if="scope.row.fileType==='2'">音频</span>
          <span v-else-if="scope.row.fileType==='3'">视频</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('介质类型')" width="100px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.medium==='0'">电子</span>
          <span v-else-if="scope.row.medium==='1'">纸质</span>
          <span v-else-if="scope.row.medium==='2'">电子加纸质</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('档案信息来源')" align="center" width="105">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.source==='0'">录入</el-tag>
          <el-tag v-else-if="scope.row.source==='1'">扫描</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('创建时间')" width="150px" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('审核状态')" width="90px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status==='0'">已销毁</span>
          <span v-else-if="scope.row.status==='2'">待审核</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" align="center" width="330" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleView(scope.row)">{{
            $t('查看') }}
          </el-button>
          <el-button v-show="scope.row.status!='0'" size="mini" type="danger" @click="handleUpdate(scope.row)">{{
            $t('审核') }}
          </el-button>
          <el-button v-show="scope.row.status!='0'" size="mini" type="success" @click="handleReturn(scope.row)">{{
            $t('退回') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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
        label-width="70px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item :label="$t('档案名称')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item :label="textMap[dialogStatus]+$t('意见')" prop="suggestion">
          <el-input v-model="temp.suggestion" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='return'?returnData():updateData()">{{ $t('确认') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="查看" :visible.sync="viewFormVisible">
      <el-form
        ref="viewForm"
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
        <el-form-item :label="$t('所在省市')" prop="county">
          <el-cascader
            v-model="temp.provinces"
            :label="请选择"
            :options="provinces"
            :props="props"
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
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, updateDestroy } from '@/api/article/destroy'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
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
const statusOptions = [
  { key: '0', display_name: '已销毁' },
  { key: '2', display_name: '待审核' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const fileTypeKeyValue = fileTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
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
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
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
        status: undefined,
        sort: '+id'
      },
      fileTypeOptions,
      mediumOptions,
      securityLevelOptions,
      digitalDeviceOptions,
      statusOptions,
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
        provinces: '', // /省市
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
        securityLevel: '', // 密级0,机密 1 内部 2外部
        digitalOwner: '', // 数字化责任人
        digitalTime: new Date(),
        digitalDevice: '',
        status: '1', // 档案状态0已销毁 1正常 2待销毁审核
        suggestion: '同意'// 审核意见
      },
      dialogFormVisible: false,
      viewFormVisible: false,
      dialogStatus: '',
      rowtemp: undefined,
      textMap: {
        update: '销毁',
        return: '退回'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {

      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
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
        id: '',
        name: '',
        fileNum: 'GZ-', // 文件编
        fileType: '', // 文件类型
        docType: {// 所属分类
          id: '',
          name: ''
        },
        provinces: '', // /省市
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
        securityLevel: '', // 密级0,机密 1 内部 2外部
        digitalOwner: '', // 数字化责任人
        digitalTime: new Date(),
        digitalDevice: '',
        status: '', // 档案状态0已销毁 1正常 2待销毁审核
        suggestion: ''
      }
    },
    handleView(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.updateDate = new Date(this.temp.updateDate)
      this.viewFormVisible = true
      this.$nextTick(() => {
        this.$refs['viewForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.updateDate = new Date(this.temp.updateDate)
      this.dialogStatus = 'update'
      this.temp.status = '0'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateDestroy(tempData).then(() => {
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
    handleReturn(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.updateDate = new Date(this.temp.updateDate)
      this.dialogStatus = 'return'
      this.temp.status = '1'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      // 从列表中删除
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    returnData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateDestroy(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '退回成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
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
            '档案状态', // 档案状态0已销毁 1正常 2待销毁审核
            '审核意见'
          ]
          const filterVal = [
            'name',
            'fileNum', // 文件编
            'fileType', // 文件类型
            'docType.name', // 所属分类,
            'county', // /省市
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
            'status', // 档案状态0已销毁 1正常 2待销毁审核
            'suggestion'
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
    }
  }
}
</script>
