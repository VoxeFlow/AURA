import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Save, Sparkles, Brain, Edit2, Check, RefreshCw, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';

const BriefingModal = ({ isOpen, onClose }) => {
    const { briefing, knowledgeBase, setConfig, setKnowledgeBase } = useStore();
    const [view, setView] = useState('dashboard'); // interview, dashboard
    const [status, setStatus] = useState('idle');
    const [currentQuestion, setCurrentQuestion] = useState("Para começarmos: Qual o nome da sua empresa e o que exatamente vocês fazem?");
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [tempAnswer, setTempAnswer] = useState("");

    // Initialize view based on data presence
    useEffect(() => {
        if (isOpen) {
            if (!knowledgeBase || knowledgeBase.length === 0) {
                setView('interview');
            } else {
                setView('dashboard');
            }
        }
    }, [isOpen, knowledgeBase]);

    if (!isOpen) return null;

    const handleNextInterview = async () => {
        if (!currentAnswer.trim()) return;

        setStatus('thinking');
        try {
            const { default: OpenAIService } = await import('../services/openai');

            // 1. Generate strategic analysis for this point
            const analysis = await OpenAIService.analyzeKnowledgePoint(currentQuestion, currentAnswer);

            const newItem = {
                id: Date.now(),
                q: currentQuestion,
                a: currentAnswer,
                analysis
            };

            const currentKB = knowledgeBase || [];
            const newKB = [...currentKB, newItem];
            setKnowledgeBase(newKB);
            setCurrentAnswer("");

            // 2. Decide next question
            const nextQ = await OpenAIService.generateNextBriefingQuestion(newKB);

            if (nextQ.includes("COMPLETE") || newKB.length >= 10) {
                setStatus('idle');
                setView('dashboard');
                syncBriefingText(newKB);
            } else {
                setCurrentQuestion(nextQ);
                setStatus('idle');
            }
        } catch (e) {
            console.error("AURA: Error in interview step", e);
            setStatus('idle');
        }
    };

    const syncBriefingText = (kb) => {
        const currentKB = kb || [];
        const text = currentKB.map(h => `[P]: ${h.q}\n[R]: ${h.a}`).join('\n\n');
        setConfig({ briefing: text });
    };

    const handleUpdatePoint = async (id) => {
        const currentKB = knowledgeBase || [];
        const point = currentKB.find(k => k.id === id);
        if (!point) return;

        setStatus('thinking');
        try {
            const { default: OpenAIService } = await import('../services/openai');
            const analysis = await OpenAIService.analyzeKnowledgePoint(point.q, tempAnswer);

            const newKB = currentKB.map(item =>
                item.id === id ? { ...item, a: tempAnswer, analysis } : item
            );

            setKnowledgeBase(newKB);
            syncBriefingText(newKB);
            setEditingId(null);
            setStatus('idle');
        } catch (e) {
            setStatus('idle');
        }
    };

    const safeKB = knowledgeBase || [];

    return (
        <div className="modal-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', zIndex: 1000 }}>
            <div className="modal-content glass-panel" style={{ width: '95%', maxWidth: '800px', padding: '0', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>

                <div className="briefing-header" style={{
                    padding: '20px 30px',
                    background: 'linear-gradient(135deg, #1a1a1a, #000000)',
                    borderBottom: '1px solid var(--glass-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ padding: '10px', background: 'rgba(197, 160, 89, 0.1)', borderRadius: '12px' }}>
                            <Brain size={24} color="var(--accent-primary)" />
                        </div>
                        <div>
                            <h2 style={{ color: 'white', margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Cérebro de Inteligência Aura</h2>
                            <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: '10px' }}>Revisão estratégica de conhecimento</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button
                            onClick={() => { if (confirm("Deseja apagar o conhecimento atual e começar uma nova entrevista?")) { setKnowledgeBase([]); setView('interview'); } }}
                            style={{ background: 'transparent', color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.3)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '10px' }}
                        >
                            Reiniciar Treinamento
                        </button>
                        <X size={20} color="white" onClick={onClose} style={{ cursor: 'pointer', opacity: 0.5 }} />
                    </div>
                </div>

                <div className="briefing-body" style={{ padding: '30px', overflowY: 'auto', flex: 1, background: '#0D0D0D' }}>

                    {view === 'interview' ? (
                        <div className="interview-flow" style={{ maxWidth: '600px', margin: '0 auto' }}>
                            {/* ... current interview code ... */}
                            <div className="question-area">
                                <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>Entrevista Aura</span>
                                <h3 style={{ margin: '0 0 25px 0', fontSize: '20px', color: 'white' }}>{status === 'thinking' ? "Processando..." : currentQuestion}</h3>
                                <textarea
                                    autoFocus
                                    value={currentAnswer}
                                    onChange={(e) => setCurrentAnswer(e.target.value)}
                                    placeholder="Escreva aqui..."
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '15px', color: 'white', fontSize: '14px', minHeight: '120px' }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '10px' }}>
                                <button className="btn-primary" onClick={handleNextInterview} disabled={!currentAnswer.trim() || status === 'thinking'}>
                                    {status === 'thinking' ? "Aura Pensando..." : "Próxima Pergunta"} <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="knowledge-dashboard">
                            {safeKB.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                    <Sparkles size={40} color="var(--accent-primary)" style={{ opacity: 0.3, marginBottom: '20px' }} />
                                    <h3 style={{ color: 'white' }}>Nenhum conhecimento registrado</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Para a Aura vender por você, ela precisa conhecer seu negócio.</p>
                                    <button onClick={() => setView('interview')} className="btn-primary" style={{ marginTop: '20px' }}>Começar Treinamento</button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {safeKB.map((point) => (
                                        <div key={point.id} className="knowledge-card glass-panel" style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '16px' }}>
                                            <div style={{ marginBottom: '20px' }}>
                                                <div style={{ color: 'var(--accent-primary)', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Pergunta da IA</div>
                                                <div style={{ color: 'white', fontSize: '15px', fontWeight: '600' }}>{point.q}</div>
                                            </div>

                                            <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: editingId === point.id ? '1px solid var(--accent-primary)' : '1px solid transparent' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>SUA RESPOSTA</div>
                                                    {editingId === point.id ? (
                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                            <button onClick={() => handleUpdatePoint(point.id)} style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer', fontSize: '10px' }}>Salvar</button>
                                                            <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '10px' }}>Cancelar</button>
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => { setEditingId(point.id); setTempAnswer(point.a); }} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                            <Edit2 size={12} /> Editar
                                                        </button>
                                                    )}
                                                </div>
                                                {editingId === point.id ? (
                                                    <textarea
                                                        autoFocus
                                                        value={tempAnswer}
                                                        onChange={e => setTempAnswer(e.target.value)}
                                                        style={{ width: '100%', background: 'none', border: 'none', color: 'white', fontSize: '13px', outline: 'none', resize: 'none', minHeight: '60px' }}
                                                    />
                                                ) : (
                                                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', lineHeight: '1.6' }}>{point.a}</div>
                                                )}
                                            </div>

                                            {point.analysis && (
                                                <div style={{ padding: '15px', background: 'rgba(197, 160, 89, 0.08)', borderRadius: '12px', borderLeft: '4px solid var(--accent-primary)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                        <Sparkles size={14} color="var(--accent-primary)" />
                                                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Visão Estratégica da Aura</span>
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', lineHeight: '1.5' }}>{point.analysis}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                        <button onClick={onClose} className="btn-primary" style={{ padding: '15px 80px', borderRadius: '14px', background: 'var(--accent-primary)', color: 'black', fontWeight: 'bold' }}>
                                            Finalizar e Aplicar Inteligência
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BriefingModal;
