<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" :placeholder="$t('用户名')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-select v-model="listQuery.status" :placeholder="$t('状态')" clearable style="width: 110px" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      :default-sort="{prop: 'createDate', order: 'descending'}"
      style="width: 100%;margin-top: 20px;"
    >
      <el-table-column v-if="false" :label="$t('序号')" prop="id" sortable align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('用户名')" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('昵称')" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('行为')" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.actionName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('接口地址')" min-width="140px" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.api }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('请求方式')" width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.httpMethod }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('ip')" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Ajax')" prop="status" width="100px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.ajax==1" style="color:springgreen;">是</span>
          <span v-else-if="scope.row.ajax==0" style="color:red;">否</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" :label="$t('请求参数')" min-width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.params }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('创建时间')" prop="createTime" sortable width="135px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('删除') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
        <el-form-item :label="$t('单位名称')" prop="company">
          <el-input v-model="temp.company" />
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
import { fetchList, deleteLog } from '@/api/system/log'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const statusOptions = [
  { key: 0, display_name: '是' },
  { key: 1, display_name: '否' }
]

export default {
  name: 'Log',
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
      listQuery: {
        page: 1,
        limit: 20,
        username: ''
      },
      statusOptions,
      showReviewer: false,
      temp: {
        id: '',
        username: '',
        nickname: '',
        ip: '',
        ajax: '',
        api: '',
        params: '',
        httpMethod: '',
        classMethod: '',
        actionName: '',
        createTime: '',
        updateTime: ''

      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        /* type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]*/
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

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDelete(row) {
      deleteLog(row.id).then((response) => {
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
        this.$notify({
          title: response.code,
          message: '删除成功',
          type: 'success',
          duration: 1500
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
    }
  }
}
</script>
