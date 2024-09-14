const token = "84f2cb04-74a4-465b-be4c-4b79953985af";
class Card {
    constructor(id, doctor, visitPurpose, bloodPressure, bmi, medicalHistory, urgency, visitStatus) {
        this._id = id;
        this._doctor = doctor;
        this._visitPurpose = visitPurpose;
        this._bloodPressure = bloodPressure;
        this._bmi = bmi;
        this._medicalHistory = medicalHistory;
        this._urgency = urgency;
        this._visitStatus = visitStatus;
    }

    get id() {
        return this._id;
    }

    get doctor() {
        return this._doctor;
    }

    get visitPurpose() {
        return this._visitPurpose;
    }

    get bloodPressure() {
        return this._bloodPressure;
    }

    get bmi() {
        return this._bmi;
    }

    get medicalHistory() {
        return this._medicalHistory;
    }

    get urgency() {
        return this._urgency;
    }

    get visitStatus() {
        return this._visitStatus;
    }

    set doctor(value) {
        this._doctor = value;
    }

    set visitPurpose(value) {
        this._visitPurpose = value;
    }

    set bloodPressure(value) {
        this._bloodPressure = value;
    }

    set bmi(value) {
        this._bmi = value;
    }

    set medicalHistory(value) {
        this._medicalHistory = value;
    }

    set urgency(value) {
        this._urgency = value;
    }

    set visitStatus(value) {
        this._visitStatus = value;
    }
}

class CardManager {
    constructor() {
        this.apiUrl = "https://ajax.test-danit.com/api/v2/cards";
        this.cards = [];
    }


    async fetchCards() {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                console.error("Невірний токен або токен відсутній.");
                return;
            }

            if (!response.ok) {
                throw new Error('Помилка при отриманні карток');
            }

            const cardData = await response.json();
            console.log(cardData);
            this.cards = cardData.map(card => new Card(
                card.id,
                card.doctor || "Не вказано",
                card.visitPurpose || "Не вказано",
                card.bloodPressure || "Не вказано",
                card.bmi || "Не вказано",
                card.medicalHistory || "Не вказано",
                card.urgency || "Не вказано",
                card.visitStatus || "Не вказано"
            ));

            return this.cards;
        } catch (error) {
            console.error("Помилка при отриманні карток:", error);
        }
    }

    async addCard(doctor, visitPurpose, bloodPressure, bmi, medicalHistory, urgency, visitStatus) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    doctor,
                    visitPurpose,
                    bloodPressure,
                    bmi,
                    medicalHistory,
                    urgency,
                    visitStatus
                })
            });


            if (!response.ok) {
                throw new Error('Помилка при додаванні картки');
            }

            const newCard = await response.json();
            this.cards.push(new Card(
                newCard.id,
                newCard.doctor,
                newCard.visitPurpose,
                newCard.bloodPressure,
                newCard.bmi,
                newCard.medicalHistory,
                newCard.urgency,
                newCard.visitStatus
            ));
        } catch (error) {
            console.error("Помилка при додаванні картки:", error);
        }
    }

    async deleteCard(cardId) {
        try {
            const response = await fetch(`${this.apiUrl}/${cardId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Помилка при видаленні картки');
            }

            this.cards = this.cards.filter(card => card.id !== cardId);
        } catch (error) {
            console.error("Помилка при видаленні картки:", error);
        }
    }

    async editCard(cardId, updatedInfo) {
        try {
            const response = await fetch(`${this.apiUrl}/${cardId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedInfo)
            });

            if (!response.ok) {
                throw new Error('Помилка при редагуванні картки');
            }

            const updatedCard = await response.json();
            const card = this.cards.find(card => card.id === cardId);
            if (card) {
                Object.assign(card, updatedCard);
            } else {
                console.error(`Картку з id ${cardId} не знайдено.`);
            }
        } catch (error) {
            console.error("Помилка при редагуванні картки:", error);
        }
    }
}