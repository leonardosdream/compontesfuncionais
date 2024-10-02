<script>
    let filteredItemsGlobal = [];

    function styleListContainer() {
        const listContainer = document.getElementById('document-list-items');
        Object.assign(listContainer.style, {
            listStyle: 'none',
            padding: '0',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: '10px'
        });
    }

    // Função para estilizar cada item da lista
    function styleItems() {
        allItems = document.querySelectorAll('#document-list-items li'); // Armazena todos os itens
        const items = Array.from(allItems);
        let itemWidth = window.innerWidth < 768 ? '100%' : '100%'; // Itens ocupam 100% da largura em telas pequenas e 49% em telas maiores

        items.forEach(item => {
            Object.assign(item.style, {
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '28px',
                marginBottom: '12px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
                transition: 'transform 0.2s',
                width: itemWidth,
                alignContent: 'end',
                height: 'fit-content'
            });

            addHoverEffect(item);
            addIconToLink(item);
        });
    }

    // Função para adicionar efeito de hover
    function addHoverEffect(item) {
        item.addEventListener('mouseover', () => {
            item.style.border = '1px solid #0c74e4';
            item.style.transform = 'scale(1.02)';
        });

        item.addEventListener('mouseout', () => {
            item.style.border = '1px solid #ddd';
            item.style.transform = 'scale(1)';
        });
    }

    // Função para adicionar o ícone FontAwesome aos links de download
    function addIconToLink(item) {
        const link = item.querySelector('a');

        if (link && !link.querySelector('i.fas.fa-download')) { // Verifica se já existe o ícone com a classe 'fa-download'
            const icon = document.createElement('i');
            icon.classList.add('fas', 'fa-download');
            icon.style.marginRight = '8px';
            icon.style.color = '#00ee71';
            link.prepend(icon); // Adiciona o ícone antes do texto do link

            Object.assign(link.style, {
                fontSize: 'small',
                fontWeight: '700',
                display: 'block',
                margin: '16px 0 0 0'
            });
        }
    }

    // Função para filtrar a lista com base no input de texto
    function filterList() {
        const searchInput = document.getElementById('searchInput').value.toLowerCase();

        // Armazena os itens filtrados na variável global
        filteredItemsGlobal = Array.from(allItems).filter(item =>
            item.textContent.toLowerCase().includes(searchInput)
        );

        // Atualiza a exibição com os itens filtrados
        updateDisplay(filteredItemsGlobal);
        console.log('Itens filtrados:', filteredItemsGlobal);
    }

    // Função para limpar o filtro
    function clearFilter() {
        const searchInput = document.getElementById('searchInput');
        searchInput.value = ''; // Limpar o valor do input

        // Restaurar a exibição original com todos os itens
        filteredItemsGlobal = Array.from(allItems);
        updateDisplay(filteredItemsGlobal); // Atualizar a exibição com todos os itens
    }

    // Função para atualizar a exibição da lista e a paginação
    function updateDisplay(filteredItems) {
        const paginationContainer = document.getElementById('pagination');

        // Ocultar todos os itens
        allItems.forEach(item => {
            item.style.display = 'none'; // Ocultar todos os itens
        });

        // Mostrar apenas os itens filtrados
        filteredItems.forEach(item => {
            item.style.display = 'block'; // Exibir os itens filtrados
        });

        // Limpar e recriar a paginação com base nos itens filtrados
        const totalFilteredItems = filteredItems.length;

        if (totalFilteredItems > 0) {
            createPagination(totalFilteredItems, 10); // Recriar a paginação com os itens filtrados
            displayPage(1, 10); // Exibir a primeira página dos itens filtrados
        } else {
            paginationContainer.innerHTML = ''; // Ocultar a paginação se não houver itens
        }
    }

    // Função para criar a paginação com botão ativo
    function createPagination(totalItems, itemsPerPage) {
        const paginationContainer = document.getElementById('pagination');
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // Limpar conteúdo anterior
        paginationContainer.querySelector('ul').innerHTML = ''; // Limpar a lista

        // Ocultar a paginação se houver apenas uma página
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return; // Saia da função
        } else {
            paginationContainer.style.display = 'block'; // Mostrar a paginação
        }

        // Botão "Voltar"
        const prevButton = document.createElement('button');
        prevButton.classList.add('br-button', 'circle');
        prevButton.setAttribute('type', 'button');
        prevButton.setAttribute('data-previous-page', 'data-previous-page');
        prevButton.setAttribute('aria-label', 'Voltar página');
        prevButton.innerHTML = '<i class="fas fa-angle-left" aria-hidden="true"></i>';
        prevButton.onclick = () => {
            const currentPage = parseInt(paginationContainer.getAttribute('data-current'), 10);
            if (currentPage > 1) {
                displayPage(currentPage - 1, itemsPerPage);
            }
        };
        paginationContainer.querySelector('ul').appendChild(prevButton);

        // Números das páginas
        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.classList.add('page');
            pageLink.setAttribute('href', 'javascript:void(0)');
            pageLink.setAttribute('aria-label', `Página ${i}`);
            pageLink.innerText = i;
            pageLink.onclick = () => {
                displayPage(i, itemsPerPage);
            };
            paginationContainer.querySelector('ul').appendChild(pageLink);
        }

        // Botão "Próximo"
        const nextButton = document.createElement('button');
        nextButton.classList.add('br-button', 'circle');
        nextButton.setAttribute('type', 'button');
        nextButton.setAttribute('data-next-page', 'data-next-page');
        nextButton.setAttribute('aria-label', 'Página seguinte');
        nextButton.innerHTML = '<i class="fas fa-angle-right" aria-hidden="true"></i>';
        nextButton.onclick = () => {
            const currentPage = parseInt(paginationContainer.getAttribute('data-current'), 10);
            if (currentPage < totalPages) {
                displayPage(currentPage + 1, itemsPerPage);
            }
        };
        paginationContainer.querySelector('ul').appendChild(nextButton);

        // Atualizar os atributos de dados
        paginationContainer.setAttribute('data-total', totalPages);
        paginationContainer.setAttribute('data-current', 1);
    }


    // Função para exibir os itens da página selecionada
    function displayPage(pageNumber, itemsPerPage) {
        const totalItems = filteredItemsGlobal.length;

        // Calcular o índice inicial e final dos itens a serem exibidos
        const start = (pageNumber - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        // Ocultar todos os itens
        allItems.forEach(item => item.style.display = 'none');

        // Mostrar apenas os itens da página atual
        for (let i = start; i < end && i < totalItems; i++) {
            filteredItemsGlobal[i].style.display = 'block'; // Exibir os itens da página
        }

        // Atualizar a página ativa
        setActivePageButton(pageNumber);
    }

    // Função para definir o botão da página ativa
    function setActivePageButton(pageNumber) {
        const pageLinks = document.querySelectorAll('#pagination .page');
        pageLinks.forEach(link => link.classList.remove('active')); // Remover classe ativa de todos os links
        pageLinks[pageNumber - 1].classList.add('active'); // Adicionar classe ativa ao link da página selecionada
    }
    // Função principal que chama as outras funções
    function init() {
        styleListContainer();
        styleItems();

        // Exibir todos os itens inicialmente
        filteredItemsGlobal = Array.from(allItems);

        const itemsPerPage = 10; // Definindo 10 itens por página
        createPagination(allItems.length, itemsPerPage);
        displayPage(1, itemsPerPage); // Exibir a primeira página ao inicializar
    }

    // Evento DOMContentLoaded para executar o código após o carregamento do DOM
    document.addEventListener('DOMContentLoaded', init);
    window.addEventListener('resize', styleItems);

</script>
