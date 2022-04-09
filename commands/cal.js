module.exports = {
    name: 'cal',
    description: 'calculator',
    execute(client, message, cmd, args, Discord) {
        let method = args[1];
        let firstNumber = Number(args[0]);
        let secondNumber = Number(args[2])
        const operations = ['+', '-', 'x', '/'];

        if (!method) return message.reply('please state an operation.');
        
        if (!operations.includes(method)) return message.reply('when choosing an operation please select add, subtract, multiply or divide.');

        if (!args[1]) return message.reply('please state the first number to put into the calculator');

        if (!args[2]) return message.reply('please state the second number to put into the calculator');

        if (isNaN(firstNumber)) return message.reply('the first number you stated is not a number.');

        if (isNaN(secondNumber)) return message.reply('the second number you stated is not a number.');

        if (method === '+') {
            let doMath = firstNumber + secondNumber
            message.channel.send(`${firstNumber} + ${secondNumber} = ${doMath}`);
            
        }

        if (method === '-') {
            let doMath = firstNumber - secondNumber
            message.channel.send(`${firstNumber} - ${secondNumber} = ${doMath}`);
            
        }

        if (method === 'x') {
            let doMath = firstNumber * secondNumber
            message.channel.send(`${firstNumber} x ${secondNumber} = ${doMath}`);
            
        }

        if (method === '/') {
            let doMath = firstNumber / secondNumber
            message.channel.send(`${firstNumber} / ${secondNumber} = ${doMath}`);
            
        }
    }
}