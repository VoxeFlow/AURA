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
                        bottom: '85px',
                        left: '0',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(30px)',
                        WebkitBackdropFilter: 'blur(30px)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: '32px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        zIndex: 1000,
                        minWidth: '260px',
                        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.3)',
                        animation: 'fadeInUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                >
                    <button
                        type="button"
                        className="menu-item-v4"
                        onClick={() => { handleAttachmentClick('Fotos/Vídeos'); setShowAttachMenu(false); }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            background: 'transparent',
                            border: 'none',
                            color: '#1d1d1f',
                            cursor: 'pointer',
                            padding: '16px 20px',
                            fontSize: '16px',
                            fontWeight: '700',
                            textAlign: 'left',
                            width: '100%',
                            borderRadius: '24px',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'scale(1.02) translateX(10px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'scale(1) translateX(0)'; }}
                    >
                        <div style={{ background: 'linear-gradient(135deg, #FF2D55, #FF375F)', padding: '12px', borderRadius: '16px', display: 'flex', boxShadow: '0 8px 20px rgba(255, 45, 85, 0.4)', color: '#fff' }}>
                            <Image size={22} />
                        </div>
                        <span>Fotos e Vídeos</span>
                    </button>

                    <button
                        type="button"
                        className="menu-item-v4"
                        onClick={() => { handleAttachmentClick('Câmera'); setShowAttachMenu(false); }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            background: 'transparent',
                            border: 'none',
                            color: '#1d1d1f',
                            cursor: 'pointer',
                            padding: '16px 20px',
                            fontSize: '16px',
                            fontWeight: '700',
                            textAlign: 'left',
                            width: '100%',
                            borderRadius: '24px',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'scale(1.02) translateX(10px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'scale(1) translateX(0)'; }}
                    >
                        <div style={{ background: 'linear-gradient(135deg, #FF3B30, #FF453A)', padding: '12px', borderRadius: '16px', display: 'flex', boxShadow: '0 8px 20px rgba(255, 59, 48, 0.4)', color: '#fff' }}>
                            <Camera size={22} />
                        </div>
                        <span>Câmera</span>
                    </button>

                    <button
                        type="button"
                        className="menu-item-v4"
                        onClick={() => { handleAttachmentClick('Documento'); setShowAttachMenu(false); }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            background: 'transparent',
                            border: 'none',
                            color: '#1d1d1f',
                            cursor: 'pointer',
                            padding: '16px 20px',
                            fontSize: '16px',
                            fontWeight: '700',
                            textAlign: 'left',
                            width: '100%',
                            borderRadius: '24px',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'scale(1.02) translateX(10px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'scale(1) translateX(0)'; }}
                    >
                        <div style={{ background: 'linear-gradient(135deg, #5856D6, #5E5CE6)', padding: '12px', borderRadius: '16px', display: 'flex', boxShadow: '0 8px 20px rgba(88, 86, 214, 0.4)', color: '#fff' }}>
                            <FileText size={22} />
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
