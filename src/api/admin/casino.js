import request from '@/utils/request'

// 查询Casino列表
export function listCasino(query) {
    return request({
        url: '/api/v1/casino',
        method: 'get',
        params: query
    })
}

// 查询Casino详细
export function getCasino (id) {
    return request({
        url: '/api/v1/casino/' + id,
        method: 'get'
    })
}


// 新增Casino
export function addCasino(data) {
    return request({
        url: '/api/v1/casino',
        method: 'post',
        data: data
    })
}

// 修改Casino
export function updateCasino(data) {
    return request({
        url: '/api/v1/casino/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除Casino
export function delCasino(data) {
    return request({
        url: '/api/v1/casino',
        method: 'delete',
        data: data
    })
}

