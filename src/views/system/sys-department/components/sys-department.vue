<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    custom-class="page-dialog sys-department-dialog"
  >
    <el-divider />
    <el-form
      ref="sysDepartmentForm"
      :rules="rules"
      :model="form"
      label-position="left"
      label-width="125px"
      class="page-form"
      
      :inline-message="true"
      :show-message="true"
      style="padding: 15px 20px;"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入部门名称" clearable :readonly="isDetail" style="width: 80%;" />
      </el-form-item>
      <el-form-item label="父级菜单" prop="parentId">
        <tree-select
          ref="treeSelect"
          :data="treeSelectData"
          :disabled="isDetail"
          clearable
          :select-key.sync="form.parentId"
          :select-label.sync="selectDepartmentName"
          :select-node.sync="selectNode"
          :select-data.sync="selectData"
          style="width: 80%;"
        />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="form.state" :disabled="isDetail">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <template>
          <el-input
            v-model="form.remark"
            :rows="5"
            type="textarea"
            clearable
            style="width: 50%"
          />
        </template>
      </el-form-item>
      <!--      <el-form-item label="顺序号" prop="sort">-->
      <!--        <el-input-number-->
      <!--          v-model="form.sort"-->
      <!--          style="width: 80%;text-align:right;"-->
      <!--          controls-position="right"-->
      <!--          :disabled="isDetail"-->
      <!--          :min="0"-->
      <!--          :max="100"-->
      <!--          :readonly="isDetail"-->
      <!--        />-->
      <!--      </el-form-item>-->
    </el-form>
    <el-divider />
    <div slot="footer" class="dialog-footer">
      <template v-if="isDetail">
        <el-button type="primary" @click="closeDialog()">关闭</el-button>
      </template>
      <template v-else-if="isAdd">
        <el-button @click="closeDialog()">取消</el-button>
        <el-button type="primary" @click="submitAddForm()">保存</el-button>
      </template>
      <template v-else-if="isUpdate">
        <el-button @click="closeDialog()">取消</el-button>
        <el-button type="primary" @click="submitUpdateForm()">修改</el-button>
      </template>
    </div>
  </el-dialog>

</template>

<script>

import TreeSelect from '@/components/TreeSelect'

import sysDepartmentApi from '@/api/system/sys-department-api'

export default {
  name: 'SysDepartment',
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
      selectDepartmentName: null,
      selectNode: null,
      selectData: null,
      form: {
        name: null,
        parentId: null,
        level: null,
        state: 1,
        sort: 0,
        remark: null
      },
      updateId: null,
      rules: {
        // TODO 菜单路径必须以/开头
        name: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 2, max: 10, message: '长度错误2-10', trigger: 'blur' }
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
        this.dialogTitle = '部门详情';
        this.getDepartmentDetail(id);
        this.rules = null;
      } else if (this.isAdd) {
        this.dialogTitle = '新增部门';
      } else if (this.isUpdate) {
        this.dialogTitle = '修改部门';
        this.updateId = id;
        this.getDepartmentDetail(id);
      }
      this.getNavDepartment()
      this.dialogVisible = true
    },
    getNavDepartment() {
      sysDepartmentApi.getDepartmentTree().then(response => {
        this.treeSelectData = [{ id: response.data[0].id, name: response.data[0].name }]
        setTimeout(() => {
          this.showParentId()
        }, 100)
      });
    },

    showParentId() {
      console.log(this.form.parentId, "数据值，，，，，？", this.selectDepartmentName, this.selectData)
      this.$nextTick(() => {
        this.$refs.treeSelect.getNode(this.form.parentId)
      })
    },
    setParentIdAndLevel() {
      if (!this.form.parentId) {
        this.form.parentId = 0
      }
      if (!this.selectData && !this.form.level) {
        this.form.level = 1
      } else if (!this.selectData && this.form.level) {
        this.form.level = this.form.level
      } else if (this.selectData.level === 1) {
        this.form.level = 2
      } else if (this.selectData.level === 2) {
        this.form.level = 3
      }
    },
    submitAddForm() {
      this.$refs.sysDepartmentForm.validate((valid) => {
        if (valid) {
          this.addDepartment()
        } else {
          return false
        }
      });
    },
    submitUpdateForm() {
      this.$refs.sysDepartmentForm.validate((valid) => {
        if (valid) {
          this.updateDepartment()
          // this.$emit("getList")
        } else {
          return false
        }
      });
    },
    getDepartmentDetail(id) {
      sysDepartmentApi.detail(id).then(response => {
        if (response.code === 200) {
          this.form = response.data;
          if (response.data.parentId === 0) {
            this.selectDepartmentName = ""
          }
        }
      });
    },
    addDepartment() {
      this.setParentIdAndLevel()
      const addParam = {
        name: this.form.name,
        parentId: this.form.parentId,
        level: this.form.level,
        sort: this.form.sort,
        state: this.form.state,
        remark: this.form.remark
      }
      sysDepartmentApi.add(addParam).then(response => {
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
    updateDepartment() {
      this.setParentIdAndLevel()
      const updateParam = {
        id: this.updateId,
        name: this.form.name,
        parentId: this.form.parentId,
        level: this.form.level,
        sort: this.form.sort,
        state: this.form.state,
        remark: this.form.remark
      }
      sysDepartmentApi.update(updateParam).then(response => {
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
    /**
     * 关闭
     */
    closeDialog() {
      this.restForm()
    },
    restForm() {
      this.$refs.sysDepartmentForm.resetFields()
      this.dialogVisible = false
      this.selectDepartmentName = null
      this.form.parentId = null
    }
  }
}
</script>

<style lang="scss">
.sys-department-dialog {
  //margin-top: 20px !important;
}

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
