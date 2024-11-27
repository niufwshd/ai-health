<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :before-close="clickHandler"
    :close-on-click-modal="false"
    custom-class="page-dialog sys-role-dialog"
  >
    <el-divider />
    <el-form
      ref="sysRoleForm"
      :rules="rules"
      :model="form"
      label-position="left"
      label-width="125px"
      class="page-form"
      
      :inline-message="true"
      :show-message="true"
      style="padding: 15px 20px;"
    >
      <el-form-item label="角色代码" prop="code">
        <el-input v-model="form.code" :readonly="isDetail" style="width: 80%;" />
      </el-form-item>
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" :readonly="isDetail" style="width: 80%;" />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          :rows="5"
          type="textarea"
          placeholder="请输入备注"
          :readonly="isDetail"
          style="width: 80%;"
        />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="form.state" :disabled="isDetail">
          <el-radio-button :label="1">启用</el-radio-button>
          <el-radio-button :label="0">禁用</el-radio-button>
        </el-radio-group>
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
import sysRoleApi from '@/api/system/sys-role-api'
import { tesValid } from '@/utils/validate'

export default {
  name: 'SysRole',
  props: {
    // detail: 详细页面，add: 添加页面，update：编辑页面
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
      dialogTitle: null,
      form: {
        id: null,
        name: null,
        code: null,
        remark: null,
        state: 1
      },
      updateId: null,
      rules: {
        code: [
          { required: true, validator: tesValid, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 2, max: 16, message: '长度错误2-16', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '必填', trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  created() {

  },
  methods: {
    clickHandler() {
      this.resetForm()
      this.dialogVisible = false
      },
    /**
     * 打开对话框
     */
    openDialog(id) {
      if (this.isDetail) {
        console.log('detail...' + id)
        this.rules = null;
        this.dialogTitle = '角色详情';
        this.getRoleDetail(id);
      } else if (this.isAdd) {
        console.log('add...')
        this.dialogTitle = '新增角色';
      } else if (this.isUpdate) {
        console.log('update...')
        this.dialogTitle = '修改角色';
        this.updateId = id;
        this.getRoleDetail(id);
      }
      this.dialogVisible = true
    },
    /**
     * 关闭对话框
     */
    closeDialog() {
      this.resetForm();
      this.dialogVisible = false;
    },
    /**
     * 添加提交
     */
    submitAddForm() {
      this.$refs.sysRoleForm.validate((valid) => {
        if (valid) {
          console.log('submit!')
          this.addRole()
          // this.$emit("getList")
        } else {
          console.log('error submit!!')
          return false
        }
      });
    },
    /**
     * 修改提交
     */
    submitUpdateForm() {
      this.$refs.sysRoleForm.validate((valid) => {
        if (valid) {
          console.log('submit!')
          this.updateRole();
          this.closeDialog();
          // this.$emit("getList")
        } else {
          console.log('error submit!!')
          return false
        }
      });
    },
    /**
     * 获取详情
     * @param id
     */
    getRoleDetail(id) {
      sysRoleApi.detail(id).then(response => {
        if (response.code === 200) {
          this.form = response.data;
        }
      });
    },
    /**
     * 添加保存
     */
    addRole() {
      const addParam = {
        name: this.form.name,
        code: this.form.code,
        remark: this.form.remark,
        state: this.form.state
      }
      console.log(addParam)
      sysRoleApi.add(addParam).then(response => {
        if (response.code === 200) {
          this.resetForm();
          this.closeDialog()
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$emit('change')
        }
      })
    },
    /**
     * 修改保存
     */
    updateRole() {
      const updateParam = {
        id: this.updateId,
        name: this.form.name,
        code: this.form.code,
        remark: this.form.remark,
        state: this.form.state
      }
      sysRoleApi.update(updateParam).then(response => {
        if (response.code === 200) {
          this.resetForm();
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$emit('change')
        }
      })
    },
    /**
     * 重置表单
     */
    resetForm() {
      this.$refs.sysRoleForm.resetFields();
    }
  }
}
</script>
