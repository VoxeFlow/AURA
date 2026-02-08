const MASTER_AI_KEY = import.meta.env.VITE_OPENAI_API_KEY;

class OpenAIService {
    async generateSuggestion({ clientName, history, briefing, extraContext = "" }) {
        const openaiKey = MASTER_AI_KEY;
        if (!openaiKey) {
            console.error("AURA: OpenAI API Key missing in environment variables");
            return "⚠️ ERRO: Chave da OpenAI não configurada no Cloudflare (VITE_OPENAI_API_KEY).";
        }

        const historyPrompt = typeof history === 'string' ? history : (Array.isArray(history) ? history.slice(-10).map(m => `${m.isMe ? 'Vendedor' : 'Cliente'}: ${m.text}`).join('\n') : "");

        // Extract last 3 messages for better context
        const recentMessages = historyPrompt.split('\n').slice(-6).join('\n');
        const lastClientMsg = historyPrompt.split('\n').filter(line => line.startsWith('Cliente:')).pop() || "";

        const systemPrompt = `
Você é um consultor de vendas EXPERT. Sua missão é converter leads em agendamentos.

CONTEXTO DO NEGÓCIO:
${briefing}

${extraContext ? `INFORMAÇÃO TÉCNICA RELEVANTE:\n${extraContext}\n` : ''}

HISTÓRICO RECENTE DA CONVERSA:
${recentMessages}

ÚLTIMA MENSAGEM DO CLIENTE:
${lastClientMsg}

INTELIGÊNCIA DE RESPOSTA - SIGA RIGOROSAMENTE:

1. ANÁLISE DE CONTEXTO:
   - Leia TODO o histórico, não apenas a última mensagem
   - Identifique o ESTÁGIO da conversa (primeiro contato, dúvida, objeção, pronto para agendar)
   - Detecte EMOÇÕES (ansiedade, urgência, desconfiança, empolgação)

2. REGRAS DE OURO:
   - MÁXIMO 2-3 linhas (WhatsApp é rápido!)
   - Use o NOME do cliente quando apropriado (${clientName !== 'Cliente' ? clientName : 'mas evite "Cliente" genérico'})
   - NUNCA repita informações já ditas
   - NUNCA dê valores exatos (sempre "varia conforme o caso")
   - SEMPRE conduza para AGENDAMENTO

3. ESTRATÉGIAS POR ESTÁGIO:
   
   A) PRIMEIRO CONTATO / DÚVIDA INICIAL:
      - Seja acolhedor e mostre interesse genuíno
      - Faça UMA pergunta qualificadora
      - Exemplo: "Oi! Que bom que você entrou em contato. Você já tem alguma urgência ou está buscando melhorar algo específico?"
   
   B) OBJEÇÃO DE PREÇO:
      - NUNCA dê valor direto
      - Foque no VALOR (qualidade, resultado, tecnologia)
      - Redirecione para avaliação gratuita
      - Exemplo: "O investimento varia bastante conforme o caso. Que tal fazer uma avaliação sem custo? Assim você sai com um plano personalizado e o valor exato."
   
   C) OBJEÇÃO DE CONVÊNIO:
      - Seja direto mas ofereça solução
      - Destaque facilidades de pagamento
      - Exemplo: "Não trabalhamos com convênio, mas temos parcelamento facilitado em até 24x. Prefere agendar e ver as condições?"
   
   D) PRONTO PARA AGENDAR:
      - Seja DIRETO e objetivo
      - Ofereça opções de horário
      - Exemplo: "Perfeito! Temos horários amanhã de manhã ou na quinta à tarde. Qual funciona melhor?"

4. TOM E ESTILO:
   - Natural e humano (como se fosse um amigo profissional)
   - Confiante mas não arrogante
   - Empático com as preocupações
   - Máximo 1 emoji por mensagem (use com sabedoria)

5. PROIBIDO:
   - Frases robóticas ("Claro, Cliente!")
   - Jargões técnicos desnecessários
   - Textos longos (mais de 3 linhas)
   - Repetir informações já ditas
   - Ser vago ou genérico

AGORA GERE A MELHOR RESPOSTA POSSÍVEL. Apenas a resposta, sem explicações.
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
                        { role: 'user', content: 'Gere a melhor resposta estratégica para a última mensagem do cliente.' }
                    ],
                    temperature: 0.85,
                    max_tokens: 200
                })
            });

            const data = await response.json();
            if (data.error) {
                console.error("AURA AI Proxy Error:", data.error);
                return null;
            }

            return data.choices[0].message.content.trim();
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
