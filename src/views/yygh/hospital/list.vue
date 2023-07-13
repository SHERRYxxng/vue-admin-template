<template>
  <div class="app-container">

    <!-- {{searchObj}} -->
    <!-- {{cityList}} -->
    <!-- {{provinceList}} -->

    <el-form :inline="true" :model="searchObj" class="demo-form-inline">
    
    <el-form-item label="请选择省份">
        <el-select v-model="searchObj.provinceCode" placeholder="请选择省份" @change="provinceChange()">
          <!-- label:用于显示  value:赋值给searchObj.xxxx -->
          <!-- v-bind:label -->
          <el-option v-for="item in provinceList"  :label="item.name" :value="item.value"></el-option>
        </el-select>
    </el-form-item>

    <el-form-item label="请选择城市">
        <el-select v-model="searchObj.cityCode" placeholder="请选择城市"  @change="cityChange()">
          <el-option v-for="item in cityList" :label="item.name" :value="item.value"></el-option>
        </el-select>
    </el-form-item>

    <el-form-item label="请选择区">
        <el-select v-model="searchObj.districtCode" placeholder="请选择区">
          <el-option v-for="item in districtList" :label="item.name" :value="item.value"></el-option>
        </el-select>
    </el-form-item>


    <el-form-item label="医院名称">
        <el-input v-model="searchObj.hosname" placeholder="医院名称"></el-input>
    </el-form-item>


    <el-form-item>
        <el-button type="primary" @click="fetchData()">查询</el-button>
        <el-button type="primary" @click="clear()">清空</el-button>
    </el-form-item>
    </el-form>

    <el-table :data="tableData" border style="width: 100%">
      <!-- fixed 固定列 -->
      <el-table-column fixed label="序号">
        <template slot-scope="scope">
          {{scope.$index+1 + (pageNum-1)*pageSize}}
        </template>
      </el-table-column>

      <el-table-column label="图片"> 
          <template slot-scope="scope">
            <!-- data:image/jpeg;base64,字符串 -->
            <img :src="'data:image/jpeg;base64,'+scope.row.logoData" width="80">
          </template>
      </el-table-column>

      <el-table-column prop="hoscode" label="医院编号"> </el-table-column>
      <el-table-column prop="hosname" label="医院名称"> </el-table-column>
      <el-table-column  label="医院等级">
        <template slot-scope="scope">
          <!-- 显示医院等级对应的数据字典名称 -->
          {{scope.row.param.hostypeString}}
        </template>
      </el-table-column>

      <el-table-column label="地址">
        <template slot-scope="scope">
          <!-- 显示医院等级对应的数据字典名称 -->
          {{scope.row.param.fullAddress}}
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          {{scope.row.status==1?'已上线':'未上线'}}
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="updateStatus(scope.row.id,0)" v-if="scope.row.status==1" type="text" size="small">下线</el-button>
          <el-button @click="updateStatus(scope.row.id,1)" v-if="scope.row.status==0" type="text" size="small">上线</el-button>
          <el-button @click="showDetail(scope.row.id)" type="text" size="small">详情</el-button>

          <!-- <router-link :to="`/hosp/hospdetail/${id}`">
              <el-button  type="text" size="small">详情</el-button>
          </router-link> -->

          <el-button type="text" size="small" @click="toSchedule(scope.row.hoscode)">排班</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      style="padding: 30px 0; text-align: center"
      :page-sizes="[3, 5, 9]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import hospitalApi from '@/api/yygh/hospital'
import cmnApi from '@/api/yygh/cmn'
export default {
  data() {
    return {
      districtList:[],
      provinceList:[],
      cityList:[],
      tableData: [{param:{hostypeString:''},logoData:''}],
      pageNum: 1,
      pageSize: 3,
      total: 0,
      searchObj:{hosname:'',provinceCode:'',cityCode:'',districtCode:''}//查询条件 （医院名称+省市）
    };
  },
  methods: {
    toSchedule(hoscode){
      //跳转到排班页面 
      //index.js 路由文件，定义的某一个路由的path路径（父path+子path）
      this.$router.push({path:'/hosp/schedule/' + hoscode})
    },
    showDetail(id){
        //show.vue
        this.$router.push({path:`/hosp/hospdetail/${id}`})
    },
    updateStatus(id,status){
      hospitalApi.updateStatus(id,status).then(resp=>{
        this.fetchData(this.pageNum)//重新加载当前页数据
      })
    },
    cityChange(){
      this.districtList = []//城市发生改变，区列表清空
      this.searchObj.districtCode = ''//用于记录选择的城市，当省份发生改变，之前选中的城市取消掉
      cmnApi.findChildData(this.searchObj.cityCode).then(resp=>{
        this.districtList = resp.data.list //城市列表
      })
    },
    provinceChange(){
      //this.searchObj.provinceCode 选中的省份对应的value值（省市区的value和省市区的id其实一样的）
      //根据省份的id查询城市列表

      this.cityList = []//省份发生改变，城市列表清空
      this.districtList = []//区列表清空

      this.searchObj.cityCode = ''//用于记录选择的城市，当省份发生改变，之前选中的城市取消掉
      this.searchObj.districtCode = ''

      cmnApi.findChildData(this.searchObj.provinceCode).then(resp=>{
        this.cityList = resp.data.list //城市列表
      })
    },
    clear(){
      this.searchObj = {hosname:'',provinceCode:'',cityCode:'',districtCode:''}
      this.fetchData()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    fetchData(page=1){
      this.pageNum = page
      hospitalApi.pageList(this.pageNum,this.pageSize,this.searchObj).then(resp=>{
        this.tableData = resp.data.pages.content//当前页结果集
        this.total = resp.data.pages.totalElements//总记录数
      })
    },
    findProvinceList(){
      cmnApi.findByDictCode('Province').then(resp=>{
        this.provinceList = resp.data.list//省份列表
      })
    }
  },
  created(){
    this.fetchData()
    this.findProvinceList()
  }
};
</script>

<style>
</style>