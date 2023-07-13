//1、先引入request.js，他是封装了axios.js , 用于统一的发起请求的代码的编写
import request from '@/utils/request'

//类上的公共路径
const api_name = '/admin/hosp/hospital'

//2、es6的模块化
export default {

    //查询医院列表接口
    pageList(pageNum,pageSize,searchObj){
        return request({
            url:`${api_name}/hospList/${pageNum}/${pageSize}`,
            method:'get',
            params:searchObj
        })
    },
    updateStatus(id,status){
        return request({
            url:`${api_name}/updateStatus/${id}/${status}`,
            method:'get'
        })
    },
    getHospById(id){
        return request({
            url:`${api_name}/show/${id}`,
            method:'get'
        })
    },
    //DepartmentController接口
    getDeptByHoscode(hoscode){
        return request({
            url:`/admin/hosp/department/departmentList/${hoscode}`,
            method:'get'
        })
    }

}