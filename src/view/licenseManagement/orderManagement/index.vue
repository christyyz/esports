<template>
  <div>
    <el-row class="searchForm">
      <el-col :span="18">
        <el-form
          :inline="true"
          ref="searchForm"
          :model="searchForm"
          class="demo-form-inline"
          label-width="85px"
        >
          <el-form-item label="订单号" prop="orderFormNo">
            <el-input
              v-model="searchForm.orderFormNo"
              placeholder="订单号"
            ></el-input>
          </el-form-item>
          <el-form-item label="项目名称" prop="projectName">
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
          <transition
            :duration="{ enter: 800, leave: 100 }"
            mode="out-in"
            name="el-fade-in-linear"
          >
            <div
              class="selectMode"
              v-if="!isUpDown"
            >
              <el-form-item label="创建人" prop="createPerson">
                <el-input
                  v-model="searchForm.createPerson"
                  placeholder="创建人"
                ></el-input>
              </el-form-item>
              <el-form-item label="创建时间" prop="createTime">
                <el-date-picker
                  v-model="searchForm.createTime"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </el-form-item>
            </div>
          </transition>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-button
          size="medium"
          type="primary"
          @click="onSubmit"
        >查询</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="resetForm('searchForm')"
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
    <div>
      <div style="textAlign:left;marginBottom:10px">
        <el-button
          type="primary"
          @click="addOrderForm"
        >添加</el-button>
        <el-button
          type="primary"
          @click="dialogFormVisible1 = true"
        >导出</el-button>
      </div>
      <el-table
        :data="formData"
        stripe
        border
        style="width: 100%"
        :cell-style="cellStyle"
        :header-cell-style="{background:'#cbe4ff',color:'black',borderColor:'#cccccc'}"
      >
        <el-table-column
          prop="orderFormNo"
          label="订单号"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="projectName"
          label="项目名称"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="customerName"
          label="客户名称"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="deviceNumber"
          label="设备总数"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="name3"
          label="激活设备数"
          width="150"
        >
          --
        </el-table-column>
        <el-table-column
          prop="createPerson"
          label="创建人"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="200"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="lookFormItem('edit',scope.row)"
          >修改</el-button>
          <el-popconfirm
            title="确定删除该设订单吗？"
          >
            <el-button
              size="mini"
              type="warning"
              style="margin: 0 10px"
              slot="reference">删除</el-button>
          </el-popconfirm>
          <el-button
            size="mini"
            type="info"
            @click="lookFormItem('look',scope.row)"
          >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="com-pagination"
        @size-change="search"
        @current-change="search"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :current-page.sync="pager.page"
        :page-size.sync="pager.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <el-dialog title="设备信息" :visible.sync="dialogFormVisible">
        <el-form :inline="true" :model="orderForm" :rules="rules" label-width="100px" ref="orderForm">
          <el-form-item label="订单号：" prop="orderFormNo">
            <el-input v-model="orderForm.orderFormNo" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="项目名称：" prop="projectName">
            <el-input v-model="orderForm.projectName" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="客户名称：" prop="customerName">
            <el-input v-model="orderForm.customerName" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="设备数量：" prop="deviceNumber">
            <el-input v-model="orderForm.deviceNumber" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="创建人：" prop="createPerson">
            <el-input v-model="orderForm.createPerson" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：" prop="createTime">
            <el-date-picker
              v-model="orderForm.createTime"
              type="date" 
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-row v-if="!execlData">
            <el-form-item label="设备详情：">
              <uploadExecl :limit="1" :showFileList="false" @uploadExcelData="uploadExcelData" :disabled="disabled"></uploadExecl>
            </el-form-item>
          </el-row>
          <el-table :data="execlData"
                    v-if="execlData"
                    height="300"
                    style="width: 100%">
            <el-table-column prop="deviceName"
                             label="设备名称">
            </el-table-column>
            <el-table-column prop="modelNo"
                             label="设备类型">
            </el-table-column>
            <el-table-column prop="macAddr"
                             label="MAC地址">
            </el-table-column>
          </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitOrderForm('orderForm')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="设备信息" :visible.sync="dialogFormVisible1">
        <el-form :inline="true" :model="orderForm1" label-width="85px">
          <el-row>
            <el-form-item label="订单号：">
              <el-input v-model="orderForm1.id"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="设备数量：">
              <el-input-number v-model="orderForm1.num" :min="1" label="描述文字" style="width:210px"></el-input-number>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="有效时间：">
              <el-date-picker
                v-model="orderForm1.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="submitOrderForm1('orderForm1')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import mixin from '@/mixins'
import uploadExecl from '@/components/uploadExecl/index'
export default {
  name: 'licenseManagement',
  mixins: [mixin],
  components: {
    uploadExecl
  },
  data () {
    return {
      id: '',
      table: false,
      disabled: false,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      formData: [],
      orderForm: {
        orderFormNo: '',
        projectName: '',
        customerName: '',
        deviceNumber: '',
        createPerson: '',
        createTime: ''
      },
      execlData: [],
      orderForm1: {
        time:[]
      },
      searchForm: {},
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      rules: {
        orderFormNo: [
          { required: true, message: '请输入订单号', trigger: 'blur' },
        ],
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        customerName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        deviceNumber: [
          { required: true, message: '请输入设备数量', trigger: 'blur' }
        ],
        createPeoper: [
          { required: true, message: '请输入创建人', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请输入创建时间', trigger: 'blur' }
        ],
        
      }
    }
  },
  mounted () {
    this.getListData()
  },
  methods: {
    async getListData () {
      this.formData = await this.$get('/order/getall')
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
       this.$set(this.orderForm, "createTime", defaultDate);
   },
    add () {
      this.$router.push({
        name: 'orderManagement',
        params: {
          flag: 'add'
        }
      })
    },
    uploadExcelData(e){
      this.execlData = e
    },
    resetOrderForm(){
      this.orderForm = {}
      this.execlData = []
    },
    resetOrderForm1(){
      this.orderForm1 = {}
    },
    submitOrderForm(formName){
      this.$refs[formName].validate(async (valid) => {
          if (valid) {
            if (this.execlData.length > 0) {
              const params = { ...this.orderForm, orderItemsVo: this.execlData, id: this.id}
              console.log(params, 'params');
              const res = this.$post('/order/add',params)
              this.getListData()
              this.dialogFormVisible = false
              this.resetOrderForm()
              console.log(res, 'res');
            } else {
              this.$message.error('请上传设备信息')
            }
          }
      });
    },
    submitOrderForm1(formName){
      this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const res = this.$post('/order/add',this.orderForm1)
            console.log(res);
            this.dialogFormVisible1 = false
            this.resetOrderForm1()
          }
      });
    },
    addOrderForm () {
      this.id = ''
      this.orderForm = {}
      this.execlData = ''
      this.disabled = false
      this.dialogFormVisible = true
      this.getNowTime()
    },
    lookFormItem(e,item){
      console.log(item);
      this.disabled = (e == 'look')
      this.id = item.id
      this.orderForm = item
      this.execlData = item.orderItemsVo
      this.dialogFormVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
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