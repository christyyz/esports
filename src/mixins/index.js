import moment from 'moment'
const mixin = {
  data() {
    return {
      isUpDown: true,
      total: 0,
      multipleSelection: [],
      loadInfo: '暂无数据',
      pager: {
        currentPage: 1,
        countPerPage: 10
      },
    }
  },
  methods: {
    pf (arr) {  // 判断是否是同一个订单
        var set = new Set;
        arr.forEach(function(v){
          set.add(v.orderFormNo)
        });
        return set.size > 1
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    onUpDown () {
      this.isUpDown = !this.isUpDown
    },
    onSubmit () { },
    search () {

    },
    handleDelete (id) {
      // console.log(id)
    },
    back () {
      this.$router.go(-1)
    },
    //设置单元格背景
    cellStyle({row, column, rowIndex, columnIndex}) {
        return 'height:35px!important; border-color:#cccccc!important; color:#000000!important; padding:0px!important; height:40px!important'
    },
    // 给form表达赋值
    changeFormData (oldFormData, newFormData) {
      console.log(oldFormData, newFormData);
      const newFormData1 = JSON.parse(JSON.stringify(newFormData))
      for ( let i in newFormData1) {
        this.$set(oldFormData, i, newFormData1[i])
      }
    },
    async getListData (url) {
      // orderFormNo
      // projectName
      // customerName
      // createdBy
      // createdDate
      // orderFormNo
      // projectName
      // modelNo
      // macAddr
      // status
      // createdDate
      this.loadInfo = '数据加载中...'
      console.log(this.searchForm);
      let searchForm = {
        ...this.searchForm,
        createdDate: this.searchForm.createdDate.length > 0 ? [moment(this.searchForm.createdDate[0]).format('YYYYMMDD'),moment(this.searchForm.createdDate[1]).format('YYYYMMDD')] : ''
      }
      console.log(searchForm, 'searchForm123');
      let searchStr = ''
      if (JSON.stringify(searchForm) !== '{}') {
        for (let i in searchForm) {
          console.log(i);
          if (searchForm[i]) {
            if (i == 'projectName' || i == 'customerName') {
              console.log(searchForm, searchForm[i]);
              searchStr += `${i}:${searchForm[i]}`
            } else if (i == 'createdDate') {
              console.log(searchForm[i]);
              searchStr += searchForm[i].length > 0 ? `${searchForm[i][0]}<createdDate<${searchForm[i][1]}` : ''
            } else {
              searchStr += `${i}=${searchForm[i]}`
            }
          }
        }
      }
      console.log(searchStr,'searchStr');
      const params = {
        currentPage: this.pager.currentPage - 1,
        countPerPage: this.pager.countPerPage,
        search: JSON.stringify(searchForm) !== '{}'? searchStr : null
      }
      const res = await this.$get(url,params)
      this.formData = res.pageData
      this.loadInfo = '暂无数据'
      this.total = res.totalElements
    },
  },
}
export default mixin