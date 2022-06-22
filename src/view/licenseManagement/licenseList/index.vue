<template>
  <div>
    <el-row class="searchForm">
      <el-col :span="18">
        <el-form
          :inline="true"
          :model="searchForm"
          class="demo-form-inline"
          label-width="85px"
        >
          <el-form-item label="订单号">
            <el-input
              v-model="searchForm.orderFormNo"
              placeholder="订单号"
            ></el-input>
          </el-form-item>
          <el-form-item label="项目名称">
            <el-input
              v-model="searchForm.projectName"
              placeholder="项目名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="客户名称" prop="customerName">
            <el-input
              v-model="searchForm.customerName"
              placeholder="客户名称"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-button
          size="medium"
          type="primary"
          @click="getTableData"
        >查询</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="onSubmit"
        >重置</el-button>
        <el-button
          size="medium"
          type="primary"
          :icon="isUpDown?'el-icon-arrow-up':'el-icon-arrow-down'"
          @click="onUpDown"
          class="highSearch"
        >高级查询</el-button>
      </el-col>
    </el-row>
    <div style="marginBottom:10px">
      <el-button type="primary" @click="orderitemsAdd">新增</el-button>
      <!-- <el-button type="primary">导出</el-button> -->
    </div>
    <el-table
      :data="formData"
      stripe
      border
      :empty-text="loadInfo"
      style="width: 100%"
      :header-cell-style="{background:'#cbe4ff',color:'black',borderColor:'#ccccccc'}"
    >
      <el-table-column
        label="序号"
        width="80">
        <template slot-scope="scope">
          <span>{{scope.$index + 1 + ((pager.currentPage - 1) * pager.countPerPage)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderFormNo"
        label="订单号"
        width="220"
      >
      </el-table-column>
      <el-table-column
        prop="projectName"
        label="项目名称"
        width="220"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="customerName"
        label="客户名称"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="macAddr"
        label="许可id"
      >
      </el-table-column>
    </el-table>
    <el-pagination
      class="com-pagination"
      background
      @size-change="getTableData"
      @current-change="getTableData"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :current-page.sync="pager.currentPage"
      :page-size.sync="pager.countPerPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
      <el-dialog title="订单导出" :visible.sync="dialogFormVisible">
        <el-form :inline="true" :model="orderFormExport" label-width="85px">
          <el-row>
            <el-form-item label="订单号：">
              <el-input v-model="orderFormExport.id"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="设备数量：">
              <el-input-number v-model="orderFormExport.num" :min="1" label="描述文字" style="width:210px"></el-input-number>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="有效时间：">
              <el-date-picker
                v-model="orderFormExport.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="getLicense">许可生成</el-button>
          <!-- <el-button type="primary" @click="submitorderFormExport" :disabled="!orderFormExport.license">确 定</el-button> -->
        </div>
      </el-dialog>
  </div>
</template>

<script>
import mixin from '@/mixins'
import moment from 'moment'
export default {
  name: 'licenseList',
  mixins: [mixin],
  data () {
    return {
      dialogFormVisible: false,
      orderFormExport: {},
      searchForm: {},
      formData: [],
    }
  },
//   filters: {
//     statusName(item){
//       let statusName = ''
//       switch (item) {
//         case 0:
//           statusName = '未激活'
//           break;
//         case 1:
//           statusName = '已激活'
//           break;
//         case 2:
//           statusName = '已停止'
//           break;
//       }
//       return statusName
//     }
//   },
  mounted () {
    const {params} = this.$route
    this.changeFormData(this.searchForm, params)
    this.getTableData()
  },
  methods: {
    getTableData () {
      // this.getListData('/orderitems/getall')
    },
    getNowTime() {
       var now = new Date();
       var year = now.getFullYear(); //得到年份
       var month = now.getMonth(); //得到月份
       var date = now.getDate(); //得到日期
       month = month + 1;
       month = month.toString().padStart(2, "0");
       date = date.toString().padStart(2, "0");
       var defaultDate = `${year}-${month}-${date}`;
       this.$set(this.orderForm, "createdDate", defaultDate);
   },
   orderitemsAdd () {
      this.dialogFormVisible = true
      this.orderFormExport = {}
   },
   getLicense () {
       this.dialogFormVisible = false
   }
  }
}
</script>

<style lang="less" scoped>
.backBox {
  align-items: center;
  text-align: left;
  line-height: 60px;
}
.el-col {
  padding: 0 0 0 20px;
}
.searchForm {
  margin-bottom: 20px;
  border-bottom: 5px solid #cccccc;
  .el-input {
    width: 200px;
  }
}
.el-drawer.btt {
  padding-top: 10px;
}
</style>