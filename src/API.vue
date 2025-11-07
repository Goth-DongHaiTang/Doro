<script setup lang="ts">
import { ref } from 'vue';
import { sendToDeepseek } from './API';

const command = ref('');
const text = ref('');
const apiKey = ref('你的DEEPSEEK_API_KEY'); // 测试用

async function sendMessage() {
    if (!command.value) return;
    const reply = await sendToDeepseek(command.value, apiKey.value);
    text.value += `\nAI: ${reply}`;
    command.value = '';
}
</script>

<template>
    <div class="p-4">
        <textarea v-model="text" rows="6" class="w-full mb-2 border p-2" readonly></textarea>
        <input v-model="command" placeholder="输入消息" class="w-full mb-2 border p-2" @keyup.enter="sendMessage" />
        <button @click="sendMessage" class="px-4 py-2 bg-blue-500 text-white rounded">发送</button>
    </div>
</template>
