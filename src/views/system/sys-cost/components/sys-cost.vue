<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    custom-class="page-dialog sys-user-dialog"
  >
    <el-divider />
    <el-form
      ref="sysCostForm"
      :rules="rules"
      :model="form"
      label-position="left"
      label-width="125px"
      class="page-form"
      size="small"
      :inline-message="true"
      :show-message="true"
      style="padding: 15px 20px;"
    >
      <el-form-item label="发运地" prop="cityStartAddress">
        <el-input v-model="form.cityStartAddress" clearable style="width: 80%;" />
      </el-form-item>
      <el-form-item label="目的地" prop="cityEndAddress">
        <el-input v-model="form.cityEndAddress" clearable style="width: 80%;" />
      </el-form-item>
      <el-form-item label="重量单价" prop="weightPrice">
        <el-input v-model="form.weightPrice" clearable style="width: 80%;">
          <template>
            <slot slot="suffix" class="input-slot" style="margin-right:100px;">元/kg</slot>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="体积单价" prop="volumePrice">
        <el-input v-model="form.volumePrice" clearable style="width: 80%;">
          <template>
            <slot slot="suffix" class="input-slot" style="margin-right:100px;">元/m³</slot>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <el-divider />
    <div slot="footer" class="dialog-footer">
      <template v-if="isAdd">
        <el-button
          size="small"
          @click="closeDialog()"
        >取消
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="submitAddForm()"
        >保存
        </el-button>
      </template>
      <template v-else-if="isUpdate">
        <el-button @click="closeDialog()">取消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="submitUpdateForm()"
        >修改
        </el-button>
      </template>
    </div>
  </el-dialog>

</template>

<script>
import sysCostApi from '@/api/system/sys-cost-api'
import { checkMoney } from '@/utils/validate'

export default {
  name: "SysCost",
  components: {},
  props: {
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
      dialogTitle: null,
      dialogVisible: false,
      form: {
        id: null,
        cityStartAddress: null,
        cityEndAddress: null,
        weightPrice: null,
        volumePrice: null
      },
      rules: {
        cityStartAddress: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        cityEndAddress: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        weightPrice: [
          { required: true, validator: checkMoney, trigger: 'blur' }
        ],
        volumePrice: [
          { required: true, validator: checkMoney, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    /**
     * 打开对话框
     */
    openDialog(id) {
      if (this.isAdd) {
        this.dialogTitle = '新增'
      } else {
        this.dialogTitle = '修改'
        this.getDetail(id)
      }
      this.dialogVisible = true
    },
    closeDialog() {
      this.$refs['sysCostForm'].resetFields();
      this.dialogVisible = false
    },
    handleFilter() {
      this.closeDialog()
      this.resetForm()
    },
    getDetail(id) {
      sysCostApi.detail(id).then(response => {
        if (response.code === 200) {
          this.form = response.data
        }
      })
    },
    /**
     * 新增
     */
    submitAddForm() {
      this.$refs.sysCostForm.validate((valid) => {
        if (valid) {
          console.log('submit!')
          sysCostApi.add(this.form).then(response => {
            if (response.code === 200) {
              this.handleFilter()
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.$emit('change')
            }
          })
        }
      });
    },

    /**
     * 修改
     */
    submitUpdateForm() {
      this.$refs.sysCostForm.validate((valid) => {
        if (valid) {
          sysCostApi.update(this.form).then(response => {
            if (response.code === 200) {
              this.closeDialog()
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.$emit('change')
            }
          })
        }
      })
    },
    // 表单重置
    resetForm() {
      this.$refs.sysCostForm.resetFields();
      this.$refs.sysCostForm.clearValidate();
    }

  }
}
</script>

<style scoped>

</style>
