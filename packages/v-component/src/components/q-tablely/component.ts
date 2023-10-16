import { createApp, defineComponent, getCurrentInstance, onMounted, ref, toRefs, reactive, computed } from "vue";
import { TableProps } from "ant-design-vue";
import { cloneDeep } from "lodash-es";
import {
  Form,
  FormItem,
  Input,
  Select,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  TimePicker,
  DatePicker,
  Button,
  Tooltip,
  Switch,
  InputNumber,
  Textarea,
  Slider,
  Rate,
  message,
  Tag,
  Divider,
  Cascader,
  Dropdown,
  Menu,
  Modal,
  Drawer,
  Spin,
  Table,
  Typography,
  Popconfirm,
  ConfigProvider
} from "ant-design-vue";
import {
  SmileOutlined,
  DownOutlined
} from "@ant-design/icons-vue";
import zhCN from "ant-design-vue/lib/locale/zh_CN";
// import axios from "axios";
import { IMessage } from "../../types/runtime/IMessage";
import { SearchBar, Common, FormData, FormItemData, Pagination, OperationBar, OperationCol, Appearance } from "./IQTablely"
import dyncForm from "./dyncForm.vue"
import { enumFilter } from "../../util/dict";
import { onSendMessage } from "../../util/utils";


// type APIParams = {
//   current: number;
//   pageSize: number;
//   [key: string]: any;
// };
type Key = string | number;

// const queryData = (type: string, params: APIParams) => {
//   const queryLogic = {
//     Add: (params: APIParams) => axios.post("https://randomuser.me/api?add", { params }),
//     Edit: (params: APIParams) => axios.post("https://randomuser.me/api?edit", { params }),
//     Info: (params: APIParams) => axios.get("https://randomuser.me/api?info", { params }),
//     List: (params: APIParams) => axios.get("https://randomuser.me/api?list", { params }),
//     Del: (params: APIParams) => axios.post("https://randomuser.me/api?del", { params })
//   }
//   return queryLogic[type](params)
// };

export const createVueComponent = (root: any, insideChange: { value: boolean }) => {
  //   <template #headerCell="{ column, text }">
  //   <template v-if="column.key === 'action'">
  //       <span>
  //       {{text}}
  //       </span>
  //   </template>
  //   <template v-else>
  //       {{ Number(text) === NaN ? text : Number(text) }}
  //   </template>
  // </template>
  // console.log('tabledata:', root)
  const component = defineComponent({
    template: `
      <a-config-provider :locale="zhCN">
        <div class="q-tablely-wrap" ref="tablelyRef">
          <div style="margin-bottom: 16px" class="q-tablely-headline" v-if="operationbar.visible || searchbar.visible">
            <div class="q-tablely-operationbar" v-if="operationbar.visible">
              <a-button v-for="(btnbar, btnbarIndex) in operationbar.btn" :type="enumFilter('btnType', btnbar.type, 'primary')" :disabled="btnbar.disabled" :loading="btnbar.loading" @click="tableEventBus($event, btnbar)">
                {{btnbar.label}}
              </a-button>
              <span style="margin-left: 8px">
                <template v-if="hasSelected">
                  选中 {{ selectedRowKeys.length }} 项
                </template>
              </span>
            </div>
            <div class="q-tablely-searchbar" v-if="searchbar.visible">
              <a-input-search
                v-model:value="searchbar.value"
                :placeholder="searchbar.placeholder"
                @search="searchHandleFun"
              >
                <template #enterButton>
                  <a-button>{{searchbar.btnTitle}}</a-button>
                </template>
              </a-input-search>
            </div>
          </div>
          <a-table
            class="q-tablely"
            :class="{nobg: !appearance.bg, nosplitline: !appearance.hSplitline.enable}"
            :bordered="appearance.bordered"
            :size="enumFilter('tableSize', appearance.size)"
            :row-key="record => record.key"
            :row-class-name="(_record, index) => ((index % 2 === 1 && appearance.striped.enable) ? 'table-striped' : null)"
            :style="{backgroundColor: appearance.striped.color}"
            :customRow="customRow"
            :customHeaderRow="customHeaderRow"
            :row-selection="rowSelection ? { selectedRowKeys: selectedRowKeys, onChange: onSelectChange } : null"
            :columns="columnsAll" 
            :data-source="tdata" 
            :pagination="paginations"
            :loading="loading"
            @change="handleTableChange">
            <template #bodyCell="{ text, record, index, column }">
              <template v-if="column.type === 'text'">
                  {{ text }}
              </template>
              
              <template v-else-if="column.type === 'number'">
                  {{ (text === "" || Number(text) === NaN) ? text : Number(text) }}
              </template>
              <template v-else-if="column.type === 'tag'">
                  <span>
                  <a-tag
                      v-for="tag in record.tags"
                      :key="tag"
                      :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
                  >
                      {{ tag.toUpperCase() }}
                  </a-tag>
                  </span>
              </template>
              <template v-else-if="column.key === 'action'">
                <span>
                <a-button  v-for="(btn, btnIndex) in column.btn" :size="btn.size ? btn.size : 'small'" :type="enumFilter('btnType', btn.type, 'link')" @click="tableEventBus($event, btn, index, btnIndex)">{{btn.label}}</a-button>
                </span>
              </template>
            </template>
          </a-table>
        </div>
        <a-modal
          ref="dyncModalRef"
          v-model:visible="common.openAddModal"
          v-if="common.openAddModal"
          :title="formTitle+'信息'"
          :okText="formTitle"
          cancel-text="取消"
          @ok="handleOk"
          @cancel="handleCancel"
        >
          <dync-form :formData="formData" ref="dyncFormRef" />
        </a-modal>
      </a-config-provider>
    `,
    components: { dyncForm },
    
    setup(props: any) {      
      const state = reactive<{
        columns: Array<any>;
        operationcol: OperationCol;
        operationbar: OperationBar;
        selectedRowKeys: Key[];
        loading: boolean;
        rowSelection: boolean;
        searchbar: SearchBar;
        tdata: Array<any>;
        common: Common;
        pagination: Pagination;
        appearance: Appearance;
        mode: string; // add | edit
        curId: string | number
      }>({
        columns: root.columns,
        operationcol: root.operationcol,
        operationbar: root.operationbar,
        selectedRowKeys: root.selectedRowKeys,
        loading: root.loading,
        rowSelection: root.rowSelection,
        searchbar: root.searchbar,
        tdata: root.tdata,
        common: {...root.common, openAddModal: false },
        pagination: root.pagination,
        appearance: root.appearance,
        mode: "Add",
        curId: 0
      });
      // 自动抛出表格数据
      // 发送数据到总线
      // setTimeout(() => {
      //   const ttdmsg: IMessage = {
      //     header: {
      //       src: root.id,
      //       dst: "",
      //       srcType: "ThrowTableData",
      //       dstType: "",
      //     },
      //     body: state.tdata
      //   };
      //   root.componentModel.sendMessage(ttdmsg);
      // }, 1000);

      const tablelyRef = ref(null);
      // const addVisible = ref<boolean>(false);
      const { proxy } = getCurrentInstance() as any;
      // state.columns[state.columns.length] = { key: "action", ...state.operationcol, fixed: state.operationcol.fixed ? "right" : false }
      // const btnLoadArr = new Array(tdata.length).fill(false).map(() => new Array(operationcol.btn.lenght).fill(false));
      // 屏蔽默认请求
      // const result = queryData("List", state.pagination.data)
      // console.log(result)
      // 所有列
      const columnsAll = computed(() => state.operationcol.enable ? 
      [
        ...state.columns, 
        { key: "action", ...state.operationcol, fixed: state.operationcol.fixed ? "right" : false }
      ].map((v: any) => {
        v.customCell = customCell; 
        v.customHeaderCell = customHeaderCell;
        if (v?.width) v.width = v.width.indexOf('%') !== -1 ? v.width : (parseInt(v.width)+'px');
        return v;
      }) : state.columns.map((v: any) => {
        v.customCell = customCell; 
        v.customHeaderCell = customHeaderCell; 
        if (v?.width) v.width = v.width.indexOf('%') !== -1 ? v.width : (parseInt(v.width)+'px');
        return v;
      }))
      // 分页
      const paginations = computed(() => {
        return state.pagination.visible ? {
          current: state.pagination.data.current,
          pageSize: state.pagination.data.pageSize,
          showQuickJumper: state.pagination.data.showQuickJumper,
          showSizeChanger: state.pagination.data.showSizeChanger,
          ...state.pagination
        } : state.pagination.visible
        
      });
      // 表单标题
      const formTitle = computed(() => state.mode === "Add" ? "添加" : "修改")
      // 监听数据并初始化数据
      const formData = computed(() => {
        const formDataResult: FormData = {
          config: {
            size: "mini",
            layout: "horizontal",
            labelCol: 4,
            wrapperCol: 14
          },
          data: {},
          list: []
        }
        if (state.columns.length) state.columns.map((v:any) => {
          formDataResult.data[v.key] = v.type === "tag" ? [] : ""
          const formItemData:FormItemData = {
            name: v.title,
            prop: v.key,
            type: v.type === "number" ? "number" : v.type === "tag" ? "select":"input",
            required: !!v.required,
            message: v.message ? v.message : "不能为空"
          }
          if (v.placeholder) { formItemData.placeholder = v.placeholder } else formItemData.placeholder = `请输入${v.title}`
          if (v.mode) { formItemData.mode = v.mode }     
          if (v.options) { formItemData.options = v.options }

          formDataResult.list.push(formItemData)
        })
        return formDataResult
      })
      // 表格数据变更
      const handleTableChange: TableProps["onChange"] = (
        filters: any,
        sorter: any,
      ) => {
        // debugger
        // 屏蔽分页请求
        //  const res = queryData("List", {
        //   current: state.pagination.data.current,
        //   pageSize: state.pagination.data.pageSize,
        //   sortField: sorter.field,
        //   sortOrder: sorter.order,
        //   ...filters,
        // });
        
        // console.log(res)
        // state.tdata = res.body
        const msg: IMessage = {
          header: {
            src: root.id,
            dst: "",
            srcType: "PageChange",
            dstType: "",
          },
          body: state.tdata
        };
        root.componentModel.sendMessage(msg);
        state.pagination.data.current = filters.current
        state.pagination.data.pageSize = filters.pageSize
        // state.tdata = state.tdata.slice((filters.current - 1) * filters.pageSize, filters.current * filters.pageSize)
      };

      /**
       * onHandle
       */
      // const onHandle = (btnItem:any, index: number, btnIndex: number): void => {
      //   if (proxy[btnItem.func]) proxy[btnItem.func](btnItem, index, btnIndex)
      //   else customHandleFun(btnItem)
      // }

      /**
       * onHandleFunList
       */
      //  const customHandleFun = (btnItem:any) => {
      //   try {
      //     eval(eval("(" + btnItem.func + ")")())
      //   } catch (error: any) {
      //     message.warning(`执行函数有误，请检查：${error.message}`);
      //   }
      //  }
      //  收敛表格按钮内置事件
      // 事件处理
      const tableEventBus = (e: Event, btnItem:any, index: number) => {
        console.log(e, btnItem, index)
        // const DOM = e.target as HTMLElement
        // switch (DOM.textContent) {
        switch (btnItem.func) {
          case "新增":
            addHandleFun(btnItem)
            break;
          case "刷新":
            refreshHandleFun(btnItem)
            break;
          case "修改":
            editHandleFun(e, btnItem, index)
            break;
          case "删除":
            delHandleFun(e, btnItem, index)
            break;
          default:
            tableCustomEvent(e, btnItem, index)
            break;
        }
      }
      // 表格自定义事件
      const tableCustomEvent = (e: Event, btnItem:any, index: number) => {
        // 发送数据到总线
        const msg: IMessage = {
          header: {
            src: root.id,
            dst: "",
            srcType: "CustomEvents",
            dstType: "",
          },
          body: { e, btnItem, index, data: state.tdata }
        };
        root.componentModel.sendMessage(msg);
      }
      // 添加事件
      const addHandleFun = (btnItem:any) => {
        console.log(columnsAll)
        state.mode = "Add"
        state.common.openAddModal = true;
      }
      // 编辑事件
      const editHandleFun = (e: Event, btnItem:any, index: number) => {
        state.mode = "Edit"
        state.curId = index
        formData.value.data = cloneDeep(state.tdata[index])
        state.common.openAddModal = true;
        // 发送数据到总线
        const msg: IMessage = {
          header: {
            src: root.id,
            dst: "",
            srcType: "EditTableData",
            dstType: "",
          },
          body: { e, btnItem, index, data: state.tdata }
        };
        root.componentModel.sendMessage(msg);
      }
      // 删除事件
      const delHandleFun = (e: Event, btnItem:any, index: number) => {
      // 处理删除逻辑
      // queryData("Del", formData.value.data).then()
      // 成功 则刷新表格数据
      // 发送数据到总线
      const msg: IMessage = {
        header: {
          src: root.id,
          dst: "",
          srcType: "DeleteTableData",
          dstType: "",
        },
        body: { e, btnItem, index, data: state.tdata }
      };
      root.componentModel.sendMessage(msg);
      state.tdata.splice(index, 1)
      message.success("删除成功");
      }

      /**
       * 选中操作
       */
      const hasSelected = computed(() => state.selectedRowKeys.length > 0);
      // 刷新事件
      const refreshHandleFun = (btnItem:any) => {
        state.loading = true;
        setTimeout(() => {
          state.loading = false;
          state.selectedRowKeys = [];
        }, 1000);
      };
      // 搜索事件
      const searchHandleFun = (searchValue: string) => {
        console.log("use value", searchValue);
        console.log("use this.value", state.searchbar.value)
        const msg: IMessage = {
          header: {
            src: root.id,
            dst: "",
            srcType: "SearchTableData",
            dstType: "",
          },
          body: { searchValue, data: state.tdata }
        };
        root.componentModel.sendMessage(msg);
        // 屏蔽分页搜索请求
        // const res = queryData("List", {
        //   current: state.pagination.data.current,
        //   pageSize: state.pagination.data.pageSize,
        //   keywords: searchbar.value
        // });
        // console.log(res)
        // 模拟分页
        if (!state.searchbar.value) state.tdata = root.tdata
        else state.tdata = root.tdata.filter((x:any) => {
          return state.columns.some((y: any) => { 
            return String(x[y.key]).indexOf(state.searchbar.value) !== -1 
          });
        })
        // state.tdata = res.body
        
      }
      // 选择变更事件
      const onSelectChange = (selectedRowKeys: Key[]) => {
        console.log("selectedRowKeys changed: ", selectedRowKeys);
        state.selectedRowKeys = selectedRowKeys;
      };
      /**
       * 提交表单
       * @param e 
       */
      const handleOk = (e: MouseEvent) => {
        proxy.$refs["dyncFormRef"].$refs["formRef"].validate().then(() => {
          // proxy.$refs["dyncModalRef"].formRef
          if(state.mode === "Add") {
            console.log(formData.value);
            // 处理添加逻辑
            // queryData("Add", formData.value.data).then()
            // 成功 则刷新表格数据
            state.tdata.push(cloneDeep(formData.value.data))
          } else {
            state.tdata.splice(Number(state.curId), 1, cloneDeep(formData.value.data))
          }
          root.componentModel.model.tdata = state.tdata
          
          // 发送数据到总线
          const msg: IMessage = {
            header: {
              src: root.id,
              dst: "",
              srcType: `${state.mode}edTableData`,
              dstType: "",
            },
            body: formData.value.data,
          };
          root.componentModel.sendMessage(msg);
          message.success(`${formTitle.value}成功`);
          state.common.openAddModal=false
        })
        .catch((error: any) => {
          console.log('error', error);
        });
      };
      // 取消
      const handleCancel = () => {
        state.common.openAddModal=false
        // proxy.$refs["dyncModalRef"].destroy()
      }
      // 自定义行
      const customRow = (record:any, index: number) => {
        return {
          onClick: (event: Event) => {
            onSendMessage(root, { record, index }, { srcType: "ClickRow" })
          },
          onDblclick: (event: Event) => {
            onSendMessage(root, { record, index }, { srcType: "DblclickRow" })
          },
          onContextmenu: (event: Event) => {
            onSendMessage(root, { record, index }, { srcType: "ContextmenuRow" })
          },
          onMouseenter: (event: Event) => {
            onSendMessage(root, { record, index }, { srcType: "MouseenterRow" })
          },
          onMouseleave: (event: Event) => {
            onSendMessage(root, { record, index }, { srcType: "MouseleaveRow" })
          }
        }
      }
      // 自定义头部
      const customHeaderRow = (columns:any, index: number) => {
        return {
          onClick: (event: Event) => {
            onSendMessage(root, { columns, index }, { srcType: "ClickHeaderRow" })
          },
          onDblclick: (event: Event) => {
            onSendMessage(root, { columns, index }, { srcType: "DblclickHeaderRow" })
          },
          onContextmenu: (event: Event) => {
            onSendMessage(root, { columns, index }, { srcType: "ContextmenuHeaderRow" })
          },
          onMouseenter: (event: Event) => {
            onSendMessage(root, { columns, index }, { srcType: "MouseenterHeaderRow" })
          },
          onMouseleave: (event: Event) => {
            onSendMessage(root, { columns, index }, { srcType: "MouseleaveHeaderRow" })
          }
        }
      }
      // 自定义列
      const customCell = (record:any, rowIndex:number, column:any) => {
        return {
          style: {
            color: state.appearance.text.bodycolor,
            "background-color": state.appearance.text.bodybgcolor,
            "border-bottom-color": state.appearance.hSplitline.color,
            "border-right-color": state.appearance.vSplitline.color
          },
          onClick: (event: Event) => {
            onSendMessage(root, { record, rowIndex, column }, { srcType: "ClickCell" })
          },
          onDblclick: (event: Event) => {
            onSendMessage(root, { record, rowIndex, column }, { srcType: "DblclickCell" })
          },
          onContextmenu: (event: Event) => {
            onSendMessage(root, { record, rowIndex, column }, { srcType: "ContextmenuCell" })
          },
          onMouseenter: (event: Event) => {
            onSendMessage(root, { record, rowIndex, column }, { srcType: "MouseenterCell" })
          },
          onMouseleave: (event: Event) => {
            onSendMessage(root, { record, rowIndex, column }, { srcType: "MouseleaveCell" })
          }
        }
      }
      // 自定义头部列
      const customHeaderCell = (column:any) => {
        return {
          style: {
            color: state.appearance.text.headcolor,
            "background-color": state.appearance.text.headbgcolor,
            "border-bottom-color": state.appearance.hSplitline.color,
            "border-right-color": state.appearance.vSplitline.color
          },
          onClick: (event: Event) => {
            onSendMessage(root, { column }, { srcType: "ClickHeaderCell" })
          },
          onDblclick: (event: Event) => {
            onSendMessage(root, { column }, { srcType: "DblclickHeaderCell" })
          },
          onContextmenu: (event: Event) => {
            onSendMessage(root, { column }, { srcType: "ContextmenuHeaderCell" })
          },
          onMouseenter: (event: Event) => {
            onSendMessage(root, { column }, { srcType: "MouseenterHeaderCell" })
          },
          onMouseleave: (event: Event) => {
            onSendMessage(root, { column }, { srcType: "MouseleaveHeaderCell" })
          }
        }
      }
      // console.log("tabledata:", state.columns, state.tdata)
      onMounted(() => {
        if (tablelyRef.value) {
          const tablelyDom = tablelyRef.value as Element
          const tableDom = tablelyDom.querySelector('table')
          const tableTbodyDom = tablelyDom.querySelector('.ant-table-tbody')
          if (tableDom) {
            tableDom.style.borderTop = `1px ${state.appearance.hSplitline.color} solid`
            tableDom.style.borderLeft = `1px ${state.appearance.vSplitline.color} solid`
          }
          if (tableTbodyDom) tableTbodyDom.setAttribute("style", `color: ${state.appearance.text.bodycolor};background-color: ${state.appearance.text.bodybgcolor}`)
        }
      });

      // watch(comData, (newVal: any) => {
      //   console.log(newVal)
      // }, {deep:true})
      return {
        columnsAll,
        // columns,
        paginations,
        // operationbar,
        // btnLoadArr,
        formTitle,
        formData,
        zhCN,
        hasSelected,
        tablelyRef,
        ...toRefs(state),
        // func
        refreshHandleFun,
        onSelectChange,
        handleTableChange,
        // onHandle,
        // customHandleFun,
        tableEventBus,
        // tableCustomEvent,
        addHandleFun,
        // editHandleFun,
        // delHandleFun,
        handleOk,
        handleCancel,
        searchHandleFun,
        enumFilter,
        customRow,
        customHeaderRow,
        customCell,
        customHeaderCell
      };
    },
  });

  root.componentInstance = createApp(component);
  root.componentInstance.use(ConfigProvider);
  root.componentInstance.use(Form);
  root.componentInstance.use(FormItem);
  root.componentInstance.use(Input);
  root.componentInstance.use(InputNumber);
  root.componentInstance.use(Select);
  root.componentInstance.use(Radio);
  root.componentInstance.use(RadioGroup);
  root.componentInstance.use(Checkbox);
  root.componentInstance.use(CheckboxGroup);
  root.componentInstance.use(TimePicker);
  root.componentInstance.use(DatePicker);
  root.componentInstance.use(Button);
  root.componentInstance.use(Tooltip);
  root.componentInstance.use(Switch);
  root.componentInstance.use(Textarea);
  root.componentInstance.use(Slider);
  root.componentInstance.use(Rate);
  root.componentInstance.use(Tag);
  root.componentInstance.use(Divider);
  root.componentInstance.use(Cascader);
  root.componentInstance.use(Dropdown);
  root.componentInstance.use(Typography);
  root.componentInstance.use(Popconfirm);
  root.componentInstance.use(Menu);
  root.componentInstance.use(Modal);
  root.componentInstance.use(Drawer);
  root.componentInstance.use(Spin);
  root.componentInstance.use(Table);
  root.componentInstance.use(message);
  root.componentInstance.component("DownOutlined", DownOutlined);
  root.componentInstance.component("SmileOutlined", SmileOutlined);
  root.componentInstance.mount(root.container);
};
