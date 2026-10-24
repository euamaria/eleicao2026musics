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

// Playlist Scripts
document.addEventListener('DOMContentLoaded', function() {
    const playlistDataElement = document.getElementById('playlistData');
    if (!playlistDataElement) return;

    try {
        const playlistData = JSON.parse(playlistDataElement.textContent);
        const trackItems = document.querySelectorAll('.track-item');
        const mainContent = document.getElementById('playlistMainContent');

        trackItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all
                trackItems.forEach(t => t.classList.remove('active'));
                // Add active class to clicked
                this.classList.add('active');

                const index = parseInt(this.getAttribute('data-index'), 10);
                const track = playlistData[index];

                renderTrackDetails(track, mainContent);
            });
        });
    } catch (e) {
        console.error("Error parsing playlist data", e);
    }
});

function renderTrackDetails(track, container) {
    let html = `
        <article class="musica-content">
            <header class="musica-header">
                <h2><a href="${track.url}">${track.title}</a></h2>
                <div class="musica-meta">
    `;

    if (track.duration) {
        html += `<p><strong>Duração:</strong> ${track.duration}</p>`;
    }
    if (track.compositor) {
        html += `<p><strong>Compositor:</strong> ${track.compositor}</p>`;
    }

    html += `
                </div>
            </header>
            <div class="musica-layout">
                <div class="musica-main" style="flex: 1;">
    `;

    if (track.thumbnail) {
        html += `
            <div class="thumbnail">
                <img src="${track.thumbnail}" alt="Thumbnail para ${track.title}">
            </div>
        `;
    }

    if (track.audio_url) {
        html += `
            <div class="audio-player">
                <audio controls autoplay>
                    <source src="${track.audio_url}" type="audio/mpeg">
                    Seu navegador não suporta o elemento de áudio.
                </audio>
            </div>
        `;
    }

    html += `
            <div class="letra">
                <h3>Letra</h3>
                <div class="letra-content">
                    ${track.content}
                </div>
            </div>
    `;

    if (track.images && track.images.length > 0) {
        html += `
            <div class="related-images">
                <h3>Imagens Relacionadas</h3>
                <div class="image-gallery">
                    ${track.images.map(img => `<img src="${img}" alt="Imagem relacionada">`).join('')}
                </div>
            </div>
        `;
    }

    html += `</div>`; // end musica-main

    // Add Sidebar for facts if they exist
    if (track.facts && track.facts.length > 0) {
        html += `
            <aside class="musica-sidebar">
                <div class="fact-checking">
                    <h3>Checagem de Fatos</h3>
                    <ul class="fact-list">
                        ${track.facts.map(fact => `
                            <li class="fact-item">
                                <div class="fact-stanza"><strong>Estrofe/Trecho:</strong> ${fact.stanza}</div>
                                <div class="fact-info"><strong>Fato:</strong> ${fact.fact}</div>
                                ${fact.source_url ? `
                                    <div class="fact-source">
                                        <strong>Fonte:</strong> <a href="${fact.source_url}" target="_blank" rel="noopener noreferrer">${fact.source_name || 'Link'}</a>
                                    </div>
                                ` : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </aside>
        `;
    }

    html += `
            </div>
        </article>
    `;

    container.innerHTML = html;
}
