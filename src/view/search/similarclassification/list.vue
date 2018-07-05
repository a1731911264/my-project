<template>
  <Layout :style="{padding: '0 24px 24px', height: '100%'}">
    <Breadcrumb :style="{margin: '24px 0'}">
      <BreadcrumbItem>图搜管理</BreadcrumbItem>
      <BreadcrumbItem>相似分类管理</BreadcrumbItem>
    </Breadcrumb>
    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
      <Row style="margin-bottom: 6px">
        <Col span="3">
          <Button type="primary" icon="plus" title="新增" size="small" style="margin-right: 5px"></Button>
          <Button type="error" icon="trash-b" title="批量删除" size="small" style="margin-right: 5px"></Button>
          <Button type="info" icon="arrow-up-a" title="导入" size="small"></Button>
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
          <Button type="success" icon="search" size="small" style="margin-right: 2px;margin-left: 10px">查询</Button>
          <Button type="warning" icon="refresh" size="small">重置</Button>
        </Col>
      </Row>
      <Table :loading="loading" :data="tableData1" :columns="tableColumns1" stripe></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="100" :current="1" @on-change="changePage"></Page>
        </div>
      </div>
    </Content>
  </Layout>
</template>

<script>
export default {
  data () {
    return {
      searchForm: {
        categoryId: '',
        name: '',
        status: ''
      },
      tableData1: this.mockTableData1(),
      loading: true,
      tableColumns1: [
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
      ]
    }
  },
  mounted () {
    setTimeout(() => { this.loading = false }, 1000)
  },
  methods: {
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
    }
  }
}
</script>

<style scoped>

</style>
