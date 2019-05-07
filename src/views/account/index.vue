<template>
  <div class="app-container">
    <label>个人信息修改</label>
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="userInfo"
      label-position="left"
      label-width="140px"
      style="width: 600px; margin-left:25%;margin-top: 20px"
      :disabled="editable"
    >
      <el-form-item :label="$t('用户昵称')" prop="nickname">
        <el-input v-model="userInfo.nickname" />
      </el-form-item>
      <el-form-item :label="$t('登录账号')" prop="username">
        <el-input v-model="userInfo.username" />
      </el-form-item>
      <el-form-item :label="$t('性别')" prop="sex">
        <el-select v-model="userInfo.sex" class="filter-item" placeholder="请选择">
          <el-option v-for="item in sexOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('电话')" prop="phone">
        <el-input v-model="userInfo.phone" />
      </el-form-item>
      <el-form-item :label="$t('邮箱')" prop="email">
        <el-input v-model="userInfo.email" />
      </el-form-item>
      <el-form-item :label="$t('公司')" prop="company">
        <el-input v-model="userInfo.company" />
      </el-form-item>
      <el-form-item :label="$t('头像')" prop="avatar">
        <!--<el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:8081/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="userInfo.avatar"   v-bind:src="userInfo.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>-->
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button @click="editable = true">{{ $t('放弃修改') }}</el-button>
      <el-button type="primary" style="margin-left: 160px" @click="updateData()">{{ $t('确认修改') }}</el-button>
    </div>
  </div>
</template>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
<script>
import { getInfo } from '@/api/account/account'
import { updateUser } from '@/api/system/user'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'

const sexOptions = [
  { key: 0, display_name: '女' },
  { key: 1, display_name: '男' }
]

export default {
  name: 'ComplexTable',
  directives: { waves },
  filters: {
  },
  data() {
    return {
      imageUrl: '',
      sexOptions,
      filterText: '',
      listQuery: { token: 'admin-token' },
      userInfo: null,
      avatarurl: '',
      total: 0,
      listLoading: true,
      id: '1001',
      temp: {
        id: '',
        createDate: '',
        nickname: '',
        username: '',
        password: '',
        roles: [],
        sex: '',
        status: '',
        company: '',
        phone: undefined,
        email: '',
        avatar: ''
      },
      editable: false,
      dialogStatus: '',
      dialogImageUrl: '',
      rules: {
        nickname: [{ required: true, message: '请填入昵称', trigger: 'blur' }],
        username: [{ required: true, message: '用户名不得为空', trigger: 'blur' }], // 文件编
        password: [{ required: true, message: '密码不得为空', trigger: 'blur' }]// 文件类型
      },
      downloadLoading: false
    }
  },
  created() {
    this.getUserDetail()
  },
  methods: {
    getUserDetail() {
      this.listLoading = true
      getInfo(this.listQuery).then(response => {
        this.userInfo = response.data
        this.imageUrl = this.userInfo.avatar
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.userInfo)
          updateUser(tempData).then(() => {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })

          this.editable = true
          location.reload()
        }
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
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.userInfo.avatar = this.imageUrl
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }

  }

}
</script>
