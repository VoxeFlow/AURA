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

                <form onSubmit={handleSave} style={{ padding: '0 25px 25px' }}>

                    {/* HUB NAVIGATION - PRIMARY ACTIONS */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '15px',
                        marginBottom: '30px',
                        padding: '20px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '16px',
                        border: '1px solid var(--glass-border)'
                    }}>
                        <button
                            type="button"
                            onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('open-connect')); }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '20px',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                        >
                            <Link2 color="var(--accent-primary)" size={24} />
                            <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>Conectar WhatsApp</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('open-briefing')); }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '20px',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                        >
                            <Brain color="var(--accent-primary)" size={24} />
                            <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>Gerir Inteligência</span>
                        </button>
                    </div>

                    <div className="input-field-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="input-group">
                            <label style={{ fontSize: '11px', opacity: 0.6 }}>API URL</label>
                            <input name="apiUrl" value={formData.apiUrl} onChange={handleChange} required style={{ height: '35px', fontSize: '12px' }} />
                        </div>
                        <div className="input-group">
                            <label style={{ fontSize: '11px', opacity: 0.6 }}>Instância</label>
                            <input name="instanceName" value={formData.instanceName} onChange={handleChange} required style={{ height: '35px', fontSize: '12px' }} />
                        </div>
                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                            <label style={{ fontSize: '11px', opacity: 0.6 }}>Master API Key</label>
                            <input type="password" name="apiKey" value={formData.apiKey} onChange={handleChange} required style={{ height: '35px', fontSize: '12px', letterSpacing: '2px' }} />
                        </div>
                    </div>

                    <div className="input-group" style={{ marginTop: '25px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <label style={{ margin: 0, fontWeight: 'bold', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Edição Direta do Briefing (Backup)</label>
                        </div>

                        <textarea
                            name="briefing"
                            value={formData.briefing}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Descreva seu negócio para a IA..."
                            style={{
                                width: '100%',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--glass-border)',
                                color: 'rgba(255,255,255,0.6)',
                                padding: '12px',
                                borderRadius: '10px',
                                resize: 'vertical',
                                fontSize: '11px',
                                lineHeight: '1.5'
                            }}
                        />
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                        <button type="submit" className="btn-primary" style={{ padding: '12px 60px', borderRadius: '12px', fontSize: '13px' }}>
                            <Save size={18} /> Salvar Tudo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
import { Settings, Sparkles, Link2 } from 'lucide-react';
export default ConfigModal;
