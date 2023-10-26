let LIMIT = 10000;
const CURRENCY = 'руб.';
const STATUS_IN_LIMIT = 'все хорошо';
const STATUS_OUT_OF_LIMIT = 'все плохо';
const STATUS_OUT_OF_LIMIT_CLASSNAME = 'status_red';
const STORAGE_LABEL_LIMIT = 'limit';
const STORAGE_LABEL_EXPENSES = 'expenses';
const STORAGE_LABEL_STATUS = "status";

const inputNode = document.querySelector('.js-input');
const categorySelectNode = document.querySelector('.js-category_select');
const addBtnNode = document.querySelector('.js-button');
const resetBtnNode = document.querySelector('.js-reset-button');
const changeLimitBtnNode = document.querySelector('.js-change-limit_btn')
const sumNode = document.querySelector('.js-sum');
const statusNode = document.querySelector('.js-status');
const historyNode = document.querySelector('.js-history');
const newLimitPopup = document.querySelector('.js-newlimit-input');

const limitNode = document.querySelector('.js-limit');

function initLimit() {
    const limitFromStorage = parseInt(localStorage.getItem(STORAGE_LABEL_LIMIT));
    if (!limitFromStorage){
        return;
    }
    limitNode.innerText = limitFromStorage;
    LIMIT = limitFromStorage;
}

initLimit();

const expensesFromStorageString = localStorage.getItem(STORAGE_LABEL_EXPENSES);
const expensesFromStorage = JSON.parse(expensesFromStorageString);
let expenses = [];
if(Array.isArray(expensesFromStorage)){
    expenses = expensesFromStorage;
}
render();

init(expenses);

function init(expenses) {
   limitNode.innerText = LIMIT;
   const statusFromStorage = localStorage.getItem(STORAGE_LABEL_STATUS);

    if(statusFromStorage) {
        statusNode.innerText = statusFromStorage;
    } else {
        statusNode.innerText = STATUS_IN_LIMIT;
    }
};

addBtnNode.addEventListener('click', function(){
    const currentAmount = getExpanseFromUser();
    if (!currentAmount) {
        alert ('Нужно задать сумму');
        return
    }

    const currentCategory = getSelectedCategory();
    if (currentCategory === "Категория") {
        alert ('Нужно выбрать категорию');
        return;
    }

    const newExpense = { amount: currentAmount, category: currentCategory };
    console.log(newExpense);

    trackExpanse(newExpense);

    render();

    clearInput(inputNode);
});


function trackExpanse(newExpense){
    expenses.push(newExpense);
    const expensesString = JSON.stringify(expenses);
    localStorage.setItem(STORAGE_LABEL_EXPENSES, expensesString);
}

function render() {
    renderHistory();
    renderStatus();
}

function clearInput(input) {
    input.value = '';
}


function calculateExpanses() {
    let sum = 0;

    expenses.forEach(function (expense) {
        sum += expense.amount;
    });

    return sum;
}


function getExpanseFromUser() {
    return parseInt(inputNode.value);
}

function getSelectedCategory () {
    return categorySelectNode.value;
}


function renderHistory() {
    historyNode.innerHTML = '';

    expenses.forEach(function (expense) {
        const historyItem = document.createElement("li");

        historyItem.innerText = `${expense.category} - ${expense.amount} ${CURRENCY}`;

        historyNode.appendChild(historyItem);
    });
    }

function renderStatus() {
    const total = calculateExpanses(expenses);
    sumNode.innerText = total;

    if (total <= LIMIT) {
        statusNode.innerText = STATUS_IN_LIMIT;
        statusNode.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);
    } else {
        statusNode.innerText = `${STATUS_OUT_OF_LIMIT} (${LIMIT - total}) ${CURRENCY}`;
        statusNode.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
    }
    localStorage.setItem(STORAGE_LABEL_STATUS, statusNode.innerText);
}

function changeLimitHandler() {
    const newLimit = newLimitPopup.value;

    const newLimitValue = parseInt(newLimit);

    if (!newLimitValue) {
        return;
    }

    limitNode.innerText = newLimitValue;

    LIMIT = newLimitValue;
    localStorage.setItem(STORAGE_LABEL_LIMIT, newLimitValue);

    togglePopup();
    render();
}

function resetButtonHandler() {
    expenses = [];
    render();
}


resetBtnNode.addEventListener('click', resetButtonHandler);
changeLimitBtnNode.addEventListener('click', changeLimitHandler);


// push - добавляет новую информацию,значение к массиву.
// parseInt - позволяет сделать число, целое число - тип данных.
// forEach - Цикл, повторение неск.действий

// LOCAT STORAGE
// if(Array.isArray) - проверяем, что бьект явлется массивом. Проверка на массив.
// JSON.parse() - превращает строку в обьект.
// JSON.stringify() -  разбирает обьект и превращает его в строку для java скрипта(формат файла передается по сети)
