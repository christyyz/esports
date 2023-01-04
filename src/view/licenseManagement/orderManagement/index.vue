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
              v-model.trim="searchForm.orderFormNo"
              placeholder="订单号"
            ></el-input>
          </el-form-item>
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model.trim="searchForm.projectName"
              placeholder="项目名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="客户名称" prop="customerName">
            <el-input
              v-model.trim="searchForm.customerName"
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
              <el-form-item label="创建人" prop="createdBy">
                <el-input
                  v-model.trim="searchForm.createdBy"
                  placeholder="创建人"
                ></el-input>
              </el-form-item>
              <el-form-item label="创建时间" prop="createdDate">
                <el-date-picker
                  v-model="searchForm.createdDate"
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
          @click="getTableData('search')"
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
          @click="exportTable"
        >导出</el-button>
      </div>
      <el-table
        :data="formData"
        stripe
        border
        style="width: 100%" 
        :empty-text="loadInfo"
        :cell-style="cellStyle"
        @selection-change="handleSelectionChange"
        :header-cell-style="{background:'#cbe4ff',color:'black',borderColor:'#cccccc'}"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="序号"
          width="50">
          <template slot-scope="scope">
            <span>{{scope.$index + 1 + ((pager.currentPage - 1) * pager.countPerPage)}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="序号"
          width="80"
        >
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column> -->
        <el-table-column
          label="订单号"
          width="150"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <a href="javascript:;" @click="routerModels(scope.row,'orderFormNo')">{{scope.row.orderFormNo}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="projectName"
          label="项目名称"
          width="150"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="customerName"
          label="客户名称"
          width="150"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="deviceNumber"
          label="设备总数"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="激活设备数"
          width="120"
        >
          <template slot-scope="scope">
            <a href="javascript:;" @click="routerModels(scope.row,'activedCount')">{{scope.row.activedCount}}</a>
          </template>
        </el-table-column>
        <el-table-column
          label="订单生效时间"
          width="200"
        >
          <template slot-scope="scope">
            <span>{{creatTime(scope.row.serviceStartDate)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="订单结束时间"
          width="200"
        >
          <template slot-scope="scope">
            <span>{{creatTime(scope.row.serviceEndDate)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="许可id"
          width="220"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.macAddr">{{scope.row.macAddr}}</span>
            <el-button type="primary" size="mini" @click="addOrderFormExport(scope.row)">许可生成</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdBy"
          label="创建人"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="创建时间"
          width="200"
        >
          <template slot-scope="scope">
            <span>{{creatTime(scope.row.createdDate)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="lookFormItem('edit',scope.row)"
          >修改</el-button>
          <el-popconfirm
            title="确定删除该设订单吗？"
            @confirm="deleteOrder(scope.row)"
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
      <el-dialog :title="title" :visible.sync="dialogFormVisible">
        <el-form :inline="true" :model="orderForm" :rules="rules" label-width="100px" ref="orderForm">
          <el-form-item label="订单号：" prop="orderFormNo">
            <el-input v-model="orderForm.orderFormNo" :disabled="disabled || flag == 'edit'"></el-input>
          </el-form-item>
          <el-form-item label="项目名称：" prop="projectName">
            <el-input v-model="orderForm.projectName" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="客户名称：" prop="customerName">
            <el-input v-model="orderForm.customerName" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="设备数量：" prop="deviceNumber">
            <el-input-number v-model="orderForm.deviceNumber" :disabled="disabled || flag == 'edit'" :min="1" style="width:205px"></el-input-number>
          </el-form-item>
          <el-form-item label="有效时间：" prop="serverTime">
              <el-date-picker
                v-model="orderForm.serverTime"
                :disabled="disabled"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="创建人：" prop="createdBy">
            <el-input v-model="orderForm.createdBy" :disabled="disabled"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="创建时间：" prop="createdDate">
            <el-date-picker
              v-model="orderForm.createdDate"
              :disabled="disabled"
              type="date" 
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item> -->
          <el-row v-if="execlData.length < 1">
            <el-form-item label="设备详情：">   
              <uploadExecl :limit="1" :showFileList="false" @uploadExcelData="uploadExcelData" :disabled="disabled"></uploadExecl>
            </el-form-item>
            <el-link icon="el-icon-warning" href="/static/demo.xlsx" target="_blank">模板下载</el-link>
          </el-row>
          <el-table :data="execlData"
                    v-if="execlData.length > 0"
                    height="300"
                    style="width: 100%"
                    :cell-style="cellStyle"
                    :header-cell-style="{background:'#cbe4ff',color:'black',borderColor:'#cccccc'}">
            <el-table-column prop="deviceName"
                             label="设备名称">
            </el-table-column>
            <el-table-column prop="modelNo"
                             label="设备类型">
            </el-table-column>
            <el-table-column prop="macAddr"
                             label="MAC地址">
            </el-table-column>
            <el-table-column prop="serialNo"
                             label="SN编码">
            </el-table-column>
          </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="flag !=='look'">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitOrderForm1('orderForm','add')" v-if="flag === 'add'">暂存</el-button>
          <el-button type="primary" @click="submitOrderForm('orderForm')" v-if="flag === 'add'">确 定</el-button>
          <el-button type="primary" @click="submitOrderForm1('orderForm','edit')" v-if="flag === 'edit'">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="许可生成" :visible.sync="dialogFormVisible1">
        <el-form :inline="true" :model="orderFormExport" label-width="100px" :rules="exportRules" ref="orderFormExport">
          <el-row>
            <el-form-item label="订单号：" prop="orderFormNo">
              <el-input v-model="orderFormExport.orderFormNo" disabled></el-input>
            </el-form-item>
            <el-form-item label="客户名称：" prop="customerName">
              <el-input v-model="orderFormExport.customerName" disabled></el-input>
            </el-form-item>
            <el-form-item label="设备数量：" prop="deviceNumber">
              <el-input-number v-model="orderFormExport.deviceNumber" :min="0" label="描述文字" style="width:210px" disabled></el-input-number>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="有效时间：" prop="serverTime">
              <el-date-picker
                v-model="orderFormExport.serverTime"
                disabled
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="授权类型：" prop="licenseType">
              <el-select v-model="orderFormExport.licenseType" placeholder="请选择" style="width:200px">
                    <el-option label="试用" value="trial"></el-option>
                    <el-option label="标准" value="standard"></el-option>
                    <el-option label="其他" value="other"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <!-- <el-row type="flex" justify="" >
            <el-form-item label="许可ID：">
              <el-input v-model="orderFormExport.license" disabled></el-input>
            </el-form-item>
          </el-row> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="getLicense">许可生成</el-button>
          <!-- <el-button type="primary" @click="submitorderFormExport('orderFormExport')" :disabled="!orderFormExport.license">确 定</el-button> -->
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import mixin from '@/mixins'
import moment from 'moment'
import * as XLSX from 'xlsx'
import uploadExecl from '@/components/uploadExecl/index'
import { basePath } from '../../../util/base'
export default {
  name: 'licenseManagement',
  mixins: [mixin],
  components: {
    uploadExecl
  },
  data () {
    return {
      id: '',
      flag: '',
      title: '',
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
        serverTime: [],
        createdBy: '',
        createdDate: ''
      },
      execlData: [],
      orderFormExport: {
        time:[]
      },
      searchForm: {
        orderFormNo: '',
        projectName: '',
        customerName: '',
        createdBy: '',
        createdDate: []
      },
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
        serverTime: [
          { required: true, message: '请输入有效时间', trigger: 'blur' }
        ],
        createdBy: [
          { required: true, message: '请输入创建人', trigger: 'blur' }
        ],
        createdDate: [
          { required: true, message: '请输入创建时间', trigger: 'blur' }
        ],
        
      },
      exportRules: {
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
        serverTime: [
          { required: true, message: '请输入有效时间', trigger: 'blur' }
        ],
        licenseType: [
          { required: true, message: '请输入授权类型', trigger: 'blur' }
        ],
      }
    }
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    creatTime (e) {
      return moment(e).format('YYYY-MM-DD HH:mm:ss')
    },
    getTableData (item) {
      console.log(this.searchForm);
      this.getListData('/order/getall',item)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.searchForm.createdDate = []
      this.getTableData()
    },
    exportTable () {
      const exportList = []
      if (this.multipleSelection.length > 0) {
        // const subName = ['num','orderFormNo','projectName','customerName','deviceNumber','activedCount','macAddr','createdBy','createdDate']
        // const Header = [['序号','订单号','项目名称','客户名称','设备总数','激活设备数','许可id','创建人','创建时间']]
        const subName = ['num','orderFormNo','projectName','customerName','activedCount','createdBy','createdDate']
        const Header = [['序号','订单号','项目名称','客户名称','激活设备数','创建人','创建时间']]
        this.multipleSelection.forEach((item,index) => {
          let exportItem = {}
          subName.forEach(item1 => {
            if (item1 == 'num') {
              exportItem[item1] = index + 1
            } else if (item1 === 'macAddr') {
              exportItem[item1] = item[item1] || '--'
            } else if (item1 === 'createdDate') {
              exportItem[item1] = moment(item.createdDate).format('YYYY-MM-DD')
            } else {
              exportItem[item1] = item[item1]
            }
          })
          exportList.push(exportItem)
        })
        console.log(exportList,'1211');
        // 将JS数据数组转换为工作表。
        const headerWs = XLSX.utils.aoa_to_sheet(Header);
        const ws = XLSX.utils.sheet_add_json(headerWs, exportList, {skipHeader: true, origin: 'A2'});
        console.log(ws,'ws');

        /* 新建空的工作表 */
        const wb = XLSX.utils.book_new();

        // 可以自定义下载之后的sheetname
        XLSX.utils.book_append_sheet(wb, ws, '订单数据');

        /* 生成xlsx文件 */
        XLSX.writeFile(wb, '订单表格.xlsx');
      }
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
    uploadExcelData(e){
      this.execlData = e
    },
    resetOrderForm(){
      this.orderForm = {}
      this.execlData = []
    },
    resetorderFormExport(){
      this.orderFormExport = {}
    },
    routerModels (item,name) {
      this.$router.push({
        name: 'modelsManagement',
        params: {
          'order#orderFormNo': item.orderFormNo,
          status: name == 'activedCount'?'1': ''
        }
      })
    },
    submitOrderForm(formName){
      this.$refs[formName].validate(async (valid) => {
          if (valid) {
            console.log(this.execlData.length,this.orderForm.deviceNumber );
            if (this.execlData.length > 0) {
              const params = { ...this.orderForm, orderItemsVos: this.execlData, id: this.id}
              const orderFormExport = JSON.parse(JSON.stringify(this.orderForm))
              orderFormExport.serviceStartDate = orderFormExport.serverTime[0]
              orderFormExport.serviceEndDate = orderFormExport.serverTime[1]
              orderFormExport.orderItemsVos = this.execlData
              orderFormExport.id = this.id
              console.log(params, 'params');
              const res = this.$post('/order/uploadexcel',orderFormExport)
              if (res.code == 200) {
                this.$message({
                  message: '添加成功',
                  type: "success",
                });
              }
              this.dialogFormVisible = false
              this.resetOrderForm()
              setTimeout(()=>{
                this.getTableData()
              },500)
            } else {
              this.$message.error('请上传设备详情')
            }
            //  else if(this.execlData.length > 0 && this.execlData.length != this.orderForm.deviceNumber) {
            //   this.$message.error('请确定设备数量与设备详情数相同')
            // }
          }
      });
    },
    submitOrderForm1(formName,flag){
      this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const orderFormExport = JSON.parse(JSON.stringify(this.orderForm))
            orderFormExport.serviceStartDate = orderFormExport.serverTime[0]
            orderFormExport.serviceEndDate = orderFormExport.serverTime[1]
            const url = (flag == 'add'?'/order/add':'order/update')
            const res = await this.$post(url,orderFormExport)
            console.log(res);
            if (res.code == 200) {
              this.$message({
                message: flag == 'add'?'暂存成功':'修改成功',
                type: "success",
              });
            }
            this.getTableData()
            this.dialogFormVisible = false
            this.resetorderFormExport()
          }
      });
    },
    submitorderFormExport(formName){
      this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const params = { ...this.orderForm, id: this.id}
            const res = await this.$post('/order/add',params)
            console.log(res);
            this.dialogFormVisible1 = false
            this.resetorderFormExport()
          }
      });
    },
    addOrderForm () {
      this.id = ''
      this.flag = 'add'
      this.title = '新增订单信息'
      this.orderForm = {}
      this.execlData = ''
      this.disabled = false
      this.dialogFormVisible = true
      this.getNowTime()
    },
    async lookFormItem(e,item){
      console.log(item);
      this.flag = e
      // const MAClist = await this.$get('/orderitems/getall',{
      //   currentPage: this.pager.currentPage - 1,
      //   countPerPage: this.pager.countPerPage,
      //   search:`orderFormNo:${item.orderFormNo}`}
      // )
      this.disabled = (e == 'look')
      this.title = (e == 'look'?'查看订单信息':'修改订单信息')
      this.id = item.id
      this.changeFormData(this.orderForm, item)
      // this.execlData = MAClist
      this.dialogFormVisible = true
    },
    getLicense () {
      this.$refs['orderFormExport'].validate(async (valid) => {
        if (valid) {
          const orderFormExport = JSON.parse(JSON.stringify(this.orderFormExport))
          orderFormExport.serviceStartDate = orderFormExport.serverTime[0]
          orderFormExport.serviceEndDate = orderFormExport.serverTime[1]
          await this.$post('/order/update',orderFormExport)
          
          const exportList = {}
          const subName = ['orderFormNo','deviceNumber','serviceStartDate','serviceEndDate']
          subName.forEach(item => {
            if (item == 'serviceStartDate' || item == 'serviceEndDate') {
              exportList[item] = moment(orderFormExport[item]).format('YYYY-MM-DD')
            } else {
              exportList[item] = orderFormExport[item]
            }
          })

          const params = {
            'orderFormNo': exportList.orderFormNo,
            'countPerPage': exportList.deviceNumber,
          }
          const devices = await this.$get('/orderitems/getallbyorderno', params)
            .then(res => res.pageData)
            .catch(err => err)
          const deviceMacAddr = []
          devices.forEach(device => deviceMacAddr.push(device.macAddr))
          exportList['macAddr'] = deviceMacAddr.join(',')

          exportList['licenseType'] = orderFormExport.licenseType

          const flag = await this.$post('/license/generateLicense', exportList).then(res => {
            return res
          }).catch(err => {
            alert(`Error generating license: ${err}`)
          })

          this.downloadClick(`${basePath}/license/getLicense`, `esportsLicense-${orderFormExport.customerName}.lic`)
        }
      })
    },
    async downloadClick(url, name) {
      window.URL = window.URL || window.webkitURL;

      var xhr = new XMLHttpRequest();
      var a = document.createElement("a");
      var file;

      xhr.open("GET", url, true);
      xhr.responseType = "blob";
      xhr.onload = function() {
        file = new Blob([xhr.response], { type: "application/octet-stream" });
        a.href = window.URL.createObjectURL(file);
        a.download = name;
        a.click();
      };
      xhr.send();
    },
    async addOrderFormExport (item) {
      this.dialogFormVisible1 = true
        const params = {
          currentPage: 0,
          countPerPage: 10000000,
          search: `order#orderFormNo=${item.orderFormNo}`
        }
        const res = await this.$get('/orderitems/getall',params)
        const num = res.totalElements
      
      this.orderFormExport = {...item,deviceNumber:num,serverTime:[item.serviceStartDate,item.serviceEndDate],licenseType:''}
    },
    async deleteOrder (item) {
      const res1 = await this.$post(`/order/deletebyid?id=${item.id}`)
      const res2 = await this.$post(`/orderitems/deletebyorderno?orderFormNo=${item.orderFormNo}`)
      if (res1.data && res2.data) {
        this.$message.success(res1.msg)
        this.pager.currentPage = 1
        this.getTableData('search')
      }
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