import request from '@/utils/request'

const api_name = '/admin/user'

export default {
    check(idCard,name){
        return request({
            url:`${api_name}/checkIdCardAndName/${idCard}/${name}`,
            method:'get'
        })
    },
    //审核用户 authStatus
    updateAuthStatus(id,authStatus){
        return request({
            url:`${api_name}/updateAuthStatus/${id}/${authStatus}`,
            method:'get'
        })
    },
    show(id){
        return request({
            url:`${api_name}/show/${id}`,
            method:'get'
        })
    },
    getUserList(page,limit,searchObj){
        return request({
            url:`${api_name}/selectList/${page}/${limit}`,
            method:'post',
            data:searchObj
        })
    },
    updateStatus(id,status){
        return request({
            url:`${api_name}/updateStatus/${id}/${status}`,
            method:'get'
        })
    }


}