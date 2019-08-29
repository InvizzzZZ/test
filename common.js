'use strict';

// при регистрации указываем на js-файл с кодом serviceWorker’а
// получаем Promise объект
navigator.serviceWorker.register(
    'appCache.js'
).then(function(registration) {
    // при удачной регистрации имеем объект типа ServiceWorkerRegistration
    console.log('ServiceWorker registration', registration);
    // строкой ниже можно прекратить работу serviceWorker’а
    //registration.unregister();
}).catch(function(err) {
    throw new Error('ServiceWorker error: ' + err);
});

let question1 = new Map([  // первый вопрос
    ['question', '2+2 = ?'],
    ['answer1', '2'],
    ['answer2', '3'],
    ['answer3', '4'],
    ['answer4', '98'],
    ['answer_true', '4']
]);

let question2 = new Map([  // второй вопрос
    ['question', 'Столица Беларуси?'],
    ['answer1', 'Минск'],
    ['answer2', 'Брест'],
    ['answer3', 'Витебск'],
    ['answer4', 'Москва'],
    ['answer_true', 'Минск']
]);

let question3 = new Map([  // третий вопрос
    ['question', '3*3 = ?'],
    ['answer1', '9'],
    ['answer2', '8'],
    ['answer3', '2'],
    ['answer4', '43'],
    ['answer_true', '9']
]);

var count = 0; // кол-во правильных ответов

var count_answer = 0; // кол-во ответов

var block, answer1, answer2, answer3, answer4; // блок с вопросом, ответы на вопросы

let questions = [question1, question2, question3]; // массив с вопросами

questions = questions.sort(function () {  // рандомно сортированный массив с вопросами
    return Math.random() - 0.5;
});

let container = document.createElement('div'); // контейнер для вопросов и ответов
container.id = 'container';
container.classList.add('container');
document.body.append(container);

createQuestion(questions[count_answer]); // отрисовка первого вопроса из массива


function createQuestion(question) {  //функция, отрисовывающая вопрос переданный из массива
    block = document.createElement('div'); // блок с вопросом
    block.classList.add('block');
    block.textContent = question.get('question');
    container.append(block);

    let answers_block = document.createElement('div');
    answers_block.classList.add('answer_block');
    container.appendChild(answers_block);

    answer1 = document.createElement('div'); // ответ 1
    answer1.textContent = question.get('answer1');
    answer1.classList.add('answer');
    answer1.setAttribute('value', question.get('answer1') + "");
    answer1.setAttribute('answer_true', question.get('answer_true') + "");
    // container.append(answer1);

    answer2 = document.createElement('div'); // ответ 2
    answer2.textContent = question.get('answer2');
    answer2.classList.add('answer');
    answer2.setAttribute('value', question.get('answer2') + "");
    answer2.setAttribute('answer_true', question.get('answer_true') + "");
    // container.append(answer2);

    answer3 = document.createElement('div'); // ответ 3
    answer3.textContent = question.get('answer3');
    answer3.classList.add('answer');
    answer3.setAttribute('value', question.get('answer3') + "");
    answer3.setAttribute('answer_true', question.get('answer_true') + "");
    // container.append(answer3);

    answer4 = document.createElement('div'); // ответ 3
    answer4.textContent = question.get('answer4');
    answer4.classList.add('answer');
    answer4.setAttribute('value', question.get('answer4') + "");
    answer4.setAttribute('answer_true', question.get('answer_true') + "");
    // container.append(answer3);

    let answers = [answer1, answer2, answer3, answer4]; // массив ответов
    answers.sort(function () { // отсортированный рандомно массив ответов
        return Math.random() - 0.5;
    });

    for (let i = 0; i < answers.length; i++) {
        answers_block.appendChild(answers[i]);
    }

    answer1.addEventListener('click', checkAnswer, false); //вешаем слушатель клика на каждый блок с ответом
    answer2.addEventListener('click', checkAnswer, false);
    answer3.addEventListener('click', checkAnswer, false);
    answer4.addEventListener('click', checkAnswer, false);
}

function checkAnswer(EO) {
    EO = EO || window.event;
    EO.preventDefault();
    let elem = EO.target; // элемент, по которому был клик
    var answer = elem.getAttribute('value');
    var answer_true = elem.getAttribute('answer_true');
    let elem_true = document.querySelector('[value="' + answer_true + '"]'); // элемент  с правильным ответом
    count_answer++;

    if (answer === answer_true) { // проверка ответа
        count++;
        elem.style.backgroundColor = '#36AE34'; // верный ответ

    } else {
        elem.style.backgroundColor = '#A09D29'; //неверный ответ
        elem_true.style.backgroundColor = '#36AE34'; // верный ответ

    }

    answer1.removeEventListener('click', checkAnswer, false); // чтобы нельзя было кликать после первого клика
    answer2.removeEventListener('click', checkAnswer, false);
    answer3.removeEventListener('click', checkAnswer, false);
    answer4.removeEventListener('click', checkAnswer, false);

    setTimeout(() => { //тайм-аут для отображения следующего вопроса
        while (container.firstChild) { // удаляем отрисованный вопрос
            container.removeChild(container.firstChild);
        }

        if (count_answer < questions.length) { // проверка на кол-во заданных вопросов
            createQuestion(questions[count_answer]);
        } else {
            block = document.createElement('div');
            block.classList.add('block');
            // block.style.paddingTop = '75px';
            block.style.fontSize = '30px';
            block.style.lineHeight = 'initial';
            if (count === questions.length) {
                block.textContent = `Игра окончена Ваш результат ${count} из ${questions.length}!
                Вы молодец!`;
            } else {
                block.textContent = `Игра окончена Ваш результат ${count} из ${questions.length}.
                В следующий раз будет лучше`;
            }
            container.append(block);
            let button = document.createElement('button');
            button.innerText = 'Попробовать снова';
            button.classList.add('button');
            container.append(button);

            button.addEventListener('click', () => {
                location.reload();
            }, false);
        }
    }, 1000);
}