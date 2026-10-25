/**
 * MDC Smart Assistant - Chatbot Widget
 * Desenvolvido para o portal Minha Decisão Certa
 */

(function() {
    // 1. Criar o HTML do Chatbot
    const chatbotHTML = `
        <div id="mdc-chatbot-container">
            <div id="mdc-chatbot-button">
                <i class="fas fa-robot"></i>
                <div class="mdc-notification">1</div>
            </div>
            <div id="mdc-chatbot-window">
                <div class="mdc-chatbot-header">
                    <div class="mdc-bot-info">
                        <div class="mdc-bot-avatar">MDC</div>
                        <div>
                            <h4>Assistente MDC</h4>
                            <span>Online agora</span>
                        </div>
                    </div>
                    <button id="mdc-close-chat">&times;</button>
                </div>
                <div id="mdc-chat-messages">
                    <div class="mdc-message mdc-bot">
                        Olá! Sou o assistente da Rosângela. Estou aqui para ajudar você a tomar a <strong>decisão certa</strong> hoje! 😊
                    </div>
                    <div class="mdc-message mdc-bot">
                        Como posso te ajudar agora?
                    </div>
                </div>
                <div class="mdc-chat-options">
                    <button class="mdc-opt" data-answer="notebook">💻 Melhor Notebook?</button>
                    <button class="mdc-opt" data-answer="geladeira">❄️ Geladeira Econômica?</button>
                    <button class="mdc-opt" data-answer="whatsapp">📱 Falar com a Rosângela</button>
                </div>
            </div>
        </div>
    `;

    // 2. Injetar o CSS
    const chatbotCSS = `
        #mdc-chatbot-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            font-family: 'Inter', sans-serif;
        }
        #mdc-chatbot-button {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #ffb800 0%, #ff8a00 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(255, 184, 0, 0.4);
            transition: 0.3s;
            position: relative;
        }
        #mdc-chatbot-button:hover { transform: scale(1.1); }
        .mdc-notification {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ef4444;
            color: #fff;
            font-size: 10px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            border: 2px solid #0f172a;
        }
        #mdc-chatbot-window {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 320px;
            height: 450px;
            background: #1e293b;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.1);
        }
        #mdc-chatbot-window.active { display: flex; animation: fadeInChat 0.3s ease; }
        @keyframes fadeInChat { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .mdc-chatbot-header {
            background: #0f172a;
            padding: 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .mdc-bot-info { display: flex; align-items: center; gap: 10px; }
        .mdc-bot-avatar {
            width: 35px;
            height: 35px;
            background: var(--primary, #ffb800);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000;
            font-weight: bold;
            font-size: 12px;
        }
        .mdc-bot-info h4 { margin: 0; font-size: 14px; color: #fff; }
        .mdc-bot-info span { font-size: 11px; color: #22c55e; }
        #mdc-close-chat { background: none; border: none; color: #888; font-size: 24px; cursor: pointer; }

        #mdc-chat-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: rgba(15, 23, 42, 0.5);
        }
        .mdc-message {
            max-width: 85%;
            padding: 10px 15px;
            border-radius: 15px;
            font-size: 14px;
            line-height: 1.4;
        }
        .mdc-bot { background: #334155; color: #eee; align-self: flex-start; border-bottom-left-radius: 2px; }
        .mdc-user { background: var(--primary, #ffb800); color: #000; align-self: flex-end; border-bottom-right-radius: 2px; }

        .mdc-chat-options {
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            background: #0f172a;
        }
        .mdc-opt {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #ccc;
            padding: 8px 12px;
            border-radius: 8px;
            text-align: left;
            cursor: pointer;
            font-size: 13px;
            transition: 0.2s;
        }
        .mdc-opt:hover { background: rgba(255, 184, 0, 0.1); border-color: #ffb800; color: #fff; }
    `;

    // 3. Respostas do Robô
    const answers = {
        notebook: "O campeão de 2026 é o <strong>Acer Aspire 5 (Ryzen 5)</strong>! Ele tem o melhor equilíbrio entre preço e potência. Quer ver o ranking completo? <a href='notebooks.html' style='color: #ffb800'>Clique aqui para ver os notebooks</a>.",
        geladeira: "Para economizar na conta de luz, a melhor escolha é a <strong>Panasonic 387L A+++</strong> com tecnologia Inverter. Ela gasta muito pouco! Veja o ranking: <a href='geladeiras.html' style='color: #ffb800'>Ver geladeiras</a>.",
        whatsapp: "Você pode falar diretamente com a Rosângela para tirar dúvidas personalizadas! <a href='https://wa.me/5513991145129' target='_blank' style='color: #22c55e; font-weight: bold;'>Clique aqui para abrir o WhatsApp</a>."
    };

    // 4. Lógica de funcionamento
    function initChatbot() {
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
        const style = document.createElement('style');
        style.innerHTML = chatbotCSS;
        document.head.appendChild(style);

        const btn = document.getElementById('mdc-chatbot-button');
        const win = document.getElementById('mdc-chatbot-window');
        const close = document.getElementById('mdc-close-chat');
        const msgContainer = document.getElementById('mdc-chat-messages');
        const options = document.querySelectorAll('.mdc-opt');

        btn.addEventListener('click', () => {
            win.classList.toggle('active');
            document.querySelector('.mdc-notification').style.display = 'none';
        });

        close.addEventListener('click', () => win.classList.remove('active'));

        options.forEach(opt => {
            opt.addEventListener('click', () => {
                const answerKey = opt.getAttribute('data-answer');
                const userText = opt.innerText;

                // Add user message
                const userMsg = document.createElement('div');
                userMsg.className = 'mdc-message mdc-user';
                userMsg.innerText = userText;
                msgContainer.appendChild(userMsg);

                // Scroll to bottom
                msgContainer.scrollTop = msgContainer.scrollHeight;

                // Typing effect simulation
                setTimeout(() => {
                    const botMsg = document.createElement('div');
                    botMsg.className = 'mdc-message mdc-bot';
                    botMsg.innerHTML = answers[answerKey];
                    msgContainer.appendChild(botMsg);
                    msgContainer.scrollTop = msgContainer.scrollHeight;
                }, 600);
            });
        });
    }

    // Iniciar se o FontAwesome estiver carregado
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initChatbot();
    } else {
        window.addEventListener('DOMContentLoaded', initChatbot);
    }
})();
