import request from '@/utils/request'

// 查询TbDemo列表
export function listTbDemo(query) {
    return request({
        url: '/api/v1/tb-demo',
        method: 'get',
        params: query
    })
}

// 查询TbDemo详细
export function getTbDemo (id) {
    return request({
        url: '/api/v1/tb-demo/' + id,
        method: 'get'
    })
}


// 新增TbDemo
export function addTbDemo(data) {
    return request({
        url: '/api/v1/tb-demo',
        method: 'post',
        data: data
    })
}

// 修改TbDemo
export function updateTbDemo(data) {
    return request({
        url: '/api/v1/tb-demo/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除TbDemo
export function delTbDemo(data) {
    return request({
        url: '/api/v1/tb-demo',
        method: 'delete',
        data: data
    })
}

