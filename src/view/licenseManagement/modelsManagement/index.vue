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
              v-model.trim="searchForm['order#orderFormNo']"
              placeholder="订单号"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="deviceName">
            <el-input
              v-model.trim="searchForm.deviceName"
              placeholder="设备名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备型号" prop="modelNo">
            <el-input
              v-model.trim="searchForm.modelNo"
              placeholder="设备型号"
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
              <el-form-item label="MAC地址" prop="macAddr">
                <el-input
                  v-model.trim="searchForm.macAddr"
                  placeholder="MAC地址"
                ></el-input>
              </el-form-item>
              <el-form-item label="当前状态" prop="status">
                  <el-select v-model="searchForm.status" placeholder="请选择" style="width:200px">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="未激活" value="0"></el-option>
                    <el-option label="已激活" value="1"></el-option>
                    <!-- <el-option label="已停止" value="2"></el-option> -->
                  </el-select>
              </el-form-item>
              <el-form-item label="创建时间" prop="createdDate">
                <el-date-picker
                  v-model="searchForm.createdDate"
                  type="daterange"
                  align="right"
                  unlink-panels
                  format="yyyyMMdd"
                  value-format="yyyyMMdd"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
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
    <div style="marginBottom:10px">
      <el-button type="primary" @click="orderitemsAdd">新增</el-button>
      <el-button type="primary" @click="exportTable">导出</el-button>
      <el-button type="primary" style="float:right" :disabled="multipleSelection.length < 1" @click="changeStatueList">激活</el-button>
    </div>
    <el-table
      :data="formData"
      stripe
      border
      :empty-text="loadInfo"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :header-cell-style="{background:'#cbe4ff',color:'black',borderColor:'#ccccccc'}"
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
      <el-table-column
        prop="orderFormNo"
        label="订单号"
        width="120"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="deviceName"
        label="设备名称"
        width="140"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="modelNo"
        label="设备型号"
        width="180"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="macAddr"
        label="MAC地址"
        width="180"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="serialNo"
        label="SN编码"
        width="180"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="当前状态"
        width="120"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="primary" v-if="scope.row.status == '0' || !scope.row.status" @click="changeStatus(scope.row)">待激活</el-button>
          <el-button size="mini" type="success" v-if="scope.row.status == '1'">已激活</el-button>
          <!-- <el-button size="mini" type="danger" v-if="scope.row.status == '2'">已停止</el-button> -->
        </template>
      </el-table-column>
      <el-table-column
        label="创建日期"
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
            @click="orderitemsEdit('edit',scope.row)"
          >修改</el-button>
          <el-popconfirm
            title="确定删除该设备吗？"
            @confirm="deleteOrderItem(scope.row)"
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
            @click="orderitemsEdit('look',scope.row)"
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
    <el-dialog title="新增设备" :visible.sync="dialogAddFormVisible">
      <el-form :inline="true" :model="modelsAddForm" label-width="100px" :rules="rules" ref="modelsAddForm">
        <el-form-item label="订单号：" prop="orderFormNo">
          <el-input v-model="modelsAddForm.orderFormNo"></el-input>
        </el-form-item>
          <el-row>
            <el-form-item label="设备详情：">   
              <uploadExecl :limit="1" :showFileList="false" @uploadExcelData="uploadExcelData"></uploadExecl>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="modelsAddFormSubmit('modelsForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设备信息" :visible.sync="dialogFormVisible">
      <el-form :inline="true" :model="modelsForm" label-width="100px" :rules="rules" ref="modelsForm">
        <el-form-item label="订单号：" prop="orderFormNo">
          <el-input v-model="modelsForm.orderFormNo" :disabled="flag == 'look' || flag == 'edit'"></el-input>
        </el-form-item>
        <el-form-item label="设备名称：" prop="deviceName">
          <el-input v-model="modelsForm.deviceName" :disabled="flag == 'look'"></el-input>
        </el-form-item>
        <el-form-item label="设备型号：" prop="modelNo">
          <el-input v-model="modelsForm.modelNo" :disabled="flag == 'look'"></el-input>
        </el-form-item>
        <el-form-item label="mac地址：" prop="macAddr">
          <el-input v-model="modelsForm.macAddr" :disabled="flag == 'look'"></el-input>
        </el-form-item>
        <el-form-item label="SN编码" prop="serialNo">
          <el-input v-model="modelsForm.serialNo" :disabled="flag == 'look'"></el-input>
        </el-form-item>
        <el-form-item label="当前状态：" prop="status">
          <el-select v-model="modelsForm.status" placeholder="请选择" style="width:205px" :disabled="flag == 'look'">
            <el-option label="未激活" value="0"></el-option>
            <el-option label="已激活" value="1"></el-option>
            <!-- <el-option label="已停止" value="2"></el-option> -->
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="创建时间：" prop="createdDate">
            <el-date-picker
              v-model="modelsForm.createdDate"
              :disabled="flag == 'look'"
              type="date" 
              placeholder="选择日期">
            </el-date-picker>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="flag !== 'look'">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="modelsFormSubmit('modelsForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixin from '@/mixins'
import moment from 'moment'
import * as XLSX from 'xlsx'
import uploadExecl from '@/components/uploadExecl/index'
export default {
  name: 'modelsManagement',
  mixins: [mixin],
  components: {
    uploadExecl
  },
  data () {
    return {
      searchForm: {
        'order#orderFormNo': '',
        projectName: '',
        modelNo: '',
        macAddr: '',
        status: '',
        createdDate: []
      },
      modelsForm: {
        orderFormNo: '',
        deviceName: '',
        modelNo: '',
        macAddr: '',
        status: '',
        createdDate: '',
      },
      modelsAddForm: {
        orderFormNo: '',
        projectName: '',
        customerName: '',
        deviceNumber: ''
      },
      execlData: [],
      formData: [],
      dialogFormVisible: false,
      dialogAddFormVisible: false,
      flag: '',
      rules: {
        orderFormNo: [
          { required: true, message: '请输入订单号', trigger: 'blur' },
        ],
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
        ],
        customerName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' },
        ],
        deviceNumber: [
          { required: true, message: '请输入设备数量', trigger: 'blur' }
        ],
        modelNo: [
          { required: true, message: '请输入设备类型', trigger: 'blur' }
        ],
        macAddr: [
          { required: true, message: '请输入MAC地址', trigger: 'blur' }
        ],
        serialNo: [
          { required: true, message: '请输入SN编码', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择当前状态', trigger: 'blur' }
        ],
        createdDate: [
          { required: true, message: '请输入创建时间', trigger: 'blur' }
        ],
        
      }
    }
  },
  filters: {
    statusName(item){
      let statusName = '未激活'
      switch (item) {
        case '0':
          statusName = '未激活'
          break;
        case '1':
          statusName = '已激活'
          break;
        case '2':
          statusName = '已停止'
          break;
      }
      return statusName
    }
  },
  mounted () {
    const {params} = this.$route
    this.changeFormData(this.searchForm, params)
    this.getTableData()
    console.log(this.multipleSelection);
  },
  methods: {
    creatTime (e) {
      return moment(e).format('YYYY-MM-DD HH:mm:ss')
    },
    getTableData (item) {
      this.getListData('/orderitems/getall',item)
    },
    uploadExcelData(e){
      this.execlData = e
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.searchForm = {
        'order#orderFormNo': '',
        projectName: '',
        modelNo: '',
        macAddr: '',
        status: '',
        createdDate: []
      },
      this.getTableData()
    },
    statusName(item){
      let statusName = '未激活'
      switch (item) {
        case '0':
          statusName = '未激活'
          break;
        case '1':
          statusName = '已激活'
          break;
        case '2':
          statusName = '已停止'
          break;
      }
      return statusName
    },
    async exportTable () {
      const exportList = []
      let dataList = []
      if (this.multipleSelection.length > 0) {
        dataList = this.multipleSelection
      } else {
        let searchForm = {
          ...this.searchForm,
          createdDate: this.searchForm.createdDate.length > 0 ? [moment(this.searchForm.createdDate[0]).format('YYYYMMDD'),moment(this.searchForm.createdDate[1]).format('YYYYMMDD')] : ''
        }
        let searchStr = ''
        if (JSON.stringify(searchForm) !== '{}') {
          for (let i in searchForm) {
            console.log(i);
            if (searchForm[i]) {
              if (i == 'projectName' || i == 'customerName' || i == 'deviceName') {
                console.log(searchForm, searchForm[i]);
                searchStr += `${i}:${searchForm[i]},`
              } else if (i == 'createdDate') {
                console.log(searchForm[i]);
                searchStr += searchForm[i].length > 0 ? `${searchForm[i][0]}<createdDate<${searchForm[i][1]},` : ''
              } else {
                searchStr += `${i}=${searchForm[i]},`
              }
            }
          }
        }
        const params = {
          currentPage: 0,
          countPerPage: 10000000,
          search: JSON.stringify(searchForm) !== '{}'? searchStr : null
        }
        const res = await this.$get('/orderitems/getall',params)
        dataList = res.pageData
      }
      console.log(dataList,'dataList');
        const subName = ['num','orderFormNo','deviceName','modelNo','macAddr','status','createdDate']
        const Header = [['序号','订单号','设备名称','设备型号','MAC地址','当前状态','创建时间']]
        dataList.forEach((item,index) => {
          let exportItem = {}
          subName.forEach(item1 => {
            if (item1 == 'num') {
              exportItem[item1] = index + 1
            } else if (item1 === 'status') {
              exportItem[item1] = this.statusName(item[item1])
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
    },
    async getDataList () {
      let searchForm = {
        ...this.searchForm,
        createdDate: this.searchForm.createdDate.length > 0 ? [moment(this.searchForm.createdDate[0]).format('YYYYMMDD'),moment(this.searchForm.createdDate[1]).format('YYYYMMDD')] : ''
      }
      let searchStr = ''
      if (JSON.stringify(searchForm) !== '{}') {
        for (let i in searchForm) {
          console.log(i);
          if (searchForm[i]) {
            if (i == 'projectName' || i == 'customerName' || i == 'deviceName') {
              console.log(searchForm, searchForm[i]);
              searchStr += `${i}:${searchForm[i]},`
            } else if (i == 'createdDate') {
              console.log(searchForm[i]);
              searchStr += searchForm[i].length > 0 ? `${searchForm[i][0]}<createdDate<${searchForm[i][1]},` : ''
            } else {
              searchStr += `${i}=${searchForm[i]},`
            }
          }
        }
      }
      const params = {
        currentPage: 0,
        countPerPage: 10000000,
        search: JSON.stringify(searchForm) !== '{}'? searchStr : null
      }
      const res = await this.$get('/orderitems/getall',params)
      return res.pageData
    },
    rowKey(row) {
        // console.log('================:', JSON.stringify(row))
        return row.id
    },
    changeStatueList () {
      if (this.pf(this.multipleSelection)) {
        this.$message.error('请保证所激活设备为同一订单')
      } else {
        this.multipleSelection.forEach(async (item,index) => {
          const params = {...item, status: 1}
          let res = await this.$post('/orderitems/update',params)
          if (index == this.multipleSelection.length - 1 && res.code == 200) {
            this.$message({
              message: '激活成功',
              type: "success",
            });
            this.getTableData()
          }
        })
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
    orderitemsAdd() {
      this.flag = 'add'
      this.id = 0
      this.modelsAddForm = {}
      this.dialogAddFormVisible = true
    },
    orderitemsEdit(flag,item) {
      this.id = item.id
      this.flag = flag
      this.changeFormData(this.modelsForm, item)
      // this.modelsForm = item
      this.dialogFormVisible = true
    },
    async changeStatus(item) {
      const params = {...item, status: 1}
      const res = await this.$post('/orderitems/update',params)
      if (res.code == 200) {
        this.$message({
          message: '激活成功',
          type: "success",
        });
        this.getTableData()
      }
    },
    modelsFormSubmit (formName) {
      this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const params = { ...this.modelsForm, id: this.id }
            const url = (this.flag == 'add'?'/orderitems/add':'/orderitems/update')
            const res = await this.$post(url,params)
            console.log(res);
            if (res.code == 200) {
              this.$message({
                message: this.flag == 'add'?'新增成功':'修改成功',
                type: "success",
              });
              this.getTableData()
            }
            this.dialogFormVisible = false
          }
      });
    },
    modelsAddFormSubmit () {
      this.$refs['modelsAddForm'].validate(async (valid) => {
        if (valid) {
          if (this.execlData.length > 0) {
            const params = {...this.modelsAddForm, orderItemsVos: this.execlData}
            const res = await this.$post('/order/batchadditems',params)
              if (res.code == 200) {
                this.$message({
                  message: '添加成功',
                  type: "success",
                });
              }
              this.dialogAddFormVisible = false
              this.getTableData()
          } else {
            this.$message.error('请上传设备信息')
          }
        }
      })
    },
    async deleteOrderItem (item) {
      const res = await this.$post(`/orderitems/deletebyid?id=${item.id}`)
      console.log(res);
      if (res.data) {
        this.$message.success(res.msg)
        this.pager.currentPage = 1
        this.getTableData('search')
      }
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