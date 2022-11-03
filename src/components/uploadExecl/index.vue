<template>
  <div class="titleBox">
      <el-upload
        ref="upload"
        action="action"
        :limit="limit"
        :show-file-list="showFileList"
        :file-list="fileList"
        :http-request="uploadFileList"
        :accept="accept"
      >
        <el-button
            slot="trigger"
            type="primary"
            :disabled="disabled"
            icon="el-icon-plus"
        >导⼊⽂件</el-button>
      </el-upload>  
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
export default {
  name: 'uploadExecl',
  props: {
    limit: {
        type: Number,
        default: 1,
    },
    showFileList: {
        type: Boolean,
        default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      fileList: [],
      accept: '.xlsx, .xls',
      excelData: {
          header: null,
          results: null,
      },
    }
  },
  methods: {
    changeName(arr, names) {
      const newArr = [];
      arr.forEach((item) => {
        const objL = Object.entries(item);
        objL.forEach((ite, i) => {
          if (names[i] === undefined) return;
          ite[0] = names[i];
        });
        item = Object.fromEntries(objL);
        newArr.push(item);
      });
      return newArr;
    },
    generateData({header, results}) {
        // this.excelData.header = header;
        // this.excelData.results = results;
        const execlList = this.changeName(results,['deviceName','modelNo','macAddr','serialNo'])
        console.log(execlList, '数据列表');
        this.$emit('uploadExcelData', execlList);
        this.fileList = [];
    },
    uploadFileList(file) {
        console.log(file);
        const rawFile = file.file;
        console.log(rawFile);
        if (!rawFile) {
            return;
        }
        if (!this.isExcel(rawFile)) {
            this.$message.error('请上传Excel⽂件！');
            return false;
        }
        this.readerData(rawFile);
    },
    readerData(rawFile) {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = e => {
              try {
                  const data = e.target.result;
                  console.log(data, 'data');
                  const workbook = XLSX.read(data, {type: 'array'});
                  console.log(workbook, 'workbook');
                  const firstSheetName = workbook.SheetNames[0];
                  console.log(firstSheetName, 'firstSheetName');
                  const worksheet = workbook.Sheets[firstSheetName];
                  console.log(worksheet, 'worksheet');
                  const header = this.getHeaderRow(worksheet);
                  console.log(header, 'header');
                  const results = XLSX.utils.sheet_to_json(worksheet);
                  console.log(results, 'results');
                  this.generateData({header, results});
                  resolve();
              }
              catch (error) {
                  this.$message.error('解析失败，请下载模板！');
              }
          };
          reader.readAsArrayBuffer(rawFile);
      });
    },
    getHeaderRow(sheet) {
        const headers = [];
        const range = XLSX.utils.decode_range(sheet['!ref']);
        let C;
        const R = range.s.r;
        /* start in the first row */
        for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
            const cell = sheet[XLSX.utils.encode_cell({c: C, r: R})];
            /* find the cell in the first row */
            let hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
            if (cell && cell.t) {
                hdr = XLSX.utils.format_cell(cell);
            }
            headers.push(hdr);
        }
        return headers;
    },
    isExcel(file) {
        return /\.(xlsx|xls|csv)$/.test(file.name);
    },
  }
}
</script>

<style lang="less" scoped>
</style>