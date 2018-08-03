<template>
  <!--<Layout :style="{padding: '0 24px 24px', height: '100%'}">-->
  <div>
    <Breadcrumb :style="{margin: '24px 0'}">
      <BreadcrumbItem>图搜管理</BreadcrumbItem>
      <BreadcrumbItem>全量分类管理</BreadcrumbItem>
    </Breadcrumb>
    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
      <Row style="margin-bottom: 6px">
        <Col span="3">
          <Button type="primary" icon="plus" title="新增" size="small" style="margin-right: 5px" v-on:click="addData()"></Button>
          <Button type="error" icon="trash-b" title="批量删除" size="small" style="margin-right: 5px" v-on:click="showDeleteModal()"></Button>
          <Button type="info" icon="arrow-up-a" title="导入" size="small" @click="showUploadModal()"></Button>
        </Col>
        <Col span="6">
          <strong style="padding-bottom: 3px;margin-right: 10px">分类ID：</strong><Input style="width: 70%" type="text" size="small" v-model="searchForm.categoryId" placeholder="输入分类ID"></Input>
        </Col>
        <Col span="6">
          <strong style="margin-right: 10px">分类名称：</strong><Input type="text" style="width: 70%" size="small" v-model="searchForm.name" placeholder="输入分类名称"></Input>
        </Col>
        <Col span="6">
          <strong style="margin-right: 10px">分类状态：</strong>
          <Select v-model="searchForm.status" size="small" style="width: 70%;">
            <Option value="2">全部</Option>
            <Option value="1">通过</Option>
            <Option value="0">不通过</Option>
          </Select>
        </Col>
        <Col span="3">
          <Button type="success" icon="search" size="small" style="margin-right: 2px;margin-left: 10px" v-on:click="search()">查询</Button>
          <Button type="warning" icon="refresh" size="small" v-on:click="reset()">重置</Button>
        </Col>
      </Row>
      <Table :loading="loading" :data="tableData1" :columns="tableColumns1" stripe border ref="selection" @on-selection-change="handlerSelected" @on-select-all="handlerSelected"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="100" :current="1" @on-change="changePage"></Page>
        </div>
      </div>
    </Content>
    <Modal
      @on-ok="deleteSelectedData"
      v-model="batchDeleteModal"
      title="操作提醒"
      width="300">
      <strong style="text-align: center">您确定要删除选中的数据吗？</strong>
    </Modal>
    <Modal
      :ok-text="modalText"
      :loading="modalLoading"
      @on-ok="add()"
      @on-cancel="clearForm('addOrEditForm')"
      v-model="addOrEditModel"
      title="新增分类"
      width="420">
      <Form ref="addOrEditForm" :model="addOrEditForm" :rules="addOrEditFormValidate" :label-width="100">
        <FormItem label="分类ID：" prop="portrayal">
          <Input v-model="addOrEditForm.portrayal" placeholder="请输入分类ID..."></Input>
        </FormItem>
        <FormItem label="分类名称：" prop="name">
          <Input v-model="addOrEditForm.name" placeholder="请输入分类名称..."></Input>
        </FormItem>
        <FormItem label="状态：" prop="status">
          <Select v-model="addOrEditForm.status" placeholder="请先择分类状态">
            <Option value="1">通过</Option>
            <Option value="0">不通过</Option>
          </Select>
        </FormItem>
        <FormItem label="分类描述：">
          <Input v-model="addOrEditForm.people" type="textarea" placeholder="请输入分类描述..."></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      ok-text="关闭"
      v-model="uploadModal"
      title="操作提醒"
      width="300"
    @on-ok="clearFiles"
    @on-cancel="clearFiles">
      <Upload
        ref="upload"
        type="drag"
        action="//jsonplaceholder.typicode.com/posts/">
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>点击或拖拽文件到此处进行上传</p>
        </div>
      </Upload>
    </Modal>
  </div>
  <!--</Layout>-->
</template>

<script>
export default {
  data () {
    return {
      loadingStatus: false,
      file: null,
      uploadModal: false,
      addOrEditModel: false,
      addOrEditForm: {
        name: '',
        status: '',
        portrayal: '',
        people: ''
      },
      modalLoading: true,
      modalText: '保存',
      showMessage: true,
      addOrEditFormValidate: {
        name: [
          { required: true, message: '请输入分类名称...', trigger: 'blur' }
        ],
        portrayal: [
          { required: true, message: '请输入分类ID...', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择分类状态...', trigger: 'change' }
        ]
      },
      searchForm: {
        categoryId: '',
        name: '',
        status: ''
      },
      tableData1: this.mockTableData1(),
      loading: true,
      tableColumns1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          type: 'index',
          width: 70
        },
        {
          title: '分类名称',
          key: 'name'
        },
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            const row = params.row
            const color = row.status === 1 ? 'blue' : row.status === 2 ? 'green' : 'red'
            const text = row.status === 1 ? 'Working' : row.status === 2 ? 'Success' : 'Fail'

            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '分类编码',
          key: 'portrayal',
          render: (h, params) => {
            return h('Poptip', {
              props: {
                trigger: 'hover',
                title: params.row.portrayal.length + 'portrayals',
                placement: 'bottom'
              }
            }, [
              h('Tag', params.row.portrayal.length),
              h('div', {
                slot: 'content'
              }, [
                h('ul', this.tableData1[params.index].portrayal.map(item => {
                  return h('li', {
                    style: {
                      textAlign: 'center',
                      padding: '4px'
                    }
                  }, item)
                }))
              ])
            ])
          }
        },
        {
          title: '描述信息',
          key: 'people',
          render: (h, params) => {
            return h('Poptip', {
              props: {
                trigger: 'hover',
                title: params.row.people.length + 'customers',
                placement: 'bottom'
              }
            }, [
              h('Tag', params.row.people.length),
              h('div', {
                slot: 'content'
              }, [
                h('ul', this.tableData1[params.index].people.map(item => {
                  return h('li', {
                    style: {
                      textAlign: 'center',
                      padding: '4px'
                    }
                  }, item.n + '：' + item.c + 'People')
                }))
              ])
            ])
          }
        },
        {
          title: '创建时间',
          key: 'time',
          render: (h, params) => {
            return h('div', 'Almost' + params.row.time + 'days')
          }
        },
        {
          title: '操作',
          key: 'update',
          render: (h, params) => {
            return h('div', this.formatDate(this.tableData1[params.index].update))
          }
        }
      ],
      selectedData: [],
      batchDeleteModal: false
    }
  },
  mounted () {
    setTimeout(() => { this.loading = false }, 1000)
  },
  methods: {
    addData () {
      this.clearForm('addOrEditForm')
      this.modalText = '保存'
      this.addOrEditModel = true
    },
    mockTableData1 () {
      let data = []
      for (let i = 0; i < 10; i++) {
        data.push({
          name: 'Business' + Math.floor(Math.random() * 100 + 1),
          status: Math.floor(Math.random() * 3 + 1),
          portrayal: ['City', 'People', 'Cost', 'Life', 'Entertainment'],
          people: [
            {
              n: 'People' + Math.floor(Math.random() * 100 + 1),
              c: Math.floor(Math.random() * 1000000 + 100000)
            },
            {
              n: 'People' + Math.floor(Math.random() * 100 + 1),
              c: Math.floor(Math.random() * 1000000 + 100000)
            },
            {
              n: 'People' + Math.floor(Math.random() * 100 + 1),
              c: Math.floor(Math.random() * 1000000 + 100000)
            }
          ],
          time: Math.floor(Math.random() * 7 + 1),
          update: new Date()
        })
      }
      return data
    },
    formatDate (date) {
      const y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    changePage () {
      // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
      this.tableData1 = this.mockTableData1()
    },
    showDeleteModal () {
      if (this.selectedData.length === 0) {
        this.$Message.info('请选中要删除的数据！')
      } else {
        this.batchDeleteModal = true
      }
    },
    handlerSelected (selection) {
      this.selectedData = []
      for (let i = 0; i < selection.length; i++) {
        this.selectedData.push(selection[i].name)
      }
    },
    deleteSelectedData () {
      this.loading = true
      // 发送请求删除数据
      setTimeout(() => {
        if (Math.floor(Math.random() * 10 + 1) % 2 === 0) {
          this.$Message.success('操作成功！')
        } else {
          this.$Message.error('操作失败')
        }
        this.loading = false
      }, 1000)
    },
    add () {
      this.modalLoading = false
      this.$refs['addOrEditForm'].validate((valid) => {
        if (valid) {
          this.modalText = '正在提交'
          this.modalLoading = true
          this.loading = true
          setTimeout(() => {
            if (Math.floor(Math.random() * 10 + 1) % 2 !== 0) {
              this.$Message.success('保存成功！')
              this.modalLoading = false
              this.addOrEditModel = false
              this.$refs['addOrEditForm'].resetFields()
            } else {
              this.$Message.error('保存失败！')
              this.modalLoading = false
              this.modalText = '保存'
            }
            this.$nextTick(() => {
              this.modalLoading = true
            })
            this.loading = false
          }, 1000)
        } else {
          this.$nextTick(() => {
            this.modalLoading = true
          })
        }
      })
    },
    showUploadModal () {
      this.uploadModal = true
    },
    clearFiles () {
      this.$refs.upload.clearFiles()
    },
    clearForm (name) {
      this.$refs[name].resetFields()
    },
    reset () {
      this.searchForm.categoryId = ''
      this.searchForm.status = ''
      this.searchForm.name = ''
      this.$Message.info('查询条件已重置！')
    },
    search () {
      this.loading = true
      setTimeout(() => { this.loading = false }, 1000)
    }
  }
}
</script>

<style scoped>

</style>
