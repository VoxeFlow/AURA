import React, { useState, useEffect } from 'react';
import { X, Save, Brain, AlertTriangle, Settings, Link2, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { useStore } from '../store/useStore';

const ConfigModal = ({ isOpen, onClose }) => {
    const store = useStore();
    const { setConfig } = store;
    const [showAdvanced, setShowAdvanced] = useState(false);

    const [formData, setFormData] = useState({
        apiUrl: '',
        apiKey: '',
        instanceName: '',
        briefing: ''
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                apiUrl: store.apiUrl || '',
                apiKey: store.apiKey || '',
                instanceName: store.instanceName || '',
                briefing: store.briefing || ''
            });
        }
    }, [isOpen, store.apiUrl, store.apiKey, store.instanceName, store.briefing]);

    if (!isOpen) return null;

    const handleSave = (e) => {
        e.preventDefault();
        if (store.apiKey && !formData.apiKey) {
            alert("Atenção: A chave da API não pode ficar vazia.");
            return;
        }
        setConfig(formData);
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <div className="modal-content glass-panel" style={{ width: '550px', background: 'rgba(20, 20, 20, 0.95)', border: '1px solid rgba(255,255,255,0.1)', padding: '0', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} onClick={e => e.stopPropagation()}>

                <div className="modal-header" style={{ padding: '25px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to right, rgba(197, 160, 89, 0.05), transparent)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: 'var(--accent-primary)', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Settings size={20} color="black" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: 'white', fontSize: '18px', fontWeight: 'bold' }}>Painel de Controle AURA</h3>
                            <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Gerenciamento de Inteligência e Conectividade</p>
                        </div>
                    </div>
                    <X size={24} onClick={onClose} style={{ cursor: 'pointer', opacity: 0.3, transition: 'opacity 0.2s' }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.3} />
                </div>

                <form onSubmit={handleSave} style={{ padding: '30px' }}>

                    {/* HUB ACTIONS - PREMIUM DESIGN */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '35px' }}>
                        <button
                            type="button"
                            onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('open-connect')); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '20px',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '18px',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(197, 160, 89, 0.08)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <div style={{ background: 'rgba(197, 160, 89, 0.1)', padding: '10px', borderRadius: '12px' }}>
                                <Link2 color="var(--accent-primary)" size={22} />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ color: 'white', fontSize: '13px', fontWeight: 'bold', display: 'block' }}>WhatsApp</span>
                                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Status da Conexão</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('open-briefing')); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '20px',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '18px',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(197, 160, 89, 0.08)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <div style={{ background: 'rgba(197, 160, 89, 0.1)', padding: '10px', borderRadius: '12px' }}>
                                <Brain color="var(--accent-primary)" size={22} />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ color: 'white', fontSize: '13px', fontWeight: 'bold', display: 'block' }}>Cérebro IA</span>
                                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Ajustar Conhecimento</span>
                            </div>
                        </button>
                    </div>

                    {/* BRIEFING PREVIEW SECTION */}
                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <label style={{ margin: 0, fontWeight: 'bold', fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Briefing Estratégico do Negócio</label>
                        </div>
                        <textarea
                            name="briefing"
                            value={formData.briefing}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Recomendamos usar o 'Cérebro IA' acima para um treinamento guiado..."
                            style={{
                                width: '100%',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                color: 'rgba(255,255,255,0.8)',
                                padding: '18px',
                                borderRadius: '16px',
                                resize: 'none',
                                fontSize: '12px',
                                lineHeight: '1.6',
                                outline: 'none',
                                transition: 'all 0.3s'
                            }}
                            onFocus={e => e.target.style.borderColor = 'rgba(197, 160, 89, 0.3)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.05)'}
                        />
                    </div>

                    {/* ADVANCED SECTION TOGGLE */}
                    <div
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderTop: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', opacity: showAdvanced ? 1 : 0.4, transition: 'opacity 0.3s' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Lock size={14} color="var(--accent-primary)" />
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}>Área Técnica (Avançado)</span>
                        </div>
                        {showAdvanced ? <ChevronUp size={16} color="white" /> : <ChevronDown size={16} color="white" />}
                    </div>

                    {showAdvanced && (
                        <div style={{ paddingTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', animation: 'fadeIn 0.3s ease' }}>
                            <div className="input-group">
                                <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '8px', display: 'block' }}>API ENDPOINT URL</label>
                                <input name="apiUrl" value={formData.apiUrl} onChange={handleChange} required style={{ height: '40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', color: 'white', padding: '0 12px', fontSize: '12px', width: '100%' }} />
                            </div>
                            <div className="input-group">
                                <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '8px', display: 'block' }}>ENVIRONMENT INSTANCE</label>
                                <input name="instanceName" value={formData.instanceName} onChange={handleChange} required style={{ height: '40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', color: 'white', padding: '0 12px', fontSize: '12px', width: '100%' }} />
                            </div>
                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '8px', display: 'block' }}>MASTER ACCESS KEY (ENCRYPTED)</label>
                                <input type="password" name="apiKey" value={formData.apiKey} onChange={handleChange} required style={{ height: '40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', color: 'white', padding: '0 12px', fontSize: '12px', width: '100%', letterSpacing: '4px' }} />
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                        <button type="submit" className="btn-primary" style={{ padding: '16px 80px', borderRadius: '50px', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(197, 160, 89, 0.2)' }}>
                            <Save size={18} /> Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default ConfigModal;
