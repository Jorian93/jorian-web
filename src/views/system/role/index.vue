<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" :placeholder="$t('角色名')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column :label="$t('角色名称')" width="130px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('角色描述')" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('权限树')" min-width="100px" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="viewPermission(scope.row)">查看权限树</el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('创建时间')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" align="center" width="330" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
        <el-form-item :label="$t('角色名称')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item :label="$t('角色描述')" prop="name">
          <el-input v-model="temp.description" />
        </el-form-item>
        <el-form-item :label="$t('权限树')">
          <el-tree
            ref="tree2"
            :data="permission"
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="defaultPermissionKeys"
            :props="defaultProps"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPermissionVisible" :title="$t('权限树')" center>
      <el-tree
        ref="tree"
        :data="permission"
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultPermissionKeys"
        show-checkbox
        :props="defaultProps"
      />
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, createRole, updateRole, deleteRole } from '@/api/system/role'
import { fetchTree, fetchTreeCheckedNode } from '@/api/system/resource'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Role',
  components: { Pagination },
  directives: { waves },
  filters: {

  },
  data() {
    return {
      tableKey: 0,
      list: null,
      permission: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      permissionChecked: [],
      defaultPermissionKeys: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: ''
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID 增序', key: '+id' }, { label: 'ID 倒序', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        name: '',
        description: '',
        resources: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新建角色'
      },
      dialogPermissionVisible: false,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        name: [{ required: true, message: 'title is required', trigger: 'blur' }]
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
      // 获取所有树
      fetchTree().then((response) => {
        this.permission = response.data
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
        id: undefined,
        name: '',
        description: '',
        resources: [
          {
            id: ''
          }
        ],
        updateTime: new Date(),
        createTime: new Date()
      }
    },
    getCheckedKeys() {
      return this.$refs.tree2.getCheckedKeys()
    },
    getCheckedKeysHalf() {
      return this.$refs.tree2.getHalfCheckedKeys()
    },
    setCheckedKeys(checkedKeys) {
      this.$refs.tree2.setCheckedKeys(checkedKeys)
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
      this.$refs.tree2.setCheckedKeys([])
    },
    viewPermission(row) {
      this.temp = Object.assign({}, row) // copy obj
      // 获取角色有的树
      fetchTreeCheckedNode(row.id).then((response) => {
        this.defaultPermissionKeys = response.data
      })

      this.dialogPermissionVisible = true
      this.$nextTick(() => {
        this.resetChecked()
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.permissionChecked = []
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.resetChecked()// 清空选择点
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const checkedKeys = this.getCheckedKeys().concat(this.getCheckedKeysHalf())
          const resources = []
          checkedKeys.forEach(item => {
            const resource = {}
            resource.id = item
            resources.push(resource)
          })
          this.temp.resources = resources
          const tempData = Object.assign({}, this.temp)
          // 前台插入
          this.list.unshift(this.temp)
          this.dialogFormVisible = false
          // 后台插入
          createRole(tempData).then(() => {
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
      this.temp.updateDate = +new Date(this.temp.updateDate)// change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // 获取角色有的树
      fetchTreeCheckedNode(row.id).then((response) => {
        this.defaultPermissionKeys = response.data
      })
      this.$nextTick(() => {
        this.resetChecked()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const checkedKeys = this.getCheckedKeys().concat(this.getCheckedKeysHalf())
          const resources = []
          checkedKeys.forEach(item => {
            const resource = {}
            resource.id = item
            resources.push(resource)
          })
          this.temp.resources = resources
          const tempData = Object.assign({}, this.temp)
          updateRole(tempData).then((response) => {
            this.dialogFormVisible = false
            this.$notify({
              title: response.code,
              message: response.msg,
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleDelete(row) {
      // 前台先删除
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
      this.dialogFormVisible = false
      // 后台删除
      deleteRole(row.id).then(() => {
        this.$notify({
          title: '200',
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
