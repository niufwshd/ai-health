<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :before-close="closeDialog"
    custom-class="page-dialog bas-dictItem-dialog"
    width="50%"
    top="5vh"
  >
    <el-divider />
    <el-form
      ref="sysDictItemForm"
      :rules="rules"
      :model="form"
      label-position="left"
      label-width="100px"
      class="page-form"
      
      :inline-message="true"
      :show-message="true"
      style="padding: 15px 20px;"
    >
      <el-form-item label="编码" prop="dictValue">
        <el-input v-model="form.dictValue" :readonly="isUpdate" style="width: 80%;"/>
      </el-form-item>
      <el-form-item label="名称" prop="dictText">
        <el-input v-model="form.dictText" :readonly="isDetail" style="width: 80%;" />
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
  </el-dialog>

</template>

<script>

import { addDictItem, getDictItemDetail, updateDictItem } from "@/api/basics/bas-dict-api";

const formJson = {
  dictId: null,
  dictText: null,
  dictValue: null,
  description: null

}

export default {
  name: "SysDicts",
  components: {},
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
    },
    dictId: {
      type: String,
      default: ''
    }

  },
  data() {
    return {
      dialogVisible: false,
      showDictListViews: false,
      dialogTitle: null,
      form: formJson,
      rules: {
        dictValue: [
          { required: true, message: '不能为空', trigger: 'blur' }
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
        this.form.dictId = this.dictId
        this.dialogTitle = '新增'
      } else if (this.isUpdate) {
        this.dialogTitle = '修改'
        this.getDictDetail(id)
      }
      this.dialogVisible = true
      // this.formData = JSON.parse(JSON.stringify(formJson))
    },
    // 关闭表单
    closeDialog() {
      this.resetForm()
      this.dialogVisible = false
    },
    submitAddForm() {
      this.$refs.sysDictItemForm.validate((valid) => {
        if (valid) {
          addDictItem(this.form).then(response => {
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
      updateDictItem(this.form).then(response => {
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
      getDictItemDetail(id).then(response => {
        if (response.code === 200) {
          this.form = response.data
        }
      })
    },
    // 表单重置
    resetForm() {
      this.$refs.sysDictItemForm.resetFields();
      this.$refs.sysDictItemForm.clearValidate();
    }


  }
}
</script>

<style scoped>

</style>
