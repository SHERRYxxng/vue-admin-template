//1、先引入request.js，他是封装了axios.js , 用于统一的发起请求的代码的编写
import request from '@/utils/request'

//类上的公共路径
const api_name = '/admin/hosp/schedule'

//2、es6的模块化
export default {

    //查询后侧的日期列表和其它的数据
    getScheduleRule(page, limit, hoscode, depcode){
        return request({
            url:`${api_name}/getScheduleRuleVoList/${page}/${limit}/${hoscode}/${depcode}`,
            method:'get'
        })
    },
    //查询排班列表
    getScheduleDetail(hoscode, depcode, workDate){
        return request({
            url:`${api_name}/getScheduleDetail/${hoscode}/${depcode}/${workDate}`,
            method:'get'
        })
    }

}