<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.nickname" :placeholder="$t('昵称')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.username" :placeholder="$t('用户名')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.company" :placeholder="$t('所属单位')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" :placeholder="$t('状态')" clearable style="width: 90px" class="filter-item">
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
      @sort-change="sortChange"
    >
      <el-table-column v-if="false" :label="$t('序号')" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('账户名')" width="130px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('昵称')" width="130px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('性别')" width="65px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.sex==0 ">女</span>
          <span v-else-if="scope.row.sex==1 ">男</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('角色')" align="center" min-width="185">
        <template slot-scope="scope">
          <el-tag v-for="role in scope.row.roles">{{ role.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('单位名称')" min-width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.company }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('状态')" width="65px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status ==1 " style="color:springgreen;">正常</span>
          <span v-else-if="scope.row.status == 0" style="color:red;">异常</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('手机号')" class-name="status-col" min-width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('创建时间')" width="170px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" align="center" min-width="260" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}
          </el-button>
          <el-button v-if="scope.row.status" size="mini" @click="handleModifyStatus(scope.row,0)">{{ $t('table.lock') }}
          </el-button>
          <el-button v-else-if="!scope.row.status" size="mini" @click="handleModifyStatus(scope.row,1)">{{ $t('table.unlock') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
        <el-form-item :label="$t('账户名')" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item :label="$t('昵称')" prop="nickname">
          <el-input v-model="temp.nickname" />
        </el-form-item>
        <el-form-item v-if="isShowPassword" :label="$t('密码')" prop="password">
          <el-input v-model="temp.password" type="password" />
        </el-form-item>
        <el-form-item v-if="isShowPassword" :label="$t('重复密码')" prop="repassword">
          <el-input v-model="repassword" type="password" />
        </el-form-item>
        <el-form-item :label="$t('角色')" prop="roleNameChecked">
          <el-checkbox-group v-model="roleNameChecked">
            <el-checkbox v-for="item in rolesOptions" :key="item" :label="item.name">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('公司')" prop="company">
          <el-input v-model="temp.company" />
        </el-form-item>
        <el-form-item :label="$t('手机号')" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item :label="$t('性别')">
          <el-select v-model="temp.sex" class="filter-item" :placeholder="$t('table.selectplaceholder')">
            <el-option v-for="item in sexOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('状态')">
          <el-select v-model="temp.status" class="filter-item" :placeholder="$t('table.selectplaceholder')">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchUserList, createUser, updateUser, deleteUser } from '@/api/system/user'
import { fetchList } from '@/api/system/role'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { validUsername, validPassword } from '@/utils/validate'
import { Message } from 'element-ui'

const sexOptions = [
  { key: 0, display_name: '女' },
  { key: 1, display_name: '男' }
]
const statusOptions = [
  { key: 0, display_name: '锁定' },
  { key: 1, display_name: '正常' }
]
// arr to obj ,such as { CN : "China", US : "USA" }
const validateUsername = (rule, value, callback) => {
  if (!validUsername(value)) {
    callback(new Error('用户名应该由4到16位字母数字组成'))
  } else {
    callback()
  }
}
const validatePassword = (rule, value, callback) => {
  if (!validPassword(value)) {
    callback(new Error('密码应该由6到10位字母数字组成'))
  } else {
    callback()
  }
}

export default {
  name: 'Login',
  components: { Pagination },
  directives: { waves },
  filters: {
  },
  data() {
    const validateRePassword = () => {
      if (!validPassword(this.repassword)) {
        Message({
          message: '密码应该由6到10位字母数字组成',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        if (!this.repassword === this.password) {
          Message({
            message: '两次输入不一致',
            type: 'error',
            duration: 5 * 1000
          })
        }
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      isShowPassword: false,
      repassword: '',
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        username: '',
        nickname: '',
        company: '',
        status: ''
      },
      sortOptions: [{ label: 'ID 增序', key: '+id' }, { label: 'ID 倒序', key: '-id' }],
      sexOptions,
      statusOptions,
      rolesOptions: [],
      roleNameChecked: [],
      showReviewer: false,
      temp: {
        id: '',
        createTime: '',
        updateTime: '',
        nickname: '',
        username: '',
        password: '',
        roles: [],
        sex: '',
        status: '',
        company: '',
        phone: '',
        email: '',
        avatar: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新建'
      },
      dialogPvVisible: false,
      rules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        /* repassword: [{ required: true, trigger: 'blur', validator: validateRePassword }]*/
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
      fetchUserList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
      // 后台获取所有角色
      fetchList().then((response) => {
        this.rolesOptions = response.data.records
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      row.status = status
      this.temp = Object.assign({}, row)
      this.temp.updateTime = (new Date()) | parseTime
      for (const v of this.list) {
        if (v.id === this.temp.id) {
          const index = this.list.indexOf(v)
          this.list.splice(index, 1, this.temp)
          break
        }
      }
      this.dialogFormVisible = false
      updateUser(this.temp).then(() => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = 'id'
      } else {
        this.listQuery.sort = 'id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.roleNameChecked = []
      this.repassword = ''
      this.temp = {
        id: '',
        createTime: undefined,
        updateTime: undefined,
        nickname: undefined,
        username: undefined,
        password: undefined,
        roles: [],
        sex: undefined,
        status: undefined,
        company: undefined,
        phone: undefined,
        email: undefined,
        avatar: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.isShowPassword = true // 展现密码框
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          const roles = []
          this.roleNameChecked.forEach(rolename => {
            this.rolesOptions.forEach(role => {
              if (rolename === role.name) {
                roles.push(role)
              }
            })
          })
          tempData.roles = roles
          // 前台
          this.list.unshift(tempData)
          this.dialogFormVisible = false
          // 后台
          createUser(tempData).then(() => {
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
      // 初始化选中的角色
      this.roleNameChecked = []
      this.temp.roles.forEach(role => {
        this.roleNameChecked.push(role.name)
      })
      this.isShowPassword = false // 展现密码框
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
          const roles = []
          this.roleNameChecked.forEach(rolename => {
            this.rolesOptions.forEach(role => {
              if (rolename === role.name) {
                roles.push(role)
              }
            })
          })
          tempData.roles = roles
          for (const v of this.list) {
            if (v.id === tempData.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, tempData)
              break
            }
          }
          updateUser(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleDelete(row) {
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
      deleteUser(row.id).then(() => {
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
    }
  }
}
</script>
