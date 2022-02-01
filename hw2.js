//1 5 6 2 3 4
const EventEmitter = require('events');
const emitter = new EventEmitter();
const inputDate = process.argv.slice(2).toString(); //hh-DD-MM-YYYY берем из массива нужную строку
const regEx = /(0[1-9]|1[0-9]|2[0-3])-(0[1-9]|1[0-9]|2[0-9]|3[01])-(0[1-9]|1[012])-[0-9]{4}/;

const getDateFromDateString = (dateString) => {
    if (regEx.test(dateString)) {
        const [hour, day, month, year] = dateString.split('-');

        return new Date(Date.UTC(year, month - 1, day, hour));
    } else {
        console.log('Введите корректные данные');
    }
};

const showTime = (dateNumber) => {
    const currentDate = new Date();

    if (currentDate >= dateNumber) {
        emitter.emit('timerEnd');
    } else {

        const diff = new Date(dateNumber.getTime() - currentDate.getTime());

        const days = diff > 0 ? Math.floor(diff / 1000 / 60 / 60 / 24) : 0;
        const hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) % 24 : 0;
        const minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0;
        const seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0;

        console.clear();
        console.log(days <= 1 ? '0 days ' : (days - 1) + ' days ' + hours + ':' + minutes + ':' + seconds); //вывод надо доработать
    }
};

const showTimerDone = (timerId) => {
    clearInterval(timerId);
    console.log('Таймер истек');
};

const dateNumber = getDateFromDateString(inputDate);
const timerId = setInterval(() => {
    emitter.emit('timerTick', dateNumber);
}, 1000)

emitter.on('timerTick', showTime);
emitter.on('timerEnd', () => {
    showTimerDone(timerId);
});