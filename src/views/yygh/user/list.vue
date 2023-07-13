<template>
  <div class="app-container">
    {{value1}}
    <el-form :inline="true" :model="searchObj" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="searchObj.keyword" placeholder="用户名"></el-input>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="value1"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchData()">查询</el-button>
        <el-button type="primary" @click="clear()">清空</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" border style="width: 100%">
      <el-table-column fixed prop="date" label="序号">
        <template slot-scope="scope">
            {{scope.$index+1 + (page-1)*limit}}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号"> </el-table-column>
      <el-table-column prop="nickName" label="微信昵称"> </el-table-column>
      <el-table-column prop="name" label="姓名"> </el-table-column>

      <el-table-column prop="param.statusString" label="状态"> </el-table-column>
      <el-table-column prop="param.authStatusString" label="认证状态"> </el-table-column>

      <el-table-column prop="createTime" label="注册时间"> </el-table-column>

      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.status==1" size="small" @click="updateStatus(scope.row.id,0)">锁定</el-button>
          <el-button type="text" v-if="scope.row.status==0" size="small" @click="updateStatus(scope.row.id,1)">解锁</el-button>

          <!-- 点击查看按钮，打开user/show.vue  并且传递当前行用户id -->
          <el-button type="text" @click="show(scope.row.id)" size="small">查看</el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      style="padding: 30px 0; text-align: center"
      :page-sizes="[3, 5, 7, 9]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import userinfoApi from '@/api/yygh/userinfo'
export default {
  methods: {
    show(id){
      //打开show.vue (需要定义路由)
      this.$router.push({path:'/user/show/' + id})
    },
    //锁定和解锁按钮绑定的方法，根据id修改用户的status
    updateStatus(id,status){
        userinfoApi.updateStatus(id,status).then(resp=>{
            this.fetchData(this.page)
        })
    },
    handleClick(row) {
      console.log(row);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    fetchData(page=1){
        this.page = page

        //value1是时间控制中的两个时间值 [ "2023-06-26", "2023-07-03" ]
        if(this.value1.length>0){
            this.searchObj.createTimeBegin= this.value1[0]
            this.searchObj.createTimeEnd= this.value1[1]
        }
        userinfoApi.getUserList(this.page,this.limit,this.searchObj).then(resp=>{
            this.list = resp.data.list
            this.total = resp.data.total
        })
    },
    clear(){
        this.searchObj = {}
        this.value1 = []
        this.fetchData()
    }
  },
  data() {
    return {
      //查询表单绑定的属性
      searchObj: {},
      list: [], //用户列表
      total: 0, //总记录数
      page: 1,
      limit: 5,
      value1:[]
    };
  },
  created(){
    this.fetchData()
  }
};
</script>

<style>
</style>