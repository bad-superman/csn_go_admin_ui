<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item label="网站名" prop="name"><el-input v-model="queryParams.name" placeholder="请输入网站名"
                            clearable size="small" @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="链接" prop="displayLink"><el-input v-model="queryParams.displayLink"
                            placeholder="请输入链接" clearable size="small" @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="状态" prop="status"><el-input v-model="queryParams.status" placeholder="请输入状态"
                            clearable size="small" @keyup.enter.native="handleQuery" />
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button v-permisaction="['admin:casino:add']" type="primary" icon="el-icon-plus" size="mini"
                            @click="handleAdd">新增
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button v-permisaction="['admin:casino:edit']" type="success" icon="el-icon-edit" size="mini"
                            :disabled="single" @click="handleUpdate">修改
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button v-permisaction="['admin:casino:remove']" type="danger" icon="el-icon-delete"
                            size="mini" :disabled="multiple" @click="handleDelete">删除
                        </el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="casinoList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="网站名" align="center" prop="name" :show-overflow-tooltip="true" />
                    <el-table-column label="链接" align="center">
                        <template slot-scope="scope">
                            <el-link 
                            type="primary" 
                            :href="formatLink(scope.row.displayLink)" 
                            target="_blank"
                            :underline="false">
                            {{ scope.row.displayLink }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="描述" align="center" prop="description"
                        :show-overflow-tooltip="true" /> -->
                    <el-table-column label="图标" align="center" width="80">
                        <template slot-scope="scope">
                            <el-image 
                            style="width: 30px; height: 30px"
                            :src="scope.row.logoUrl"
                            fit="contain">
                            <!-- 加载失败显示默认图标 -->
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column label="成立时间" align="center"
                        prop="establishedDate" :show-overflow-tooltip="true" >
                        <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.establishedDate, "{y}-{m}-{d}") }}</span>
                        </template>
                    </el-table-column> 
                    <el-table-column label="游戏类型"
                        align="center" prop="gameTypes" :show-overflow-tooltip="true" >
                        <template slot-scope="scope">
                            <span>{{ selectOptionsJoin("casino_games",scope.row.gameTypes) }}</span>
                        </template>
                    </el-table-column>    
                    <el-table-column label="支付方式"
                        align="center" prop="paymentMethods" :show-overflow-tooltip="true" >
                        <template slot-scope="scope">
                            <span>{{ selectOptionsJoin("casino_payment_methods",scope.row.paymentMethods) }}</span>
                        </template>
                        </el-table-column> 
                    <el-table-column label="支持语言"
                        align="center" prop="languages" :show-overflow-tooltip="true" >
                        <template slot-scope="scope">
                            <span>{{ selectOptionsJoin("language",scope.row.languages) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="地区"
                        align="center" prop="regions" :show-overflow-tooltip="true" >
                        <template slot-scope="scope">
                            <span>{{ selectOptionsJoin("region",scope.row.regions) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="促销活动"
                        align="center" prop="promotions" :show-overflow-tooltip="true" >
                        <template slot-scope="scope">
                            <span>{{ selectOptionsJoin("promotion",scope.row.promotions) }}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="促销活动" align="center" prop="promotions" :show-overflow-tooltip="true" /> -->
                    <el-table-column label="状态" align="center" prop="status" :show-overflow-tooltip="true" :formatter="(row, column, cellValue) => getStatusLabel(cellValue)"/>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-popconfirm class="delete-popconfirm" title="确认要修改吗?" confirm-button-text="修改"
                                @confirm="handleUpdate(scope.row)">
                                <el-button slot="reference" v-permisaction="['admin:casino:edit']" size="mini"
                                    type="text" icon="el-icon-edit">修改
                                </el-button>
                            </el-popconfirm>
                            <el-popconfirm class="delete-popconfirm" title="确认要删除吗?" confirm-button-text="删除"
                                @confirm="handleDelete(scope.row)">
                                <el-button slot="reference" v-permisaction="['admin:casino:remove']" size="mini"
                                    type="text" icon="el-icon-delete">删除
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

                        <el-form-item label="网站名" prop="name">
                            <el-input v-model="form.name" placeholder="网站名" />
                        </el-form-item>
                        <el-form-item label="链接" prop="displayLink">
                            <el-input v-model="form.displayLink" placeholder="链接" />
                        </el-form-item>
                        <el-form-item label="描述" prop="description">
                            <el-input v-model="form.description" placeholder="描述" />
                        </el-form-item>
                        <el-form-item label="图标" prop="logoUrl">
                            <el-upload
                                class="avatar-uploader"
                                :action="sys_app_uploadAction"
                                :show-file-list="false"
                                :on-success="handleLogoSuccess"
                                :before-upload="beforeLogoUpload"
                                :headers="headers">
                                <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="成立时间" prop="establishedDate">
                            <el-date-picker
                                v-model="form.establishedDate"
                                type="date"
                                placeholder="请选择成立时间"
                                value-format="yyyy-MM-dd"
                                style="width: 100%;"
                            />
                        </el-form-item>
                        <el-form-item label="游戏类型" prop="gameTypes">
                            <el-select
                                v-model="form.gameTypes"
                                multiple
                                placeholder="请选择游戏类型"
                                style="width: 100%;"
                            >
                                <el-option v-for="item in dictMap.casino_games" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="支付方式" prop="paymentMethods">
                            <el-select
                                v-model="form.paymentMethods"
                                multiple
                                placeholder="请选择支付方式"
                                style="width: 100%;"
                            >
                                <el-option v-for="item in dictMap.casino_payment_methods" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="支持语言" prop="languages">
                            <el-select
                                v-model="form.languages"
                                multiple
                                placeholder="请选择语言"
                                style="width: 100%;"
                            >
                                <el-option v-for="item in dictMap.language" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="地区" prop="regions">
                            <el-select
                                v-model="form.regions"
                                multiple
                                placeholder="请选择地区"
                                style="width: 100%;"
                            >
                                <el-option v-for="item in dictMap.region" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="促销活动" prop="promotions">
                            <el-select
                                v-model="form.promotions"
                                multiple
                                placeholder="请选择促销活动"
                                style="width: 100%;"
                            >
                                <el-option v-for="item in dictMap.promotion" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%;">
                                <el-option :label="'默认'" :value="0"></el-option>
                                <el-option :label="'正常运营'" :value="1"></el-option>
                                <el-option :label="'停止运营'" :value="2"></el-option>
                            </el-select>
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
import { addCasino, delCasino, getCasino, listCasino, updateCasino } from '@/api/admin/casino'
import { formatLink } from '@/utils/url'
import { getToken } from '@/utils/auth'
import './index.css'
export default {
    name: 'Casino',
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
            casinoList: [],
            gameTypes: [],
            paymentMethods: [],
            dictMap: {
                casino_payment_methods: [],
                casino_games: [],
                language: [],
                region: [],
                promotion: [],
            },
            // 关系表类型

            // 查询参数
            queryParams: {
                pageIndex: 1,
                pageSize: 10,
                name: undefined,
                displayLink: undefined,
                status: undefined,

            },
            headers: { 'Authorization': 'Bearer ' + getToken() },
            // 表单参数
            form: {
            },
            // 表单校验
            rules: {
                name: [{ required: true, message: '网站名不能为空', trigger: 'blur' }],
                displayLink: [{ required: true, message: '链接不能为空', trigger: 'blur' }],
                status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
            },
            sys_app_uploadAction: process.env.VUE_APP_BASE_API + '/api/v1/public/uploadFile',
        }
    },
    created() {
        this.loadDicts()
        this.$nextTick(() => {})
        this.getList()
    },
    methods: {
        loadDicts() {
            for (let key in this.dictMap) {
                this.getDicts(key).then(response => {
                    this.dictMap[key] = response.data
                    console.log('key:', key, 'value:', response.data)
                })
            }
        },
        formatLink,
        stringToArr(val) {
            if (val && typeof val === 'string') {
                try {
                    val = JSON.parse(val);
                } catch (error) {
                    console.error('解析gameTypes失败:', error);
                    val = [];
                }
                return val
            }
            return [];
        },
        /** 查询参数列表 */
        getList() {
            this.loading = true
            listCasino(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                this.casinoList = response.data.list.map(item => {
                item.gameTypes = this.stringToArr(item.gameTypes);
                item.paymentMethods = this.stringToArr(item.paymentMethods);
                item.languages = this.stringToArr(item.languages);
                item.regions = this.stringToArr(item.regions);
                item.promotions = this.stringToArr(item.promotions);
                return item;
                });
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
                name: undefined,
                displayLink: undefined,
                description: undefined,
                logoUrl: undefined,
                establishedDate: undefined,
                gameTypes: undefined,
                paymentMethods: undefined,
                languages: undefined,
                regions: undefined,
                promotions: undefined,
                status: undefined,
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
            this.title = '添加Casino'
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
            getCasino(id).then(response => {
                this.form = response.data
                this.form.gameTypes = this.stringToArr(this.form.gameTypes)
                this.form.paymentMethods = this.stringToArr(this.form.paymentMethods)
                this.form.languages = this.stringToArr(this.form.languages)
                this.form.regions = this.stringToArr(this.form.regions)
                this.form.promotions = this.stringToArr(this.form.promotions)
                this.open = true
                this.title = '修改Casino'
                this.isEdit = true
            })
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs['form'].validate(valid => {
                const data = { ...this.form }
                data.gameTypes = JSON.stringify(this.form.gameTypes)
                data.paymentMethods = JSON.stringify(this.form.paymentMethods)
                data.languages = JSON.stringify(this.form.languages)
                data.regions = JSON.stringify(this.form.regions)
                data.promotions = JSON.stringify(this.form.promotions)
                if (valid) {
                    if (data !== undefined) {
                        updateCasino(data).then(response => {
                            if (response.code === 200) {
                                this.msgSuccess(response.msg)
                                this.open = false
                                this.getList()
                            } else {
                                this.msgError(response.msg)
                            }
                        })
                    } else {
                        addCasino(data).then(response => {
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
                return delCasino({ 'ids': Ids })
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
        handleLogoSuccess(response) {
            this.form.logoUrl = process.env.VUE_APP_BASE_API + response.data.full_path
            this.$message.success('上传成功')
        },
        getStatusLabel(val) {
            switch (val) {
                case 0: return '默认'
                case 1: return '正常运营'
                case 2: return '停止运营'
                default: return '未知'
            }
        },stringsJoin(val, separator = ",") {
            if (!val) return ''
            let arr = []
            try {
                arr = JSON.parse(val)
            } catch (e) {
                // 兼容后端返回不是json字符串的情况
                arr = Array.isArray(val) ? val : [val]
            }
            return arr.join(separator)
        },selectOptionsJoin(dictKey,val, separator = ",") {
            if (!val) return ''
            let arr = []
            try {
                arr = JSON.parse(val)
            } catch (e) {
                // 兼容后端返回不是json字符串的情况
                arr = Array.isArray(val) ? val : [val]
            }
            return arr.map(item => this.dictMap[dictKey].find(option => option.value === item)?.label).join(separator)
        }
    }
}
</script>
