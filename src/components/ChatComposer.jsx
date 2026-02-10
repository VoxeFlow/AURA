import React from 'react';
import { Paperclip, Wand2, Send, Mic, Image, Camera, FileText } from 'lucide-react';

const ChatComposer = ({
    showAttachMenu,
    setShowAttachMenu,
    handleAttachmentClick,
    handleSend,
    input,
    setInput,
    handleEnhance,
    isEnhancing,
    sending,
    recording,
    handleMicClick,
}) => {
    return (
        <form className="message-input-area" onSubmit={handleSend} style={{ position: 'relative' }}>
            {showAttachMenu && (
                <div
                    className="attach-menu glass-panel"
                    style={{
                        position: 'absolute',
                        bottom: '75px',
                        left: '0',
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        borderRadius: '24px',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        zIndex: 100,
                        minWidth: '220px',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                        animation: 'fadeInUp 0.3s ease-out'
                    }}
                >
                    <button
                        type="button"
                        className="menu-item-v3"
                        onClick={() => { handleAttachmentClick('Fotos/Vídeos'); setShowAttachMenu(false); }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: 'transparent',
                            border: 'none',
                            color: '#1d1d1f',
                            cursor: 'pointer',
                            padding: '12px 16px',
                            fontSize: '14px',
                            fontWeight: '600',
                            textAlign: 'left',
                            width: '100%',
                            borderRadius: '16px',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)'; e.currentTarget.style.transform = 'translateX(5px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateX(0)'; }}
                    >
                        <div style={{ background: 'linear-gradient(135deg, #FF2D55, #FF375F)', padding: '8px', borderRadius: '12px', display: 'flex', boxShadow: '0 4px 10px rgba(255, 45, 85, 0.2)' }}>
                            <Image size={18} color="#fff" />
                        </div>
                        <span>Fotos e Vídeos</span>
                    </button>

                    <button
                        type="button"
                        className="menu-item-v3"
                        onClick={() => { handleAttachmentClick('Câmera'); setShowAttachMenu(false); }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: 'transparent',
                            border: 'none',
                            color: '#1d1d1f',
                            cursor: 'pointer',
                            padding: '12px 16px',
                            fontSize: '14px',
                            fontWeight: '600',
                            textAlign: 'left',
                            width: '100%',
                            borderRadius: '16px',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)'; e.currentTarget.style.transform = 'translateX(5px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateX(0)'; }}
                    >
                        <div style={{ background: 'linear-gradient(135deg, #FF3B30, #FF453A)', padding: '8px', borderRadius: '12px', display: 'flex', boxShadow: '0 4px 10px rgba(255, 59, 48, 0.2)' }}>
                            <Camera size={18} color="#fff" />
                        </div>
                        <span>Câmera</span>
                    </button>

                    <button
                        type="button"
                        className="menu-item-v3"
                        onClick={() => { handleAttachmentClick('Documento'); setShowAttachMenu(false); }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: 'transparent',
                            border: 'none',
                            color: '#1d1d1f',
                            cursor: 'pointer',
                            padding: '12px 16px',
                            fontSize: '14px',
                            fontWeight: '600',
                            textAlign: 'left',
                            width: '100%',
                            borderRadius: '16px',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)'; e.currentTarget.style.transform = 'translateX(5px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateX(0)'; }}
                    >
                        <div style={{ background: 'linear-gradient(135deg, #5856D6, #5E5CE6)', padding: '8px', borderRadius: '12px', display: 'flex', boxShadow: '0 4px 10px rgba(88, 86, 214, 0.2)' }}>
                            <FileText size={18} color="#fff" />
                        </div>
                        <span>Documento</span>
                    </button>
                </div>
            )}

            <button
                type="button"
                className="btn-icon"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0 5px' }}
            >
                <Paperclip size={22} />
            </button>

            <div className="input-container-main">
                <button
                    type="button"
                    className={`btn-enhance ${input.trim() ? 'active' : ''}`}
                    onClick={() => handleEnhance(input)}
                    disabled={!input.trim() || isEnhancing || sending}
                    title="Aprimorar Resposta"
                >
                    <Wand2 size={18} className={isEnhancing ? 'spin' : ''} />
                </button>

                <input
                    type="text"
                    placeholder="Resposta persuasiva..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={sending || isEnhancing}
                />
            </div>

            {input.trim() ? (
                <button
                    type="submit"
                    disabled={sending || isEnhancing}
                    style={{
                        background: 'var(--accent-primary)',
                        color: '#000',
                        border: 'none',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        flexShrink: 0,
                    }}
                >
                    <Send size={20} />
                </button>
            ) : (
                <button
                    type="button"
                    onClick={handleMicClick}
                    style={{
                        background: recording ? '#ef4444' : 'var(--accent-primary)',
                        border: 'none',
                        color: recording ? '#fff' : '#000',
                        cursor: 'pointer',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s',
                        flexShrink: 0,
                    }}
                >
                    <Mic size={20} className={recording ? 'pulse' : ''} />
                </button>
            )}
        </form>
    );
};

export default ChatComposer;
