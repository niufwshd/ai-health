<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :before-close="closeDialog"
    custom-class="page-dialog bas-dict-dialog"
    width="50%"
    top="5vh"
  >
    <el-divider />
    <el-form
      ref="sysDictForm"
      :rules="rules"
      :model="form"
      label-position="left"
      label-width="125px"
      class="page-form"
      
      :inline-message="true"
      :show-message="true"
      style="padding: 15px 20px;"
    >
      <el-form-item label="名称" prop="dictName">
        <el-input v-model="form.dictName" :readonly="isDetail" style="width: 80%;" />
      </el-form-item>
      <el-form-item label="编码" prop="dictCode">
        <el-input v-model.number="form.dictCode" :readonly="isDetail" style="width: 80%;" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" :rows="5" type="textarea" :readonly="isDetail" style="width: 80%;" />
      </el-form-item>

    </el-form>
    <el-divider />
    <div slot="footer" class="dialog-footer">
      <template v-if="isDetail">
        <el-button type="primary"  @click="closeDialog();">关闭</el-button>
      </template>
      <template v-else-if="isAdd">
        <el-button  @click="closeDialog()">取消</el-button>
        <el-button type="primary"  @click="submitAddForm()">保存</el-button>
      </template>
      <template v-else-if="isUpdate">
        <el-button  @click="closeDialog()">取消</el-button>
        <el-button type="primary"  @click="submitUpdateForm()">修改</el-button>
      </template>
    </div>
    <!--    <sys-dict-item-list ref="child" :dict-code="form.dictCode" :show-dict-list-views="showDictListViews"></sys-dict-item-list>-->
  </el-dialog>

</template>

<script>

// import SysDictItemList from '@/views/system/sys-dict/sys-dict-item-list'
import { getDictDetail, addDict, updateDict } from '@/api/basics/bas-dict-api'

const formJson = {
  id: null,
  dictName: null,
  dictCode: null,
  description: null

}
export default {
  name: "SysDictProfile",
  components: {  },
  props: {
    isDetail: {
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: false
    },
    isUpdate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      showDictListViews: false,
      dialogTitle: null,
      form: formJson,
      rules: {
        dictCode: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { type: 'number', message: '必须为数字值' }
        ],
        dictName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },

  created() {

  },
  methods: {
    // 打开表单
    openDialog(id) {
      if (this.isAdd) {
        this.dialogTitle = '新增'
      } else if (this.isUpdate) {
        this.dialogTitle = '修改'
        this.getDictDetail(id)
      }
      this.dialogVisible = true
      this.showDictListViews = true
      // this.formData = JSON.parse(JSON.stringify(formJson))
    },
    // 关闭表单
    closeDialog() {
      this.showDictListViews = !this.showDictListViews
      this.resetForm()
      this.dialogVisible = false
    },
    submitAddForm() {
      this.$refs.sysDictForm.validate((valid) => {
        if (valid) {
          addDict(this.form).then(response => {
            if (response.code === 200) {
              this.closeDialog();
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.$emit('change')
            }
          })
        }
      });
    },
    submitUpdateForm() {
      updateDict(this.form).then(response => {
        if (response.code === 200) {
          this.closeDialog();
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$emit('change')
        }
      })
    },
    // 获取详情
    getDictDetail(id) {
      getDictDetail(id).then(response => {
        if (response.code === 200) {
          this.form = response.data
        }
      })
    },
    // 表单重置
    resetForm() {
      this.$refs.sysDictForm.resetFields();
      this.$refs.sysDictForm.clearValidate();
    }


  }
}
</script>

<style scoped>

</style>
