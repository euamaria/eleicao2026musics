document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const tagFilter = document.getElementById('tagFilter');
    const cards = document.querySelectorAll('.musica-card');
    const noResultsMessage = document.getElementById('noResultsMessage');

    if (!searchInput && !categoryFilter && !tagFilter) return;

    function filterCards() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const categoryTerm = categoryFilter ? categoryFilter.value.toLowerCase() : '';
        const tagTerm = tagFilter ? tagFilter.value.toLowerCase() : '';

        let visibleCount = 0;

        cards.forEach(card => {
            // Se o card estiver na home (recent-musicas), nao filtra a menos que a classe seja diferente.
            // Para evitar bugs, vamos garantir que estamos filtrando os cards certos
            if(!card.hasAttribute('data-title')) return;

            const title = card.getAttribute('data-title');
            const category = card.getAttribute('data-category');
            const tags = card.getAttribute('data-tags');
            const content = card.getAttribute('data-content');

            const matchesSearch = title.includes(searchTerm) || content.includes(searchTerm);
            const matchesCategory = categoryTerm === '' || category === categoryTerm;

            // Tratamento para tags: ver se o array de tags (string separada por virgula) inclui o termo exato
            let matchesTag = true;
            if (tagTerm !== '') {
                const tagsArray = tags.split(',');
                matchesTag = tagsArray.includes(tagTerm);
            }

            if (matchesSearch && matchesCategory && matchesTag) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (noResultsMessage) {
            if (visibleCount === 0) {
                noResultsMessage.classList.remove('hidden');
            } else {
                noResultsMessage.classList.add('hidden');
            }
        }
    }

    if (searchInput) searchInput.addEventListener('input', filterCards);
    if (categoryFilter) categoryFilter.addEventListener('change', filterCards);
    if (tagFilter) tagFilter.addEventListener('change', filterCards);
});
