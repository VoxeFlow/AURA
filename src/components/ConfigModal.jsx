import React, { useState, useEffect } from 'react';
import { X, Save, Brain, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';

const ConfigModal = ({ isOpen, onClose }) => {
    const store = useStore();
    const { setConfig } = store;

    // Controlled state to prevent "blank wipe" bugs
    const [formData, setFormData] = useState({
        apiUrl: '',
        apiKey: '',
        instanceName: '',
        briefing: ''
    });

    // Initialize/Sync when modal opens
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

        // Safety: If fields are blank but store had data, warn or prevent
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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" style={{ width: '600px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Settings size={20} color="var(--accent-primary)" />
                        <h3 style={{ margin: 0 }}>Configurações de Inteligência AURA</h3>
                    </div>
                    <X size={24} onClick={onClose} style={{ cursor: 'pointer', opacity: 0.5 }} />
                </div>

                <form onSubmit={handleSave} style={{ padding: '20px' }}>
                    <div className="input-field-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="input-group">
                            <label>API URL</label>
                            <input name="apiUrl" value={formData.apiUrl} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Instância</label>
                            <input name="instanceName" value={formData.instanceName} onChange={handleChange} required />
                        </div>
                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                            <label>Master API Key</label>
                            <input type="password" name="apiKey" value={formData.apiKey} onChange={handleChange} required style={{ letterSpacing: '2px' }} />
                        </div>
                    </div>

                    <div className="input-group" style={{ marginTop: '25px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Brain size={16} color="var(--accent-primary)" />
                                <label style={{ margin: 0, fontWeight: 'bold' }}>Briefing do Negócio</label>
                            </div>
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={() => {
                                    onClose();
                                    window.dispatchEvent(new CustomEvent('open-briefing'));
                                }}
                                style={{ padding: '5px 15px', fontSize: '11px', borderRadius: '8px', background: 'rgba(197, 160, 89, 0.1)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)' }}
                            >
                                <Sparkles size={12} style={{ marginRight: '5px' }} /> Abrir Dashboard Estratégico
                            </button>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <textarea
                                name="briefing"
                                value={formData.briefing}
                                onChange={handleChange}
                                rows={8}
                                placeholder="Descreva seu negócio, produtos, serviços e diferenciais..."
                                style={{
                                    width: '100%',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'rgba(255,255,255,0.9)',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    resize: 'vertical',
                                    fontSize: '13px',
                                    lineHeight: '1.6',
                                    outline: 'none',
                                    transition: 'border-color 0.3s'
                                }}
                            />
                            {!formData.briefing && (
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none', opacity: 0.3 }}>
                                    <AlertTriangle size={32} style={{ marginBottom: '10px' }} />
                                    <p style={{ fontSize: '12px' }}>A IA precisa de um briefing para atuar.</p>
                                </div>
                            )}
                        </div>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>
                            Dica: Use o Dashboard Estratégico para uma análise profunda feita pela IA Aura.
                        </p>
                    </div>

                    <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                        <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>Cancelar</button>
                        <button type="submit" className="btn-primary" style={{ padding: '12px 30px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Save size={18} /> Salvar Configurações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
import { Settings, Sparkles } from 'lucide-react';
export default ConfigModal;
