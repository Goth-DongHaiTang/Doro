<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { sendToDeepseek } from './API';

// 页面数据
const command = ref('');
const messages = ref<{ role: 'user' | 'ai'; content: string }[]>([]);
const apiKey = ref(localStorage.getItem('deepseek_api_key') || '');

// 聊天区滚动
const chatContainer = ref<HTMLElement | null>(null);
async function scrollToBottom() {
    await nextTick();
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
}

// 发送消息
async function sendMessage() {
    if (!command.value) return;

    // 用户消息
    messages.value.push({ role: 'user', content: command.value });
    // AI loading
    messages.value.push({ role: 'ai', content: '…正在生成回答…' });
    await scrollToBottom();

    try {
        const reply = await sendToDeepseek(command.value, apiKey.value);
        // 替换 loading
        messages.value[messages.value.length - 1].content = reply;
    } catch (e) {
        messages.value[messages.value.length - 1].content =
            '请求失败，请检查 API Key 或网络';
        console.error(e);
    }

    command.value = '';
    await scrollToBottom();
}

// 侧边栏状态
const showSidebar = ref(false);
function toggleSidebar() {
    showSidebar.value = !showSidebar.value;
}

// 保存 API Key
function saveApiKey() {
    localStorage.setItem('deepseek_api_key', apiKey.value);
    toggleSidebar();
}
</script>

<template>
    <main class="relative flex flex-col items-center justify-start min-h-screen p-8"
        style="background-image: linear-gradient(135deg, #a8d8ea, #fcbad3);">
        <!-- 遮罩层 -->
        <div v-if="showSidebar" @click="toggleSidebar" class="fixed inset-0 bg-black bg-opacity-20 z-20"></div>

        <!-- 右上角设置按钮 -->
        <button @click="toggleSidebar"
            class="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors z-30">
            设置
        </button>

        <!-- 左上角头像 -->
        <img src="D:\DEV\tauri\Doro\src\satou.png" class="absolute top-4 left-4 w-16 h-16 z-30" />

        <!-- 侧边栏 -->
        <div :class="[
            'fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 overflow-y-auto',
            showSidebar ? 'translate-x-0' : 'translate-x-full'
        ]">
            <h2 class="p-4 font-bold border-b">设置</h2>
            <div class="p-4 flex flex-col">
                <label class="block mb-2 font-medium">Deepseek API Key</label>
                <input type="password" v-model="apiKey" placeholder="请输入API Key"
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:shadow-sm" />
                <button class="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" @click="saveApiKey">
                    保存
                </button>
                <button class="mt-4 px-4 py-2 bg-red-300 rounded hover:bg-red-400" @click="toggleSidebar">
                    关闭侧边栏
                </button>
            </div>
        </div>

        <!-- 聊天区 -->
        <div ref="chatContainer" class="w-full max-w-md flex-1 overflow-y-auto p-2 border border-gray-300 rounded mb-4"
            style="height: 400px; background: rgba(255,255,255,0.3); backdrop-filter: blur(10px);">
            <div v-for="(msg, idx) in messages" :key="idx"
                :class="{ 'text-right': msg.role === 'user', 'text-left': msg.role === 'ai' }">
                <div :class="[
                    'inline-block p-2 rounded my-1 max-w-[80%]',
                    msg.role === 'user' ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-800'
                ]">
                    {{ msg.content }}
                </div>
            </div>
        </div>

        <!-- 命令行输入 -->
        <div class="flex w-full max-w-md">
            <input v-model="command" placeholder="> 输入消息" @keyup.enter="sendMessage"
                class="flex-1 p-3 border border-gray-300 rounded-l focus:outline-none focus:border-blue-500 focus:shadow-sm" />
            <button @click="sendMessage"
                class="px-4 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition-colors">
                发送
            </button>
        </div>

        <!-- 页面底部图片 -->
        <img id="satou" src="https://img.moegirl.org.cn/common/thumb/3/30/Satou1.png/400px-Satou1.png" alt="笨蛋"
            class="mt-6 w-40" />
    </main>
</template>

<style scoped>
textarea:focus,
input:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
}
</style>
