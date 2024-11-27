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
      ref="sysUserForm"
      :rules="rules"
      :model="form"
      label-position="left"
      label-width="125px"
      class="page-form"
      
      :inline-message="true"
      :show-message="true"
      style="padding: 15px 20px;"
    >
      <el-form-item label="登录账号" prop="username">
        <el-input v-model="form.username" placeholder="请输入登录账号" clearable :readonly="!isAdd" style="width: 80%;" />
      </el-form-item>
      <el-form-item label="用户名称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入用户名称" clearable :readonly="isDetail" style="width: 80%;" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号码" clearable :readonly="isDetail" style="width: 80%;" />
      </el-form-item>
      <el-form-item v-if="isAdd" label="登录密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入登录密码"
          clearable
          autocomplete="off"
          show-password
          style="width: 80%;"
        />
      </el-form-item>
      <el-form-item v-if="isAdd" label="确认密码" prop="confirmpassword">
        <el-input
          v-model="form.confirmpassword"
          type="password"
          placeholder="请输入确认密码"
          clearable
          autocomplete="off"
          show-password
          style="width: 80%;"
        />
      </el-form-item>
      <el-form-item label="所属部门" prop="departmentId">
        <tree-select
          :data="treeSelectData"
          :disabled="isDetail"
          :select-key.sync="form.departmentId"
          :select-label.sync="departmentName"
          style="width: 80%;"
        />
      </el-form-item>
      <el-form-item label="所属角色" prop="roleId">
        <el-select
          v-model="form.roleId"
          filterable
          class="filter-item"
          placeholder="请选择"
          :disabled="isDetail"
          style="width: 80%;"
        >
          <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
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
          <!--          <el-radio-button :label="2">锁定</el-radio-button>-->
        </el-radio-group>
      </el-form-item>

    </el-form>
    <el-divider />
    <div slot="footer" class="dialog-footer">
      <template v-if="isDetail">
        <el-button
          type="primary"
          
          @click="closeDialog()"
        >关闭
        </el-button>
      </template>
      <template v-else-if="isAdd">
        <el-button
          
          @click="closeDialog()"
        >取消
        </el-button>
        <el-button
          type="primary"
          
          @click="submitAddForm()"
        >保存
        </el-button>
      </template>
      <template v-else-if="isUpdate">
        <el-button @click="closeDialog()">取消</el-button>
        <el-button
          type="primary"
          
          @click="submitUpdateForm()"
        >修改
        </el-button>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import sysUserApi from '@/api/system/sys-user-api'
import sysDepartmentApi from '@/api/system/sys-department-api'
import sysRoleApi from '@/api/system/sys-role-api'
import TreeSelect from '@/components/TreeSelect'
import { validatePhone } from "@/utils/validate";

export default {
  name: 'SysUser',
  components: { TreeSelect },
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
    // eslint-disable-next-line no-unused-vars
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('必填'));
      } else {
        if (this.form.password !== '') {
          this.$refs.sysUserForm.validateField('password');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('必填'));
      } else if (value !== this.form.password) {
        callback(new Error('密码不一致'));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      dialogTitle: null,
      form: {
        id: null,
        username: null,
        nickname: null,
        phone: null,
        password: '',
        confirmpassword: '',
        gender: null,
        head: null,
        remark: null,
        state: 1,
        departmentId: null,
        roleId: null,
        deleted: null
      },
      departmentName: null,
      updateId: null,
      departmentOptions: null,
      roleOptions: null,
      treeSelectData: null,
      rules: {
        username: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 4, max: 16, message: '长度错误4-16', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 2, max: 10, message: '长度错误4-16', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度错误6-16', trigger: 'blur' }
        ],
        confirmpassword: [
          { required: true, trigger: 'blur', validator: validatePass2 }
        ],
        departmentId: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        roleId: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        state: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        remark: [
          { min: 1, max: 40, message: '长度错误1-40', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  created() {

  },
  mounted() {

  },
  methods: {
    clickHandler() {},
    /**
     * 打开对话框
     */
    openDialog(id) {
      if (this.isDetail) {
        this.rules = null;
        this.dialogTitle = '用户详情';
        this.getUserDetail(id);
      } else if (this.isAdd) {
        this.dialogTitle = '新增用户';
        this.getDepartmentTree();
        this.getRoleList();
      } else if (this.isUpdate) {
        this.dialogTitle = '修改用户';
        this.updateId = id;
        this.getUserDetail(id);
        this.getDepartmentTree();
        this.getRoleList();
      }
      this.dialogVisible = true;
    },
    /**
     * 关闭对话框
     */
    closeDialog() {
      this.resetForm();
      this.dialogVisible = false;
    },
    /**
     * 绑定部门数据
     */
    getDepartmentTree() {
      sysDepartmentApi.getDepartmentTree().then(response => {
        this.treeSelectData = response.data;
      });
    },
    /**
     * 绑定角色数据(正常状态)
     */
    getRoleList() {
      sysRoleApi.getList().then(response => {
        this.roleOptions = response.data;
        console.log(this.roleOptions)
      });
    },
    /**
     * 添加提交
     */
    submitAddForm() {
      console.log("form...")
      // console.log(this.form.departmentId)
      // console.log(this.departmentName)
      this.$refs.sysUserForm.validate((valid) => {
        console.log("？？？？？？？？")
        if (valid) {
          console.log('submit!')
          this.addUser()
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
      this.$refs.sysUserForm.validate((valid) => {
        if (valid) {
          console.log('submit!')
          this.updateUser()
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
    getUserDetail(id) {
      sysUserApi.detail(id).then(response => {
        if (response.code === 200) {
          this.form = response.data;
          if (this.isDetail) {
            this.form.roleId = response.data.roleName
          }
          this.departmentName = response.data.departmentName
        }
      });
    },
    /**
     * 添加保存
     */
    addUser() {
      console.log(this.form)
      const addParam = {
        username: this.form.username,
        nickname: this.form.nickname,
        phone: this.form.phone,
        password: this.form.password,
        remark: this.form.remark,
        state: this.form.state,
        departmentId: this.form.departmentId,
        roleId: this.form.roleId
      }
      sysUserApi.add(addParam).then(response => {
        if (response.code === 200) {
          this.closeDialog();
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
    updateUser() {
      const updateParam = {
        id: this.updateId,
        nickname: this.form.nickname,
        phone: this.form.phone,
        remark: this.form.remark,
        state: this.form.state,
        departmentId: this.form.departmentId,
        roleId: this.form.roleId
      }
      sysUserApi.update(updateParam).then(response => {
        if (response.code === 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.$emit('change');
          this.closeDialog();
        }
      })
    },
    /**
     * 重置表单
     */
    resetForm() {
      this.form.departmentId = null;
      this.departmentName = "";
      this.$refs.sysUserForm.resetFields();
    }
  }
}

</script>
