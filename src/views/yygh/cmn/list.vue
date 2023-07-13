<template>
  <div class="app-container">

    <el-button type="text" @click="open()">导入</el-button>
    <el-button type="text" @click="download()">导出</el-button>
    <el-dialog
      title="选中需要导入的excel"
      :visible.sync="dialogVisible"
      width="30%"
      >

      <el-upload
        name="multipartFile"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        ref="upload"
        class="upload-demo"
        drag
        action="http://localhost:8202/admin/cmn/importData"
        :auto-upload="auto"
        >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传excel文件，且不超过2M</div>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload()">导入</el-button>
      </span>
    </el-dialog>

    
    <el-table
      :data="list"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <!-- prop 数据字典json中的属性名 -->
      <el-table-column prop="name" label="数据字典名称" width="180"> </el-table-column>
      <el-table-column prop="value" label="值" width="180"> </el-table-column>
      <el-table-column prop="dictCode" label="编码"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import cmnApi from '@/api/yygh/cmn'
export default {
  data() {
    return {
      auto:false,
      list: [],
      dialogVisible:false,//默认关闭弹窗
    };
  },
  methods: {
    download(){
      //直接调用文件下载接口
      location.href = 'http://localhost:8202/admin/cmn/exportData'
    },
    beforeAvatarUpload(file) {
      // console.log(file.type)
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isExcel) {
        this.$message.error('导入的文件只能是excel格式!');
      }
      if (!isLt2M) {
        this.$message.error('导入的文件不能超过 2MB!');
      }
      return isExcel && isLt2M;
    },
    //文件上传成功，自动调用
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.fetchData()
    },
    //确定导入 
    submitUpload() {
      this.$refs.upload.submit();
      // this.fetchData()
      this.dialogVisible = false
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    open(){
      this.dialogVisible=true
    },
    //点击 > 执行load方法，加载下级列表，拿到的下级列表数据放在resolve( [xxx] )
    load(tree, treeNode, resolve) {
      // console.log(tree.id)//当前节点的id
      //根据当前节点的id查询下级列表
      cmnApi.findChildData(tree.id).then(resp=>{
        //resp.data.list  当前节点的下级数据列表
        //resolve（下级集合）
        resolve(resp.data.list);
      })
    },
    fetchData(){
      cmnApi.findChildData(1).then(resp=>{
        //tableData1用于存放一级数据字典列表
        this.list = resp.data.list
      })
    }
  },
  //打开list.vue之后，从created钩子方法开始执行
  created(){
    this.fetchData()
  }
};
</script>

<style>
</style>