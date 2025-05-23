import request from '@/utils/request'

// 查询CasinoRaw列表
export function listCasinoRaw(query) {
    return request({
        url: '/api/v1/casino-raw',
        method: 'get',
        params: query
    })
}

// 查询CasinoRaw详细
export function getCasinoRaw (id) {
    return request({
        url: '/api/v1/casino-raw/' + id,
        method: 'get'
    })
}


// 新增CasinoRaw
export function addCasinoRaw(data) {
    return request({
        url: '/api/v1/casino-raw',
        method: 'post',
        data: data
    })
}

// 修改CasinoRaw
export function updateCasinoRaw(data) {
    return request({
        url: '/api/v1/casino-raw/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除CasinoRaw
export function delCasinoRaw(data) {
    return request({
        url: '/api/v1/casino-raw',
        method: 'delete',
        data: data
    })
}

// 更新CasinoRaw
export function updateCasinoRawStatus(data) {
    return request({
        url: '/api/v1/casino-raw/update-status',
        method: 'post',
        data: data
    })
}

