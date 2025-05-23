
<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item label="赌场标题" prop="title"><el-input v-model="queryParams.title" placeholder="请输入赌场标题" clearable
                                              size="small" @keyup.enter.native="handleQuery"/>
                            </el-form-item>
                        <el-form-item label="显示链接" prop="displayLink"><el-input v-model="queryParams.displayLink" placeholder="请输入显示链接" clearable
                                              size="small" @keyup.enter.native="handleQuery"/>
                            </el-form-item>
                        
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button
                                v-permisaction="['admin:casinoRaw:edit']"
                                type="success"
                                icon="el-icon-edit"
                                size="mini"
                                :disabled="false"
                                @click="handlePass"
                        >通过
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                                v-permisaction="['admin:casinoRaw:remove']"
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                :disabled="false"
                                @click="handleDelete"
                        >忽略
                        </el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="casinoRawList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"/><el-table-column label="赌场标题" align="center" prop="title"
                                                 :show-overflow-tooltip="true"/><el-table-column label="显示链接" align="center" prop="displayLink"
                                                 :show-overflow-tooltip="true"/><el-table-column label="描述信息" align="center" prop="description"
                                                 :show-overflow-tooltip="true"/><el-table-column label="网站评分" align="center" prop="rating"
                                                 :show-overflow-tooltip="true"/><el-table-column label="用户评价数量" align="center" prop="userReviews"
                                                 :show-overflow-tooltip="true"/><el-table-column label="支持的游戏类型" align="center" prop="gameTypes"
                                                 :show-overflow-tooltip="true"/><el-table-column label="支持的支付方式" align="center" prop="paymentMethods"
                                                 :show-overflow-tooltip="true"/><el-table-column label="运营许可信息" align="center" prop="license"
                                                 :show-overflow-tooltip="true"/><el-table-column label="原始JSON数据" align="center" prop="rawData"
                                                 :show-overflow-tooltip="true"/><el-table-column label="数据状态：0-未验证，1-已验证，2-已删除" align="center" prop="status"
                                                 :show-overflow-tooltip="true"/>
                </el-table>

                <pagination
                        v-show="total>0"
                        :total="total"
                        :page.sync="queryParams.pageIndex"
                        :limit.sync="queryParams.pageSize"
                        @pagination="getList"
                />

                <!-- 添加或修改对话框 -->
                <el-dialog :title="title" :visible.sync="open" width="500px">
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                        
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
    import {addCasinoRaw, delCasinoRaw, getCasinoRaw, listCasinoRaw, updateCasinoRaw, updateCasinoRawStatus} from '@/api/admin/casino-raw'
    
    export default {
        name: 'CasinoRaw',
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
                casinoRawList: [],
                
                // 关系表类型
                
                // 查询参数
                queryParams: {
                    pageIndex: 1,
                    pageSize: 10,
                    title:undefined,
                    displayLink:undefined,
                    
                },
                // 表单参数
                form: {
                },
                // 表单校验
                rules: {title:  [ {required: true, message: '赌场标题不能为空', trigger: 'blur'} ],
                displayLink:  [ {required: true, message: '显示链接不能为空', trigger: 'blur'} ],
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
                listCasinoRaw(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                        this.casinoRawList = response.data.list
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
            }
                this.resetForm('form')
            },
            getImgList: function() {
              this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
            },
            fileClose: function() {
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
                this.title = '添加原始采集数据表'
                this.isEdit = false
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.id)
                this.single = selection.length !== 1
                this.multiple = !selection.length
            },
            /** 修改按钮操作 */
            handlePass(row) {
                var Ids = (row.id && [row.id]) || this.ids

                console.log(Ids)

                this.$confirm('是否确认通过编号为"' + Ids + '"的数据项?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                      return  updateCasinoRawStatus( { 'ids': Ids, 'status': 1 })
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
            },
            /** 删除按钮操作 */
            handleDelete(row) {
                var Ids = (row.id && [row.id]) || this.ids

                this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                      return    updateCasinoRawStatus( { 'ids': Ids, 'status': 2 })
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
