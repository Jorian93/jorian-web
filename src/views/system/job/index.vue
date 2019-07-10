<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.jobName" :placeholder="$t('任务名称')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
     <el-select v-model="listQuery.status" :placeholder="$t('任务状态')" clearable style="width: 110px" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top: 20px;"
    >
      <el-table-column :label="$t('任务名称')" prop="id" sortable align="center" width="85">
        <template slot-scope="scope">
          <span>{{ scope.row.jobName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('任务详情')" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('CRON表达式')" min-width="70px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cron }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('执行Service')" prop="status" sortable width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.springBeanName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('执行Method')" prop="expireDate" sortable class-name="status-col" width="130px">
        <template slot-scope="scope">
          <span>{{ scope.row.methodName}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('任务类别')" prop="status" sortable width="110px" align="center">
        <template slot-scope="scope">
         <span v-if="scope.row.isSysJob" style="color:red;">系统任务</span>
          <span v-else="scope.row.isSysJob" style="color:springgreen;">常规任务</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('状态')" prop="status" sortable width="80px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status==1" style="color:springgreen;">执行中</span>
          <span v-else-if="scope.row.status==0" style="color:red;">已暂停</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('创建时间')" prop="createDate" sortable width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleUpdate(scope.row,'published')">{{ $t('修改') }}
          </el-button>
          <el-button v-if="scope.row.status" size="mini" @click="handleModifyStatus(scope.row,0)">{{ $t('暂停') }}
          </el-button>
          <el-button v-else-if="!scope.row.status" size="mini" @click="handleModifyStatus(scope.row,1)">{{ $t('启动') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('删除') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
        <el-form-item :label="$t('任务名称')" prop="jobName">
          <el-input v-model="temp.jobName" />
        </el-form-item>
        <el-form-item :label="$t('任务详情')" prop="description">
          <el-input v-model="temp.description" />
        </el-form-item>
        <el-form-item :label="$t('CRON表达式')" prop="cron">
          <el-autocomplete
            class="inline-input"
            v-model="temp.cron"
            :fetch-suggestions="querySearchCron"
            placeholder="请输入内容"
            @select="handleCronSelect"
          >
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
              <span class="addr">{{ item.desc }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item :label="$t('执行Service')" prop="springBeanName">
          <el-autocomplete
            class="inline-input"
            v-model="temp.springBeanName"
            :fetch-suggestions="querySearchService"
            placeholder="请输入内容"
            @select="handleServiceSelect"
          >
            <template slot-scope="{ item }">
              {{item}}
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item :label="$t('执行Method')" prop="methodName">
          <el-autocomplete
            class="inline-input"
            v-model="temp.methodName"
            :fetch-suggestions="querySearchMethod"
            placeholder="请输入内容"
            @select="handleMethodSelect"
          >
            <template slot-scope="{ item }">
              {{item}}
            </template>
          </el-autocomplete>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, createJob, updateJob,deleteJob } from '@/api/system/job'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const cronOptions = [
  { key: '', display_name: '每分钟执行1次' },
  { key: '', display_name: '每小时执行1次' },
  { key: '', display_name: '每天执行1次' },
]
const statusOptions = [
  { key: 0, display_name: '执行中' },
  { key: 1, display_name: '已暂停' }
]
export default {
  name: 'License',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'guo',
        1: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      crons:[],
      serviceNames:[],
      methodNames:[],
      listQuery: {
        page: 1,
        limit: 20,
        jobName: undefined,
        status: undefined,
      },
      showReviewer: false,
      cronOptions,
      temp: {
        id: "'",
        createTime: "",
        updateTime: "",
        jobName: "",
        description: "",
        cron: "",
        springBeanName: "",
        methodName: "",
        isSysJob: false,
        status: 1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        /* type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        */
        jobName: [{ required: true, message: '任务名称不得为空', trigger: 'blur' }],
        description: [{ required: true, message: '任务描述不得为空', trigger: 'blur' }],
        cron: [{ required: true, message: 'cron表达式不得为空', trigger: 'blur' }],
        springBeanName: [{ required: true, message: '服务类不得为空', trigger: 'blur' }],
        methodName: [{ required: true, message: '方法不得为空', trigger: 'blur' }],



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
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })

    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      row.status = status
      const tempData = Object.assign({}, row)
      updateJob(tempData).then(() => {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    sortChange(data) {
      const { prop, order } = data
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
        id: "'",
        jobName: "",
        description: "",
        cron: "",
        springBeanName: "",
        methodName: "",
        isSysJob: false,
        status: 0,
        createTime: undefined,
        updateTime: undefined,
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
          const tempData = Object.assign({}, this.temp)
          createJob(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) //
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
          tempData.createTime = +new Date(tempData.createTime) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          tempData.status = 1 //置为启动状态
          updateJob(tempData).then(() => {
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
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
      deleteJob(row.id).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
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
    formatter(row, column) {
      return row.address
    },
    querySearchCron(queryString, cb){
      let crons = this.crons;
      let results = queryString ? crons.filter(this.createFilter(queryString)) : crons;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    querySearchService(queryString, cb){
      let serviceNames = this.serviceNames;
      let results = queryString ? serviceNames.filter(this.createFilter(queryString)) : serviceNames;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    querySearchMethod(queryString, cb){
      let methodNames = this.methodNames;
      let results = queryString ? methodNames.filter(this.createFilter(queryString)) : methodNames;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (item) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    loadAllCrons() {
      this.crons = [
        { 'value': "0/5 * * * * ? ", "desc": "每5秒执行1次" },
        { 'value': "0 0/5 0 1/1 * ? *", "desc": "每5分钟执行1次" },
        { 'value': "0 0 0/1 * * ? *", "desc": "每1小时执行1次" },
        { 'value': "0 0 0 1/1 * ? *", "desc": "每1天0:00点执行1次" },
      ];
    },
    loadAllServices() {
      this.serviceNames =  [
        'logServiceImpl','logServiceImpl','logServiceImpl','logServiceImpl'
    ];
    },
    loadAllMethods() {
      this.methodNames =  [
        'deleteAllLogs','addUser','deleteAllLogs','deleteAllLogs'
      ];
    },
    handleCronSelect(item) {
      this.temp.cron = item.value
    },
    handleServiceSelect(item) {
      this.temp.springBeanName = item
    },
    handleMethodSelect(item) {
      this.temp.methodName = item
      console.log(this.temp.springBeanName+this.temp.cron +this.temp.methodName)
    }
  },
  mounted() {
    this.loadAllCrons()
    this.loadAllServices()
    this.loadAllMethods()
  }
}
</script>
