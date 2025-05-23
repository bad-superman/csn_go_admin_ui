import request from '@/utils/request'

// 查询IndexerDelegateRewards列表
export function listIndexerDelegateRewards(query) {
    return request({
        url: '/api/v1/indexer-delegate-rewards',
        method: 'get',
        params: query
    })
}

// 查询IndexerDelegateRewards详细
export function getIndexerDelegateRewards (id) {
    return request({
        url: '/api/v1/indexer-delegate-rewards/' + id,
        method: 'get'
    })
}


// 新增IndexerDelegateRewards
export function addIndexerDelegateRewards(data) {
    return request({
        url: '/api/v1/indexer-delegate-rewards',
        method: 'post',
        data: data
    })
}

// 修改IndexerDelegateRewards
export function updateIndexerDelegateRewards(data) {
    return request({
        url: '/api/v1/indexer-delegate-rewards/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除IndexerDelegateRewards
export function delIndexerDelegateRewards(data) {
    return request({
        url: '/api/v1/indexer-delegate-rewards',
        method: 'delete',
        data: data
    })
}

