
class Modal {
    constructor(modalId, closeSelector) {
        this.modal = document.getElementById(modalId);
        this.closeBtn = document.querySelector(closeSelector);

        this.closeBtn.onclick = () => {
            this.close();
        };

        window.onclick = (event) => {
            if (event.target == this.modal) {
                this.close();
            }
        };
    }

    open() {
        this.modal.style.display = "block";
    }

    close() {
        this.modal.style.display = "none";
    }
}

class CardViewer {
    constructor() {
        this.modal = new Modal('showCardModal', '.close[data-modal="showCardModal"]');
    }

    showCard(cardData) {
        document.getElementById('viewDoctor').textContent = cardData.doctor || 'Не вказано';
        document.getElementById('viewVisitPurpose').textContent = cardData.visitPurpose || 'Не вказано';
        document.getElementById('viewBloodPressure').textContent = cardData.bloodPressure || 'Не вказано';
        document.getElementById('viewBMI').textContent = cardData.bmi || 'Не вказано';
        document.getElementById('viewMedicalHistory').textContent = cardData.medicalHistory || 'Не вказано';
        document.getElementById('viewUrgency').textContent = cardData.urgency || 'Не вказано';
        document.getElementById('viewVisitStatus').textContent = cardData.status || 'Не вказано';

        this.modal.open();
    }
}

class CardEditor {
    constructor(apiUrl, token, updateCardListCallback) {
        this.apiUrl = apiUrl;
        this.token = token;
        this.updateCardListCallback = updateCardListCallback;
        // Ініціалізація модального вікна для редагування
        this.modal = new Modal('editCardModal', '.close[data-modal="editCardModal"]');
    }

    openEditModal(cardData) {
        document.getElementById('editCardId').value = cardData.id;
        document.getElementById('editDoctor').value = cardData.doctor || '';
        document.getElementById('editVisitPurpose').value = cardData.visitPurpose || '';
        document.getElementById('editBloodPressure').value = cardData.bloodPressure || '';
        document.getElementById('editBMI').value = cardData.bmi || '';
        document.getElementById('editMedicalHistory').value = cardData.medicalHistory || '';
        document.getElementById('editUrgency').value = cardData.urgency || '';
        document.getElementById('editVisitStatus').value = cardData.status || '';

        const form = document.getElementById('editCardForm');

        form.onsubmit = (event) => {
            event.preventDefault();
            this.submitEdit();
        };

        this.modal.open();
    }

    async submitEdit() {
        const cardId = document.getElementById('editCardId').value;
        const cardData = {
            id: cardId,
            doctor: document.getElementById('editDoctor').value,
            visitPurpose: document.getElementById('editVisitPurpose').value,
            bloodPressure: document.getElementById('editBloodPressure').value,
            bmi: document.getElementById('editBMI').value,
            medicalHistory: document.getElementById('editMedicalHistory').value,
            urgency: document.getElementById('editUrgency').value,
            status: document.getElementById('editVisitStatus').value
        };

        try {
            const response = await fetch(`${this.apiUrl}/${cardId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(cardData)
            });

            if (!response.ok) {
                throw new Error(`Помилка оновлення картки: ${response.status} ${response.statusText}`);
            }

            const updatedCard = await response.json();
            console.log("Картка оновлена успішно:", updatedCard);

            this.updateCardListCallback(updatedCard);

            this.modal.close();
        } catch (error) {
            console.error("Помилка при оновленні картки:", error);
        }
    }
}

class CardManager {
    constructor() {
        this.apiUrl = "https://ajax.test-danit.com/api/v2/cards";
        this.token = prompt("Введіть ваш токен для автентифікації:");

        if (!this.token) {
            alert("Токен не вказаний. Ви не можете отримати картки без токена.");
            return;
        }

        this.cardEditor = new CardEditor(this.apiUrl, this.token, this.updateCard.bind(this));
        this.cardViewer = new CardViewer();

        this.loadCardsFromLocalStorage();
    }

    async createCard(cardData) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(cardData)
            });

            if (!response.ok) {
                throw new Error(`Помилка створення картки: ${response.status} ${response.statusText}`);
            }

            const createdCard = await response.json();
            console.log("Картка створена успішно:", createdCard);
            this.saveCardToLocalStorage(createdCard);
            this.displayCards([createdCard]);
        } catch (error) {
            console.error("Помилка при створенні картки:", error);
        }
    }

    async fetchCards() {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Помилка: ${response.status} ${response.statusText}`);
            }

            const cards = await response.json();
            this.saveCardsToLocalStorage(cards);
            this.displayCards(cards);
        } catch (error) {
            console.error("Помилка при отриманні карток:", error);
        }
    }

    saveCardsToLocalStorage(cards) {
        localStorage.setItem('cards', JSON.stringify(cards));
    }

    saveCardToLocalStorage(card) {
        const cards = this.loadCardsFromLocalStorage();
        cards.push(card);
        this.saveCardsToLocalStorage(cards);
    }

    loadCardsFromLocalStorage() {
        const storedCards = localStorage.getItem('cards');
        const cards = storedCards ? JSON.parse(storedCards) : [];
        this.displayCards(cards);
        return cards;
    }

    displayCards(cards) {
        const cardContainer = document.getElementById('cardContainer');
        cardContainer.innerHTML = '';

        if (cards.length === 0) {
            cardContainer.textContent = "Немає карток для відображення.";
            return;
        }

        cards.forEach((card) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.innerHTML = `
        <h3>${card.doctor || 'Лікар не вказаний'}</h3>
        <p><strong>Мета візиту:</strong> ${card.visitPurpose || 'Не вказано'}</p>
        <p><strong>Терміновість:</strong> ${card.urgency || 'Не вказано'}</p>
        <p><strong>Тиск:</strong> ${card.bloodPressure || 'Не вказано'}</p>
        <p><strong>ІМТ:</strong> ${card.bmi || 'Не вказано'}</p>
        <p><strong>Історія хвороб:</strong> ${card.medicalHistory || 'Не вказано'}</p>
        <p><strong>Статус візиту:</strong> ${card.status || 'Не вказано'}</p>
        <button class="edit-card" data-card-id="${card.id}">Редагувати</button>
        <button class="show-card" data-card-id="${card.id}">Переглянути</button>
      `;
            cardContainer.appendChild(cardElement);
        });

        this.addEventListeners();
    }

    updateCard(updatedCard) {
        const cards = this.loadCardsFromLocalStorage();
        const index = cards.findIndex(card => card.id === updatedCard.id);
        if (index !== -1) {
            cards[index] = updatedCard;
            this.saveCardsToLocalStorage(cards);
            this.displayCards(cards);
        }
    }

    addEventListeners() {
        document.querySelectorAll('.edit-card').forEach(button => {
            button.addEventListener('click', (event) => {
                const cardId = event.target.dataset.cardId;
                const card = this.loadCardsFromLocalStorage().find(c => c.id == cardId);
                if (card) {
                    this.cardEditor.openEditModal(card);
                }
            });
        });

        document.querySelectorAll('.show-card').forEach(button => {
            button.addEventListener('click', (event) => {
                const cardId = event.target.dataset.cardId;
                const card = this.loadCardsFromLocalStorage().find(c => c.id == cardId);
                if (card) {
                    this.cardViewer.showCard(card);
                }
            });
        });
    }
}

const cardManager = new CardManager();

document.getElementById('createCardForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const cardData = {
        doctor: document.getElementById('doctor').value,
        visitPurpose: document.getElementById('visitPurpose').value,
        bloodPressure: document.getElementById('bloodPressure').value,
        bmi: document.getElementById('bmi').value,
        medicalHistory: document.getElementById('medicalHistory').value,
        urgency: document.getElementById('urgency').value,
        status: document.getElementById('status').value
    };

    cardManager.createCard(cardData);
});
