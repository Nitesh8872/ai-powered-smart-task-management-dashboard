/**
 * AI Service to handle interactions with Large Language Models
 * Currently supports simulated responses for development.
 * Can be easily extended to use Gemini API or OpenAI.
 */

class AIService {
    async generateResponse(prompt, context = {}) {
        console.log('AI Service generating response for:', prompt);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const tasks = context.tasks || [];
        const userName = context.user?.name || 'Student';
        const lowerPrompt = prompt.toLowerCase();
        
        if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi')) {
            return `Hello ${userName}! I'm your SmartDesk AI Assistant. You have ${tasks.filter(t => !t.completed).length} pending tasks. How can I help you today?`;
        }
        
        if (lowerPrompt.includes('task') || lowerPrompt.includes('todo')) {
            if (tasks.length > 0) {
                const pending = tasks.filter(t => !t.completed);
                if (pending.length > 0) {
                    return `You have ${pending.length} pending tasks. Your highest priority one is "${pending.sort((a,b) => (a.priority === 'High' ? -1 : 1))[0].title}". Would you like me to help you plan it?`;
                }
                return "You've completed all your tasks! Great job. Ready to add some new ones?";
            }
            return "You don't have any tasks yet. Would you like to create your first task?";
        }

        if (lowerPrompt.includes('summarize')) {
            return "I'm ready to summarize! Please paste the text you'd like me to condense in the AI Lab view.";
        }

        if (lowerPrompt.includes('who are you')) {
            return "I am the SmartDesk AI Assistant, designed to help you stay organized and productive in your academic journey.";
        }

        return `That's an interesting question, ${userName}. Since I'm in simulation mode, I recommend checking your "${tasks[0]?.title || 'tasks'}" for more details. Is there anything else I can help with?`;
    }


    async summarizeText(text) {
        if (!text || text.length < 10) return "Please provide more text to summarize.";
        
        await new Promise(resolve => setTimeout(resolve, 2000));

        const keyTakeaways = [
            "Focus on the core concepts discussed in the first half.",
            "Review the practical examples provided at the end.",
            "Ensure you understand the relationship between the main variables."
        ];

        return {
            summary: `This text discusses the fundamental principles of the subject matter, emphasizing the importance of consistent practice and conceptual clarity.`,
            takeaways: keyTakeaways
        };
    }
}

module.exports = new AIService();
