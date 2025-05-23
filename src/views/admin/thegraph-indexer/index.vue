<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item label="索引人ID" prop="id"><el-input v-model="queryParams.id" placeholder="请输入索引人"
                            clearable size="small" @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="索引人" prop="defaultDisplayName"><el-input
                            v-model="queryParams.defaultDisplayName" placeholder="请输入索引人" clearable size="small"
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <!-- <el-col :span="1.5">
                        <el-button
                                v-permisaction="['admin:thegraphIndexer:add']"
                                type="primary"
                                icon="el-icon-plus"
                                size="mini"
                                @click="handleAdd"
                        >新增
                        </el-button>
                    </el-col> -->
                    <el-col :span="1.5">
                        <el-button v-permisaction="['admin:thegraphIndexer:edit']" type="success" icon="el-icon-edit"
                            size="mini" :disabled="single" @click="handleUpdate">修改
                        </el-button>
                    </el-col>
                    <!-- <el-col :span="1.5">
                        <el-button
                                v-permisaction="['admin:thegraphIndexer:remove']"
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                :disabled="multiple"
                                @click="handleDelete"
                        >删除
                        </el-button>
                    </el-col> -->
                </el-row>

                <el-table v-loading="loading" :data="thegraphIndexerList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" /><el-table-column label="url"
                        align="center" prop="id" :show-overflow-tooltip="true" /><el-table-column label="url"
                        align="center" prop="url" :show-overflow-tooltip="true" /><el-table-column label="索引人"
                        align="center" prop="defaultDisplayName" :show-overflow-tooltip="true" /><el-table-column
                        label="索引人质押量" align="center" prop="stakedTokens"
                        :show-overflow-tooltip="true" /><el-table-column label="已质押量" align="center"
                        prop="allocatedTokens" :show-overflow-tooltip="true" /><el-table-column label="未质押量"
                        align="center" prop="unstakedTokens" :show-overflow-tooltip="true" /><el-table-column
                        label="当前索引子图数" align="center" prop="allocationCount"
                        :show-overflow-tooltip="true" /><el-table-column label="历史索引子图数" align="center"
                        prop="totalAllocationCount" :show-overflow-tooltip="true" /><el-table-column label="累计查询费用"
                        align="center" prop="queryFeesCollected" :show-overflow-tooltip="true" /><el-table-column
                        label="索引人查询分成" align="center" prop="queryFeeRebates"
                        :show-overflow-tooltip="true" /><el-table-column label="累计奖励" align="center"
                        prop="rewardsEarned" :show-overflow-tooltip="true" /><el-table-column label="索引人累计奖励"
                        align="center" prop="indexerIndexingRewards" :show-overflow-tooltip="true" /><el-table-column
                        label="委托人累计奖励" align="center" prop="delegatorIndexingRewards"
                        :show-overflow-tooltip="true" /><el-table-column label="自身奖励占比" align="center"
                        prop="indexerRewardsOwnGenerationRatio" :show-overflow-tooltip="true" /><el-table-column
                        label="委托权益" align="center" prop="delegatedCapacity"
                        :show-overflow-tooltip="true" /><el-table-column label="总权益" align="center" prop="tokenCapacity"
                        :show-overflow-tooltip="true" /><el-table-column label="可分配代币量" align="center"
                        prop="availableStake" :show-overflow-tooltip="true" /><el-table-column label="质押人质押量"
                        align="center" prop="delegatedTokens" :show-overflow-tooltip="true" /><el-table-column
                        label="自质押占比" align="center" prop="ownStakeRatio"
                        :show-overflow-tooltip="true" /><el-table-column label="质押人占比" align="center"
                        prop="delegatedStakeRatio" :show-overflow-tooltip="true" /><el-table-column label="质押人份额"
                        align="center" prop="delegatorShares" :show-overflow-tooltip="true" /><el-table-column
                        label="单份额收益" align="center" prop="delegationExchangeRate"
                        :show-overflow-tooltip="true" /><el-table-column label="索引奖励自留比例" align="center"
                        prop="indexingRewardCut" :show-overflow-tooltip="true" /><el-table-column label="索引奖励有效占比"
                        align="center" prop="indexingRewardEffectiveCut"
                        :show-overflow-tooltip="true" /><el-table-column label="质押人质押溢出量" align="center"
                        prop="overDelegationDilution" :show-overflow-tooltip="true" /><el-table-column label="质押人查询费用"
                        align="center" prop="delegatorQueryFees" :show-overflow-tooltip="true" /><el-table-column
                        label="查询费用自留占比" align="center" prop="queryFeeCut"
                        :show-overflow-tooltip="true" /><el-table-column label="查询费用有效占比" align="center"
                        prop="queryFeeEffectiveCut" :show-overflow-tooltip="true" /><el-table-column label="委托人冷静区块数"
                        align="center" prop="delegatorParameterCooldown"
                        :show-overflow-tooltip="true" /><el-table-column label="最新委托区块" align="center"
                        prop="lastDelegationParameterUpdate" :show-overflow-tooltip="true" /><el-table-column
                        label="强制关闭次数" align="center" prop="forcedClosures" :show-overflow-tooltip="true" />
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-popconfirm class="delete-popconfirm" title="确认要修改吗?" confirm-button-text="修改"
                                @confirm="handleUpdate(scope.row)">
                                <el-button slot="reference" v-permisaction="['admin:thegraphIndexer:edit']" size="mini"
                                    type="text" icon="el-icon-edit">修改
                                </el-button>
                            </el-popconfirm>
                            <el-popconfirm class="delete-popconfirm" title="确认要删除吗?" confirm-button-text="删除"
                                @confirm="handleDelete(scope.row)">
                                <el-button slot="reference" v-permisaction="['admin:thegraphIndexer:remove']"
                                    size="mini" type="text" icon="el-icon-delete">删除
                                </el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageIndex"
                    :limit.sync="queryParams.pageSize" @pagination="getList" />

                <!-- 添加或修改对话框 -->
                <el-dialog :title="title" :visible.sync="open" width="500px">
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px">

                        <el-form-item label="索引人" prop="defaultDisplayName">
                            <el-input v-model="form.defaultDisplayName" placeholder="索引人" />
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="submitForm">确 定</el-button>
                        <el-button @click="cancel">取 消</el-button>
                    </div>
                </el-dialog>
            </el-card>
        </template>
    </BasicLayout>
</template>

<script>
import { addThegraphIndexer, delThegraphIndexer, getThegraphIndexer, listThegraphIndexer, updateThegraphIndexer } from '@/api/admin/thegraph-indexer'

export default {
    name: 'ThegraphIndexer',
    components: {
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 总条数
            total: 0,
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            isEdit: false,
            // 类型数据字典
            typeOptions: [],
            thegraphIndexerList: [],

            // 关系表类型

            // 查询参数
            queryParams: {
                pageIndex: 1,
                pageSize: 10,
                defaultDisplayName: undefined,

            },
            // 表单参数
            form: {
            },
            // 表单校验
            rules: {
                defaultDisplayName: [{ required: true, message: '索引人不能为空', trigger: 'blur' }],
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        /** 查询参数列表 */
        getList() {
            this.loading = true
            listThegraphIndexer(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                this.thegraphIndexerList = response.data.list
                this.total = response.data.count
                this.loading = false
            }
            )
        },
        // 取消按钮
        cancel() {
            this.open = false
            this.reset()
        },
        // 表单重置
        reset() {
            this.form = {

                id: undefined,
                defaultDisplayName: undefined,
            }
            this.resetForm('form')
        },
        getImgList: function () {
            this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
        },
        fileClose: function () {
            this.fileOpen = false
        },
        // 关系
        // 文件
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageIndex = 1
            this.getList()
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = []
            this.resetForm('queryForm')
            this.handleQuery()
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset()
            this.open = true
            this.title = '添加ThegraphIndexer'
            this.isEdit = false
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset()
            const id =
                row.id || this.ids
            getThegraphIndexer(id).then(response => {
                this.form = response.data
                this.open = true
                this.title = '修改ThegraphIndexer'
                this.isEdit = true
            })
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id !== undefined) {
                        updateThegraphIndexer(this.form).then(response => {
                            if (response.code === 200) {
                                this.msgSuccess(response.msg)
                                this.open = false
                                this.getList()
                            } else {
                                this.msgError(response.msg)
                            }
                        })
                    } else {
                        addThegraphIndexer(this.form).then(response => {
                            if (response.code === 200) {
                                this.msgSuccess(response.msg)
                                this.open = false
                                this.getList()
                            } else {
                                this.msgError(response.msg)
                            }
                        })
                    }
                }
            })
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            var Ids = (row.id && [row.id]) || this.ids

            this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                return delThegraphIndexer({ 'ids': Ids })
            }).then((response) => {
                if (response.code === 200) {
                    this.msgSuccess(response.msg)
                    this.open = false
                    this.getList()
                } else {
                    this.msgError(response.msg)
                }
            }).catch(function () {
            })
        }
    }
}
</script>
