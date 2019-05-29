<template>
  <div class="app-container">
    <el-col :span="24" :xs="24" align="center">
      <el-card style="margin-bottom:20px;">
        <div slot="header" class="clearfix">
          <span>个人信息修改</span>
        </div>
        <div class="user-profile">
          <div class="box-center">
            <el-upload
              v-show="!imagecropperShow"
              class="avatar-uploader"
              action="123"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </div>
          <div class="box-center">
            <el-form
              ref="dataForm"
              :rules="rules"
              :model="userInfo"
              label-position="left"
              label-width="100px"
              style="width: 600px; margin-top: 20px"
              :disabled="editable"
            >
              <el-form-item :label="$t('用户昵称')" prop="nickname">
                <el-input v-model="userInfo.nickname" />
              </el-form-item>
              <el-form-item :label="$t('登录账号')" prop="username">
                <el-input v-model="userInfo.username" />
              </el-form-item>
              <el-form-item :label="$t('性别')" prop="sex">
                <el-select v-model="userInfo.sex" placeholder="请选择" style="width: 500px;">
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
            </el-form>
          </div>
        </div>
        <div class="dialog-footer" align="center">
          <el-button @click="editable = true">{{ $t('放弃修改') }}</el-button>
          <el-button type="primary" style="margin-left: 160px" @click="updateData()">{{ $t('确认修改') }}</el-button>
        </div>
      </el-card>
    </el-col>
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
import { fileUpload } from '@/api/fileUpload'

import { updateUser } from '@/api/system/user'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import PanThumb from '@/components/PanThumb'
import ImageCropper from '@/components/ImageCropper'

const sexOptions = [
  { key: 0, display_name: '女' },
  { key: 1, display_name: '男' }
]

export default {
  name: 'ComplexTable',
  directives: { waves },
  components: { PanThumb, ImageCropper },
  filters: {
  },
  data() {
    return {
      imagecropperShow: false,
      imagecropperKey: 0,
      image: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',
      imageUrl: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',
      sexOptions,
      filterText: '',
      listQuery: { token: 'admin-token' },
      userInfo: null,
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
      // this.imageUrl = URL.createObjectURL(file.raw)
      // this.userInfo.avatar = res.data.url
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isGIF = file.type === 'image/gif'
      const isPNG = file.type === 'image/png'
      const isBMP = file.type === 'image/bmp'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error('上传头像图片只能是 JPG/GIF/PNG/BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      const fd = new FormData()
      fd.append('file', file)
      fileUpload(fd).then((res) => {
        this.imageUrl = 'http://' + res.data.url
        this.userInfo.avatar = this.imageUrl
        this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success',
          duration: 2000
        })
      })

      return isJPG && isLt2M
    }

  }

}
</script>
