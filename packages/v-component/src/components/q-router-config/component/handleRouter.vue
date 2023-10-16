<template>
  <a-drawer
    v-model:visible="modalVisible"
    placement="right"
    :title="modalTitle"
    :mask="false"
    :width="645"
    :z-index="1000"
  >
    <template #extra>
      <div style="display: flex; align-items: center">
        <a-popover placement="leftTop" trigger="click">
          <template #content>
            <pre
              style="
                max-width: 600px;
                max-height: 600px;
                margin: 0;
                padding: 15px;
                font-size: 16px;
                font-family: Arial, Helvetica, sans-serif;
                color: #409eff;
                background-color: #f5f5f5;
                box-sizing: content-box;
                overflow: auto;
              "
            ><code>{{ JSON.stringify(tempDataInfo, null, 2) }}</code></pre>
          </template>
          <template #title>
            <span>路由配置项Schema</span>
          </template>
          <div title="查看路由配置数据">
            <svg style="width: 20px; height: 20px; margin-right: 20px; cursor: pointer" viewBox="0 0 1024 1024">
              <path
                fill="#409EFF"
                d="M742.4 755.456H564.770133c-14.4384 0-26.112 12.475733-26.112 27.869867v168.618666h28.433067L742.4 760.439467v-4.983467zM742.4 699.733333v-88.183466c0-15.189333 11.4688-27.477333 25.6-27.477334s25.6 12.288 25.6 27.477334v160.136533c0 7.2192-2.645333 14.1312-7.338667 19.285333L596.087467 998.7072a24.746667 24.746667 0 0 1-18.261334 8.226133H194.56C129.536 1006.933333 76.8 950.306133 76.8 880.452267V143.530667C76.8 73.693867 129.536 17.066667 194.56 17.066667h481.28C740.864 17.066667 793.6 73.693867 793.6 143.547733v48.930134c0 15.189333-11.4688 27.477333-25.6 27.477333s-25.6-12.288-25.6-27.477333V143.530667c0-39.4752-29.7984-71.492267-66.56-71.492267H194.56c-36.7616 0-66.56 32.017067-66.56 71.509333v736.887467c0 39.4752 29.7984 71.492267 66.56 71.492267H486.4v-168.618667C486.4 737.160533 521.489067 699.733333 564.770133 699.733333H742.4zM289.058133 294.570667h33.3824l-15.581866 153.275733c-2.645333 26.026667-9.437867 45.056-20.4288 57.7536-12.1856 13.329067-29.986133 20.002133-53.674667 20.002133-20.548267 0-35.601067-6.3488-44.868267-19.0464-9.557333-12.6976-13.192533-30.139733-10.939733-52.360533l0.733867-7.304533h33.399466l-0.7168 6.997333c-2.645333 26.0096 6.024533 39.0144 26.282667 39.0144 11.127467 0 19.797333-3.805867 25.668267-11.093333 5.888-7.304533 9.642667-19.0464 11.281066-35.2256l15.4624-152.0128z m144.128-4.437334c23.978667 0 42.257067 5.393067 54.545067 16.503467 13.073067 11.741867 19.473067 30.139733 18.944 54.903467H473.6c-1.4336-13.9776-5.819733-24.132267-12.629333-30.1568-6.775467-6.3488-17.902933-9.198933-32.733867-9.198934-12.8512 0-22.7328 1.911467-30.0032 6.024534-9.045333 4.778667-13.858133 12.6976-14.9504 23.483733-0.9728 9.5232 2.798933 17.4592 11.912533 23.176533 4.027733 2.525867 15.240533 7.287467 33.399467 13.960534 26.709333 9.506133 43.6224 17.134933 51.0976 22.203733 16.503467 11.741867 23.7056 27.938133 21.572267 48.878933-2.048 20.309333-10.837333 36.488533-26.299734 48.2304-15.428267 11.434667-36.3008 17.4592-62.276266 17.4592-25.105067 0-44.253867-5.393067-57.1392-16.196266-15.7696-13.312-23.04-34.269867-21.538134-63.146667h33.109334c0.512 17.134933 4.693333 29.525333 12.8 36.8128 7.338667 6.3488 19.2512 9.8304 36.096 9.8304 14.848 0 27.101867-2.850133 36.215466-8.2432 9.147733-5.717333 14.455467-13.0048 15.428267-22.528 1.211733-12.066133-4.369067-21.589333-16.213333-28.5696-3.771733-2.218667-16.384-7.287467-38.161067-14.916267-24.200533-8.874667-39.253333-15.223467-44.868267-19.029333-14.626133-10.478933-20.7872-25.7024-18.7392-45.704533 2.030933-19.985067 11.0592-35.84 27.630934-47.274667 15.394133-11.093333 33.928533-16.503467 55.893333-16.503467z m207.223467 0c31.112533 0 54.528 11.093333 70.212267 33.621334 14.9504 21.282133 20.650667 49.527467 17.1008 84.4288-3.549867 34.901333-14.9504 62.8224-34.235734 84.087466-20.241067 22.2208-45.909333 33.3312-77.0048 33.3312-31.402667 0-54.784-11.434667-70.212266-33.6384-14.933333-21.589333-20.360533-49.5104-16.878934-83.797333 3.515733-34.577067 14.626133-62.498133 33.962667-84.0704C583.338667 301.226667 609.006933 290.133333 640.392533 290.133333z m-3.242667 32.682667c-21.128533 0-38.1952 7.936-51.5072 23.808-12.680533 15.223467-20.1728 35.5328-22.818133 61.559467-2.6112 25.7024 0.750933 46.011733 10.325333 61.252266 9.847467 15.530667 25.582933 23.466667 46.6944 23.466667 21.128533 0 38.161067-7.611733 51.0976-22.528 12.629333-14.916267 20.445867-35.5328 23.159467-62.190933 2.7136-26.658133-0.8704-47.616-10.4448-62.839467-9.864533-15.223467-25.3952-22.528-46.506667-22.528z m131.84-28.245333h33.3824l84.1216 163.4304h1.143467l16.605867-163.4304h33.672533l-23.04 226.577066h-32.529067L797.354667 355.498667h-1.143467l-16.8448 165.649066H745.984l23.04-226.577066z"
              />
            </svg>
          </div>
        </a-popover>
        <SyncOutlined
          v-if="modalType !== ModalTypeInfo.SEE"
          title="刷新"
          :style="{
            fontSize: '20px',
            cursor: refreshDisabled ? 'wait' : 'pointer',
            marginRight: '20px',
            color: refreshDisabled ? '#e6e6e6' : '#409EFF',
          }"
          @click="handleRefresh"
        ></SyncOutlined>
        <a-button @click="routerMessageTest(root, tempDataInfo)" style="margin-right: 15px">测试</a-button>
        <a-button v-if="modalType !== ModalTypeInfo.SEE" type="primary" @click="handleDataInfo">确定</a-button>
      </div>
    </template>
    <a-spin :spinning="loading">
      <div
        ref="selectContainer"
        :style="{
          overflow: 'auto',
          background: 'white',
          outline: tempDataInfo._srcState === RouterState.ERROR ? '2px solid red' : '1px solid rgb(225, 228, 232)',
          position: 'relative',
        }"
      >
        <div style="display: flex; align-items: center; padding: 10px 0">
          <div style="width: 90px; text-align: right">
            <span style="color: red">*</span>
            配置项名称:
          </div>
          <div style="width: 455px; margin-left: 10px">
            <a-input
              v-model:value="tempDataInfo.title"
              :disabled="modalType === ModalTypeInfo.SEE"
              :maxlength="30"
              showCount
              placeholder="请输入名称"
            />
          </div>
        </div>
        <div style="display: flex; align-items: center; padding: 10px 0">
          <div style="width: 90px; text-align: right">
            <span style="color: red">*</span>
            配置项类型:
          </div>
          <div style="width: 455px; margin-left: 10px">
            <a-select
              v-if="typeSelect === 'choose'"
              v-model:value="tempDataInfo.type"
              :disabled="modalType === ModalTypeInfo.SEE"
              placeholder="请选择路由分类"
              style="width: 320px"
            >
              <a-select-option v-for="(routerType, index) in routerTypeArr" :value="routerType" :key="index">
                {{ routerType }}
              </a-select-option>
            </a-select>
            <a-input
              v-else
              v-model:value="tempDataInfo.type"
              :disabled="modalType === ModalTypeInfo.SEE"
              :maxLength="15"
              placeholder="请输入路由分类"
              style="width: 320px"
            />
            <a-divider type="vertical" style="margin: 0 6px; height: 32px; top: 0" />
            <a-radio-group v-model:value="typeSelect" :disabled="modalType === ModalTypeInfo.SEE">
              <a-radio-button value="choose">选择</a-radio-button>
              <a-radio-button value="add">新增</a-radio-button>
            </a-radio-group>
          </div>
        </div>
        <div
          :style="{
            backgroundColor: currentTarget.type === CurrentTypeInfo.SRC ? '#91d5ff' : '',
            display: 'flex',
            alignItems: 'center',
            padding: '10px 0',
            cursor: 'pointer',
          }"
          @click="selectCurrent(CurrentTypeInfo.SRC, null, null)"
        >
          <div style="width: 90px; text-align: right">
            <span style="color: red">*</span>
            发起源:
          </div>
          <div ref="srcInputRef" style="width: 455px; margin-left: 10px">
            <a-select
              v-model:value="tempDataInfo.src"
              :disabled="modalType === ModalTypeInfo.SEE"
              show-search
              :filter-option="filterComponent"
              placeholder="请选择发起源"
              style="width: 100%"
              @change="
                (value: string, option: any) => {
                  elementChange(value, option, CurrentTypeInfo.SRC, -1, -1);
                }
              "
            >
              <a-select-opt-group
                v-for="(components, componentsKey) in componentsArr.value"
                :key="componentsKey"
                :label="componentsKey"
              >
                <a-select-option
                  v-for="component in components"
                  :key="component.id"
                  :value="String(component.id)"
                  :text="component.text"
                  :componentAliasName="component.componentAliasName"
                  @mouseenter="focusSelectCom(component.id)"
                  @mouseleave="blurSelectCom"
                >
                  {{ component.componentAliasName || component.text || "未命名元件" }}
                  <br />
                  <span style="font-size: 12px">ID: {{ component.id }}</span>
                </a-select-option>
              </a-select-opt-group>
            </a-select>
          </div>
          <bulb-outlined
            v-if="modalType !== ModalTypeInfo.SEE"
            :style="{ fontSize: '18px', color: '#91d5ff', marginLeft: '8px' }"
            title="选中该发起源后, 再选中画布元件可快速设置该发起源"
          />
        </div>
        <div style="display: flex; align-items: flex-start; padding: 10px 0">
          <div style="width: 90px; text-align: right; margin-top: 4px">发起方式:</div>
          <div style="margin-left: 10px">
            <div
              v-for="triggerIndex in Object.keys(tempDataInfo.trigger)"
              style="display: flex; align-items: center; margin-bottom: 10px"
            >
              <a-select
                v-model:value="tempDataInfo.trigger[triggerIndex]"
                :options="triggerArr.value"
                :disabled="modalType === ModalTypeInfo.SEE"
                placeholder="请选择发起方式"
                style="width: 432px"
              ></a-select>
              <a-popover placement="leftTop" trigger="click">
                <template #content>
                  <pre
                    v-if="getMessageDemo(Number(triggerIndex))"
                    style="
                      max-width: 600px;
                      max-height: 600px;
                      margin: 0;
                      padding: 15px;
                      font-size: 16px;
                      font-family: Arial, Helvetica, sans-serif;
                      color: #409eff;
                      background-color: #f5f5f5;
                      box-sizing: content-box;
                      overflow: auto;
                    "
                  ><code>{{ JSON.stringify(getMessageDemo(Number(triggerIndex)), null, 2) }}</code></pre>
                  <a-empty v-else description="暂无路由测试数据" />
                </template>
                <template #title>
                  <span>消息测试数据MessageDemo</span>
                </template>
                <div title="查看消息测试数据">
                  <svg style="width: 16px; height: 16px; margin-left: 8px; cursor: pointer" viewBox="0 0 1024 1024">
                    <path
                      fill="#8F9BB3"
                      d="M742.4 755.456H564.770133c-14.4384 0-26.112 12.475733-26.112 27.869867v168.618666h28.433067L742.4 760.439467v-4.983467zM742.4 699.733333v-88.183466c0-15.189333 11.4688-27.477333 25.6-27.477334s25.6 12.288 25.6 27.477334v160.136533c0 7.2192-2.645333 14.1312-7.338667 19.285333L596.087467 998.7072a24.746667 24.746667 0 0 1-18.261334 8.226133H194.56C129.536 1006.933333 76.8 950.306133 76.8 880.452267V143.530667C76.8 73.693867 129.536 17.066667 194.56 17.066667h481.28C740.864 17.066667 793.6 73.693867 793.6 143.547733v48.930134c0 15.189333-11.4688 27.477333-25.6 27.477333s-25.6-12.288-25.6-27.477333V143.530667c0-39.4752-29.7984-71.492267-66.56-71.492267H194.56c-36.7616 0-66.56 32.017067-66.56 71.509333v736.887467c0 39.4752 29.7984 71.492267 66.56 71.492267H486.4v-168.618667C486.4 737.160533 521.489067 699.733333 564.770133 699.733333H742.4zM289.058133 294.570667h33.3824l-15.581866 153.275733c-2.645333 26.026667-9.437867 45.056-20.4288 57.7536-12.1856 13.329067-29.986133 20.002133-53.674667 20.002133-20.548267 0-35.601067-6.3488-44.868267-19.0464-9.557333-12.6976-13.192533-30.139733-10.939733-52.360533l0.733867-7.304533h33.399466l-0.7168 6.997333c-2.645333 26.0096 6.024533 39.0144 26.282667 39.0144 11.127467 0 19.797333-3.805867 25.668267-11.093333 5.888-7.304533 9.642667-19.0464 11.281066-35.2256l15.4624-152.0128z m144.128-4.437334c23.978667 0 42.257067 5.393067 54.545067 16.503467 13.073067 11.741867 19.473067 30.139733 18.944 54.903467H473.6c-1.4336-13.9776-5.819733-24.132267-12.629333-30.1568-6.775467-6.3488-17.902933-9.198933-32.733867-9.198934-12.8512 0-22.7328 1.911467-30.0032 6.024534-9.045333 4.778667-13.858133 12.6976-14.9504 23.483733-0.9728 9.5232 2.798933 17.4592 11.912533 23.176533 4.027733 2.525867 15.240533 7.287467 33.399467 13.960534 26.709333 9.506133 43.6224 17.134933 51.0976 22.203733 16.503467 11.741867 23.7056 27.938133 21.572267 48.878933-2.048 20.309333-10.837333 36.488533-26.299734 48.2304-15.428267 11.434667-36.3008 17.4592-62.276266 17.4592-25.105067 0-44.253867-5.393067-57.1392-16.196266-15.7696-13.312-23.04-34.269867-21.538134-63.146667h33.109334c0.512 17.134933 4.693333 29.525333 12.8 36.8128 7.338667 6.3488 19.2512 9.8304 36.096 9.8304 14.848 0 27.101867-2.850133 36.215466-8.2432 9.147733-5.717333 14.455467-13.0048 15.428267-22.528 1.211733-12.066133-4.369067-21.589333-16.213333-28.5696-3.771733-2.218667-16.384-7.287467-38.161067-14.916267-24.200533-8.874667-39.253333-15.223467-44.868267-19.029333-14.626133-10.478933-20.7872-25.7024-18.7392-45.704533 2.030933-19.985067 11.0592-35.84 27.630934-47.274667 15.394133-11.093333 33.928533-16.503467 55.893333-16.503467z m207.223467 0c31.112533 0 54.528 11.093333 70.212267 33.621334 14.9504 21.282133 20.650667 49.527467 17.1008 84.4288-3.549867 34.901333-14.9504 62.8224-34.235734 84.087466-20.241067 22.2208-45.909333 33.3312-77.0048 33.3312-31.402667 0-54.784-11.434667-70.212266-33.6384-14.933333-21.589333-20.360533-49.5104-16.878934-83.797333 3.515733-34.577067 14.626133-62.498133 33.962667-84.0704C583.338667 301.226667 609.006933 290.133333 640.392533 290.133333z m-3.242667 32.682667c-21.128533 0-38.1952 7.936-51.5072 23.808-12.680533 15.223467-20.1728 35.5328-22.818133 61.559467-2.6112 25.7024 0.750933 46.011733 10.325333 61.252266 9.847467 15.530667 25.582933 23.466667 46.6944 23.466667 21.128533 0 38.161067-7.611733 51.0976-22.528 12.629333-14.916267 20.445867-35.5328 23.159467-62.190933 2.7136-26.658133-0.8704-47.616-10.4448-62.839467-9.864533-15.223467-25.3952-22.528-46.506667-22.528z m131.84-28.245333h33.3824l84.1216 163.4304h1.143467l16.605867-163.4304h33.672533l-23.04 226.577066h-32.529067L797.354667 355.498667h-1.143467l-16.8448 165.649066H745.984l23.04-226.577066z"
                    />
                  </svg>
                </div>
              </a-popover>
              <delete-outlined
                v-if="modalType !== ModalTypeInfo.SEE"
                :style="{ fontSize: '16px', color: '#8F9BB3', marginLeft: '8px' }"
                @click="deleteTrigger(Number(triggerIndex))"
              />
            </div>
            <a-button v-if="modalType !== ModalTypeInfo.SEE" @click="addTrigger">
              <template #icon><plus-outlined /></template>
              添加
            </a-button>
          </div>
        </div>
        <div
          v-if="tempDataInfo.trigger.includes(modelChangeType)"
          style="display: flex; align-items: flex-start; padding: 10px 0"
        >
          <div style="width: 90px; text-align: right; margin-top: 4px; display: flex; align-items: center">
            <a-tooltip placement="left">
              <template #title>
                <span>{{ attrTips }}</span>
              </template>
              <question-circle-outlined
                :style="{ fontSize: '16px', color: '#91d5ff', marginRight: '8px', marginLeft: 'auto' }"
              />
            </a-tooltip>
            <a-popover
              v-if="modalType !== ModalTypeInfo.SEE"
              v-model:visible="bindVisible"
              placement="left"
              trigger="click"
              title="选择属性"
              arrow-point-at-center
            >
              <template #content>
                <div v-if="waitBindList.length" style="width: 400px; height: 600px; overflow: auto">
                  <a-input-search
                    v-model:value="bindSearchValue"
                    placeholder="请输入查询内容"
                    style="width: 100%; margin-bottom: 10px"
                  />
                  <a-tree
                    :selected-keys="bindSelectedKey"
                    :tree-data="waitBindList"
                    :load-data="bindLoadData"
                    :check-strictly="true"
                    :show-icon="false"
                    @select="
                        (keys: any, info: any) => {
                          onSelectAttr(keys, info);
                        }
                      "
                  >
                    <template #title="{ title }">
                      <span v-if="title.indexOf(bindSearchValue) > -1" style="white-space: nowrap">
                        {{ title.substr(0, title.indexOf(bindSearchValue)) }}
                        <span style="color: #f50">{{ bindSearchValue }}</span>
                        {{ title.substr(title.indexOf(bindSearchValue) + bindSearchValue.length) }}
                      </span>
                      <span v-else>{{ title }}</span>
                    </template>
                  </a-tree>
                </div>
                <div
                  v-else
                  style="
                    width: 400px;
                    height: 600px;
                    overflow: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <a-empty description="暂无可选属性" />
                </div>
              </template>
              <div></div>
            </a-popover>
            <span>属性:</span>
          </div>
          <div style="margin-left: 10px">
            <div
              v-for="attributeIndex in Object.keys(tempDataInfo.attribute)"
              style="display: flex; align-items: center; margin-bottom: 10px"
            >
              <div style="width: 455px; display: flex; align-items: center">
                <a-input
                  v-model:value="tempDataInfo.attribute[attributeIndex]"
                  :disabled="modalType === ModalTypeInfo.SEE"
                  style="flex: 1"
                ></a-input>
                <a-divider
                  v-if="modalType !== ModalTypeInfo.SEE"
                  type="vertical"
                  style="margin: 0 6px; height: 32px; top: 0"
                />
                <a-button
                  type="primary"
                  :disabled="modalType === ModalTypeInfo.SEE"
                  @mousedown="showAttrPop(Number(attributeIndex))"
                >
                  选择
                </a-button>
              </div>
              <delete-outlined
                v-if="modalType !== ModalTypeInfo.SEE"
                :style="{ fontSize: '16px', color: '#8F9BB3', marginLeft: '8px' }"
                @click="deleteAttribute(Number(attributeIndex))"
              />
            </div>
            <a-button v-if="modalType !== ModalTypeInfo.SEE" @click="addAttribute">
              <template #icon><plus-outlined /></template>
              添加
            </a-button>
          </div>
        </div>
        <div style="display: flex; align-items: flex-start; padding: 10px 0">
          <div style="width: 90px; min-width: 90px; text-align: right; margin-top: 4px">接收源:</div>
          <div style="width: 480px; margin-left: 10px">
            <div v-for="(receive, receiveIndex) in tempDataInfo.receive" style="display: flex; align-items: center">
              <div
                :style="{
                  width: '100%',
                  outline:
                    receive._targetState === RouterState.ERROR ? '2px solid red' : '1px solid rgb(225, 228, 232)',
                  borderRadius: '4px',
                  marginBottom: '10px',
                }"
              >
                <div style="display: flex; align-items: center; padding: 10px 0">
                  <div style="width: 75px; text-align: right">
                    <span style="color: red">*</span>
                    接收页面:
                  </div>
                  <div style="width: 330px; margin-left: 10px">
                    <a-select
                      v-model:value="receive.page"
                      :disabled="modalType === ModalTypeInfo.SEE"
                      show-search
                      :filter-option="filterPage"
                      placeholder="请选择接收页面"
                      style="width: 100%"
                      @change="pageChange($event, receiveIndex)"
                    >
                      <a-select-option
                        v-for="receivePage in pageList"
                        :key="receivePage.id"
                        :value="String(receivePage.id)"
                        :page="receivePage.page_name"
                      >
                        {{ receivePage.page_name }}
                        <br />
                        <span style="font-size: 12px">ID:{{ receivePage.id }}</span>
                      </a-select-option>
                    </a-select>
                  </div>
                </div>
                <div
                  :style="{
                    backgroundColor:
                      currentTarget.type === CurrentTypeInfo.RECEIVE && currentTarget.receiveIndex === receiveIndex
                        ? '#91d5ff'
                        : '',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 0',
                    cursor: 'pointer',
                  }"
                  @click="selectCurrent(CurrentTypeInfo.RECEIVE, receiveIndex, -1)"
                >
                  <div style="width: 75px; text-align: right">
                    <span style="color: red">*</span>
                    接收点:
                  </div>
                  <div style="width: 330px; margin-left: 10px">
                    <a-select
                      v-model:value="receive.target"
                      :disabled="modalType === ModalTypeInfo.SEE"
                      show-search
                      placeholder="请选择接收点"
                      style="width: 100%"
                      @change="
                          (value: string, option: any) => {
                            elementChange(value, option, CurrentTypeInfo.RECEIVE, receiveIndex, -1);
                          }
                        "
                    >
                      <a-select-opt-group
                        v-for="(receiveComponents, receiveComponentsKey) in receiveComponentsArr.value[receiveIndex]"
                        :key="receiveComponentsKey"
                        :label="receiveComponentsKey"
                      >
                        <a-select-option
                          v-for="receiveComponent in receiveComponents"
                          :key="receiveComponent.id"
                          :value="String(receiveComponent.id)"
                          :text="receiveComponent.text"
                          :componentAliasName="receiveComponent.componentAliasName"
                          @mouseenter="focusSelectCom(receiveComponent.id)"
                          @mouseleave="blurSelectCom"
                        >
                          {{ receiveComponent.componentAliasName || receiveComponent.text || "未命名元件" }}
                          <br />
                          <span style="font-size: 12px">ID: {{ receiveComponent.id }}</span>
                        </a-select-option>
                      </a-select-opt-group>
                    </a-select>
                  </div>
                  <bulb-outlined
                    v-if="modalType !== ModalTypeInfo.SEE"
                    :style="{ fontSize: '18px', color: '#91d5ff', marginLeft: '8px' }"
                    title="选中该接收点后, 再选中画布元件可快速设置该接收点"
                  />
                </div>
                <div style="display: flex; align-items: flex-start; padding: 10px 0">
                  <div style="width: 75px; text-align: right; margin-top: 4px">接收方式:</div>
                  <div style="margin-left: 10px">
                    <div
                      v-for="receiveEventIndex in Object.keys(receive.event)"
                      style="display: flex; align-items: center; margin-bottom: 10px"
                    >
                      <a-select
                        v-model:value="receive.event[receiveEventIndex]"
                        :disabled="modalType === ModalTypeInfo.SEE"
                        placeholder="请选择接收方式"
                        style="width: 330px"
                      >
                        <a-select-option
                          v-for="receiveEventInfo in receiveEventArr.value[receiveIndex]"
                          :key="receiveEventInfo.eventType"
                          :value="receiveEventInfo.eventType"
                        >
                          {{ receiveEventInfo.text }}
                        </a-select-option>
                      </a-select>
                      <delete-outlined
                        v-if="modalType !== ModalTypeInfo.SEE"
                        :style="{ fontSize: '16px', color: '#8F9BB3', marginLeft: '8px' }"
                        @click="deleteReceiveEvent(receiveIndex, Number(receiveEventIndex))"
                      />
                    </div>
                    <a-button v-if="modalType !== ModalTypeInfo.SEE" @click="addReceiveEvent(receiveIndex)">
                      <template #icon><plus-outlined /></template>
                      添加
                    </a-button>
                  </div>
                </div>
                <div style="display: flex; align-items: flex-start; padding: 10px 0">
                  <div style="width: 75px; text-align: right; margin-top: 4px">数据处理:</div>
                  <div style="margin-left: 10px; display: flex; align-items: center">
                    <a-textarea
                      v-model:value="receive.script"
                      :disabled="modalType === ModalTypeInfo.SEE"
                      :style="{
                        width: '330px',
                        height: '150px',
                        outline: receive._scriptState === RouterState.ERROR ? '2px solid red' : 'none',
                      }"
                      @change="changeScriptState(CurrentTypeInfo.RECEIVE, receiveIndex)"
                    />
                    <code-outlined
                      v-if="modalType !== ModalTypeInfo.SEE"
                      :style="{ fontSize: '18px', color: '#91d5ff', marginLeft: '8px' }"
                      title="编辑数据处理函数"
                      @click="showCodeEditor(CurrentTypeInfo.RECEIVE, receiveIndex)"
                    />
                  </div>
                </div>
                <div style="display: flex; align-items: flex-start; padding: 10px 0">
                  <div
                    style="
                      width: 75px;
                      min-width: 75px;
                      text-align: right;
                      margin-top: 3px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <a-tooltip placement="left">
                      <template #title>
                        <span>{{ replyTips }}</span>
                      </template>
                      <question-circle-outlined
                        :style="{ fontSize: '16px', color: '#91d5ff', marginRight: '8px', marginLeft: 'auto' }"
                      />
                    </a-tooltip>
                    <span>回流:</span>
                  </div>
                  <div style="width: 330px; margin-left: 10px">
                    <a-switch v-model:checked="receive.reply"></a-switch>
                    <div
                      v-if="receive.reply"
                      style="width: 100%; outline: 1px solid rgb(225, 228, 232); border-radius: 4px; margin: 10px 0"
                    >
                      <div style="display: flex; align-items: flex-start; padding: 10px 0">
                        <div style="width: 75px; text-align: right; margin-top: 4px">回流方式:</div>
                        <div style="margin-left: 10px">
                          <div
                            v-for="replyEventIndex in Object.keys(receive.replyEvents)"
                            style="display: flex; align-items: center; margin-bottom: 10px"
                          >
                            <a-select
                              v-model:value="receive.replyEvents[replyEventIndex]"
                              :options="replyEventArr.value"
                              :disabled="modalType === ModalTypeInfo.SEE"
                              placeholder="请选择回流方式"
                              style="width: 210px"
                            ></a-select>
                            <delete-outlined
                              v-if="modalType !== ModalTypeInfo.SEE"
                              :style="{ fontSize: '16px', color: '#8F9BB3', marginLeft: '8px' }"
                              @click="deleteReplyEvent(receiveIndex, Number(replyEventIndex))"
                            />
                          </div>
                          <a-button v-if="modalType !== ModalTypeInfo.SEE" @click="addReplyEvent(receiveIndex)">
                            <template #icon><plus-outlined /></template>
                            添加
                          </a-button>
                        </div>
                      </div>
                      <div style="display: flex; align-items: flex-start; padding: 10px 0">
                        <div style="width: 75px; text-align: right; margin-top: 4px">数据处理:</div>
                        <div style="margin-left: 10px; display: flex; align-items: center">
                          <a-textarea
                            v-model:value="receive.replyScript"
                            :disabled="modalType === ModalTypeInfo.SEE"
                            :style="{
                              width: '210px',
                              height: '150px',
                              outline: receive._replyScriptState === RouterState.ERROR ? '2px solid red' : 'none',
                            }"
                            @change="changeScriptState(CurrentTypeInfo.REPLY, receiveIndex)"
                          />
                          <code-outlined
                            v-if="modalType !== ModalTypeInfo.SEE"
                            :style="{ fontSize: '18px', color: '#91d5ff', marginLeft: '8px' }"
                            title="编辑数据处理函数"
                            @click="showCodeEditor(CurrentTypeInfo.REPLY, receiveIndex)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <close-circle-outlined
                v-if="modalType !== ModalTypeInfo.SEE"
                :style="{ fontSize: '16px', marginLeft: '10px', cursor: 'pointer' }"
                @click="deleteReceive(receiveIndex)"
              />
            </div>
            <a-button v-if="modalType !== ModalTypeInfo.SEE" @click="addReceive">
              <template #icon><plus-outlined /></template>
              添加
            </a-button>
          </div>
        </div>
      </div>
    </a-spin>
  </a-drawer>
  <a-modal
    v-model:visible="codeModal"
    v-if="codeModal"
    title="代码编辑"
    :maskClosable="false"
    width="80%"
    @ok="codeChange"
  >
    <q-code-editor
      ref="codeEditor"
      :value="codeStr"
      language="javascript"
      style="width: 100%; height: 600px; display: block"
    ></q-code-editor>
  </a-modal>
</template>
<script lang="ts" setup>
import { IEventSpecificationEvent, IReceive, IRouterConfig, IRouterInfo, ISchema } from "@zzjz/v-uibuilder-types";
import { cloneDeep, isArray, isNumber, isObject, throttle } from "lodash-es";
import { reactive, ref, watch } from "vue";
import { EventDataNode } from "ant-design-vue/es/tree";
import { modelChangeType } from "../../../util/utils";
import { JSONPath } from "jsonpath-plus";
import { ModalTypeInfo, routerMessageTest } from "../utils/utils";
import { message, Modal, TreeProps } from "ant-design-vue";
import { getCurrentPageComponents, transformGroup } from "../utils/composition";
import { filterComponent, filterPage } from "../utils/composition";
import { createHashId, focusSelectCom, blurSelectCom } from "../../../util/utils";
import JSONfn from "json-fn";

const props = defineProps<{
  root: any;
  data: IRouterConfig;
  routerTypeArr: string[];
  loading: Boolean;
  pageId: any;
  pageList: any[];
  defaultType: string;
  isStoryLine?: Boolean;
  getRouterType: Function;
  closeStoryLineModal?: Function;
  changeElementData: Function;
  changeTypeList: Function;
  onSearch: Function;
  getProjectData: Function;
  refreshStoryLine?: Function;
}>();

enum RouterState {
  OK = "ok",
  ERROR = "error",
}
const defaultInfo: IRouterInfo = {
  id: "",
  title: "",
  type: "",
  src: "",
  trigger: <string[]>[],
  attribute: <string[]>[],
  receive: <IReceive[]>[],
  _state: RouterState.OK,
  _srcState: RouterState.OK,
};
const defaultReceive: IReceive = {
  id: "",
  page: "",
  target: "",
  event: <string[]>[],
  script: "function(data) { return data; }",
  reply: false,
  replyEvents: <string[]>[],
  replyScript: "function(data) { return data; }",
  _targetState: RouterState.OK,
  _scriptState: RouterState.OK,
  _replyScriptState: RouterState.OK,
  _current: true,
};
const tempDataInfo = ref(cloneDeep(defaultInfo));
const tempDataIndex = ref(-1);
const selectContainer = ref(null);
const replyTips = ref("回流操作将接收源处理完成的数据自动返回至发起源中");
const attrTips = ref("选择需要响应model变更的属性, 不填写该项则会响应model的所有属性变更");
const typeSelect = ref("choose");

/**
 * 抽屉关闭，清空临时数据
 */
const modalVisible = ref(false);
watch([modalVisible], (newValue) => {
  if (!newValue[0]) {
    props.root.testValue = null;
  }
});

/**
 * 配置项操作
 */
const modalType = ref("");
const modalTitle = ref("");
const handleRouterKey = ref("");
const componentsArr = reactive({ value: <any>{} });
const receiveComponentsArr = reactive({ value: <any>[] });
const triggerArr = reactive({ value: <any>[] });
const receiveEventArr = reactive({ value: <any>[] });
const replyEventArr = reactive({ value: <any>[] });
const openRouterModal = async (type: string, src: string, routerId: string) => {
  tempDataIndex.value = -1;
  if (!props.isStoryLine) {
    props.closeStoryLineModal?.();
  }
  handleRouterKey.value = src;
  modalType.value = type;
  typeSelect.value = "choose";
  resetCurrent();
  getSrcList();
  props.getRouterType?.();
  if (props.data[src]?.length) {
    tempDataIndex.value = props.data[src].findIndex((item: IRouterInfo) => item.id === routerId);
  }
  switch (type) {
    case ModalTypeInfo.ADD:
      handleTempData(ModalTypeInfo.ADD, "创建", true, false, false);
      break;
    case ModalTypeInfo.SEE:
      handleTempData(ModalTypeInfo.SEE, "查看", false, true, true);
      break;
    case ModalTypeInfo.EDIT:
      handleTempData(ModalTypeInfo.EDIT, "编辑", false, false, true);
      break;
    case ModalTypeInfo.DELETE:
      Modal.confirm({
        title: "确定要删除吗?",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          confirmDelete();
        },
      });
      break;
    case ModalTypeInfo.COPY:
      handleTempData(ModalTypeInfo.COPY, "复制", true, false, true);
      break;
  }
};
function closeRouterModal() {
  modalVisible.value = false;
}

/**
 * 获取发起源可选列表
 */
function getSrcList() {
  componentsArr.value = getCurrentPageComponents();
}

/**
 * 组件选择改变
 * 更新组件事件可选列表
 * @param value
 * @param type
 * @param index
 */
const elementChange = (value: string, option: any, type: string, receiveIndex: number, replyIndex: number) => {
  const element = document.querySelector(`#${value}`);
  const model = (element as any)?.componentModel?.model;
  let inputMessage: IEventSpecificationEvent[] = [];
  let outputMessage: IEventSpecificationEvent[] = [];
  switch (type) {
    case CurrentTypeInfo.SRC:
      // 设置OK状态
      tempDataInfo.value._srcState = RouterState.OK;
      // 清空事件列表
      triggerArr.value = [];
      replyEventArr.value = [];
      // 清空已添加事件列表
      tempDataInfo.value.trigger = [];
      tempDataInfo.value.receive.forEach((receive: IReceive) => {
        receive.replyEvents = [];
      });
      inputMessage = model?.iovSchema?.eventSpecification?.inputMessage;
      outputMessage = model?.iovSchema?.eventSpecification?.outputMessage;
      if (inputMessage) {
        inputMessage.forEach((item: IEventSpecificationEvent) => {
          replyEventArr.value.push({ label: item.text, value: item.eventType });
        });
      }
      if (outputMessage) {
        outputMessage.forEach((item: IEventSpecificationEvent) => {
          triggerArr.value.push({ label: item.text, value: item.eventType });
        });
      }
      // 清空属性数据
      // 清空已添加事件列表
      tempDataInfo.value.attribute = [];
      // 清空tree选中属性
      bindSelectedKey.value = [];
      bindVisible.value = false;
      // 重载元件可选属性
      reloadBindList(model);
      break;
    case CurrentTypeInfo.RECEIVE:
      // 设置OK状态
      tempDataInfo.value.receive[receiveIndex]._targetState = RouterState.OK;
      // 清空可接收事件列表
      receiveEventArr.value[receiveIndex] = [];
      // 清空已添加接收事件
      tempDataInfo.value.receive[receiveIndex].event = [];
      if (props.pageId && String(tempDataInfo.value.receive[receiveIndex].page) === String(props.pageId)) {
        // 选择本页面组件，使用最新的model数据
        inputMessage = model?.iovSchema?.eventSpecification?.inputMessage;
        // 设置当前页面组件标识
        tempDataInfo.value.receive[receiveIndex]._current = true;
      } else {
        // 选择其它页面组件，使用请求到的页面数据
        let component = null;
        receiveComponentsArr.value[receiveIndex]?.[option.text]?.forEach((element: ISchema) => {
          if (element.id === value) component = element;
        });
        if (component) {
          inputMessage = (component as ISchema)?.iovSchema?.eventSpecification?.inputMessage;
        }
        // 设置其他页面组件标识
        tempDataInfo.value.receive[receiveIndex]._current = false;
      }
      if (inputMessage) {
        receiveEventArr.value[receiveIndex] = cloneDeep(inputMessage);
      }
      break;
  }
  checkUpRouterInfo();
};

/**
 * 接收页面选择改变
 * 更新接收组件可选列表
 * @param value
 * @param index
 */
const pageChange = (value: string, receiveIndex: number) => {
  // 清空可选组件列表
  receiveComponentsArr.value[receiveIndex] = {};
  // 清空已选接受组件
  tempDataInfo.value.receive[receiveIndex].target = "";
  // 清空可接收事件列表
  receiveEventArr.value[receiveIndex] = [];
  // 清空已添加接收事件
  tempDataInfo.value.receive[receiveIndex].event = [];
  if (props.pageId && String(props.pageId) === String(value)) {
    receiveComponentsArr.value[receiveIndex] = cloneDeep(componentsArr.value);
  } else {
    const pageIndex = props.pageList.findIndex(({ id }: { id: Number }) => String(id) === String(value));
    if (pageIndex !== -1) {
      const tempArray = props.pageList[pageIndex]?.custom_model?.componentsArray;
      if (tempArray) {
        receiveComponentsArr.value[receiveIndex] = transformGroup(cloneDeep(tempArray));
      }
    }
  }
};

/**
 * 编辑时初始化event可选项
 */
const initEvents = () => {
  if (!tempDataInfo.value.src) return;
  const targetElement = document.querySelector(`#${tempDataInfo.value.src}`);
  const targetModel = (targetElement as any)?.componentModel?.model;
  if (targetModel) {
    triggerArr.value = [];
    const outputMessage = targetModel?.iovSchema?.eventSpecification?.outputMessage;
    if (outputMessage) {
      outputMessage.forEach((item: any) => {
        triggerArr.value.push({ label: item.text, value: item.eventType });
      });
    }
    reloadBindList(targetModel);
  }
  tempDataInfo.value.receive.forEach((receive: IReceive, receiveIndex: number) => {
    if (!receive.page || !receive.target) return;
    receiveComponentsArr.value[receiveIndex] = {};
    receiveEventArr.value[receiveIndex] = [];
    const receiveElement = document.querySelector(`#${receive.target}`);
    const receiveModel = (receiveElement as any)?.componentModel?.model;
    if (props.pageId && String(props.pageId) === String(receive.page)) {
      // 选择本页面组件，使用本页面最新数据
      receiveComponentsArr.value[receiveIndex] = cloneDeep(componentsArr.value);
      const inputMessage = receiveModel?.iovSchema?.eventSpecification?.inputMessage;
      if (inputMessage) {
        receiveEventArr.value[receiveIndex] = cloneDeep(inputMessage);
      }
    } else {
      // 选择其它页面组件，使用请求到的页面数据
      const pageIndex = props.pageList.findIndex(({ id }: { id: Number }) => String(id) === String(receive.page));
      if (pageIndex !== -1) {
        const componentsArray = props.pageList[pageIndex]?.custom_model?.componentsArray;
        if (componentsArray) {
          receiveComponentsArr.value[receiveIndex] = transformGroup(cloneDeep(componentsArray));
          const componentIndex = componentsArray.findIndex(
            (component: ISchema) => String(component.id) === String(receive.target)
          );
          if (componentIndex !== -1) {
            const inputMessage = componentsArray[componentIndex]?.iovSchema?.eventSpecification?.inputMessage;
            if (inputMessage) {
              receiveEventArr.value[receiveIndex] = cloneDeep(inputMessage);
            }
          }
        }
      }
    }
  });
};

/**
 * 处理路由临时编辑数据
 * @param type 操作类型
 * @param title model-title
 * @param refresh 刷新路由项id
 * @param clear 清除快速选中参数
 * @param init 初始化元件可选事件
 * @returns
 */
const handleTempData = async (type: string, title: string, refresh: boolean, clear: boolean, init: boolean) => {
  // await getProjectData();
  switch (type) {
    case ModalTypeInfo.ADD:
      tempDataInfo.value = cloneDeep(defaultInfo);
      tempDataInfo.value.type = props.defaultType;
      break;
    case ModalTypeInfo.SEE:
    case ModalTypeInfo.EDIT:
    case ModalTypeInfo.COPY:
      tempDataInfo.value = cloneDeep(props.data[handleRouterKey.value][tempDataIndex.value]);
      break;
  }
  if (!tempDataInfo.value) {
    message.destroy();
    message.error("未找到路由配置项数据!");
    return;
  }
  refresh && (tempDataInfo.value.id = createHashId(12, "router-"));
  modalTitle.value = `${title}路由配置项 ` + tempDataInfo.value.title;
  clear && clearCurrent();
  init && initEvents();
  modalVisible.value = true;
};

/**
 * 检查配置项重复title
 */
function checkRepeatTitle() {
  for (const key of Object.keys(props.data)) {
    const routerArr = props.data[key] || [];
    for (const route of routerArr) {
      if (route.title === tempDataInfo.value.title && route.id !== tempDataInfo.value.id) return true;
    }
  }
  return false;
}

/**
 * 校验数据处理函数语法正确性
 */
function checkDataScript() {
  let scriptError = false;
  const scriptFormat = (script: any) => {
    try {
      JSONfn.parse(JSON.stringify(script));
      return true;
    } catch (error) {
      console.log(
        `%c路由配置项数据处理函数异常`,
        "text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 4px 0 #aaa,0 5px 1px rgba(0,0,0,.1),0 0 3px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 2px 3px rgba(0,0,0,.2),0 3px 5px rgba(0,0,0,.25),0 6px 6px rgba(0,0,0,.2),0 10px 10px rgba(0,0,0,.15);font-size:14px;background-color: #8BC2FF;color: #fff;padding: 5px 10px;border-radius: 6px;font-weight: 600"
      );
      console.log(error);
      scriptError = true;
      return false;
    }
  };
  tempDataInfo.value.receive.forEach((receive: IReceive) => {
    const receiveScript = { script: receive.script };
    if (!scriptFormat(receiveScript)) receive._scriptState = RouterState.ERROR;
    if (!receive.reply) return;
    const replyScript = { script: receive.replyScript };
    if (!scriptFormat(replyScript)) receive._replyScriptState = RouterState.ERROR;
  });
  return scriptError;
}

/**
 * 校验路由配置项数据
 */
function checkDataInfo() {
  if (!modalType.value) {
    message.error("程序操作类型出错!");
    return false;
  }
  let paramError = false;
  tempDataInfo.value.receive.forEach((item: IReceive) => {
    if (item.page === "" || item.target === "") paramError = true;
  });
  if (!tempDataInfo.value.type || !tempDataInfo.value.title || !tempDataInfo.value.src || paramError) {
    message.destroy();
    message.error("缺少必填参数!");
    return false;
  }
  if (checkRepeatTitle()) {
    message.destroy();
    message.warning("已存在相同名称, 请重命名该配置项!");
    return false;
  }
  if (checkDataScript()) {
    message.destroy();
    message.error("数据处理函数异常, 请关注浏览器控制台异常警告并检查JavaScript函数语法!");
    return false;
  }
  return true;
}

/**
 * 弹窗确定操作
 * @returns
 */
const handleDataInfo = () => {
  if (!checkDataInfo()) return;
  if (!props.routerTypeArr.includes(tempDataInfo.value.type)) {
    // 更新分类
    props.routerTypeArr.push(tempDataInfo.value.type);
    props.changeTypeList();
  }
  switch (modalType.value) {
    case ModalTypeInfo.ADD:
    case ModalTypeInfo.COPY:
      confirmAdd();
      break;
    case ModalTypeInfo.EDIT:
      confirmEdit();
      break;
    default:
      modalVisible.value = false;
  }
  props.changeElementData();
};

/**
 * 确认增加配置项
 */
function confirmAdd() {
  // let repeatTitle = false;
  // let repeatKey = false;
  // Object.keys(data).forEach((key) => {
  //   if (data[key].title === tempDataInfo.value.title) repeatTitle = true;
  //   if (data[key].src === tempDataInfo.value.src) repeatKey = true;
  // });
  // if (repeatTitle) {
  //   message.destroy();
  //   message.error("配置项名称重复");
  //   return;
  // }
  // if (repeatKey) {
  //   message.destroy();
  //   message.error("已存在该发起源");
  //   return;
  // }
  // 处理新增的路由关系
  //   const addRouter = cloneDeep(tempDataInfo.value);
  //   const addEdgeId: EdgeInfo[] = [];
  //   addRouter.receive.forEach((item) => {
  //     addEdgeId.push({
  //       id: `${addRouter.src}|${item.page}|${item.target}`,
  //       source: `${props.pageId}|${addRouter.src}`,
  //       target: `${item.page}|${item.target}`,
  //     });
  //   });
  //   sendRouterChange(addEdgeId, []);
  // 进行变更路由数据
  isArray(props.data[tempDataInfo.value.src])
    ? props.data[tempDataInfo.value.src].push(tempDataInfo.value)
    : (props.data[tempDataInfo.value.src] = [tempDataInfo.value]);
  props.onSearch();
  modalVisible.value = false;
}

/**
 * 确认编辑配置项
 */
function confirmEdit() {
  // let repeatTitle = false;
  // let repeatKey = false;
  // const tempDataList = cloneDeep(data);
  // Reflect.deleteProperty(tempDataList, handleRouterKey.value);
  // Object.keys(tempDataList).forEach((key) => {
  //   if (tempDataList[key].title === tempDataInfo.value.title) repeatTitle = true;
  //   if (tempDataList[key].src === tempDataInfo.value.src) repeatKey = true;
  // });
  // if (repeatTitle) {
  //   message.destroy();
  //   message.error("配置项名称重复");
  //   return;
  // }
  // if (repeatKey) {
  //   message.destroy();
  //   message.error("已存在该发起源");
  //   return;
  // }
  // 获取路由变更数据
  // handleAddOrDelete();
  // 进行变更路由数据
  let refreshStoryLine = false;
  if (tempDataInfo.value.src !== handleRouterKey.value) {
    props.data[handleRouterKey.value].splice(tempDataIndex.value, 1);
    isArray(props.data[tempDataInfo.value.src])
      ? props.data[tempDataInfo.value.src].push(tempDataInfo.value)
      : (props.data[tempDataInfo.value.src] = [tempDataInfo.value]);
    refreshStoryLine = true;
  } else {
    if (props.data[tempDataInfo.value.src][tempDataIndex.value].type !== tempDataInfo.value.type) {
      refreshStoryLine = true;
    }
    props.data[tempDataInfo.value.src][tempDataIndex.value] = tempDataInfo.value;
  }
  props.onSearch();
  modalVisible.value = false;
  if (refreshStoryLine) {
    setTimeout(() => {
      props.refreshStoryLine?.();
    }, 0);
  }
}

/**
 * 确认删除配置项
 */
function confirmDelete() {
  if (tempDataInfo.value.id && props.data[handleRouterKey.value][tempDataIndex.value].id === tempDataInfo.value.id) {
    modalVisible.value = false;
  }
  // 处理删除的路由关系
  //   const deleteRouter = cloneDeep(data[handleRouterKey.value][tempDataIndex.value]);
  //   const deleteEdge: EdgeInfo[] = [];
  //   deleteRouter.receive.forEach((item: IReceive) => {
  //     deleteEdge.push({
  //       id: `${deleteRouter.src}|${item.page}|${item.target}`,
  //       source: `${props.pageId}|${deleteRouter.src}`,
  //       target: `${item.page}|${item.target}`,
  //     });
  //   });
  //   sendRouterChange([], deleteEdge);
  // 进行数据变更
  if (handleRouterKey.value !== "" && tempDataIndex.value !== -1) {
    props.data[handleRouterKey.value]?.splice(tempDataIndex.value, 1);
    // Reflect.deleteProperty(data, handleRouterKey.value);
  }
  props.onSearch();
  props.changeElementData();
}

/**
 * 增加发起方式
 */
const addTrigger = () => {
  tempDataInfo.value.trigger.push("");
  if (currentTarget.type === CurrentTypeInfo.SRC) {
    clearCurrent();
  }
};
/**
 * 删除发起方式
 */
const deleteTrigger = (index: number) => {
  tempDataInfo.value.trigger.splice(index, 1);
};

/**
 * 增加变更属性
 */
const addAttribute = () => {
  tempDataInfo.value.attribute.push("");
};
/**
 * 删除变更属性
 */
const deleteAttribute = (index: number) => {
  tempDataInfo.value.attribute.splice(index, 1);
};

/**
 * 获取元件消息测试数据
 * @param index
 */
function getMessageDemo(index: number) {
  let messageDemo = "";
  if (!tempDataInfo.value.src || !tempDataInfo.value.trigger[index]) return messageDemo;
  const element = document.querySelector(`#${tempDataInfo.value.src}`);
  const model = (element as any)?.componentModel?.model;
  const outputMessage = model?.iovSchema?.eventSpecification?.outputMessage;
  outputMessage?.length &&
    outputMessage.forEach((item: IEventSpecificationEvent) => {
      if (item.eventType === tempDataInfo.value.trigger[index]) {
        messageDemo = item.messageDemo;
      }
    });
  return messageDemo;
}

/**
 * 显示属性tree的气泡卡片
 */
const attributeIndex = ref(-1);
const bindVisible = ref(false);
function showAttrPop(index: number) {
  if (bindVisible.value && attributeIndex.value === index) return;
  clearUpSearch();
  attributeIndex.value = index;
  bindSelectedKey.value = [tempDataInfo.value.attribute[index]];
  if (bindVisible.value) {
    setTimeout(() => {
      bindVisible.value = true;
    }, 200);
  } else {
    bindVisible.value = true;
  }
}

/**
 * 元件属性绑定列表
 * @param resetList
 */
interface treeProps {
  title: string;
  key: string;
  children: treeProps[];
}
const waitBindList = ref<treeProps[]>([]);
function reloadBindList(model: ISchema) {
  if (!model) return;
  // 当前元件待绑定属性
  const waitBindArr = Object.keys(model).map((key: string) => {
    return {
      title: key,
      key,
      children: [],
    };
  });
  waitBindList.value = waitBindArr;
}

/**
 * 搜索属性tree
 */
const bindSearchValue = ref("");
function clearUpSearch() {
  bindSearchValue.value = "";
}

/**
 * 异步加载元件属性
 */
const bindLoadData: TreeProps["loadData"] = (treeNode) => {
  return onLoadData(treeNode, true);
};
function onLoadData(treeNode: EventDataNode, isBind: Boolean) {
  return new Promise<void>((resolve) => {
    const { key = "", children = [] } = treeNode.dataRef || <Record<string, any>>{};
    if (!treeNode.dataRef || children.length || !key || !tempDataInfo.value.src) {
      resolve();
      return;
    }
    const element = document.querySelector(`#${tempDataInfo.value.src}`);
    const componentModel = (element as any)?.componentModel?.model;
    const attribute = JSONPath({ path: key, json: componentModel })[0];
    if (isObject(attribute) || isArray(attribute)) {
      treeNode.dataRef.children = Object.keys(attribute).map((attr: string) => {
        return {
          title: attr,
          key: Number.isNaN(Number(attr)) ? `${key}.${attr}` : `${key}[${attr}]`,
          children: [],
        };
      });
      waitBindList.value = [...waitBindList.value];
    }
    resolve();
  });
}

/**
 * 属性tree选中
 */
const bindSelectedKey = ref<string[]>([]);
function onSelectAttr(keys: any, info: any) {
  bindVisible.value = false;
  if (!keys.length) return;
  // 被点击的key
  const eventKey = info.node.eventKey;
  bindSelectedKey.value = keys;
  tempDataInfo.value.attribute[attributeIndex.value] = eventKey;
  bindVisible.value = false;
}

/**
 * 添加接收源
 */
const addReceive = () => {
  const receive = cloneDeep(defaultReceive);
  receive.id = createHashId(12, "receive-");
  // 默认增加当前页面数据
  if (props.pageId && props.pageList.length) {
    receive.page = props.pageId;
  }
  receiveComponentsArr.value.push(cloneDeep(componentsArr.value));
  tempDataInfo.value.receive.push(receive);
};
/**
 * 删除接收源
 * @param receiveIndex
 */
const deleteReceive = (receiveIndex: number) => {
  tempDataInfo.value.receive.splice(receiveIndex, 1);
  if (currentTarget.type === CurrentTypeInfo.RECEIVE && receiveIndex === currentTarget.receiveIndex) {
    resetCurrent();
  }
};
/**
 * 添加接收方式
 * @param receiveIndex
 */
const addReceiveEvent = (receiveIndex: number) => {
  tempDataInfo.value.receive[receiveIndex].event.push("");
  if (currentTarget.type === CurrentTypeInfo.RECEIVE && currentTarget.receiveIndex === receiveIndex) {
    clearCurrent();
  }
};
/**
 * 删除接收方式
 * @param receiveIndex
 * @param eventIndex
 */
const deleteReceiveEvent = (receiveIndex: number, eventIndex: number) => {
  tempDataInfo.value.receive[receiveIndex].event.splice(eventIndex, 1);
};

/**
 * 添加回流方式
 * @param receiveIndex
 */
const addReplyEvent = (receiveIndex: number) => {
  tempDataInfo.value.receive[receiveIndex].replyEvents.push("");
};
/**
 * 删除回流方式
 * @param receiveIndex
 * @param eventIndex
 */
const deleteReplyEvent = (receiveIndex: number, eventIndex: number) => {
  tempDataInfo.value.receive[receiveIndex].replyEvents.splice(eventIndex, 1);
};

/**
 * 刷新可选元件数据
 */
const refreshDisabled = ref(false);
let refreshTimer: any = undefined;
const handleRefresh = throttle(
  async () => {
    refreshDisabled.value = true;
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      refreshDisabled.value = false;
    }, 3000);
    props.getProjectData();
    getSrcList();
    tempDataInfo.value.receive.forEach((receive: IReceive, index: number) => {
      if (receive._current) {
        receiveComponentsArr.value[index] = cloneDeep(componentsArr.value);
      } else {
        const pageIndex = props.pageList.findIndex(({ id }: { id: Number }) => String(id) === String(receive.page));
        if (pageIndex !== -1) {
          const tempArray = props.pageList[pageIndex]?.custom_model?.componentsArray;
          if (tempArray) {
            receiveComponentsArr.value[index] = transformGroup(cloneDeep(tempArray));
          }
        }
      }
    });
  },
  3000,
  { trailing: false }
);

/**
 * 选择外部需要变更哪个源
 * @param type
 * @param index
 */
enum CurrentTypeInfo {
  SRC = "src",
  RECEIVE = "receive",
  REPLY = "reply",
}
const currentTarget = reactive<{ type: string; receiveIndex: number | null; replyIndex: number | null }>({
  type: CurrentTypeInfo.SRC,
  receiveIndex: null,
  replyIndex: null,
});
function selectCurrent(type: string, receiveIndex: number | null, replyIndex: number | null) {
  if (modalType.value === ModalTypeInfo.SEE) return;
  currentTarget.type = type;
  currentTarget.receiveIndex = receiveIndex;
  currentTarget.replyIndex = replyIndex;
}
function resetCurrent() {
  currentTarget.type = CurrentTypeInfo.SRC;
  currentTarget.receiveIndex = null;
  currentTarget.replyIndex = null;
}
function clearCurrent() {
  currentTarget.type = "";
  currentTarget.receiveIndex = null;
  currentTarget.replyIndex = null;
}

/**
 * 组件外部更新元件源
 * @param value
 */
// @ts-ignore
function changeSelectedComponent(value: string) {
  if (!value || !modalVisible.value || modalType.value === ModalTypeInfo.SEE) return;
  switch (currentTarget.type) {
    case CurrentTypeInfo.SRC:
      if (tempDataInfo.value.src === value) return;
      getSrcList();
      tempDataInfo.value.src = value;
      elementChange(value, null, CurrentTypeInfo.SRC, -1, -1);
      break;
    case CurrentTypeInfo.RECEIVE:
      if (
        !isNumber(currentTarget.receiveIndex) ||
        !tempDataInfo.value.receive[currentTarget.receiveIndex] ||
        tempDataInfo.value.receive[currentTarget.receiveIndex].target === value
      )
        return;
      getSrcList();
      tempDataInfo.value.receive[currentTarget.receiveIndex].page = props.pageId;
      pageChange(props.pageId, currentTarget.receiveIndex);
      tempDataInfo.value.receive[currentTarget.receiveIndex].target = value;
      elementChange(value, null, CurrentTypeInfo.RECEIVE, currentTarget.receiveIndex, -1);
      break;
    case CurrentTypeInfo.REPLY:
      if (
        !isNumber(currentTarget.receiveIndex) ||
        !isNumber(currentTarget.replyIndex) ||
        !tempDataInfo.value.receive[currentTarget.receiveIndex].reply[currentTarget.replyIndex] ||
        tempDataInfo.value.receive[currentTarget.receiveIndex].reply[currentTarget.replyIndex].target === value
      )
        return;
      getSrcList();
      tempDataInfo.value.receive[currentTarget.receiveIndex].reply[currentTarget.replyIndex].page = props.pageId;
      pageChange(props.pageId, currentTarget.receiveIndex);
      tempDataInfo.value.receive[currentTarget.receiveIndex].reply[currentTarget.replyIndex].target = value;
      elementChange(value, null, CurrentTypeInfo.REPLY, currentTarget.receiveIndex, currentTarget.replyIndex);
      break;
  }
}

/**
 * 检查路由是否正确
 * 添加错误项标识
 */
function checkUpRouterInfo() {
  let isError = false;
  isError = tempDataInfo.value._srcState === RouterState.ERROR;
  tempDataInfo.value.receive.forEach((receive) => {
    isError = receive._targetState === RouterState.ERROR;
  });
  tempDataInfo.value._state = isError ? RouterState.ERROR : RouterState.OK;
}

/**
 * code编辑
 */
const codeModal = ref(false);
const codeEditor = ref(null);
const codeIndex = reactive({
  type: "",
  receiveIndex: -1,
});
const codeStr = ref("");
function showCodeEditor(type: string, receiveIndex: number) {
  switch (type) {
    case CurrentTypeInfo.RECEIVE:
      codeStr.value = tempDataInfo.value.receive[receiveIndex].script;
      break;
    case CurrentTypeInfo.REPLY:
      codeStr.value = tempDataInfo.value.receive[receiveIndex].replyScript;
      break;
  }
  codeIndex.type = type;
  codeIndex.receiveIndex = receiveIndex;
  codeModal.value = true;
}
function codeChange() {
  try {
    const code = (codeEditor.value as any).getValue();
    switch (codeIndex.type) {
      case CurrentTypeInfo.RECEIVE:
        if (tempDataInfo.value.receive[codeIndex.receiveIndex].script !== code) {
          tempDataInfo.value.receive[codeIndex.receiveIndex].script = code;
          changeScriptState(CurrentTypeInfo.RECEIVE, codeIndex.receiveIndex);
        }
        break;
      case CurrentTypeInfo.REPLY:
        if (tempDataInfo.value.receive[codeIndex.receiveIndex].replyScript !== code) {
          tempDataInfo.value.receive[codeIndex.receiveIndex].replyScript = code;
          changeScriptState(CurrentTypeInfo.REPLY, codeIndex.receiveIndex);
        }
        break;
    }
    codeModal.value = false;
  } catch (error) {
    console.log(error);
    message.error("无法获取编辑器内容!");
  }
}

/**
 * 重置script错误状态
 * @param type
 * @param index
 */
function changeScriptState(type: string, index: number) {
  switch (type) {
    case CurrentTypeInfo.RECEIVE:
      tempDataInfo.value.receive[index]._scriptState = RouterState.OK;
      break;
    case CurrentTypeInfo.REPLY:
      tempDataInfo.value.receive[index]._replyScriptState = RouterState.OK;
      break;
  }
}

/**
 * 导出供外部调用数据
 */
defineExpose({
  openRouterModal,
  closeRouterModal,
  changeSelectedComponent,
});
</script>
<style lang="scss" scoped></style>
