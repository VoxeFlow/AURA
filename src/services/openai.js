const MASTER_AI_KEY = import.meta.env.VITE_OPENAI_API_KEY;

class OpenAIService {
    async generateSuggestion({ clientName, history, briefing, extraContext = "" }) {
        const openaiKey = MASTER_AI_KEY;
        if (!openaiKey) {
            console.error("AURA: OpenAI API Key missing");
            return "⚠️ ERRO: Chave da OpenAI não configurada.";
        }

        const systemPrompt = `
Você é o Orquestrador da AURA, o mecanismo de vendas v1.2.0 da VoxeFlow. Sua missão não é apenas responder, é CONVERTER leads em clientes apaixonados com o "Fator UAU".

PODER DE PERSUASÃO (A TÉCNICA):
1. GATILHO DO VALOR: Nunca fale de preço ou agendamento sem antes elevar o valor percebido. Use frases que tragam autoridade (ex: "Trabalhamos com a tecnologia X que garante um resultado Y...").
2. O "PULO DO GATO" (WOW FACTOR): Sua resposta deve ter uma frase de impacto que "desmonte" a hesitação do cliente. Se ele quer preço, mostre que o prejuízo de não fazer é maior que o custo de fazer.
3. FECHAMENTO IRRESISTÍVEL: Termine com uma pergunta de baixo atrito que conduza ao agendamento (ex: "Faz sentido para você darmos esse primeiro passo e garantirmos que seu sorriso fique perfeito?").
4. ROTAÇÃO DE ARGUMENTO: Se o cliente insistiu, mude a abordagem. Se falou de lógica, vá para a emoção. Se falou de medo, vá para a segurança técnica.
5. ZERO CLICHÊ: Nada de "estamos à disposição". Seja o dono do negócio: decidido, cordial e altamente consultivo.

DIRETRIZES TÁTICAS:
- Mantenha a resposta HUMANIZADA e RÁPIDA (WhatsApp Style).
- SEM RÓTULOS (Empresa:, Aura:).
- Máximo 3 linhas, mas com "punch" em cada palavra.

CONTEXTO: ${briefing}
${extraContext ? `DADOS TÉCNICOS: ${extraContext}` : ''}
        `.trim();

        // 1. Prepare Messages
        const messages = [
            { role: 'system', content: systemPrompt }
        ];

        // 2. Add History
        if (Array.isArray(history)) {
            messages.push(...history);
        }

        // 3. Force final command
        messages.push({
            role: 'user',
            content: 'Gere a melhor resposta para a última mensagem acima. Seja direto, sem saudações e sem repetir o que já foi dito nas mensagens anteriores da Empresa.'
        });

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: messages,
                    temperature: 0.9,
                    max_tokens: 300
                })
            });

            const data = await response.json();
            if (data.error) {
                console.error("AURA AI Proxy Error:", data.error);
                return null;
            }

            let result = data.choices[0].message.content.trim();
            // Final sanitize: Remove any labels the AI might have hallucinated
            result = result.replace(/^(Empresa|Aura|Vendedor|Assistant):\s*/i, '');

            return result;
        } catch (e) {
            console.error("AURA AI Proxy Fetch Error:", e);
            return null;
        }
    }

    async enhanceMessage(text, context = {}) {
        const openaiKey = MASTER_AI_KEY;
        if (!openaiKey || !text.trim()) return text;

        const systemPrompt = `
Você é um redator de vendas EXPERT e assistente de comunicação profissional. Sua missão é transformar o rascunho ou instrução do usuário em uma mensagem de WhatsApp impecável, persuasiva e humana.

CONTEXTO DO NEGÓCIO:
${context.briefing || 'Empresa de Alto Padrão'}

OBJETIVO:
Você deve agir de duas formas, dependendo do que o usuário enviar:

1. SE FOR UM RASCUNHO (Texto incompleto, com erros ou mal escrito):
   - Corrija ortografia, gramática e pontuação.
   - Melhore a fluidez e o tom (mantenha profissional mas próximo).
   - Não adicione informações que não estão lá, apenas "limpe" e "brilhe" o texto.

2. SE FOR UMA INSTRUÇÃO (Ex: "diga que não aceitamos convenio mas damos desconto"):
   - Entenda a INTENÇÃO do usuário.
   - Crie uma frase COMPLETA, elegante e profissional baseada no contexto.
   - Use gatilhos de empatia e conduza para o próximo passo.

REGRAS DE OURO:
- MÁXIMO 3 linhas.
- Naturalidade total (nada de "Caro cliente" ou tons robóticos).
- Vá direto ao ponto.
- Preserve a essência da mensagem.

RETORNE APENAS O TEXTO FINAL DA MENSAGEM, sem explicações, sem aspas, sem comentários.
        `.trim();

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4o', // Using GPT-4o for better intent detection
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: text }
                    ],
                    temperature: 0.7,
                    max_tokens: 300
                })
            });

            const data = await response.json();
            if (data.error) {
                console.error("AURA AI Proxy Error:", data.error);
                return text;
            }

            return data.choices[0].message.content.trim();
        } catch (e) {
            console.error("AURA AI Proxy Fetch Error:", e);
            return text;
        }
    }

    async analyzeNextSteps(chatHistory, patientName, currentTag) {
        const openaiKey = MASTER_AI_KEY;
        if (!openaiKey) {
            return {
                steps: ['Configure OpenAI API key'],
                priority: 'medium',
                reasoning: 'API key não configurada'
            };
        }

        const systemPrompt = `
Você é um consultor de vendas EXPERT em orquestração de negócios.

CONTEXTO:
- Cliente: ${patientName}
- Estágio Atual: ${currentTag}

HISTÓRICO DA CONVERSA:
${chatHistory}

MISSÃO: Analise a conversa e sugira os próximos 2-3 passos ESPECÍFICOS e ACIONÁVEIS para converter este lead.

REGRAS:
1. Seja ESPECÍFICO (não genérico como "fazer follow-up")
2. Considere o estágio atual do funil
3. Priorize ações que movem o lead para o próximo estágio
4. Seja PRÁTICO (ações que podem ser feitas hoje)

EXEMPLOS DE BONS PASSOS:
- "Enviar vídeo explicativo sobre implante dentário via WhatsApp"
- "Ligar hoje às 15h para esclarecer dúvida sobre convênio"
- "Enviar proposta personalizada com 3 opções de pagamento"

RETORNE EM JSON:
{
  "steps": ["Passo 1", "Passo 2", "Passo 3"],
  "priority": "high|medium|low",
  "reasoning": "Breve explicação da prioridade"
}
        `.trim();

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: 'Analise e sugira os próximos passos.' }
                    ],
                    temperature: 0.7,
                    max_tokens: 300,
                    response_format: { type: "json_object" }
                })
            });

            const data = await response.json();

            if (data.error) {
                console.error('OpenAI API Error:', data.error);
                return {
                    steps: ['Revisar conversa manualmente'],
                    priority: 'medium',
                    reasoning: 'Erro na análise automática'
                };
            }

            const result = JSON.parse(data.choices[0].message.content);
            return result;
        } catch (error) {
            console.error('Error analyzing next steps:', error);
            return {
                steps: ['Revisar conversa manualmente'],
                priority: 'medium',
                reasoning: 'Erro na análise automática'
            };
        }
    }
}

export default new OpenAIService();
