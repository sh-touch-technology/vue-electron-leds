<template>
    <div class="common-layout">
        <el-container class="main-container">
            <el-header class="head">
                <!-- 串口设置 -->
                <div class="groupbox" data-title="串口设置" style="flex: 2;">
                    <div class="groupbox-content row">
                        <el-select v-model="data.com_port_selected" filterable placeholder="请选择监听串口"
                            style="min-width: 220px;flex: 1;" :popper-options="popper_options">
                            <el-option v-for="item in com_port_list" :key="item.port" :label="item.port"
                                :value="item.port"
                                style="display: flex;flex-direction: row;justify-content: space-between;">
                                <span style="">
                                    {{ item.port }}
                                </span>
                                <span style="color: var(--el-text-color-secondary);font-size: 12px;">
                                    {{ item.name }}
                                </span>
                            </el-option>
                            <template #label>
                                <div style="display: flex;flex-direction: row;align-items: center;">
                                    <span class="selector-selected" :style="computeSelectStyle(data.com_port_selected)">
                                        <p class="selected-title">串口选择：</p>
                                        <p class="selected-content">{{ data.com_port_selected }}</p>
                                    </span>
                                    <el-tag
                                        style="margin-left: auto;height: 20px;border-radius: 4px;padding-left: 5px;padding-right: 5px;"
                                        :type="com_state ? 'success' : 'info'">
                                        {{ com_state ? '监听中' : '未监听' }}
                                    </el-tag>
                                </div>
                            </template>
                        </el-select>
                        <div class="button-area nowrap">
                            <el-button type="primary" plain @click="getSerialPortList">刷新列表</el-button>
                            <el-button :type="com_state ? 'danger' : 'primary'" plain @click="openSerialPort">
                                {{ com_state ? '释放串口' : '打开串口' }}
                            </el-button>
                        </div>
                    </div>
                </div>

                <!-- 设备类型 -->
                <div class="groupbox" data-title="设备类型" style="flex: 1;">
                    <div class="groupbox-content row">
                        <el-segmented v-model="data.device_type" :options="[
                            { label: '窗口屏', value: 1 },
                            { label: '综合屏', value: 2 },
                            { label: '喇叭', value: 3 },
                            { label: '75E接口窗口屏', value: 4 }]" @change="" />
                    </div>
                </div>

                <el-button type="primary" plain style="height: 100%;width: 100px;" @click="exitApp">退出程序</el-button>
            </el-header>
            <el-main class="main">
                <div class="setting">
                    <!-- 基本设置 -->
                    <div class="groupbox" data-title="基本设置" style="flex:1;">
                        <div class="groupbox-content column">
                            <!-- 修改屏号 -->
                            <el-select v-model="data.screen_edit" filterable placeholder="修改屏号："
                                style="min-width: 200px;flex: 1;" :popper-options="popper_options"
                                :filter-method="handleScreenEditInput">
                                <el-option v-for="screen in Array.from({ length: 255 }, (_, i) => i + 1)" :key="screen"
                                    :label="screen" :value="screen"
                                    style="display: flex;flex-direction: row;justify-content: space-between;">
                                    <span style="">{{ screen }}</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected" :style="computeSelectStyle(data.screen_edit)">
                                        <p class="selected-title">修改屏号：</p>
                                        <p class="selected-content">{{ data.screen_edit }}</p>
                                    </span>
                                </template>
                            </el-select>
                            <!-- 行数 -->
                            <el-select v-model="data.line_num" filterable style="flex: 1;"
                                :popper-options="popper_options" :filter-method="handleLineNumInput" placeholder="行数："
                                v-if="data.device_type !== 3">
                                <el-option :key="1" :label="1" :value="1">
                                    <span style="">1</span>
                                </el-option>
                                <el-option :key="2" :label="2" :value="2">
                                    <span style="">2</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected" :style="computeSelectStyle(data.line_num)">
                                        <p class="selected-title">行数：</p>
                                        <p class="selected-content">{{ data.line_num }}</p>
                                    </span>
                                </template>
                            </el-select>
                            <!-- 每行汉字数 -->
                            <el-select v-model="data.line_text_num" filterable style="flex: 1;"
                                :popper-options="popper_options" :filter-method="handleLineTextNumInput"
                                placeholder="每行汉字数：" v-if="data.device_type !== 3">
                                <el-option v-for="item in Array.from({ length: 33 }, (_, i) => i)" :key="item"
                                    :label="item" :value="item">
                                    <span style="">{{ item }}</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected" :style="computeSelectStyle(data.line_text_num)">
                                        <p class="selected-title">每行汉字数：</p>
                                        <p class="selected-content">{{ data.line_text_num }}</p>
                                    </span>
                                </template>
                            </el-select>
                            <!-- 数据正反向 -->
                            <el-select v-model="data.data_forward_or_reverse_direction" style="flex: 1;"
                                :popper-options="popper_options" placeholder="数据正反向："
                                v-if="[1, 2].includes(data.device_type)">
                                <el-option :key="1" :label="'正向'" :value="true">
                                    <span style="">正向</span>
                                </el-option>
                                <el-option :key="2" :label="'反向'" :value="false">
                                    <span style="">反向</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected"
                                        :style="computeSelectStyle(data.data_forward_or_reverse_direction)">
                                        <p class="selected-title">数据正反向：</p>
                                        <p class="selected-content">
                                            {{ data.data_forward_or_reverse_direction ? '正向' : '反向' }}
                                        </p>
                                    </span>
                                </template>
                            </el-select>
                            <!-- OE极性 -->
                            <el-select v-model="data.oe_polarity" style="flex: 1;" :popper-options="popper_options"
                                placeholder="OE极性：" v-if="[1, 2].includes(data.device_type)">
                                <el-option :key="1" :label="'正向'" :value="true">
                                    <span style="">正向</span>
                                </el-option>
                                <el-option :key="2" :label="'反向'" :value="false">
                                    <span style="">反向</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected" :style="computeSelectStyle(data.oe_polarity)">
                                        <p class="selected-title">OE极性：</p>
                                        <p class="selected-content">{{ data.oe_polarity ? '正向' : '反向' }}</p>
                                    </span>
                                </template>
                            </el-select>
                            <!-- 点阵选择 -->
                            <el-select v-model="data.dot_matrix" style="flex: 1;" :popper-options="popper_options"
                                placeholder="点阵选择：" v-if="data.device_type === 1">
                                <el-option :key="16" :label="16" :value="16">
                                    <span style="">16</span>
                                </el-option>
                                <el-option :key="24" :label="24" :value="24">
                                    <span style="">24</span>
                                </el-option>
                                <el-option :key="32" :label="32" :value="32">
                                    <span style="">32</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected" :style="computeSelectStyle(data.dot_matrix)">
                                        <p class="selected-title">点阵选择：</p>
                                        <p class="selected-content">{{ data.dot_matrix }}</p>
                                    </span>
                                </template>
                            </el-select>
                            <!-- 75e背景颜色 -->
                            <el-select v-model="data.background_color_75e" style="flex: 1;"
                                :popper-options="popper_options" v-if="data.device_type === 4" placeholder="背景颜色：">
                                <el-option :key="0" label="0-H黑色" :value="0">
                                    <span style="">0-H黑色</span>
                                </el-option>
                                <el-option :key="1" label="1-R红色" :value="1">
                                    <span style="">1-R红色</span>
                                </el-option>
                                <el-option :key="2" label="2-G绿色" :value="2">
                                    <span style="">2-G绿色</span>
                                </el-option>
                                <el-option :key="3" label="3-Y黄色" :value="3">
                                    <span style="">3-Y黄色</span>
                                </el-option>
                                <el-option :key="4" label="4-B蓝色" :value="4">
                                    <span style="">4-B蓝色</span>
                                </el-option>
                                <el-option :key="5" label="5-V紫色" :value="5">
                                    <span style="">5-V紫色</span>
                                </el-option>
                                <el-option :key="6" label="6-S天蓝" :value="6">
                                    <span style="">6-S天蓝</span>
                                </el-option>
                                <el-option :key="7" label="7-W白色" :value="7">
                                    <span style="">7-W白色</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected"
                                        :style="computeSelectStyle(data.background_color_75e)">
                                        <p class="selected-title">背景颜色：</p>
                                        <p class="selected-content">
                                            {{ computeBackgroundColor75e(data.background_color_75e) }}
                                        </p>
                                    </span>
                                </template>
                            </el-select>
                            <!-- 综合屏点阵选择 -->
                            <el-select v-model="data.dot_matrix_zh" style="flex: 1;" :popper-options="popper_options"
                                placeholder="点阵选择：" disabled v-if="data.device_type === 2">
                                <el-option :key="16" :label="16" :value="16">
                                    <span style="">16</span>
                                </el-option>
                                <el-option :key="24" :label="24" :value="24">
                                    <span style="">24</span>
                                </el-option>
                                <el-option :key="32" :label="32" :value="32">
                                    <span style="">32</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected">
                                        <p class="selected-title" style="color: #909399;">点阵选择：</p>
                                        <p class="selected-content">{{ data.dot_matrix_zh }}</p>
                                    </span>
                                </template>
                            </el-select>
                            <!-- 75e点阵选择 -->
                            <el-select v-model="data.dot_matrix_75e" style="flex: 1;" :popper-options="popper_options"
                                placeholder="点阵选择：" v-if="data.device_type === 4">
                                <el-option :key="16" :label="16" :value="16">
                                    <span style="">16</span>
                                </el-option>
                                <el-option :key="24" :label="24" :value="24">
                                    <span style="">24</span>
                                </el-option>
                                <el-option :key="32" :label="32" :value="32">
                                    <span style="">32</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected" :style="computeSelectStyle(data.dot_matrix_75e)">
                                        <p class="selected-title">点阵选择：</p>
                                        <p class="selected-content">{{ data.dot_matrix_75e }}</p>
                                    </span>
                                </template>
                            </el-select>
                            <div class="button-area wrap">
                                <el-button type="primary" plain @click="editBaseSetting"
                                    style="margin-top: auto;">修改设置</el-button>
                            </div>
                        </div>
                    </div>
                    <!-- 初始显示内容设置 -->
                    <div class="groupbox" data-title="初始显示内容设置" style="flex:1;">
                        <div class="groupbox-content column initial-content-setting"
                            style="height: 100%;display: flex;">
                            <el-input v-model="data.screen_window_sequence_and_name" :rows="2" type="textarea"
                                style="flex: 1;height: 100%;" resize="none" :spellcheck="false" autocomplete="off" />
                            <el-button type="primary" plain
                                @click="ledContentSend(data.screen_window_sequence_and_name, 'W')">设置窗口序号和名称</el-button>
                            <el-input v-model="data.screen_initial_content" :rows="2" type="textarea"
                                style="flex: 1;height: 100%;" resize="none" :spellcheck="false" autocomplete="off" />
                            <el-button type="primary" plain
                                @click="ledContentSend(data.screen_initial_content, 'S')">设置初始显示内容</el-button>
                        </div>
                    </div>
                    <!-- 扩展设置 -->
                    <div class="groupbox" data-title="扩展设置" style="flex:1;">
                        <div class="groupbox-content column">
                            <!-- 移动效果 -->
                            <el-select v-model="data.move_effect" :popper-options="popper_options" disabled
                                v-if="data.device_type === 1 || data.device_type === 4">
                                <el-option :key="0" label="左移" :value="0">
                                    <span style="">左移</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected" style="color:#909399 ;">
                                        <p class="selected-title" style="color: #909399;">移动效果：</p>
                                        <p class="selected-content">左移</p>
                                    </span>
                                </template>
                            </el-select>
                            <!-- 综合屏移动效果 -->
                            <el-select v-model="data.move_effect_zh" :popper-options="popper_options"
                                v-if="data.device_type === 2">
                                <el-option :key="0" label="上移百叶窗" :value="0">
                                    <span style="">上移百叶窗</span>
                                </el-option>
                                <el-option :key="1" label="下移百叶窗" :value="1">
                                    <span style="">下移百叶窗</span>
                                </el-option>
                                <el-option :key="2" label="上移闪烁" :value="2">
                                    <span style="">上移闪烁</span>
                                </el-option>
                                <el-option :key="3" label="下移闪烁" :value="3">
                                    <span style="">下移闪烁</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected" :style="computeSelectStyle(data.move_effect_zh)">
                                        <p class="selected-title">移动效果：</p>
                                        <p class="selected-content">
                                            {{ computeMoveEffect(data.move_effect_zh) }}
                                        </p>
                                    </span>
                                </template>
                            </el-select>
                            <!-- 移动速度 -->
                            <el-select v-model="data.move_speed" :popper-options="popper_options"
                                v-if="data.device_type !== 3">
                                <el-option :key="0" label="最快" :value="0">
                                    <span style="">最快</span>
                                </el-option>
                                <el-option :key="1" label="快" :value="1">
                                    <span style="">快</span>
                                </el-option>
                                <el-option :key="2" label="中" :value="2">
                                    <span style="">中</span>
                                </el-option>
                                <el-option :key="3" label="慢" :value="3">
                                    <span style="">慢</span>
                                </el-option>
                                <el-option :key="4" label="最慢" :value="4">
                                    <span style="">最慢</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected" :style="computeSelectStyle(data.move_speed)">
                                        <p class="selected-title">
                                            {{ data.device_type === 2 ? '移动速度：' : '左移速度：' }}
                                        </p>
                                        <p class="selected-content">
                                            {{ computeMoveSpeed(data.move_speed) }}
                                        </p>
                                    </span>
                                </template>
                            </el-select>
                            <!-- 闪烁次数 -->
                            <el-select v-model="data.flashes_num" filterable :popper-options="popper_options"
                                :filter-method="handleLineTextNumInput" placeholder="闪烁次数："
                                v-if="data.device_type !== 3">
                                <el-option v-for="item in Array.from({ length: 10 }, (_, i) => i)" :key="item"
                                    :label="item" :value="item">
                                    <span style="">{{ item }}</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected" :style="computeSelectStyle(data.flashes_num)">
                                        <p class="selected-title">闪烁次数：</p>
                                        <p class="selected-content">{{ data.flashes_num }}</p>
                                    </span>
                                </template>
                            </el-select>
                            <!-- 对齐方式 -->
                            <el-select v-model="data.align_type" :popper-options="popper_options" disabled
                                v-if="data.device_type !== 3">
                                <el-option :key="0" label="居中" :value="0">
                                    <span style="">居中</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected" style="color:#909399 ;">
                                        <p class="selected-title" style="color: #909399;">对齐方式(24点阵)：</p>
                                        <p class="selected-content">居中</p>
                                    </span>
                                </template>
                            </el-select>
                            <!-- 喇叭音量 -->
                            <el-select v-model="data.volume" filterable :popper-options="popper_options"
                                :filter-method="handleLineTextNumInput" placeholder="喇叭音量："
                                v-if="data.device_type === 3">
                                <el-option v-for="item in Array.from({ length: 16 }, (_, i) => i + 1)" :key="item"
                                    :label="item" :value="item">
                                    <span style="">{{ item }}</span>
                                </el-option>
                                <template #label>
                                    <span class="selector-selected" :style="computeSelectStyle(data.volume)">
                                        <p class="selected-title">喇叭音量：</p>
                                        <p class="selected-content">{{ data.volume }}</p>
                                    </span>
                                </template>
                            </el-select>
                            <el-button type="primary" plain @click="editExtensionSetting" style="margin-top: auto;"
                                v-if="data.device_type !== 3">扩展设置</el-button>
                            <el-button type="primary" plain @click="settingVolume" style="margin-top: auto;"
                                v-if="data.device_type === 3">音量设置</el-button>
                        </div>
                    </div>
                    <div style="flex: 1;display: flex;flex-direction: column;gap: 18px;">
                        <!-- 屏号选择 -->
                        <div class="groupbox" data-title="选择屏号">
                            <div class="groupbox-content row">
                                <el-select v-model="data.screen_selected" filterable placeholder="当前屏号："
                                    style="min-width: 150px;flex: 1;" :popper-options="popper_options"
                                    :filter-method="handleScreenSelectInput">
                                    <el-option v-for="screen in Array.from({ length: 256 }, (_, i) => i)" :key="screen"
                                        :label="screen" :value="screen"
                                        style="display: flex;flex-direction: row;justify-content: space-between;">
                                        <span style="">{{ screen }}</span>
                                    </el-option>
                                    <template #label>
                                        <span class="selector-selected"
                                            :style="computeSelectStyle(data.screen_selected)">
                                            <p class="selected-title">当前屏号：</p>
                                            <p class="selected-content">{{ data.screen_selected }}</p>
                                        </span>
                                    </template>
                                </el-select>
                            </div>
                        </div>
                        <!-- 信道设置 -->
                        <div class="groupbox" data-title="无线信道" style="flex:1;">
                            <div class="groupbox-content column">
                                <el-select v-model="data.com_channel_selected" filterable style=""
                                    :popper-options="popper_options" placeholder="无线信道：">
                                    <el-option v-for="item in channelDefined" :key="item.channel"
                                        :label="`${item.label}(${item.channel})`" :value="item.channel">
                                        <span style="float: left">{{ `${item.label}(${item.channel})` }}</span>
                                    </el-option>
                                    <template #label>
                                        <span class="selector-selected"
                                            :style="computeSelectStyle(data.com_channel_selected)">
                                            <p class="selected-title">信道选择：</p>
                                            <p class="selected-content">
                                                {{
                            `${channelDefined[data.com_channel_selected].label}(${data.com_channel_selected})`
                        }}
                                            </p>
                                        </span>
                                    </template>
                                </el-select>
                                <div class="button-area wrap">
                                    <el-button type="primary" plain @click="editMainControl()"
                                        style="margin-top: auto;">主控修改</el-button>
                                    <el-button type="primary" plain @click="readMainControl()">主控读取</el-button>
                                    <el-button type="primary" plain @click="wirelessControlCard()">
                                        {{ data.device_type === 3 ? '无线喇叭' : '无线控制卡' }}
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="info">
                    <!-- 提示信息 -->
                    <div class="groupbox" data-title="" style="flex:1;">
                        <div class="groupbox-content column initial-content-setting"
                            style="height: 100%;display: flex;">
                            <p>注1：当前屏号选择0时，为广播设置（V532板广播不修改地址！）</p>
                            <p>注2：设置窗口名称"&Y01 |&G行政服务中心"，则在24或32点阵窗口屏以64点阵方式显示黄色01窗口序号。</p>
                            <p>注3：需要远距离传输选用L00-L31(0-31)低速信道，当窗口较多时，选用H00-H31(32-63)高速信道。</p>
                        </div>
                    </div>
                </div>
                <div class="test">
                    <!-- 测试显示指令 -->
                    <div class="groupbox" data-title="测试显示指令" style="flex:1;">
                        <div class="groupbox-content column initial-content-setting"
                            style="height: 100%;display: flex;">
                            <el-input v-model="data.send_test_content" :rows="2" type="textarea"
                                style="flex: 1;height: 100%;" resize="none" :spellcheck="false" autocomplete="off" />
                            <div class="info2">
                                <el-button type="primary" plain @click="ledContentSend(data.send_test_content, 'D')"
                                    style="width: 180px;">发送测试显示信息</el-button>
                                <div>
                                    <p>注1：单次发送不要超过100个字符（50个汉字）！</p>
                                    <p>注2：默认红色，'&R'红色，'&G'绿色，'&Y'黄色，'&B'蓝色，'&W'白色，'&V紫色'，'&S'天蓝！</p>
                                    <p>注3：'#'换行，&1表示圈11</p>
                                </div>
                                <div>
                                    <p>上电.001C04S1（屏号001单行4字左移最快）</p>
                                    <p>.021DC12S3（屏号021双行12字左移中速）</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="log">
                    <!-- 日志 -->
                    <div class="groupbox" data-title="日志" style="flex:1;">
                        <div class="log-list" id="logContainer">
                            <el-segmented v-model="log_debug"
                                :options="[{ label: '普通', value: false }, { label: '调试', value: true }]"
                                style="position: absolute;right: 17px;top: 12px;" size="small"
                                @change="logLevelChange" />
                            <div class="log-item" v-for="item in show_log_list" :key="item.id"
                                :style="computeLogColor(item.level)">
                                <p>{{ item.time }} - {{ item.msg }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="control-panel">
                        <el-button type="primary" plain style="flex: 1;" @click="log_list.length = 0">清空日志</el-button>
                        <el-button type="primary" plain style="flex: 1;" @click="resetSetting">重置设置</el-button>
                        <el-button type="primary" plain style="flex: 1;" @click="appRelaunch">程序重启</el-button>
                    </div>
                </div>
            </el-main>
            <el-footer class="footer"></el-footer>
        </el-container>
    </div>
    <ConfirmDialog ref="confirmRef" />
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick, toRefs, computed } from 'vue';
import { channelDefined } from './channel';
import { ConfigDataStore } from '@pinia/ConfigData.js';
import * as ledsUtil from './ledsUtil.js';
import ConfirmDialog from './ConfirmDialog.vue'

const ConfigData = ConfigDataStore();
//Popper.js配置
const popper_options = ref({ modifiers: [{ name: 'computeStyles', options: { gpuAcceleration: false, adaptive: false }, },], });
//二次确认框实例
const confirmRef = ref(null);

//串口列表
const com_port_list = ref([]);
//串口监听状态
const com_state = ref(false);
//日志列表
const log_list = ref([]);
//日志显示debug级别
const log_debug = ref(false);
//渲染日志列表
const show_log_list = computed(() => {
    if (log_debug.value) {
        return log_list.value;
    }
    const result = log_list.value.filter(item => item.level !== 'debug');
    return result;
})

//设置数据
const { config: data } = toRefs(ConfigData);

//主控返回数据超时计时器
const mainControlDataReturnTimer = ref(null);

//日志函数
let log_id = 0;
const log = (msg, level) => {
    if (!level) { level = 'default' }
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`;
    log_list.value.push({
        id: log_id,
        time: time,
        msg: msg,
        level: level
    })
    log_id++;
    nextTick(() => {
        const logContainer = document.getElementById('logContainer');
        logContainer.scrollTop = logContainer.scrollHeight;
    });
}

const logLevelChange = () => {
    nextTick(() => {
        const logContainer = document.getElementById('logContainer');
        logContainer.scrollTop = logContainer.scrollHeight;
    });
}

//获取串口列表
const getSerialPortList = () => {
    window.electron.getSerialPortList();
}

//打开串口
const openSerialPort = () => {
    if (com_state.value) {
        window.electron.releaseSerialPort()
    }
    else {
        window.electron.openSerialPort(data.value.com_port_selected);
    }

}

//发送串口消息
const sendSerialPortMessage = (frame) => {
    window.electron.sendSerialPortMessage(frame);
}

//主控修改
const editMainControl = () => {
    log('主控修改');
    if (!com_state.value) {
        log('串口未打开，请先打开串口', 'error');
        return;
    }
    const frame = ledsUtil.getEditMainControlData(data.value.com_channel_selected);
    sendSerialPortMessage(frame);
    if (mainControlDataReturnTimer.value) {
        clearTimeout(mainControlDataReturnTimer.value);
        mainControlDataReturnTimer.value = null;
    }
    mainControlDataReturnTimer.value = setTimeout(() => {
        log('与主控通信失败：返回数据超时', 'error')
    }, 800);
}

//主控读取
const readMainControl = () => {
    log('主控读取');
    if (!com_state.value) {
        log('串口未打开，请先打开串口', 'error');
        return;
    }
    const frame = ledsUtil.getReadMainControlData(data.value.com_channel_selected);
    sendSerialPortMessage(frame);
    if (mainControlDataReturnTimer.value) {
        clearTimeout(mainControlDataReturnTimer.value);
        mainControlDataReturnTimer.value = null;
    }
    mainControlDataReturnTimer.value = setTimeout(() => {
        log('与主控通信失败：返回数据超时', 'error')
    }, 800);
}

//无线控制卡
const wirelessControlCard = () => {
    log('无线控制卡');
    if (!com_state.value) {
        log('串口未打开，请先打开串口', 'error');
        return;
    }
    const frame = ledsUtil.getEditWirelessControlCardChannelData(data.value.com_channel_selected);
    sendSerialPortMessage(frame);
}

//修改基本设置
const editBaseSetting = async() => {
    log('修改控制卡基本设置');

    //检查串口打开
    if (!com_state.value) {
        log('串口未打开，请先打开串口', 'error');
        return;
    }
    
    //当前地址0需要确认
    if (data.value.screen_selected === 0) {
        const result = await confirmRef.value.openConfirm({
            title: '操作确认',
            message: '当前屏号设置为0，将广播修改同信道下所有设备，是否确认？',
        })

        if (result) {
            console.warn('用户点击了确认')
        } else {
            console.warn('取消操作');
            return;
        }
    }

    const setting = {
        ph: data.value.screen_selected,
        xgph: data.value.screen_edit,
        hs: data.value.line_num,
        mhzs: data.value.line_text_num,
        zf: data.value.data_forward_or_reverse_direction,
        oe: data.value.oe_polarity,
        m_sdot: data.value.dot_matrix,
        m_sdot_75e: data.value.dot_matrix_75e,
        background_color_75e: data.value.background_color_75e,
        device_type: data.value.device_type
    };
    const frame = ledsUtil.getEditBaseSettingData(setting);
    sendSerialPortMessage(frame);
}

//内容发送
const ledContentSend = (text, cmd) => {
    log('控制卡内容发送');
    window.electron.convertStringToGbkEncode(text).then((result) => {
        if (result.state) {
            const setting = {
                ph: data.value.screen_selected,
                encodeArray: result.data,
                cmd: cmd
            };
            const frame = ledsUtil.getLedContendSendData(setting);
            sendSerialPortMessage(frame);
        }
        else {
            log(result.message, 'error');
        }
    });
}

//扩展设置
const editExtensionSetting = () => {
    log('修改控制卡扩展设置');
    const setting = {
        ph: data.value.screen_selected,
        move_effect_zh: data.value.move_effect_zh,
        move_speed: data.value.move_speed,
        flashes_num: data.value.flashes_num,
        align_type: 0,
        device_type: data.value.device_type
    };
    const frame = ledsUtil.getExtensionSettingData(setting);
    sendSerialPortMessage(frame);
}

//设置喇叭音量
const settingVolume = () => {
    log('修改喇叭音量');
    const setting = {
        ph: data.value.screen_selected,
        volume: data.value.volume
    };
    const frame = ledsUtil.getVolumeSettingData(setting);
    sendSerialPortMessage(frame);
}

//校验主控返回数据帧
const convertFrameToChannel = (frame) => {
    try {
        if (frame.length < 5) {
            log('主控返回数据帧校验失败：数据帧长度不足', 'error');
            return null;
        }
        const n1 = frame[3]; // 第四个字节
        const n2 = frame[4]; // 第五个字节

        let ten = (n1 === 0) ? 0 : (n1 - 0x30); // 如果n1是0，表示没有十位
        let one = n2 - 0x30;

        let address = ten * 10 + one;
        return address;
    }
    catch (error) {
        log('主控返回数据帧校验失败：' + error, 'error');
        return null;
    }
}


//保存取消监听渲染进程消息的函数
let cleanupFns = [];

//计算select颜色
const computeSelectStyle = (select) => {
    if (select != null && select !== '') {
        return {
            color: '#409EFF'
        };
    }
    return {};
}

//计算日志颜色
const computeLogColor = (level) => {
    switch (level) {
        case 'primary':
            return {
                color: '#409EFF'
            }
        case 'success':
            return {
                color: '#67C23A'
            }
        case 'warning':
            return {
                color: '#E6A23C'
            }
        case 'error':
            return {
                color: '#F56C6C'
            }
        case 'debug':
            return {
                color: '#b12dff'
            }
        default:
            return {
                color: '#909399'
            }
    }
}

//计算75e背景颜色选择结果
const computeBackgroundColor75e = (value) => {
    switch (value) {
        case 0:
            return '0-H 黑色';
        case 1:
            return '1-R 红色';
        case 2:
            return '2-G 绿色';
        case 3:
            return '3-Y 黄色';
        case 4:
            return '4-B 蓝色';
        case 5:
            return '5-V 紫色';
        case 6:
            return '6-S 天蓝';
        case 7:
            return '7-W 白色';
        default:
            return '';
    }
}

//计算移动效果选择结果
const computeMoveEffect = (value) => {
    switch (value) {
        case 0:
            return '上移百叶窗';
        case 1:
            return '下移百叶窗';
        case 2:
            return '上移闪烁';
        case 3:
            return '下移闪烁';
        default:
            return '';
    }
}

//计算移动速度选择结果
const computeMoveSpeed = (value) => {
    switch (value) {
        case 0:
            return '最快';
        case 1:
            return '快';
        case 2:
            return '中';
        case 3:
            return '慢';
        case 4:
            return '最慢';
        default:
            return '';
    }
}

const resetSetting = () => {
    log('重置设置');
    ConfigData.resetSetting();
    getSerialPortList();
}

const appRelaunch = () => {
    log('程序重启');
    window.electron.appRelaunch();
}

const exitApp = () => {
    log('程序退出');
    window.electron.exitApp();
}

// 防抖函数
const debounce = (fn, delay) => {
    let timer = null;
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
};

// 当前屏号输入处理函数
const handleScreenSelectInput = debounce((input) => {
    const numValue = input.replace(/[^\d]/g, '');
    if (!numValue) {
        return;
    }
    const number = parseInt(numValue);
    if (number >= 0 && number <= 255) {
        data.value.screen_selected = number;
        return;
    }
    log('输入数值不正确，修改屏号取值范围0-255', 'warning');
}, 800);

// 修改屏号输入处理函数
const handleScreenEditInput = debounce((input) => {
    const numValue = input.replace(/[^\d]/g, '');
    if (!numValue) {
        return;
    }
    const number = parseInt(numValue);
    if (number >= 1 && number <= 255) {
        data.value.screen_edit = number;
        return;
    }
    log('输入数值不正确，修改屏号取值范围1-255', 'warning');
}, 800);

//行数输入处理
const handleLineNumInput = debounce((input) => {
    const numValue = input.replace(/[^\d]/g, '');
    if (!numValue) {
        return;
    }
    const number = parseInt(numValue);
    if (number === 1 || number == 2) {
        data.value.line_num = number;
        return;
    }
    log('输入数值不正确，行数取值范围1-2', 'warning');
}, 800);

//每行汉字数
const handleLineTextNumInput = debounce((input) => {
    const numValue = input.replace(/[^\d]/g, '');
    if (!numValue) {
        return;
    }
    const number = parseInt(numValue);
    if (number >= 0 && number <= 32) {
        data.value.line_text_num = number;
        return;
    }
    log('输入数值不正确，每行汉字数取值范围0-32', 'warning');
}, 800);

onMounted(() => {
    log('程序启动');

    // 监听串口返回消息
    cleanupFns.push(
        window.electron.onSerialData((obj) => {
            switch (obj.type) {
                //接收到串口列表
                case 'com_port_list':
                    com_port_list.value = obj.data;
                    log(`串口列表获取成功 ${com_port_list.value.length}个串口`, 'success');
                    //未选择串口的情况下，自动选择一个串口
                    if (com_port_list.value.length > 0 && !data.value.com_port_selected) {
                        data.value.com_port_selected = com_port_list.value[0].port;
                    }
                    //自动开始监听串口

                    break;
                //接收到串口打开
                case 'com-port-open':
                    com_state.value = true;
                    log(`串口打开成功 ${data.value.com_port_selected}`, 'success');
                    break;
                //接收到串口释放
                case 'com-port-release':
                    com_state.value = false;
                    log(`串口释放`, 'primary');
                    break;
                //接收到串口状态消息
                case 'com-state-message':
                    log(obj.msg, obj.flag)
                    break;
                default:
                    console.log('接收到渲染进程发送的串口未注册消息', obj);
                    break;
            }
        })
    );

    // 监听串口监听接收数据
    cleanupFns.push(
        window.electron.onSerialMessage((frame) => {
            log(`串口接收：${frame.join(' ')} (${frame.map(num => num.toString(16).padStart(2, '0').toUpperCase()).join(' ')})`, 'debug');
            if (frame.length === 6 && frame[2] === 82) {
                if (mainControlDataReturnTimer.value) {
                    clearTimeout(mainControlDataReturnTimer.value);
                    mainControlDataReturnTimer.value = null;
                }
                const channel = convertFrameToChannel(frame);
                if (channel) {
                    data.value.com_channel_selected = channel;
                    log('与主控通信成功，信道：' + channel, 'success');
                    return;
                }
                log('与主控通信失败：主控返回数据帧校验失败', 'error');
            }
        })
    );
    getSerialPortList();
});

onBeforeUnmount(() => {
    console.log('before unmounted');
    cleanupFns.forEach((cleanup) => cleanup());
    cleanupFns = [];
});
</script>
<script>

</script>

<style lang="scss">
.initial-content-setting {
    .el-textarea__inner {
        height: 100%;
        color: #474747;
        padding-right: 2px;
    }
}

/* 滚动条样式 */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    margin-right: 2px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
    margin-right: 2px;
}

::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    transition: all 0.3s;
    margin-right: 2px;

    &:hover {
        background: #a8a8a8;
    }
}

/* 火狐浏览器滚动条样式 */
* {
    scrollbar-width: thin;
    scrollbar-color: #c1c1c1 #f1f1f1;
}
</style>
<style lang="scss" scoped>
.common-layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    padding: 16px 8px 10px 8px;

    .main-container {
        display: flex;
        flex-direction: column;

        .head {
            height: auto;
            display: flex;
            min-width: 510px;
            padding: 0;

            flex-direction: row;
            gap: 10px;

            // @media (max-width: 950px) {
            //     flex-direction: column;
            //     gap: 15px;
            // }

            // @media (min-width: 950px) {
            //     flex-direction: row;
            //     gap: 10px;
            // }

        }

        .main {
            flex: 1;
            padding: 16px 0 0 0;
            display: flex;
            flex-direction: column;

            .setting {
                flex: 1;
                display: flex;
                flex-direction: row;
                gap: 10px;
                min-height: 300px;

                .groupbox-content.column {
                    gap: 8px;
                    height: 100%;
                }
            }

            .info {
                margin-top: 10px;

                .groupbox {
                    padding: 2px 8px 8px 8px;
                    font-size: 14px;
                    color: #409EFF;

                    .groupbox-content.column {
                        gap: 4px;
                    }
                }
            }

            .test {
                flex: 1;
                display: flex;
                flex-direction: row;
                gap: 8px;
                min-height: 150px;
                margin-top: 18px;

                .groupbox {
                    padding-bottom: 5px;
                }

                .groupbox-content.column {
                    gap: 6px;
                }

                .info2 {
                    display: flex;
                    flex-direction: row;
                    font-size: 12px;
                    color: #409EFF;
                    justify-content: space-between;
                    align-items: center;

                    div {
                        display: flex;
                        flex-direction: column;
                        gap: 2px;
                        height: 100%;
                    }
                }
            }

            .log {
                display: flex;
                flex-direction: row;
                gap: 8px;
                min-height: 180px;
                margin-top: 18px;

                .groupbox {
                    padding-top: 12px;
                    padding-right: 5px;
                }

                .log-list {
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto;
                    max-height: 152px;
                    min-height: 152px;
                    gap: 4px;

                    .log-item {
                        display: flex;
                        flex-direction: row;
                        word-break: break-all;
                        font-size: 14px;
                    }
                }

                .control-panel {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: start;
                    gap: 10px;

                    .el-button {
                        margin: 0;
                        width: 120px;
                    }
                }
            }
        }

        .footer {
            padding: 0;
            height: auto;
        }
    }
}

.groupbox {
    position: relative;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3.5px;

    .groupbox-content {
        padding-top: 5px;
        display: flex;


        .button-area.wrap {
            display: flex;
            flex-direction: column;
            gap: 12px;
            height: 100%;
        }

        .button-area.wrap>* {
            margin: 0;
        }

        .button-area.nowrap {
            display: flex;
            flex-wrap: nowrap;
            margin-left: 12px;
        }
    }

    .groupbox-content.row {
        flex-direction: row;
    }

    .groupbox-content.column {
        flex-direction: column;
        gap: 8px;
    }
}

.groupbox::before {
    content: attr(data-title);
    position: absolute;
    top: -12px;
    left: 10px;
    background-color: white;
    padding: 0 5px;
    color: #363636;
    font-size: 15px;
}

.selector-selected {
    display: flex;
    flex-direction: row;
    user-select: none;

    .selected-title {
        color: #252525;
    }
}

.el-segmented {
    user-select: none;
}
</style>