const getToken = async (email, password) => {
    try {
        const response = await fetch("https://ajax.test-danit.com/api/v2/cards/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const token = await response.text();
        localStorage.setItem('authToken', token);

        return token;
    } catch (error) {
        console.error("Помилка при отриманні токену:", error);
    }
};



const fetchCards = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.error("Токен не знайдено. Будь ласка, увійдіть.");
        return;
    }

    try {
        const response = await fetch("https://ajax.test-danit.com/api/v2/cards", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // if (!response.ok) {
        //     throw new Error('Помилка при отриманні карток');
        // }

        const cards = await response.json();
        return cards;
    } catch (error) {
        console.error("Помилка при отриманні карток:", error);
    }
};


const loadCards = async () => {
    const cards = await fetchCards();
};



window.addEventListener('load', loadCards);

const displayCards = (cards) => {
    const cardContainer = document.querySelector('#cardContainer');
    cardContainer.innerHTML = '';

    cards.forEach((card) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.id = `card-${card.id}`;
        cardElement.innerHTML = `
            розмітка для картки
        `;
        cardContainer.appendChild(cardElement);
    });
};



const editCard = (cardId) => {
    const cardElement = document.getElementById(`card-${cardId}`);
    const currentTitle = cardElement.querySelector('h3').textContent;
    const currentDescription = cardElement.querySelector('p').textContent;

    cardElement.innerHTML = `
        форма для зміни картки
    `;
};



const saveCard = async (cardId) => {
    const token = localStorage.getItem('authToken');
    const newTitle = document.getElementById(`editTitle-${cardId}`).value;
    const newDescription = document.getElementById(`editDescription-${cardId}`).value;

    try {
        const response = await fetch(`https://ajax.test-danit.com/api/v2/cards/${cardId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: newTitle,
                description: newDescription
            })
        });

        // if (!response.ok) {
        //     throw new Error('Помилка при збереженні картки');
        // }

        loadCards();
    } catch (error) {
        console.error("Помилка:", error);
    }
};



const deleteCard = async (cardId) => {
    const token = localStorage.getItem('authToken');

    const confirmDelete = confirm("Ви впевнені, що хочете видалити цю картку?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`https://ajax.test-danit.com/api/v2/cards/${cardId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // if (!response.ok) {
        //     throw new Error('Помилка при видаленні картки');
        // }

        document.getElementById(`card-${cardId}`).remove();
    } catch (error) {
        console.error("Помилка при видаленні картки:", error);
    }
};



const updateCardInDOM = (cardId, updatedData) => {
    const cardElement = document.getElementById(`card-${cardId}`);
    cardElement.querySelector('h3').textContent = updatedData.title;
    cardElement.querySelector('p').textContent = updatedData.description;
};


const saveCardAfterDlCrEd = async (cardId) => {
    const token = localStorage.getItem('authToken');
    const newTitle = document.getElementById(`editTitle-${cardId}`).value;
    const newDescription = document.getElementById(`editDescription-${cardId}`).value;

    try {
        const response = await fetch(`https://ajax.test-danit.com/api/v2/cards/${cardId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: newTitle,
                description: newDescription
            })
        });

        const updatedCard = await response.json();
        updateCardInDOM(cardId, updatedCard);
    } catch (error) {
        console.error("Помилка:", error);
    }
};
