const colors = require("colors/safe")

const Colors = {
    GREEN: 0,
    YELLOW: 1,
    RED: 2
};

let error = colors.red;
let currentColor = Colors.GREEN;
let count = 0; //считает кол-во простых чисел в диапозоне.

function num(a, b) {

    C: for (let i = 2; i <= b; i++) {
        for (let j = 2; j < i; j++) {
            if (i % j == 0) {
                continue C;
            }
        }

        if (currentColor > Colors.RED)
            currentColor = Colors.GREEN;

        if (i >= a) {
            switch (currentColor) {
                case Colors.RED:
                    console.log(colors.red(i));
                    break;
                case Colors.GREEN:
                    console.log(colors.green(i));
                    break;
                case Colors.YELLOW:
                    console.log(colors.yellow(i));
                    break;
            }
            currentColor++;
            count++;
            // if (i % 3 === 0) {
            //     console.log(colors.red(i));
            // } else if (i % 3 === 1) {
            //     console.log(colors.yellow(i));
            // } else {
            //     console.log(colors.green(i));
            // }
        }
    }

        if (count == 0) {
        console.log(error('В этом диапозоне нет простых чисел'));
    }
}

let a = parseInt(process.argv[2]);
let b = parseInt(process.argv[3]);

if (!Number.isInteger(a) || !Number.isInteger(b)) {
    console.log(error('Введите числовые аргументы!'));
} else if (a <= 0 || b <= 0) {
    console.log(error('Введите аргументы больше нуля!'));
} else if (a >= b) {
    console.log(error('Введите верный диапозон чисел!'));
} else {
    num(a, b);
}