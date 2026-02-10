const MASTER_AI_KEY = import.meta.env.VITE_OPENAI_API_KEY;

class OpenAIService {
    async generateSuggestion({ clientName, history, briefing, extraContext = "" }) {
        const openaiKey = MASTER_AI_KEY;
        const systemPrompt = `
Você é o Especialista de Vendas AURA v10 da VoxeFlow. Sua missão não é apenas responder, mas CONECTAR e CONVERTER através de uma comunicação humana, empática e estrategicamente brilhante.

BASE DE CONHECIMENTO DO NEGÓCIO (SANTUÁRIO DE VERDADE):
${briefing}

${extraContext ? `DADOS TÉCNICOS DO ESPECIALISTA (RAG): ${extraContext}` : ''}

🚨 PROIBIÇÕES ABSOLUTAS (LEIA COM ATENÇÃO):
1. NUNCA diga "não sei", "não tenho essa informação" ou "vou verificar".
2. SE a informação não estiver na "BASE DE CONHECIMENTO", você É OBRIGADO a usar a tag [KNOWLEDGE_GAP].
3. NÃO invente preços ou marcas.

DIRETRIZES DE COMUNICAÇÃO ELITE:
1. 🤝 RAPPORT & CALIBRAGEM: Identifique e espelhe o tom do cliente.
2. 🧠 SPIN SELLING: Use Situação, Problema, Implicação, Necessidade.
3. 🖋️ HUMAN-FIRST: Seja gentil e termine com pergunta.
`.trim();

        // 1. Prepare Messages
        const messages = [{ role: 'system', content: systemPrompt }];
        if (Array.isArray(history)) messages.push(...history);
        messages.push({
            role: 'user',
            content: `Gere uma resposta calorosa, humana e profissional para ${clientName}.
            
            🧠 PROTOCOLO DE LACUNA (OBRIGATÓRIO):
            Se o cliente perguntou algo que NÃO está na Base de Conhecimento, RESPONDA APENAS:
            [KNOWLEDGE_GAP: {Sua pergunta curta para o dono do negócio}]

            Exemplo:
            Cliente: "Aceita Bitcoin?"
            Base: (Não diz nada sobre Bitcoin)
            Sua Resposta: [KNOWLEDGE_GAP: Aceitamos Bitcoin ou criptomoedas?]`
        });

        const payload = {
            model: 'gpt-4o',
            messages: messages,
            temperature: 0.5,
            max_tokens: 350
        };

        // HYBRID STRATEGY: Try Proxy first, then Direct Fallback
        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                if (!data.error) {
                    let result = data.choices[0].message.content.trim();
                    return result.replace(/^(Empresa|Aura|Vendedor|Assistant|Atendente):\s*/i, '');
                }
            }
            throw new Error(`Proxy failed: ${response.status}`);
        } catch (proxyError) {
            console.warn("AURA: Proxy failed, attempting direct client-side fallback...", proxyError);
            if (openaiKey) {
                try {
                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${openaiKey}`
                        },
                        body: JSON.stringify(payload)
                    });
                    const data = await response.json();
                    if (!data.error) {
                        return data.choices[0].message.content.trim();
                    }
                } catch (directError) {
                    console.error("AURA: Direct fallback also failed.", directError);
                }
            }
            return null;
        }
    }

    async enhanceMessage(text, context = {}) {
        const openaiKey = MASTER_AI_KEY;
        const systemPrompt = `
            Você é o Consultor de Vendas Sênior da AURA. Refine a mensagem para ser mais humana, persuasiva e aplicar SPIN Selling.
            CONTEXTO: ${context.briefing || 'Empresa de Alto Padrão'}
            RETORNE APENAS O TEXTO FINAL.
            `.trim();

        const payload = {
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: text }
            ],
            temperature: 0.7,
            max_tokens: 300
        };

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const data = await response.json();
                return data.choices[0].message.content.trim();
            }
            throw new Error(`Proxy failed: ${response.status}`);
        } catch (e) {
            if (openaiKey) {
                try {
                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${openaiKey}`
                        },
                        body: JSON.stringify(payload)
                    });
                    const data = await response.json();
                    return data.choices[0].message.content.trim();
                } catch (dE) { return text; }
            }
            return text;
        }
    }

    async analyzeNextSteps(chatHistory, patientName, currentTag) {
        const openaiKey = MASTER_AI_KEY;
        // Skip check here to try proxy first

        const systemPrompt = `
            Você é consultor de vendas EXPERT. Analise a conversa e sugira 2-3 passos PRÁTICOS.
            HISTÓRICO: ${chatHistory}
            RETORNE JSON: { "steps": [], "priority": "high|medium|low", "reasoning": "" }
            `.trim();

        const payload = {
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'Analise e sugira os próximos passos.' }
            ],
            temperature: 0.7,
            max_tokens: 300,
            response_format: { type: "json_object" }
        };

        const fallbackError = {
            steps: ['Revisar conversa manualmente'],
            priority: 'medium',
            reasoning: 'Erro na análise automática'
        };

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const data = await response.json();
                return JSON.parse(data.choices[0].message.content);
            }
            throw new Error("Proxy error");
        } catch (e) {
            if (openaiKey) {
                try {
                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${openaiKey}`
                        },
                        body: JSON.stringify(payload)
                    });
                    const data = await response.json();
                    return JSON.parse(data.choices[0].message.content);
                } catch (dE) { return fallbackError; }
            }
            return fallbackError;
        }
    }

    async generateNextBriefingQuestion(currentAnswers) {
        const openaiKey = MASTER_AI_KEY; // Fallback key
        const systemPrompt = `Você é o Arquiteto de Inteligência da AURA. Entreviste o dono do negócio. Conhecido: ${JSON.stringify(currentAnswers)}. Faça UMA pergunta por vez. Se acabar, diga COMPLETE.`;

        const payload = {
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'Gere a próxima pergunta ou COMPLETE.' }
            ],
            temperature: 0.7,
            max_tokens: 150
        };

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const data = await response.json();
                return data.choices?.[0]?.message?.content?.trim();
            }
            throw new Error('Proxy fail');
        } catch (e) {
            if (openaiKey) {
                try {
                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${openaiKey}`
                        },
                        body: JSON.stringify(payload)
                    });
                    const data = await response.json();
                    return data.choices?.[0]?.message?.content?.trim();
                } catch (dE) { return "Algum outro detalhe importante?"; }
            }
            return "Algum outro detalhe importante?";
        }
    }

    async analyzeKnowledgePoint(question, answer) {
        const openaiKey = MASTER_AI_KEY;
        const systemPrompt = `Analise este ponto de conhecimento para vendas. Resposta curta (2 linhas).`;
        const payload = {
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Pergunta: ${question}\nResposta: ${answer}` }
            ],
            temperature: 0.5,
            max_tokens: 100
        };

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const data = await response.json();
                return data.choices?.[0]?.message?.content?.trim();
            }
            throw new Error("Proxy fail");
        } catch (e) {
            if (openaiKey) {
                try {
                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${openaiKey}`
                        },
                        body: JSON.stringify(payload)
                    });
                    const data = await response.json();
                    return data.choices?.[0]?.message?.content?.trim();
                } catch (dE) { return "Ponto estratégico validado."; }
            }
            return "Ponto estratégico validado.";
        }
    }
}

export default new OpenAIService();
