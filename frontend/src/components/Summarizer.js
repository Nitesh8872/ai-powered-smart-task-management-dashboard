import { showToast } from '../utils/toast.js';
import { fetchWithAuth } from '../api/apiClient.js';
import { apiUrl } from '../config.js';

export class Summarizer {
    constructor() {
        this.container = document.getElementById('summarizer-container');
        if (this.container) {
            this.render();
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="summarizer-grid">
                <div class="card-container glass">
                    <div class="card-header">
                        <span><i class="fa-solid fa-file-lines"></i> Input Content</span>
                        <button class="btn-outline" id="clear-summarizer">Clear</button>
                    </div>
                    <textarea id="summarizer-input" placeholder="Paste your notes, lecture transcript, or assignment description here..." style="min-height: 300px; width: 100%; background: rgba(0,0,0,0.05); border: 1px solid var(--border-color); border-radius: 12px; padding: 15px; color: var(--text-main); font-family: inherit; resize: vertical;"></textarea>
                    <button class="btn-primary" id="btn-summarize" style="margin-top: 20px;">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> Generate AI Summary
                    </button>
                </div>
                
                <div class="card-container glass">
                    <div class="card-header">
                        <span><i class="fa-solid fa-sparkles"></i> AI Result</span>
                    </div>
                    <div id="summarizer-output" class="summarizer-output-content">
                        <div style="text-align: center; padding: 50px; color: var(--text-muted);">
                            <i class="fa-solid fa-robot" style="font-size: 48px; opacity: 0.2; margin-bottom: 20px;"></i>
                            <p>Paste text on the left to generate an AI summary with key takeaways.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.input = document.getElementById('summarizer-input');
        this.output = document.getElementById('summarizer-output');
        this.summarizeBtn = document.getElementById('btn-summarize');
        this.clearBtn = document.getElementById('clear-summarizer');

        this.summarizeBtn.addEventListener('click', () => this.handleSummarize());
        this.clearBtn.addEventListener('click', () => {
            this.input.value = '';
            this.resetOutput();
        });
    }

    resetOutput() {
        this.output.innerHTML = `
            <div style="text-align: center; padding: 50px; color: var(--text-muted);">
                <i class="fa-solid fa-robot" style="font-size: 48px; opacity: 0.2; margin-bottom: 20px;"></i>
                <p>Paste text on the left to generate an AI summary with key takeaways.</p>
            </div>
        `;
    }

    async handleSummarize() {
        const text = this.input.value.trim();
        if (text.length < 50) {
            showToast("Please provide at least 50 characters for a meaningful summary.", "warning");
            return;
        }

        this.output.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <div class="spinner" style="margin: 0 auto 20px;"></div>
                <p>AI is analyzing your content...</p>
            </div>
        `;
        this.summarizeBtn.disabled = true;

        try {
            const response = await fetchWithAuth(apiUrl('/ai/summarize'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || `Server error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.summary) {
                this.renderResult(data);
            } else {
                showToast("Failed to generate summary. Please try again.", "error");
                this.resetOutput();
            }
        } catch (error) {
            console.error('Summarize error:', error);
            showToast(error.message || "Error connecting to AI service", "error");
            this.resetOutput();
        } finally {
            this.summarizeBtn.disabled = false;
        }
    }

    renderResult(data) {
        let takeawaysHTML = data.takeaways.map(t => `<li><i class="fa-solid fa-check" style="color: var(--success); margin-right: 10px;"></i> ${t}</li>`).join('');
        
        this.output.innerHTML = `
            <div class="result-fade-in">
                <div style="margin-bottom: 25px;">
                    <h4 style="font-size: 14px; color: var(--primary-color); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Summary</h4>
                    <p style="line-height: 1.6; font-size: 15px;">${data.summary}</p>
                </div>
                <div>
                    <h4 style="font-size: 14px; color: var(--primary-color); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Key Takeaways</h4>
                    <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px;">
                        ${takeawaysHTML}
                    </ul>
                </div>
                <button class="btn-outline" style="margin-top: 30px; width: 100%;" onclick="window.print()">
                    <i class="fa-solid fa-print"></i> Save as PDF
                </button>
            </div>
        `;
    }
}
