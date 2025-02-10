// Previous functionality
// Substitua YOUR_API_KEY pela sua chave real da API do Google Gemini
const API_KEY = 'AIzaSyCqtL3txurKLN1G051WZmtq6koAutlZ-6I';
        
const contentData = {
    "LÍNGUA PORTUGUESA": [
        "1. Compreensão e interpretação de textos",
        "2. Tipologia textual",
        "3. Ortografia oficial",
        "4. Acentuação gráfica",
        "5. Emprego das classes de palavras",
        "6. Emprego do sinal indicativo de crase",
        "7. Sintaxe da oração e do período",
        "8. Pontuação",
        "9. Concordância nominal e verbal",
        "10. Regência nominal e verbal",
        "11. Significação das palavras",
        "12. Redação oficial: aspectos gerais, características fundamentais, padrões, emprego e concordância dos pronomes de tratamento"
    ],
    "MATEMÁTICA": [
        "1. Números inteiros: operações e propriedades; múltiplos e divisores: problemas",
        "2. Números racionais: operações e propriedades; problemas envolvendo as quatro operações na forma fracionária e decimal",
        "3. Números e grandezas proporcionais; razões e proporções; divisão proporcional; regra de três simples e composta",
        "4. Porcentagem",
        "5. Juros e desconto simples (juro, capital, tempo, taxa e montante)",
        "6. Funções do 1º e 2º graus: problemas",
        "7. Sistema de medidas: decimais e não decimais",
        "8. Sistema monetário brasileiro: problemas"
    ],
    "NOÇÕES DE INFORMÁTICA": [
        "1. Internet e Aplicativos",
        "2. Ferramentas de busca",
        "3. Navegadores (Browser)",
        "4. Sistema Operacional e Software",
        "5. Correios Eletrônicos",
        "6. Programa Antivírus e Firewall",
        "7. Editores de Apresentação",
        "8. Editores de Planilhas",
        "9. Editores de Texto",
        "10. Extensão de Arquivo",
        "11. Teclas de Atalho",
        "12. Pacote Microsoft Office"
    ],
    "CONHECIMENTOS GERAIS": [
        "1. Noções básicas de cartografia. 1.1. Orientação: pontos cardeais. 1.2. Localização: coordenadas geográficas, latitude, longitude e altitude. 1.3. Representação: leitura, escala, legendas e convenções",
        "2. Aspectos físicos do Brasil e meio ambiente no Brasil (grandes domínios de clima, vegetação, relevo e hidrografia; ecossistemas)",
        "3. Organização do espaço agrário: atividades econômicas, modernização e conflitos; organização do espaço urbano: atividades econômicas, emprego e pobreza; rede urbana e regiões metropolitanas",
        "4. Dinâmica da população brasileira: fluxos migratórios, áreas de crescimento e de perda populacional",
        "5. Formação territorial e divisão político-administrativa (organização federativa)"
    ],
    "CÓDIGO DE CONDUTA ÉTICA E INTEGRIDADE": [
        "1. Código de Conduta Ética e Integridade dos CORREIOS de 07/10/2021"
    ]
};

// Setup inicial
const subjectSelect = document.getElementById('subject');
const topicSelect = document.getElementById('topic');

const generationConfig = {
  temperature: 0.2,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};
        
Object.keys(contentData).forEach(subject => {
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    subjectSelect.appendChild(option);
});

subjectSelect.addEventListener('change', () => {
    const subject = subjectSelect.value;
    topicSelect.innerHTML = '<option value="">Selecione um tópico</option>';
            
    if (subject) {
        contentData[subject].forEach(topic => {
            const option = document.createElement('option');
            option.value = topic;
            option.textContent = topic;
            topicSelect.appendChild(option);
        });
    }
});

function generatePrompt(subject, topic, type, isSimulation = false, questionCount = 10) {
    if (isSimulation) {
        return `Gere um simulado com ${questionCount} questões de múltipla escolha sobre ${subject} - ${topic} para concurso dos Correios. 
        Para cada questão:
        - Elabore um enunciado claro e objetivo
        - Forneça 4 alternativas (A a D)
        - Não repita alternativas
        - Revise a conformidade com a informação mais atual
        - Indique a resposta correta
        - Forneça uma explicação detalhada da resposta
        - Use o formato:
        
        QUESTÃO X:
        [Enunciado]
        
        A) [Alternativa]
        B) [Alternativa]
        C) [Alternativa]
        D) [Alternativa]

        Exceção: Em concursos como INSS, as questões tem apenas duas alternativas, Certo ou Errado (pelo menos 10% das questões devem seguir essa regra)
        RESPOSTA: [Letra]
        EXPLICAÇÃO: [Explicação detalhada]`;
    }
    
    // Original prompts for study material remain the same
    const basePrompt = `Gere material de estudo sobre ${subject} - ${topic} para concurso dos Correios. `;
    
    const typePrompts = {
        complete: `Gere um conteúdo completo e aprofundado com no mínimo 100.000 caracteres sobre o tema solicitado. Inclua:
        
        - **Definição** clara e objetiva do conceito, com explicação detalhada.
        - **Exemplos** práticos e contextualizados para facilitar a compreensão.
        - **Casos de uso reais** e aplicações práticas no dia a dia ou no contexto profissional/acadêmico.
        - **Extensão** Imagine o conteúdo como uma apostila com pelo menos 100.000 caracteres.
        - **Exercícios práticos** para reforçar o aprendizado, variando entre questões objetivas e dissertativas.
        - **Tabelas comparativas** (se aplicável) para destacar diferenças e semelhanças entre conceitos relacionados.
        - **Destaques visuais em Markdown**: use títulos, subtítulos, negrito, itálico, listas numeradas e bullet points para tornar a leitura intuitiva e organizada.`,

        summary: `Gere um **resumo conciso e estruturado** sobre o tema solicitado. O conteúdo deve incluir:
        
        - **Pontos principais** organizados de forma lógica e objetiva.
        - **Esquemas e tópicos** para facilitar a memorização.
        - **Frases curtas e diretas**, sem excesso de detalhes desnecessários.
        - **Tabelas e fluxogramas** (se necessário) para organizar informações complexas de forma visual.
        - **Destaques em Markdown**, como listas, negrito e subtítulos, para tornar o resumo mais dinâmico.`,

        tips: `Forneça **dicas práticas e estratégicas** para facilitar o aprendizado e memorização do tema. Inclua:
        
        - **Regras mnemônicas** eficazes para lembrar conceitos de forma intuitiva.
        - **Macetes e atalhos mentais** usados em cursos preparatórios e por especialistas da área.
        - **Técnicas de memorização** como associação de ideias, acrônimos e analogias criativas.
        - **Erros comuns e armadilhas** para que o estudante evite dificuldades recorrentes.
        - **Destaques em Markdown** para tornar o conteúdo claro e visualmente atrativo.`  
    };

    return basePrompt + typePrompts[type];
}

// Add content type toggle handling
document.querySelectorAll('input[name="mainContentType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const isSimulation = e.target.value === 'simulation';
        document.getElementById('studyOptions').style.display = isSimulation ? 'none' : 'block';
        document.getElementById('simulationOptions').style.display = isSimulation ? 'block' : 'none';
        document.getElementById('expandBtn').style.display = isSimulation ? 'none' : 'block';
        document.getElementById('newQuestionsBtn').style.display = isSimulation ? 'block' : 'none';
        document.getElementById('showResultsBtn').style.display = isSimulation ? 'block' : 'none';
    });
});

async function generateContent() {
    let subject, topic;
    
    if (subjectSelect.value === 'OUTRO' || topicSelect.value === 'Outro') {
        subject = customSubjectInput.value || subjectSelect.value;
        topic = customTopicInput.value || topicSelect.value;
    } else {
        subject = subjectSelect.value;
        topic = topicSelect.value;
    }

    const isSimulation = document.querySelector('input[name="mainContentType"]:checked').value === 'simulation';
    const contentType = document.querySelector('input[name="contentType"]:checked')?.value || 'complete';
    const questionCount = isSimulation ? parseInt(document.querySelector('input[name="questionCount"]:checked').value) : 10;

    if (!subject || !topic) {
        showError('Por favor, preencha todos os campos necessários');
        return;
    }

    showLoading(true);
    hideError();

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: generatePrompt(subject, topic, contentType, isSimulation, questionCount)
                    }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        const content = data.candidates[0].content.parts[0].text;
        
        if (isSimulation) {
            showSimulation(content);
        } else {
            showContent(markdownToHtml(content));
        }
    } catch (error) {
        showError('Erro ao gerar conteúdo: ' + error.message);
    } finally {
        showLoading(false);
    }
}

function showSimulation(content) {
    const simulationContent = document.getElementById('simulation-content');
    const questions = parseQuestions(content);
    
    simulationContent.innerHTML = `
        <div class="simulation-container">
            <form id="simulation-form">
                ${questions.map((q, index) => `
                    <div class="question-card" id="question-${index}">
                        <h3>Questão ${index + 1}</h3>
                        <p class="question-text">${q.question}</p>
                        <div class="options">
                            ${Object.entries(q.options).map(([letter, text]) => `
                                <div class="option">
                                    <input type="radio" id="q${index}-${letter}" name="q${index}" value="${letter}">
                                    <label for="q${index}-${letter}">${letter}) ${text}</label>
                                </div>
                            `).join('')}
                        </div>
                        <div class="feedback" style="display: none;">
                            <div class="answer"></div>
                            <div class="explanation">${q.explanation}</div>
                        </div>
                    </div>
                `).join('')}
            </form>
        </div>
    `;

    document.getElementById('content').style.display = 'none';
    simulationContent.style.display = 'block';
    document.querySelector('.result').classList.add('active');

    // Store correct answers in the form element for later checking
    const form = document.getElementById('simulation-form');
    form.dataset.answers = JSON.stringify(questions.map(q => q.answer));
}

function parseQuestions(content) {
    const questions = [];
    const questionBlocks = content.split(/QUESTÃO \d+:/g).filter(Boolean);

    questionBlocks.forEach(block => {
        const question = {};
        
        // Extract question text (everything before the first option)
        const questionParts = block.split(/[A-E]\)/);
        question.question = questionParts[0].trim();
        
        // Extract options
        question.options = {};
        const optionMatches = block.match(/[A-E]\).*?(?=[A-E]\)|RESPOSTA:|$)/gs);
        if (optionMatches) {
            optionMatches.forEach(match => {
                const letter = match[0];
                const text = match.slice(2).trim();
                question.options[letter] = text;
            });
        }
        
        // Extract answer and explanation
        const answerMatch = block.match(/RESPOSTA:\s*([A-E])/);
        const explanationMatch = block.match(/EXPLICAÇÃO:\s*([\s\S]*?)(?=(?:\n\n)|$)/);
        
        if (answerMatch) question.answer = answerMatch[1];
        if (explanationMatch) question.explanation = explanationMatch[1].trim();
        
        questions.push(question);
    });

    return questions;
}

function showResults() {
    const form = document.getElementById('simulation-form');
    const correctAnswers = JSON.parse(form.dataset.answers);
    let correctCount = 0;

    correctAnswers.forEach((answer, index) => {
        const questionCard = document.getElementById(`question-${index}`);
        const selectedAnswer = form.querySelector(`input[name="q${index}"]:checked`)?.value;
        const feedback = questionCard.querySelector('.feedback');
        const answerDiv = feedback.querySelector('.answer');

        feedback.style.display = 'block';
        
        if (selectedAnswer === answer) {
            correctCount++;
            answerDiv.innerHTML = `<div class="correct">✓ Correto!</div>`;
            questionCard.classList.add('correct-answer');
        } else {
            answerDiv.innerHTML = `<div class="incorrect">✗ Incorreto. A resposta correta é ${answer}</div>`;
            questionCard.classList.add('incorrect-answer');
        }
    });

    // Show overall score
    const score = document.createElement('div');
    score.className = 'final-score';
    score.innerHTML = `
        <h2>Resultado Final</h2>
        <p>Você acertou ${correctCount} de ${correctAnswers.length} questões</p>
        <p>Percentual de acerto: ${Math.round((correctCount / correctAnswers.length) * 100)}%</p>
    `;
    form.prepend(score);
}

function generateNewQuestions() {
    generateContent();
}

const generateBtn = document.getElementById('generate');
const loadingDiv = document.querySelector('.loading');
const errorDiv = document.querySelector('.error');
const resultDiv = document.querySelector('.result');
const contentDiv = document.getElementById('content');

function markdownToHtml(markdown) {
    // Implementação básica de conversão de markdown para HTML
    return markdown
        .replace(/#{3} (.*?)\n/g, '<h3>$1</h3>')
        .replace(/#{2} (.*?)\n/g, '<h2>$1</h2>')
        .replace(/# (.*?)\n/g, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/- (.*?)(\n|$)/g, '• $1<br>')
        .replace(/\n/g, '<br>');
}

function showLoading(show) {
    document.querySelector('.loading-overlay').classList.toggle('active', show);
    generateBtn.disabled = show;
  
    // Add/remove blur to main container
    document.querySelector('.container').style.filter = show ? 'blur(4px)' : 'none';
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.add('active');
}

function hideError() {
    errorDiv.classList.remove('active');
}

// Enhanced visual content generation
function createVisualElements(content, type) {
    const visualContainer = document.createElement('div');
    visualContainer.className = 'visual-content';

    if (type === 'tips') {
        // Create mnemonic cards
        const mnemonics = content.match(/regra mnem[ôo]nica:.*?(?=\n|$)/gi) || [];
        mnemonics.forEach(mnemonic => {
            const card = document.createElement('div');
            card.className = 'mnemonic-card pulse-highlight';
            card.innerHTML = `<h4>📝 Regra Mnemônica</h4><p>${mnemonic.replace(/regra mnem[ôo]nica:/i, '')}</p>`;
            visualContainer.appendChild(card);
        });
    }

    // Create practice questions section
    if (content.includes('Exercício') || content.includes('Questão')) {
        const questions = content.match(/Exerc[íi]cio.*?(?=\n\n|$)/gs) || [];
        questions.forEach(question => {
            const questionBox = document.createElement('div');
            questionBox.className = 'practice-question';
            questionBox.innerHTML = `<h4>✍️ Prática</h4>${question}`;
            visualContainer.appendChild(questionBox);
        });
    }

    // Create concept highlights
    const concepts = content.match(/\*\*(.*?)\*\*/g) || [];
    if (concepts.length) {
        const conceptMap = document.createElement('div');
        conceptMap.className = 'concept-map';
        conceptMap.innerHTML = createConceptSVG(concepts);
        visualContainer.appendChild(conceptMap);
    }

    return visualContainer;
}

function createConceptSVG(concepts) {
    const width = 600;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 150;

    let svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
  
    concepts.forEach((concept, i) => {
        const angle = (i * 2 * Math.PI) / concepts.length;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        svg += `
          <g class="animated-concept" style="animation-delay: ${i * 0.2}s">
            <line 
              x1="${centerX}" 
              y1="${centerY}" 
              x2="${x}" 
              y2="${y}" 
              stroke="#1a5fb4" 
              stroke-width="2"
            />
            <circle 
              cx="${x}" 
              cy="${y}" 
              r="5" 
              fill="#1a5fb4"
            />
            <text 
              x="${x}" 
              y="${y + 20}" 
              text-anchor="middle" 
              fill="#333"
              font-size="14"
            >${concept.replace(/\*\*/g, '')}</text>
          </g>
        `;
    });

    svg += '</svg>';
    return svg;
}

// Enhance the showContent function
function showContent(content) {
    const contentDiv = document.getElementById('content');
    const contentType = document.querySelector('input[name="contentType"]:checked').value;
  
    // Create main content
    const mainContent = document.createElement('div');
    mainContent.className = 'content-section';
    mainContent.innerHTML = content;

    // Create visual elements
    const visualElements = createVisualElements(content, contentType);

    // Add everything to the content div
    contentDiv.innerHTML = '';
    contentDiv.appendChild(mainContent);
    contentDiv.appendChild(visualElements);

    // Show result container
    document.querySelector('.result').classList.add('active');

    // Animate concepts into view
    const concepts = document.querySelectorAll('.animated-concept');
    concepts.forEach(concept => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    concept.classList.add('visible');
                }
            });
        });
        observer.observe(concept);
    });
}

// Add interactive tooltips
function addTooltips() {
    const terms = document.querySelectorAll('strong');
    terms.forEach(term => {
        term.className = 'floating-tip';
        term.setAttribute('data-tip', 'Conceito importante!');
    });
}

// Event listeners
generateBtn.addEventListener('click', generateContent);
document.getElementById('showResultsBtn').addEventListener('click', showResults);
document.getElementById('newQuestionsBtn').addEventListener('click', generateNewQuestions);

// Função para formatar tabelas markdown em HTML
function formatMarkdownTable(markdown) {
    const lines = markdown.split('\n');
    let html = '<table class="markdown-table">';
    let isHeader = true;

    for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.includes('|-')) {
            isHeader = false;
            continue;
        }

        const cells = line.split('|').filter(cell => cell.trim() !== '');
        if (cells.length === 0) continue;

        if (isHeader) {
            html += '<thead><tr>';
            cells.forEach(cell => {
                html += `<th>${cell.trim()}</th>`;
            });
            html += '</tr></thead><tbody>';
        } else {
            html += '<tr>';
            cells.forEach(cell => {
                html += `<td>${cell.trim()}</td>`;
            });
            html += '</tr>';
        }
    }

    html += '</tbody></table>';
    return html;
}

// Estilos adicionais para tabelas
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .markdown-table {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;
    }

    .markdown-table th,
    .markdown-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }

    .markdown-table th {
        background-color: #f5f5f5;
        font-weight: bold;
    }

    .markdown-table tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    .markdown-table tr:hover {
        background-color: #f5f5f5;
    }

    /* Estilos para código */
    code {
        background-color: #f5f5f5;
        padding: 2px 4px;
        border-radius: 4px;
        font-family: monospace;
    }

    /* Estilos para listas */
    ul, ol {
        padding-left: 20px;
        margin: 10px 0;
    }

    /* Estilos para citações */
    blockquote {
        border-left: 4px solid #ddd;
        padding-left: 1em;
        margin: 1em 0;
        color: #666;
    }

    /* Estilos para destaques */
    .highlight {
        background-color: #fff3cd;
        padding: 2px 4px;
        border-radius: 4px;
    }

    /* Estilos para dicas */
    .tip {
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        border-radius: 4px;
        padding: 15px;
        margin: 10px 0;
    }

    /* Estilos para exercícios */
    .exercise {
        background-color: #e2e3e5;
        border: 1px solid #d6d8db;
        border-radius: 4px;
        padding: 15px;
        margin: 10px 0;
    }

    /* Estilos para exemplos */
    .example {
        background-color: #cce5ff;
        border: 1px solid #b8daff;
        border-radius: 4px;
        padding: 15px;
        margin: 10px 0;
    }
`;
document.head.appendChild(styleSheet);
