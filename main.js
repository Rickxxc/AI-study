// Substitua YOUR_API_KEY pela sua chave real da API do Google Gemini
       const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
console.log(API_KEY); // Teste para ver se a chave foi carregada
        
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
            ],
            "OUTRO": ["Outro"]
        };

        // Setup inicial
        const subjectSelect = document.getElementById('subject');
        const topicSelect = document.getElementById('topic');
        const customSubjectInput = document.getElementById('customSubject');
        const customTopicInput = document.getElementById('customTopic');
        customSubjectInput.style.display = 'none';
        customTopicInput.style.display = 'none';
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
            
            if (subject === 'OUTRO') {
                customSubjectInput.style.display = 'block';
                customTopicInput.style.display = 'block';
                topicSelect.style.display = 'none';
            } else {
                customSubjectInput.style.display = 'none';
                customTopicInput.style.display = 'none';
                topicSelect.style.display = 'block';
                
                if (subject) {
                    contentData[subject].forEach(topic => {
                        const option = document.createElement('option');
                        option.value = topic;
                        option.textContent = topic;
                        topicSelect.appendChild(option);
                    });

                    const otherOption = document.createElement('option');
                    otherOption.value = "Outro";
                    otherOption.textContent = "Outro";
                    topicSelect.appendChild(otherOption);
                }
            }
        });

        topicSelect.addEventListener('change', () => {
            const selectedTopic = topicSelect.value;
            if (selectedTopic === 'Outro') {
                customTopicInput.style.display = 'block';
                topicSelect.style.display = 'none';
            } else {
                customTopicInput.style.display = 'none';
            }
        });

        document.getElementsByName('mainContentType').forEach(radio => {
            radio.addEventListener('change', () => {
                const selectedType = radio.value;
                if (selectedType === 'study') {
                    document.getElementById('studyOptions').style.display = 'block';
                    document.getElementById('simulationOptions').style.display = 'none';
                } else {
                    document.getElementById('studyOptions').style.display = 'none';
                    document.getElementById('simulationOptions').style.display = 'block';
                }
            });
        });

        function generatePrompt(subject, topic, type) {
            const basePrompt = `Gere material de estudo sobre ${subject} - ${topic} para concurso dos Correios. `;
            
            const typePrompts = {
                complete: `Haja como um redator de apostilas para curso preparatório e Gere um conteúdo completo e aprofundado de pelo menos 100.000 caracteres sobre o tema solicitado, garantindo a cobertura do conteúdo. Ignore a numeração contida no tópico. Inclua:
    - **Introdução** não comece com uma resposta inicial ou saudação, ou dando a entender que é uma conversa ou uma resposta, mas já inicie a resposta com a introdução ao conteúdo.
    - **Definição** clara e objetiva do conceito, com explicação detalhada.
    - **Exemplos** práticos e contextualizados para facilitar a compreensão.
    - **Casos de uso reais** e aplicações práticas no dia a dia ou no contexto profissional/acadêmico.
    - **Lembre** que o conteúdo é uma apostila, então use o limite máximo de caracteres para proporcionar um conteúdo amplo, expandido e completo.
    - **Atualização** use sempre as informações mais atualizadas possíveis da sua nase de dados, especialmente ao tratar de língua portuguesa (Em razão da reforma ortográfica).
    - **Revisão** Conclua com uma revisão dos pontos mais importantes. Use a última pagina para resolução de questões do concurso em questão, sobre o tema, comentada com resolução.
    - **completo** Aborde tudo o que for necessário sobre o tema, sem deixar pontas soltas.
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

        const generateBtn = document.getElementById('generate');
        const loadingOverlay = document.querySelector('.loading-overlay');
        const errorDiv = document.querySelector('.error');
        const resultDiv = document.querySelector('.result');
        const contentDiv = document.getElementById('content');
        const simulationContentDiv = document.getElementById('simulation-content');

        async function generateContent() {
            let subject, topic;
            
            if (subjectSelect.value === 'OUTRO' || topicSelect.value === 'Outro') {
                subject = customSubjectInput.value || subjectSelect.value;
                topic = customTopicInput.value || topicSelect.value;
            } else {
                subject = subjectSelect.value;
                topic = topicSelect.value;
            }

            const contentType = document.querySelector('input[name="contentType"]:checked')?.value;
            const mainContentType = document.querySelector('input[name="mainContentType"]:checked').value;
            const questionCount = document.querySelector('input[name="questionCount"]:checked')?.value;

            if (mainContentType === 'study' && !contentType) {
                showError('Por favor, selecione um formato de material');
                return;
            }

            if (mainContentType === 'simulation' && !questionCount) {
                showError('Por favor, selecione um número de questões');
                return;
            }

            if (!subject || !topic) {
                showError('Por favor, preencha todos os campos necessários');
                return;
            }

            showLoading(true);
            hideError();

            try {
                
                if (mainContentType === 'study') {
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: generatePrompt(subject, topic, contentType)
                                    
                                }]
                            }]
                        })
                    });

                    const data = await response.json();
                    
                    if (data.error) {
                        throw new Error(data.error.message);
                    }

                    const content = data.candidates[0].content.parts[0].text;
                    showContent(markdownToHtml(content));
                    const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

                } else {
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: `Gere ${questionCount} questões para um simulado sobre ${subject} - ${topic}.`
                                }]
                            }]
                        })
                    });

                    const data = await response.json();
                    if (data.error) {
                        throw new Error(data.error.message);
                    }

                    const content = data.candidates[0].content.parts[0].text;
                    showSimulationContent(markdownToHtml(content));
                }
            } catch (error) {
                showError('Erro ao gerar conteúdo: ' + error.message);
            } finally {
                showLoading(false);
            }
        }

        async function expandContent() {
            const currentContent = contentDiv.innerText;
            if (!currentContent) return;

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
                                text: `Expanda e aprofunde o seguinte conteúdo, adicionando mais exemplos, exercícios e explicações detalhadas: ${currentContent}`
                            }]
                        }]
                    })
                });
                const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};


                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error.message);
                }

                const expandedContent = data.candidates[0].content.parts[0].text;
                showContent(markdownToHtml(expandedContent));
            } catch (error) {
                showError('Erro ao expandir conteúdo: ' + error.message);
            } finally {
                showLoading(false);
            }
        }

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
            loadingOverlay.style.display = show ? 'flex' : 'none';
            generateBtn.disabled = show;
        }

        function showError(message) {
            errorDiv.textContent = message;
            errorDiv.classList.add('active');
        }

        function hideError() {
            errorDiv.classList.remove('active');
        }

        function showContent(content) {
            contentDiv.innerHTML = content;
            resultDiv.classList.add('active');
            simulationContentDiv.style.display = 'none';
            document.getElementById('newQuestionsBtn').style.display = 'none';
            document.getElementById('showResultsBtn').style.display = 'none';
            document.getElementById('expandBtn').style.display = 'block';
        }

        function showSimulationContent(content) {
            simulationContentDiv.innerHTML = content;
            resultDiv.classList.add('active');
            contentDiv.style.display = 'none';
            simulationContentDiv.style.display = 'block';
            document.getElementById('newQuestionsBtn').style.display = 'block';
            document.getElementById('showResultsBtn').style.display = 'block';
            document.getElementById('expandBtn').style.display = 'none';
        }

        function exportPDF() {
            window.print();
        }

        function copyContent() {
            const content = contentDiv.innerText;
            navigator.clipboard.writeText(content)
            .then(() => alert('Conteúdo copiado para a área de transferência!'))
                .catch(err => showError('Erro ao copiar conteúdo: ' + err.message));
        }

        generateBtn.addEventListener('click', generateContent);

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
