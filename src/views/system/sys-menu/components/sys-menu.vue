<template>
  <el-dialog append-to-body :title="dialogTitle" :visible.sync="dialogVisible"
    custom-class="page-dialog sys-menu-dialog">
    <el-divider />
    <el-form ref="sysMenuForm" :rules="rules" :model="form" label-position="left" label-width="125px" class="page-form"
       :inline-message="true" :show-message="true" style="padding: 15px 20px;">
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入菜单名称" clearable :readonly="isDetail" style="width: 80%;" />
      </el-form-item>
      <el-form-item label="菜单编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入菜单编码" clearable :readonly="isDetail" style="width: 80%;" />
      </el-form-item>
      <el-form-item label="菜单路径" prop="url">
        <el-input v-model="form.url" placeholder="请输入菜单路径" clearable :readonly="isDetail" style="width: 80%;" />
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <span @click="handleMenuIcon">
          <el-input v-model="form.icon" placeholder="请选择菜单图标" readonly style="width: 80%;">
            <template slot="append">
              <i :class="menuIcon" />
            </template>
          </el-input>
        </span>
      </el-form-item>
      <el-form-item label="父级菜单" prop="parentId">
        <tree-select ref="treeSelect" :data="treeSelectData" :disabled="isDetail" clearable
          :select-key.sync="form.parentId" :select-label.sync="selectMenuName" :select-node.sync="selectNode"
          :select-data.sync="selectData" style="width: 80%;" />
      </el-form-item>
      <el-form-item label="菜单类型" prop="type">
        <el-radio-group v-model="form.type" :disabled="isDetail">
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="form.state" :disabled="isDetail">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="顺序号" prop="sort">
        <el-input-number v-model="form.sort" style="width: 80%;text-align:right;" controls-position="right"
          :disabled="isDetail" :min="0" :max="100" :readonly="isDetail" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" show-word-limit :rows="5" type="textarea" placeholder="请输入备注"
          :readonly="isDetail" style="width: 80%;" />
      </el-form-item>
    </el-form>
    <el-divider />
    <div slot="footer" class="dialog-footer">
      <template v-if="isDetail">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </template>
      <template v-else-if="isAdd">
        <el-button @click="restForm()">取消</el-button>
        <el-button type="primary" @click="submitAddForm()">保存</el-button>
      </template>
      <template v-else-if="isUpdate">
        <el-button @click="restForm()">取消</el-button>
        <el-button type="primary" @click="submitUpdateForm()">修改</el-button>
      </template>
    </div>
    <el-dialog width="460px" title="选择菜单图标" :visible.sync="innerVisible" append-to-body>
      <div class="menu-icon-container">
        <el-input v-model="form.icon" placeholder="请输入或选择菜单图标" clearable />
        <ul class="icon-list">
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-edit" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-edit" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-edit" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-edit" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-edit" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-edit" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-edit" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-edit" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-edit" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-edit" /></span></li>
          <li @click="choiceMenuIcon('el-icon-setting')"><span><i class="el-icon-setting" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-setting" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-setting" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-setting" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-setting" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-setting" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-setting" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-setting" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-setting" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-setting" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-user" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-user" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-user" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-user" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-user" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-user" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-user" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-user" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-user" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-user" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-s-fold" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-s-fold" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-s-fold" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-s-fold" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-s-fold" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-s-fold" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-s-fold" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-s-fold" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-s-fold" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-s-fold" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-s-data" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-s-data" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-s-data" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-s-data" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-s-data" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-s-data" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-s-data" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-s-data" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-s-data" /></span></li>
          <li @click="choiceMenuIcon('el-icon-edit')"><span><i class="el-icon-s-data" /></span></li>

        </ul>
      </div>
    </el-dialog>
  </el-dialog>

</template>

<script>

import TreeSelect from '@/components/TreeSelect'

import sysPermissionApi from '@/api/system/sys-permission-api'

export default {
  name: 'SysMenu',
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
    return {
      dialogVisible: false,
      innerVisible: false,
      dialogTitle: null,
      treeSelectData: null,
      selectMenuName: null,
      selectNode: null,
      selectData: null,
      menuIcon: '',
      form: {
        name: null,
        icon: null,
        code: null,
        url: null,
        type: null,
        parentId: null,
        level: 0,
        state: 1,
        sort: 0,
        remark: null
      },
      updateId: null,
      rules: {
        // TODO 菜单路径必须以/开头
        name: [
          { required: true, message: '必填', trigger: 'blur' }
          // { min: 2, max: 10, message: '长度错误2-10', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 4, max: 50, message: '长度错误4-50', trigger: 'blur' }
        ],
        // url: [
        //   { required: true, message: '必填', trigger: 'blur' },
        //   { min: 4, max: 90, message: '长度错误4-90', trigger: 'blur' }
        // ],
        type: [
          { required: true, message: '必填', trigger: 'change' }
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
    handle(id) {
      if (this.isDetail) {
        this.dialogTitle = '菜单详情';
        this.getMenuDetail(id);
        this.rules = null;
      } else if (this.isAdd) {
        this.dialogTitle = '新增菜单';
      } else if (this.isUpdate) {
        this.dialogTitle = '修改菜单';
        this.updateId = id;
        this.getMenuDetail(id);
      }
      this.getNavMenu()
      this.dialogVisible = true
    },
    getNavMenu() {
      sysPermissionApi.getNavMenuTree().then(response => {
        this.treeSelectData = response.data;
        this.showParentId()
      });
    },
    handleMenuIcon() {
      if (this.isDetail) {
        return;
      }
      this.innerVisible = true;
    },
    choiceMenuIcon(icon) {
      this.menuIcon = icon;
      this.innerVisible = false;
      this.form.icon = icon;
    },
    showParentId() {
      this.$nextTick(() => {
        this.$refs.treeSelect.getNode(this.form.parentId)
      })
    },
    setParentIdAndLevel() {
      if (!this.form.parentId) {
        this.form.parentId = 0
        this.form.level = 1
      }
      if (this.form.level === 0 && !this.selectData) {
        this.form.level = 1
      } else if (!this.selectData) {
        return;
      } else if (this.selectData.level === 1) {
        this.form.level = 2
      } else if (this.selectData.level === 2) {
        this.form.level = 3
      }
    },
    submitAddForm() {
      this.$refs.sysMenuForm.validate((valid) => {
        if (valid) {
          console.log('submit!')
          this.addMenu()
        } else {
          console.log('error submit!!')
          return false
        }
      });
    },
    submitUpdateForm() {
      this.$refs.sysMenuForm.validate((valid) => {
        if (valid) {
          console.log('submit!')
          this.updateMenu()
          // this.$emit("getList")
        } else {
          console.log('error submit!!')
          return false
        }
      });
    },
    getMenuDetail(id) {
      sysPermissionApi.detail(id).then(response => {
        if (response.code === 200) {
          this.form = response.data;
          this.menuIcon = this.form.icon;
        }
      });
    },
    addMenu() {
      this.setParentIdAndLevel()
      const addParam = {
        name: this.form.name,
        code: this.form.code,
        icon: this.form.icon,
        url: this.form.url,
        type: this.form.type,
        parentId: this.form.parentId,
        level: this.form.level,
        sort: this.form.sort,
        state: this.form.state,
        remark: this.form.remark
      }
      sysPermissionApi.add(addParam).then(response => {
        if (response.code === 200) {
          this.restForm();
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$emit('change')
        }
      })
    },
    updateMenu() {
      this.setParentIdAndLevel()
      const updateParam = {
        id: this.updateId,
        name: this.form.name,
        code: this.form.code,
        icon: this.form.icon,
        url: this.form.url,
        type: this.form.type,
        parentId: this.form.parentId,
        level: this.form.level,
        sort: this.form.sort,
        state: this.form.state,
        remark: this.form.remark
      }
      sysPermissionApi.update(updateParam).then(response => {
        if (response.code === 200) {
          this.restForm();
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$emit('change')
        }
      })
    },
    restForm() {
      this.$refs.sysMenuForm.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.menu-icon-container {
  padding: 0px 10px;
}

.menu-icon-container .icon-list {
  /*border: 1px solid red;*/
  /*font-size: 30px;*/
  overflow: hidden;
  list-style: none;
  padding: 0 !important;
  border: 1px solid #eaeefb;
  border-radius: 4px;
}

.menu-icon-container .icon-list li {
  float: left;
  text-align: center;
  line-height: 30px;
  color: #666;
  font-size: 13px;
  /*border-right: 1px solid #eee;*/
  /*border-bottom: 1px solid #eee;*/
  margin-right: -1px;
  margin-bottom: -1px;
}

.menu-icon-container .icon-list li span {
  width: 40px;
  height: 40px;
  line-height: 40px;
  display: inline-block;
  vertical-align: middle;
  font-size: 20px;
}

.menu-icon-container .icon-list li i:hover {
  color: #1890ff;
  font-size: 25px;
}
</style>
