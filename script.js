const logInEmail = 'admin@gmail.com'
const logInPass = 'admin'
const logIn = document.querySelector('.btn-log-in')
const bookVisit = document.querySelector('.btn-book-visit')
const modalLogIn = document.querySelector('.modal-log-in-wrapper')
const formLogIn = document.forms[0]
const closeLogIn = document.querySelector('.btn-close-log-in')
const dropdownItems = document.querySelectorAll('.dropdown .dropdown-item')
let modalInstance; //додала зміну для області видимості



// DROPDOWN FUNCTIONAL

dropdownItems.forEach(item => {
    item.addEventListener('click', (event) => {
        event.target.parentElement.parentElement.parentElement.children[0].innerText = item.textContent
    })
})


// LOG-IN FORM

logIn.addEventListener('click', () => {
    modalLogIn.style.display = 'flex';
});

closeLogIn.addEventListener('click', () => {
    modalLogIn.style.display = 'none'
})

modalLogIn.addEventListener('click', (event) => {
    if (event.target == modalLogIn) {
        modalLogIn.style.display = 'none'
    }
})


formLogIn.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = formLogIn.elements.email.value;
    const password = formLogIn.elements.password.value;
    modalInstance = new Modal(email, password);
    modalInstance.validate();
});


// CLASS FOR THE LOG-IN WINDOW
class Modal {
    constructor(email, password) {
        this.email = email
        this.password = password
        this.validated = false
        this.idCard = null;
        this.visit = null;
    }

    validate() {
        if (this.email == logInEmail && this.password == logInPass) {
            alert('Данні вірні, вітаю на сайті admin')
            this.validated = true
            modalLogIn.style.display = 'none'
            logIn.style.display = 'none'
            bookVisit.style.display = 'flex'
        } else {
            alert('Данні не вірні, спробуйте заново')
            formLogIn.elements.password.value = ''
            formLogIn.elements.password.style.border = '2px solid red'
            formLogIn.elements.email.value = ''
            formLogIn.elements.email.style.border = '2px solid red'
        }
    }}
