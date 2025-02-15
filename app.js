const conteudoProgramatico = {
  "CONHECIMENTOS BÁSICOS": {
    "LÍNGUA PORTUGUESA": [
      "Compreensão de textos",
      "Ortografia oficial",
      "Classe e emprego de palavras",
      "Emprego do acento indicativo de crase",
      "Sintaxe da oração e do período",
      "Emprego dos sinais de pontuação",
      "Concordância verbal e nominal",
      "Regência verbal e nominal",
      "Colocação dos pronomes oblíquos átonos (próclise, mesóclise e ênclise)"
    ],
    "LÍNGUA INGLESA": [
      "Conhecimento de um vocabulário fundamental e dos aspectos gramaticais básicos para a compreensão de textos"
    ],
    "MATEMÁTICA": [
      "Números inteiros, racionais e reais; problemas de contagem",
      "Sistema legal de medidas",
      "Razões e proporções; divisão proporcional; regras de três simples e compostas; porcentagens",
      "Lógica proposicional",
      "Noções de conjuntos",
      "Relações e funções; Funções polinomiais; Funções exponenciais e logarítmicas",
      "Matrizes",
      "Determinantes",
      "Sistemas lineares",
      "Sequências",
      "Progressões aritméticas e progressões geométricas"
    ],
    "ATUALIDADES DO MERCADO FINANCEIRO": [
      "Os bancos na Era Digital: Atualidade, tendências e desafios",
      "Internet banking",
      "Mobile banking",
      "Open banking",
      "Novos modelos de negócios",
      "Fintechs, startups e big techs",
      "Sistema de bancos sombra (Shadow banking)",
      "Funções da moeda",
      "O dinheiro na era digital: blockchain, bitcoin e demais criptomoedas",
      "Marketplace",
      "Correspondentes bancários",
      "Arranjos de pagamentos",
      "Sistema de pagamentos instantâneos (PIX)",
      "Segmentação e interações digitais",
      "Transformação digital no Sistema Financeiro"
    ]
  },
  "CONHECIMENTOS ESPECÍFICOS": {
    "MATEMÁTICA FINANCEIRA": [
      "Conceitos gerais - O conceito do valor do dinheiro no tempo; Capital, juros, taxas de juros",
      "Capitalização, regimes de capitalização",
      "Fluxos de caixa e diagramas de fluxo de caixa",
      "Equivalência financeira",
      "Juros simples - Cálculo do montante, dos juros, da taxa de juros, do principal e do prazo da operação financeira",
      "Juros compostos - Cálculo do montante, dos juros, da taxa de juros, do principal e do prazo da operação financeira",
      "Sistemas de amortização - Sistema price; Sistema SAC"
    ],
    "CONHECIMENTOS BANCÁRIOS": [
      "Sistema Financeiro Nacional: Estrutura do Sistema Financeiro Nacional",
      "Órgãos normativos e instituições supervisoras, executoras e operadoras",
      "Mercado financeiro e seus desdobramentos",
      "Moeda e política monetária",
      "Orçamento público, títulos do Tesouro Nacional e dívida pública",
      "Produtos Bancários",
      "Noções de Mercado de capitais",
      "Noções de Mercado de Câmbio",
      "Regimes de taxas de câmbio fixas, flutuantes e regimes intermediários",
      "Taxas de câmbio nominais e reais",
      "Impactos das taxas de câmbio sobre as exportações e importações",
      "Diferencial de juros interno e externo",
      "Dinâmica do Mercado",
      "Mercado bancário",
      "Garantias do Sistema Financeiro Nacional",
      "Crime de lavagem de dinheiro",
      "Autorregulação bancária",
      "Sigilo Bancário",
      "Lei Geral de Proteção de Dados (LGPD)",
      "Legislação anticorrupção",
      "Segurança cibernética",
      "Ética aplicada",
      "Política de Responsabilidade Socioambiental do Banco do Brasil"
    ],
    "CONHECIMENTOS DE INFORMÁTICA": [
      "Noções de sistemas operacionais",
      "Edição de textos, planilhas e apresentações",
      "Segurança da informação",
      "Proteção de estações de trabalho",
      "Conceitos de organização e de gerenciamento de informações",
      "Redes de computadores",
      "Navegador Web",
      "Correio eletrônico, grupos de discussão, fóruns e wikis",
      "Redes Sociais",
      "Visão geral sobre sistemas de suporte à decisão e inteligência de negócio",
      "Fundamentos sobre análise de dados",
      "Conceitos de educação a distância",
      "Conceitos de tecnologias e ferramentas multimídia",
      "Ferramentas de produtividade e trabalho a distância"
    ],
    "VENDAS E NEGOCIAÇÃO": [
      "Noções de estratégia empresarial",
      "Segmentação de mercado",
      "Ações para aumentar o valor percebido pelo cliente",
      "Gestão da experiência do cliente",
      "Aprendizagem e sustentabilidade organizacional",
      "Características dos serviços",
      "Gestão da qualidade em serviços",
      "Técnicas de vendas",
      "Noções de marketing digital",
      "Ética e conduta profissional em vendas",
      "Padrões de qualidade no atendimento aos clientes",
      "Utilização de canais remotos para vendas",
      "Comportamento do consumidor e sua relação com vendas e negociação",
      "Política de Relacionamento com o Cliente",
      "Resolução CMN nº 4.860",
      "Lei Brasileira de Inclusão da Pessoa com Deficiência",
      "Código de Proteção e Defesa do Consumidor"
    ]
  }
};

class EstudosManager {
  constructor() {
    this.data = this.loadData();
    this.currentItem = null;
    this.initializeUI();
    this.renderConteudo();
  }

  loadData() {
    return JSON.parse(localStorage.getItem('estudosBB')) || {};
  }

  saveData() {
    localStorage.setItem('estudosBB', JSON.stringify(this.data));
  }

  initializeUI() {
    // Modal elements
    this.modal = document.getElementById('modal');
    this.closeBtn = document.querySelector('.close');
    this.saveBtn = document.getElementById('save-notes');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    // Event listeners
    this.closeBtn.onclick = () => this.modal.style.display = "none";
    this.saveBtn.onclick = () => this.saveNotes();
    window.onclick = (e) => {
      if (e.target == this.modal) {
        this.modal.style.display = "none";
      }
    };

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn));
    });

    // File upload
    document.getElementById('file-upload').addEventListener('change', (e) => this.handleFileUpload(e));
  }

  switchTab(btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  }

  renderConteudo() {
    const container = document.getElementById('conteudos');
    container.innerHTML = '';

    Object.entries(conteudoProgramatico).forEach(([categoria, subcategorias]) => {
      const categoriaEl = document.createElement('div');
      categoriaEl.classList.add('categoria');
      categoriaEl.innerHTML = `
        <h2>
          ${categoria}
          <i class="fas fa-chevron-down toggle-icon"></i>
        </h2>
      `;

      const categoriaContent = document.createElement('div');
      categoriaContent.classList.add('categoria-content');

      Object.entries(subcategorias).forEach(([subcategoria, items]) => {
        const subcategoriaEl = document.createElement('div');
        subcategoriaEl.classList.add('subcategoria');
        subcategoriaEl.innerHTML = `
          <h3>
            ${subcategoria}
            <i class="fas fa-chevron-down toggle-icon"></i>
          </h3>
        `;

        items.forEach(item => {
          const itemData = this.data[item] || {
            status: 'não iniciado',
            notas: '',
            resumo: '',
            anexos: [],
            subtopicos: []
          };

          const itemEl = document.createElement('div');
          itemEl.classList.add('conteudo-item');
          itemEl.innerHTML = `
            <div class="conteudo-header">
              <h4>${item}</h4>
              <div class="status-container">
                <select class="status-select">
                  <option value="não iniciado" ${itemData.status === 'não iniciado' ? 'selected' : ''}>Não iniciado</option>
                  <option value="estudando" ${itemData.status === 'estudando' ? 'selected' : ''}>Estudando</option>
                  <option value="concluído" ${itemData.status === 'concluído' ? 'selected' : ''}>Concluído</option>
                </select>
                <button class="btn">Anotações</button>
              </div>
            </div>
          `;

          this.attachItemEventListeners(itemEl, item);
          subcategoriaEl.appendChild(itemEl);
        });

        categoriaContent.appendChild(subcategoriaEl);
      });

      categoriaEl.appendChild(categoriaContent);
      container.appendChild(categoriaEl);

      // Add click handlers for collapsible sections
      this.addCollapsibleHandlers(categoriaEl);
    });
  }

  addCollapsibleHandlers(categoriaEl) {
    const categoryHeader = categoriaEl.querySelector('h2');
    const subcategories = categoriaEl.querySelectorAll('.subcategoria');
    const items = categoriaEl.querySelectorAll('.conteudo-item');

    categoryHeader.addEventListener('click', () => {
      subcategories.forEach(sub => sub.classList.toggle('active'));
      categoryHeader.querySelector('.toggle-icon').classList.toggle('rotate');
    });

    subcategories.forEach(sub => {
      const subHeader = sub.querySelector('h3');
      const subItems = sub.querySelectorAll('.conteudo-item');
      
      subHeader.addEventListener('click', () => {
        subItems.forEach(item => item.classList.toggle('active'));
        subHeader.querySelector('.toggle-icon').classList.toggle('rotate');
      });
    });
  }

  attachItemEventListeners(itemEl, item) {
    const statusSelect = itemEl.querySelector('.status-select');
    const notesBtn = itemEl.querySelector('.btn');

    statusSelect.addEventListener('change', (e) => {
      this.updateStatus(item, e.target.value);
    });

    notesBtn.addEventListener('click', () => {
      this.openNotes(item);
    });
  }

  updateStatus(item, status) {
    if (!this.data[item]) {
      this.data[item] = {
        status: status,
        notas: '',
        resumo: '',
        anexos: [],
        subtopicos: []
      };
    } else {
      this.data[item].status = status;
    }
    this.saveData();
  }

  openNotes(item) {
    this.currentItem = item;
    this.modal.style.display = "block";
    
    if (!this.data[item]) {
      this.data[item] = {
        status: 'não iniciado',
        notas: '',
        resumo: '',
        anexos: [],
        subtopicos: []
      };
    }

    document.getElementById('notas-text').value = this.data[item].notas;
    document.getElementById('resumo-text').value = this.data[item].resumo;
    this.renderAnexos(this.data[item].anexos);
    this.renderSubtopicos();

    // Add subtopico handling
    document.getElementById('add-subtopico').onclick = () => {
      const input = document.getElementById('novo-subtopico');
      const subtopico = input.value.trim();
      
      if (subtopico) {
        this.data[item].subtopicos = this.data[item].subtopicos || [];
        this.data[item].subtopicos.push(subtopico);
        this.saveData();
        this.renderSubtopicos();
        input.value = '';
      }
    };
  }

  renderSubtopicos() {
    const container = document.getElementById('subtopicos-list');
    container.innerHTML = '';

    if (this.currentItem && this.data[this.currentItem].subtopicos) {
      this.data[this.currentItem].subtopicos.forEach((subtopico, index) => {
        const el = document.createElement('div');
        el.classList.add('subtopico-item');
        el.innerHTML = `
          <span>${subtopico}</span>
          <span class="delete-subtopico" data-index="${index}">×</span>
        `;

        el.querySelector('.delete-subtopico').onclick = () => {
          this.data[this.currentItem].subtopicos.splice(index, 1);
          this.saveData();
          this.renderSubtopicos();
        };

        container.appendChild(el);
      });
    }
  }

  saveNotes() {
    if (!this.currentItem) return;

    if (!this.data[this.currentItem]) {
      this.data[this.currentItem] = {
        status: 'não iniciado',
        notas: '',
        resumo: '',
        anexos: [],
        subtopicos: []
      };
    }

    this.data[this.currentItem].notas = document.getElementById('notas-text').value;
    this.data[this.currentItem].resumo = document.getElementById('resumo-text').value;
    
    this.saveData();
    this.modal.style.display = "none";
  }

  async handleFileUpload(event) {
    const files = event.target.files;
    if (!files.length || !this.currentItem) return;

    for (let file of files) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (!this.data[this.currentItem].anexos) {
          this.data[this.currentItem].anexos = [];
        }
        
        this.data[this.currentItem].anexos.push({
          name: file.name,
          type: file.type,
          data: e.target.result
        });
        
        this.saveData();
        this.renderAnexos(this.data[this.currentItem].anexos);
      };

      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
  }

  renderAnexos(anexos = []) {
    const container = document.getElementById('anexos-preview');
    container.innerHTML = '';

    anexos.forEach((anexo, index) => {
      const anexoEl = document.createElement('div');
      anexoEl.classList.add('anexo-item');

      if (anexo.type.startsWith('image/')) {
        anexoEl.innerHTML = `
          <img src="${anexo.data}" alt="${anexo.name}">
          <span>${anexo.name}</span>
          <span class="delete-anexo" data-index="${index}">Excluir</span>
        `;
      } else {
        anexoEl.innerHTML = `
          <div class="pdf-preview">📄</div>
          <span>${anexo.name}</span>
          <span class="delete-anexo" data-index="${index}">Excluir</span>
        `;
      }

      const deleteBtn = anexoEl.querySelector('.delete-anexo');
      deleteBtn.addEventListener('click', () => {
        this.deleteAnexo(index);
      });

      container.appendChild(anexoEl);
    });
  }

  deleteAnexo(index) {
    if (!this.currentItem || !this.data[this.currentItem].anexos) return;
    
    this.data[this.currentItem].anexos.splice(index, 1);
    this.saveData();
    this.renderAnexos(this.data[this.currentItem].anexos);
  }
}

// Initialize the application
new EstudosManager();
