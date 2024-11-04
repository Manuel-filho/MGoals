# MGoals (Gerenciador de Metas)

Este projecto é uma aplicação progressiva para gerenciamento de metas pessoais, desenvolvido em HTML, CSS e JavaScript (Com JSON). Ele permite aos usuários criar metas, acompanhar o progresso diário e gerenciar suas etapas de maneira organizada. O aplicativo oferece funcionalidades de autenticação, criação de metas, monitoramento de progresso e visualização por meio de um calendário interactivo.

## Funcionalidades

- **Autenticação de Usuário**: O sistema permite login e cadastro utilizando o armazenamento local do navegador.
- **Criação de Metas**: Usuários podem criar metas com título, data de início e data de término, além de adicionar etapas específicas.
- **Acompanhamento de Progresso**: Cada meta tem um acompanhamento visual de progresso que integra o total de dias completados e as etapas concluídas.
- **Calendário de Metas**: Visualização em calendário para marcar dias em que o progresso foi feito, com destaque para dias completos.
- **Interface Amigável**: O design responsivo e moderno facilita a navegação em dispositivos móveis e desktops.

## Estrutura de Arquivos

Abaixo está a estrutura de diretórios e arquivos do projecto **MGoals**:

```plaintext
├── assets
│   ├── css
│   │   ├── autenticacao.css
│   │   ├── index.css
│   │   ├── metas.css
│   │   ├── principal.css
│   │   └── progresso.css
│   ├── imagens
│   └── js
│       ├── autenticacao.js
│       ├── index.js
│       ├── metas.js
│       ├── principal.js
│       └── progresso.js
├── config
│   ├── manifest.json
│   └── service-worker.js
├── paginas
│   ├── autenticacao.html
│   ├── metas.html
│   ├── progresso.html
│   └── index.html
└── README.md
```

- **assets/css**: Contém os arquivos CSS para estilizar cada página e componente da aplicação.
- **assets/imagens**: Diretório reservado para imagens da aplicação.
- **assets/js**: Contém arquivos JavaScript para gerenciar a lógica de cada página.
- **config**: Arquivos de configuração do PWA, incluindo o manifesto e o service worker.
- **paginas**: Páginas HTML principais, cada uma com funcionalidades específicas da aplicação.
- **README.md**: Arquivo de documentação do projecto.

## Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/manuel-filho/MGoals.git
   ```
   
2. Navegue até o diretório do projecto:
   ```bash
   cd MGoals
   ```

3. Abra o arquivo `index.html` no navegador para iniciar a aplicação.

> **Nota**: Como uma aplicação PWA, esta interface pode ser instalada na tela inicial de dispositivos móveis ou desktop para fácil acesso.

## Uso

1. Abra `index.html` no navegador.
2. Faça login ou cadastre-se na aplicação.
3. Navegue até o **Gerenciador de Metas** para criar e gerenciar suas metas.
4. Adicione etapas para cada meta, defina datas de início e fim, e acompanhe o progresso.
5. Use o **Calendário de Progresso** para marcar os dias em que as metas foram trabalhadas.

## Tecnologias Utilizadas

- **HTML5**
- **CSS3**
- **JavaScript** (Armazenamento em LocalStorage)
- **JSON** (Criação do Manifesto)
- **Font Awesome** (ícones)
- **Sortable.js** (Ordenação de etapas)

## Funcionalidades Futuras

- Notificações para lembrar dos prazos das metas.
- Sincronização com um banco de dados remoto para persistência entre dispositivos.
- Relatórios de progresso em gráficos.

## Contribuição

Sinta-se à vontade para fazer um *Pull Request* ou, se preferir, criar um *Fork*  personalizado utilizando este código, desde que cite o repositório original e o seu criador, **[Manuel Filho](https://github.com/manuel-filho/)** .

1. Faça um fork deste repositório.
2. Crie uma branch para sua feature.
3. Commit suas alterações.
4. Faça push para a branch.
5. Abra um Pull Request.

## Licença

Este projecto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](https://github.com/Manuel-filho/MGoals/blob/main/LICENSE) para obter mais detalhes.
