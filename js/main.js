/*!
* show-more buttons in cards
*/
const showMoreButton = () => {
    'use strict'

    const cards = document.querySelectorAll('.card');

    cards.forEach(function (card) {
        const cardText = card.querySelector('.card-text');
        const showMoreButton = card.querySelector('.show-more');
        cardText.style.webkitLineClamp = '2';

        if (cardText.scrollHeight > cardText.clientHeight) {
            showMoreButton.style.display = 'inline-block';
        }

        showMoreButton.addEventListener('click', function (e) {
            e.preventDefault();
            if (cardText.style.webkitLineClamp === '2') {
                cardText.style.webkitLineClamp = 'unset';
                showMoreButton.textContent = 'Show less';
            } else {
                cardText.style.webkitLineClamp = '2';
                showMoreButton.textContent = 'Show more...';
            }
        });
    });
}

showMoreButton();

/*!
* infinite scroll in cards
*/

(() => {
    'use strict'
    
    const cardsContainer = document.getElementById('cards-container');
    const cardsLoader = document.querySelector('.cards-loader');
    let currentPage = 1;
    let limit = 9;

    const getCards = async (page, limit) => {
        const API_URL = `https://picsum.photos/v2/list?page=${page}&limit=${limit}`;
        let res;
        try {
            res = await fetch(API_URL);
        } catch (err) {
            throw new Error(err);
        } finally {
            showMoreButton();
        }
        return await res.json();
    };

    const showCards = (cards) => {
        cards.forEach(cardData => {
            const card = document.createElement('div');
            card.classList.add('col');
            card.innerHTML = `
                 <div class="card">
                        <a href="#" title="${cardData.author}">
                            <img src="${cardData.download_url}" loading="lazy" width="${cardData.width}" height="${cardData.height}" class="card-img-top img-fluid" alt="${cardData.author}">
                        </a>
                        <div class="card-body px-4">
                            <h5 class="card-title fs-4 fw-bold">
                                <a href="#" title="${cardData.author}" class="link-underline link-underline-opacity-0 link-underline-opacity-75-hover">${cardData.author}</a>
                            </h5>
                            <p class="card-text mb-2">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab dicta eos harum ipsam iste modi necessitatibus, praesentium quaerat sequi tempora. Adipisci amet aspernatur, cumque cupiditate debitis dicta dolores ea est explicabo fugit in inventore, itaque iure laboriosam libero minima molestias natus nulla officia perspiciatis porro quae quasi, quibusdam repudiandae totam vero voluptas voluptatibus? Architecto, maxime minus quas quod repellat tempora.</p>
                            <a href="#" class="show-more link-underline link-underline-opacity-0 link-underline-opacity-75-hover" title="Show more...">Show more...</a>
                        </div>
                      <div class="card-footer py-3 bg-transparent d-flex gap-3">
                        <button type="button" class="btn btn-primary text-light px-3 rounded-3" aria-label="Save to collection">Save to collection</button>
                        <button type="button" class="btn btn-secondary px-3 rounded-3 bg-transparent border-secondary border-2" aria-label="Share">Share</button>
                     </div>
                </div>
            `;
            cardsContainer.appendChild(card);
        });
    };

    const hideLoader = () => {
        cardsLoader.classList.remove('opacity-100');
    };

    const showLoader = () => {
        cardsLoader.classList.add('opacity-100');
    };

    const loadCards = (page, limit) => {
        showLoader();
        setTimeout(async () => {
            try {
                const res = await getCards(page, limit);
                showCards(res);
            } catch (err) {
                throw Error(err);
            } finally {
                observeLastCard();
                hideLoader();
                showMoreButton();
            }
        }, 1000);
    };

    const handleScroll = (entries, observer) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;

        currentPage++;
        loadCards(currentPage, limit);
        observer.unobserve(entry.target);
    };

    const infScrollObserver = new IntersectionObserver(handleScroll, {});

    const observeLastCard = () => {
        infScrollObserver.observe(cardsLoader);
    };
    observeLastCard();
})();

/*!
* Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
*/

(() => {
    'use strict'

    const storedTheme = localStorage.getItem('theme')

    const getPreferredTheme = () => {
        if (storedTheme) {
            return storedTheme
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    const setTheme = function (theme) {
        if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-bs-theme', 'dark')
        } else {
            document.documentElement.setAttribute('data-bs-theme', theme)
        }
    }

    setTheme(getPreferredTheme())

    const showActiveTheme = (theme, focus = false) => {
        const themeSwitcher = document.querySelector('#bd-theme')

        if (!themeSwitcher) {
            return
        }

        const themeSwitcherText = document.querySelector('#bd-theme-text')
        const activeThemeIcon = document.querySelector('.theme-icon-active use')
        const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
        const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href')

        document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
            element.classList.remove('active')
            element.setAttribute('aria-pressed', 'false')
        })

        btnToActive.classList.add('active')
        btnToActive.setAttribute('aria-pressed', 'true')
        activeThemeIcon.setAttribute('href', svgOfActiveBtn)
        const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
        themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)

        if (focus) {
            themeSwitcher.focus()
        }
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (storedTheme !== 'light' || storedTheme !== 'dark') {
            setTheme(getPreferredTheme())
        }
    })

    window.addEventListener('DOMContentLoaded', () => {
        showActiveTheme(getPreferredTheme())

        document.querySelectorAll('[data-bs-theme-value]')
            .forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const theme = toggle.getAttribute('data-bs-theme-value')
                    localStorage.setItem('theme', theme)
                    setTheme(theme)
                    showActiveTheme(theme, true)
                })
            })
    })
})();
