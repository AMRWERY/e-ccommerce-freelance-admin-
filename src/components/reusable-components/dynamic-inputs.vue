<template>
    <div>
        <Form v-slot="{ errors }">
            <div class="my-4">
                <label :for="id"
                    :class="['block mb-1 text-sm font-medium text-gray-700', errors[name] ? 'text-red-600' : 'text-slate-700']">
                    {{ label }}
                    <span v-if="required" class="text-red-600">*</span>
                </label>

                <div class="relative w-full">
                    <!-- prefix-icon -->
                    <span v-if="prefixIcon && type !== 'textarea'"
                        :class="['absolute inset-y-0 flex items-center text-gray-400 start-3 hover:text-gray-600', errors[name] ? 'text-red-600' : 'text-slate-400']">
                        <iconify-icon :icon="prefixIcon" width="20" height="20"></iconify-icon>
                    </span>

                    <!-- textarea -->
                    <template v-if="type === 'textarea'">
                        <div class="relative">
                            <span v-if="prefixIcon" class="absolute text-gray-400 pointer-events-none top-2 start-3">
                                <iconify-icon :icon="prefixIcon" width="20" height="20"></iconify-icon>
                            </span>
                            <Field as="textarea" :name="name" :placeholder="placeholder" :id="id"
                                v-model="internalValue" :rules="rules" rows="5"
                                class="w-full px-3 py-2 transition duration-300 bg-transparent border rounded-md shadow-sm ps-10 placeholder:text-slate-400 text-slate-700 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow"
                                :class="errors[name] ? 'border-red-600' : 'border-slate-200'" />
                        </div>
                    </template>

                    <!-- input -->
                    <template v-else>
                        <Field :type="showPassword ? 'text' : type" :name="name" :placeholder="placeholder" :id="id"
                            v-model="internalValue" :rules="rules" :class="[
                                'w-full px-3 py-2 transition duration-300 bg-transparent border rounded-md shadow-sm placeholder:text-slate-400 text-slate-700 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow ps-9',
                                errors[name] ? 'border-red-600' : 'border-slate-200'
                            ]" />
                    </template>

                    <!-- Eye icon -->
                    <span v-if="type === 'password'" @click="togglePassword"
                        class="absolute inset-y-0 flex items-center text-gray-400 cursor-pointer end-3 hover:text-gray-600">
                        <iconify-icon :icon="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" width="20"
                            height="20"></iconify-icon>
                    </span>
                </div>

                <!-- error messages -->
                <div class="mt-1">
                    <span class="font-medium text-red-600">{{ errors[name] }}</span>
                </div>
            </div>
        </Form>
    </div>
</template>

<script setup>
import { Field, Form } from 'vee-validate';

const props = defineProps({
    modelValue: {
        type: [String, Number],
    },
    label: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'text',
    },
    placeholder: {
        type: String,
        default: ''
    },
    id: {
        type: String,
        default: () => `input-${Math.random().toString(36).substr(2, 9)}`
    },
    rules: {
        type: [Object, String],
        default: () => { },
    },
    errors: {
        type: [Object, String],
        default: () => { },
    },
    required: {
        type: Boolean,
        default: false
    },
    prefixIcon: {
        type: String,
        default: null
    }
});

const emit = defineEmits(['update:modelValue']);

const internalValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

// Password visibility toggle
const showPassword = ref(false);

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};
</script>