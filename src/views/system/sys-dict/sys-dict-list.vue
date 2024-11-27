<template>
  <div class="app-container">
    <el-container>
      <el-aside width="220px" style="background-color: #FFF!important;">
        <el-card shadow="hover" class="box-card" :body-style="{ height: tableHeight + 180 + 'px' }"
          style="width: 200px;overflow-y: auto;">
          <div v-for="(item, index) in list" :key="index" class="itemType" @click="nodekey(item.id)">{{
          item.dictName
        }}
          </div>
        </el-card>
      </el-aside>

      <el-container>
        <el-main style="padding: 0;">
          <el-card class="box-card">
            <el-row>
              <el-col :span="4">
                <el-input v-model="searchValue" placeholder="请输入关键字进行查询" clearable class="input-with-select"
                   style="width:100%;padding-right: 10px;" />
              </el-col>
              <el-col :span="2">
                <el-button type="primary" icon="el-icon-search" @click="handleClear()">搜索</el-button>
              </el-col>
              <el-col :span="18" style="text-align: right;">
                <el-button type="primary" icon="el-icon-plus"  @click="handleAdd()">添加</el-button>
              </el-col>
            </el-row>
          </el-card>
          <el-card class="box-card">
            <el-table v-loading="listLoading" :data="itemList" border fit highlight-current-row style="width: 100%;"
              :height="tableHeight">
              <el-table-column label="编码" width="250px" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.dictValue }}</span>
                </template>
              </el-table-column>
              <el-table-column label="名称" width="250px" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.dictText }}</span>
                </template>
              </el-table-column>
              <el-table-column label="描述" min-width="200px" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.description }}</span>
                </template>
              </el-table-column>

              <el-table-column label="操作" align="center" width="120" class-name="operation" fixed="right">
                <template slot-scope="{row}">
                  <el-link type="warning" @click="handleForm(row.id)">修改</el-link>
                  <el-link type="danger" @click="handleDelete(row.id, row.dictName)">删除</el-link>

                </template>
              </el-table-column>
            </el-table>

            <pagination :total="total" :page.sync="listQueryItem.pageIndex" :limit.sync="listQueryItem.pageSize"
              @pagination="getDictItemList" />
          </el-card>
        </el-main>
      </el-container>
    </el-container>
    <sys-dict-item ref="addPage" is-add :dict-id="listQueryItem.dictId" @change="getDictItemList" />
    <sys-dict-item ref="updatePage" is-update @change="getDictItemList" />
  </div>

</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { getDictList, deleteDictItem, getDictItemList } from '@/api/basics/bas-dict-api'
import SysDictItem from './components/sys-dict-item'

const formJson = {
  dictName: null,
  dictValue: null,
  description: null
}
export default {
  name: 'SysDictList',
  components: { Pagination, SysDictItem },
  directives: { waves },
  data() {
    return {
      list: [],
      itemList: [],
      total: 0,
      dialog: false,
      searchColumn: 'keyword',
      searchValue: null,
      listLoading: true,
      dialogTitle: null,
      dialogVisible: false,
      isAdd: false,
      isUpdate: false,
      isDetail: false,
      listQuery: {
        pageIndex: 1,
        pageSize: 100,
        keyword: null,
        dictId: null,
        dictName: null,
        dictCode: null,
        description: null,
        pageSorts: []
      },
      listQueryItem: {
        pageIndex: 1,
        pageSize: 10,
        dictId: '3',
        keyword: null,
        pageSorts: []
      },
      form: formJson,
      rules: {
        dictName: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        dictCode: [
          { required: true, message: '编码不能为空', trigger: 'blur' }
        ]
      },
      tableHeight: window.innerHeight - 320
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        if ((window.innerHeight - 320) < 586) {
          this.tableHeight = 586
        } else {
          this.tableHeight = window.innerHeight - 320
        }
      })()
    }
  },
  created() {
    this.getList()
    this.getDictItemList()
  },
  methods: {
    filterNode() {

    },
    // 点击
    nodekey(id) {
      this.listQueryItem.dictId = id.toString()
      this.getDictItemList()
    },

    getList() {
      this.listLoading = true
      getDictList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
      })
      this.listLoading = false
    },
    // 字典明细
    getDictItemList() {
      this.listLoading = true
      getDictItemList(this.listQueryItem).then(response => {
        this.itemList = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },

    // 检索
    handleClear() {

    },
    //
    handleAdd() {
      this.$nextTick(() => {
        this.$refs.addPage.openDialog()
      })
    },
    handleForm(id) {
      this.$nextTick(() => {
        this.$refs.updatePage.openDialog(id)
      })
    },
    closeDialog() {
      this.resetForm()
      this.dialogVisible = false
    },
    handleDelete(id) {
      this.$confirm('您确定要删除 ?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDictItem(id).then(response => {
          if (response.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDictItemList()
          }
        })
      })
    },
    submitAddForm() {

    },
    submitUpdateForm() {

    },
    // 表单重置
    resetForm() {
      this.$refs.basProductForm.resetFields()
      this.$refs.basProductForm.clearValidate()
    }
  }
}
</script>

<style scoped>
aside {
  padding: 5px 5px;
}

.itemType {
  text-align: center;
  height: 35px;
  line-height: 35px;
  margin: 10px 0 10px 0;
  background-color: #ff4949;
  border-radius: 2px;
  color: white;
  cursor: pointer;

  /*text-align: center;*/
  /*height: 40px;*/
  /*line-height: 40px;*/
  /*margin: 0 0px 10px 0;*/
  /*background-color: #ff4949;*/
  /*border-radius: 2px;*/
  /*color: white;*/
  /*cursor: pointer;*/
  /*width:100%;*/
}

.cradstyle {
  border: 1px solid #E65D6E
}

.bg-purple-light {
  background: #7f0e28;
}

/*.app-container {*/
/*  position: relative;*/
/*  height: 84vh;*/
/*}*/

.area-left {
  height: 80vh;
  overflow: scroll;
}

.left-container {
  background-color: #ffffff;
  height: 100%;
  white: 30%;
}

.right-container {
  width: 100%;
  background-color: #ffffff;
  height: 100%;
}
</style>
