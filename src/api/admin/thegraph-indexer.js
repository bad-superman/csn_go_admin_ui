import request from '@/utils/request'

// 查询ThegraphIndexer列表
export function listThegraphIndexer(query) {
    return request({
        url: '/api/v1/thegraph-indexer',
        method: 'get',
        params: query
    })
}

// 查询ThegraphIndexer详细
export function getThegraphIndexer (id) {
    return request({
        url: '/api/v1/thegraph-indexer/' + id,
        method: 'get'
    })
}


// 新增ThegraphIndexer
export function addThegraphIndexer(data) {
    return request({
        url: '/api/v1/thegraph-indexer',
        method: 'post',
        data: data
    })
}

// 修改ThegraphIndexer
export function updateThegraphIndexer(data) {
    return request({
        url: '/api/v1/thegraph-indexer/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除ThegraphIndexer
export function delThegraphIndexer(data) {
    return request({
        url: '/api/v1/thegraph-indexer',
        method: 'delete',
        data: data
    })
}

