import { state } from '../state/appState.js';
import { fetchWithAuth } from '../api/apiClient.js';
import { apiUrl } from '../config.js';


export class AIChatbot {
    constructor() {
        console.log('AIChatbot initializing...');
        this.container = document.getElementById('ai-chatbot-container');
        this.messages = [];
        this.isTyping = false;
        
        if (this.container) {
            console.log('AIChatbot container found, setting up UI');
            this.setupUI();
            this.addWelcomeMessage();
        } else {
            console.error('AIChatbot container NOT found!');
        }
    }


    setupUI() {
        this.container.innerHTML = `
            <div class="ai-chat-header">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="ai-avatar-small"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
                    <div>
                        <h4 style="font-size: 14px;">Smart Assistant</h4>
                        <span style="font-size: 10px; opacity: 0.7;">AI Productivity Companion</span>
                    </div>
                </div>
                <button class="ai-chat-close"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="ai-chat-messages" id="ai-chat-messages"></div>
            <div class="ai-chat-input-area">
                <input type="text" id="ai-chat-input" placeholder="Ask me anything...">
                <button id="ai-chat-send"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        `;

        this.msgContainer = document.getElementById('ai-chat-messages');
        this.input = document.getElementById('ai-chat-input');
        this.sendBtn = document.getElementById('ai-chat-send');
        this.closeBtn = this.container.querySelector('.ai-chat-close');

        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        this.closeBtn.addEventListener('click', () => this.toggle());
    }

    addWelcomeMessage() {
        const name = state.user.name || 'Student';
        const pendingTasks = state.tasks ? state.tasks.filter(t => !t.completed).length : 0;
        let welcomeText = `Hi ${name}! I'm your AI productivity assistant. `;
        
        if (pendingTasks > 0) {
            welcomeText += `You have ${pendingTasks} tasks to tackle today. How can I help you get started?`;
        } else {
            welcomeText += `Your schedule looks clear! Want to plan something new?`;
        }
        
        this.addMessage(welcomeText, 'ai');
    }


    toggle() {
        this.container.classList.toggle('show');
        if (this.container.classList.contains('show')) {
            this.input.focus();
        }
    }

    addMessage(text, sender) {
        this.messages.push({ text, sender });
        const msgEl = document.createElement('div');
        msgEl.className = `ai-msg ${sender}`;
        msgEl.innerHTML = `<div class="ai-msg-bubble">${text}</div>`;
        this.msgContainer.appendChild(msgEl);
        this.msgContainer.scrollTop = this.msgContainer.scrollHeight;
    }

    async sendMessage() {
        const text = this.input.value.trim();
        if (!text || this.isTyping) return;

        this.addMessage(text, 'user');
        this.input.value = '';
        this.showTypingIndicator();

        try {
            const response = await fetchWithAuth(apiUrl('/ai/chat'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    prompt: text,
                    context: {
                        tasks: state.tasks,
                        user: state.user
                    }
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || `Server error: ${response.status}`);
            }

            const data = await response.json();
            this.hideTypingIndicator();

            if (data.response) {
                this.addMessage(data.response, 'ai');
            } else {
                this.addMessage("Sorry, I received an unexpected response. Please try again.", 'ai');
            }
        } catch (error) {
            console.error('AI Chat Error:', error);
            this.hideTypingIndicator();
            this.addMessage(`⚠️ ${error.message || "I encountered an error while communicating with the AI service. Please try again."}`, 'ai');
        }

    }

    showTypingIndicator() {
        this.isTyping = true;
        const indicator = document.createElement('div');
        indicator.className = 'ai-msg ai typing-indicator';
        indicator.id = 'ai-typing-indicator';
        indicator.innerHTML = `
            <div class="ai-msg-bubble">
                <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </div>
        `;
        this.msgContainer.appendChild(indicator);
        this.msgContainer.scrollTop = this.msgContainer.scrollHeight;
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const indicator = document.getElementById('ai-typing-indicator');
        if (indicator) indicator.remove();
    }
}
