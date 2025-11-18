<template>
    <el-select
        v-model="innerValue"
        filterable
        clearable
        default-first-option
        :placeholder="placeholder"
        style="width: 100%;"
        :filter-method="handleInput"
        @blur="handleBlur"
        @change="handleChange"
    >
        <el-option
            v-for="item in filteredData"
            :key="itemKey ? item[itemKey] : item[labelKey]"
            :label="item[labelKey]"
            :value="item[labelKey]"
        >
            <slot name="option" :item="item">
                {{ item[labelKey] }}
            </slot>
        </el-option>

        <template #label="{ value }">
            <slot name="label" :value="value">
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
    placeholder: { type: String, default: '请选择或输入内容' },

    // ⭐ 新增：数值取值范围，例如 [1, 100]
    valueRange: { type: Array, default: () => null },

    // ⭐ 新增：属性名称，例如 device_type
    valueName: { type: String, default: '' }
});

const emits = defineEmits(['update:modelValue', 'change', 'log']);

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
            String(item[props.labelKey] ?? '').toLowerCase().includes(keyword) ||
            String(item[props.itemKey] ?? '').toLowerCase().includes(keyword)
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
const handleBlur = () => {
    if (!hasSelected && inputKeyword.value) {
        const value = inputKeyword.value;

        // -------------------------------
        // ⭐⭐ 数值范围校验
        // -------------------------------
        if (props.valueRange && props.valueRange.length === 2) {
            const [min, max] = props.valueRange;
            const numberVal = Number(value);

            // 输入不是数字 或 不在范围内 → 不更新值 + 调用 log
            if (isNaN(numberVal) || numberVal < min || numberVal > max) {
                emits(
                    'log',
                    `输入数值不正确，${props.valueName}取值范围${min}-${max}`,
                    'warning'
                );
                hasSelected = false;
                return;
            }
        }

        // -------------------------------
        // 正常处理：匹配 option
        // -------------------------------
        const match = props.options.find(
            (item) => String(item[props.labelKey]) === String(value)
        );

        if (match) {
            emits('update:modelValue', match[props.labelKey]);
            emits('change', match[props.labelKey]);
        } else {
            emits('update:modelValue', value);
            emits('change', value);
        }
    }

    hasSelected = false;
};
</script>
