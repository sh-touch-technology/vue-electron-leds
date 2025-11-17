<template>
    <el-select v-model="innerValue" filterable clearable default-first-option :placeholder="placeholder"
        style="width: 100%;" :filter-method="handleInput" @blur="handleBlur" @change="handleChange">
        <!-- 支持自定义 option 渲染 -->
        <el-option v-for="item in filteredData" :key="itemKey ? item[itemKey] : item[labelKey]" :label="item[labelKey]"
            :value="item[labelKey]">
            <!--
        #option 插槽
        参数:
          item: 当前选项对象
      -->
            <slot name="option" :item="item">
                <!-- 默认显示 -->
                {{ item[labelKey] }}
            </slot>
        </el-option>

        <!-- 支持自定义 label（选中内容） -->
        <template #label="{ value }">
            <slot name="label" :value="value">
                <!-- 默认显示 -->
                {{ value }}
            </slot>
        </template>
    </el-select>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    options: { type: Array, required: true },
    modelValue: { type: [String, Number], default: '' },
    labelKey: { type: String, default: 'label' },
    itemKey: { type: String, default: '' },
    placeholder: { type: String, default: '请选择或输入内容' }
});

const emits = defineEmits(['update:modelValue', 'change']);

const innerValue = ref(props.modelValue);
const filteredData = ref([...props.options]);
const inputKeyword = ref('');
let hasSelected = false;

watch(
    () => props.modelValue,
    (val) => (innerValue.value = val)
);

// 输入筛选
const handleInput = (val) => {
    inputKeyword.value = val;

    if (!val) {
        filteredData.value = props.options;
    } else {
        const keyword = val.toLowerCase();
        filteredData.value = props.options.filter((item) =>
            String(item[props.labelKey] ?? '').toLowerCase().includes(keyword) || String(item[props.itemKey] ?? '').toLowerCase().includes(keyword)
        );
    }
};

// change
const handleChange = (val) => {
    hasSelected = true;
    emits('update:modelValue', val);
    emits('change', val);
};

// blur
// const handleBlur = () => {
//     console.log('inputKeyword.value',inputKeyword.value);
//     if (!hasSelected && inputKeyword.value) {
//         emits('update:modelValue', inputKeyword.value);
//         emits('change', inputKeyword.value);
//     }
//     hasSelected = false;
// };

const handleBlur = () => {
    if (!hasSelected && inputKeyword.value) {

        // 根据 labelKey 找对应的 option
        const match = props.options.find(
            (item) => String(item[props.labelKey]) === String(inputKeyword.value)
        );

        if (match) {
            // 自动成为真实选项的 value
            emits('update:modelValue', match[props.labelKey]);
            emits('change', match[props.labelKey]);
        } else {
            // 输入不存在，正常按原逻辑处理
            emits('update:modelValue', inputKeyword.value);
            emits('change', inputKeyword.value);
        }
    }

    hasSelected = false;
};
</script>
