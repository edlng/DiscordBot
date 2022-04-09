const got = require("got");
const dquiz = require('discord-quiz');

module.exports = {
  name: 'trivia',
  aliases: ['triv', 't'],
  description: "this is a YouTube command!",
  execute(client, message, cmd, args, Discord) {
    const embed = new Discord.MessageEmbed()
    let url = 'https://opentdb.com/api.php?amount=50&type=multiple';
    got(url).then(response => {
      let content = JSON.parse(response.body);
      let contentLength = content.results.length;
      if(dquiz.get_questions().length < 1000) {
        for(let i = 0; i < contentLength; i++) {
          let randomNum = Math.floor(Math.random() * contentLength);
          let question = content.results[randomNum].question;
          let newQ = question;
          let newList = [];
        
          for(let i = 0; i < 2; i++) {             // Question is longer, so check twice for double elements
            if(question.includes('&amp;')) {
              newQ = newQ.replace(/&amp;/g, '&');
            } else if(newQ.includes("&quot;")) {
              newQ = newQ.replace(/&quot;/g, `"`);
            } else if(newQ.includes("&#039;")) {
              newQ = newQ.replace(/&#039;/g, `'`);
            } else if(newQ.includes("&eacute;")){
              newQ = newQ.replace(/&eacute;/g, `é`);
            }
          }
    
          let incorrectAnswers = content.results[randomNum].incorrect_answers;
    
          for(let i = 0; i < incorrectAnswers.length; i++) {
            if(incorrectAnswers[i].includes('&amp;')) {
              newList.push(incorrectAnswers[i].replace(/&amp;/g, '&'));
            } else if(incorrectAnswers[i].includes("&quot;")) {
              newList.push(incorrectAnswers[i].replace(/&quot;/g, `"`));
            } else if(incorrectAnswers[i].includes("&#039;")) {
              newList.push(incorrectAnswers[i].replace(/&#039;/g, `'`));
            } else if(incorrectAnswers[i].includes("&eacute;")){
              newList.push(incorrectAnswers[i].replace(/&eacute;/g, `é`));
            } else {
              newList.push(incorrectAnswers[i]);
            }
          }
    
          let correctAnswer = content.results[randomNum].correct_answer;
          let newCorrectAnswer = '';
    
          if(correctAnswer.includes('&amp;')) {
            newCorrectAnswer = correctAnswer.replace(/&amp;/g, '&');
          } else if(correctAnswer.includes("&quot;")) {
            newCorrectAnswer = correctAnswer.replace(/&quot;/g, `"`);
          } else if(correctAnswer.includes("&#039;")) {
            newCorrectAnswer = correctAnswer.replace(/&#039;/g, `'`);
          } else if(correctAnswer.includes("&eacute;")){
            newCorrectAnswer = correctAnswer.replace(/&eacute;/g, `é`);
          } else {
            newCorrectAnswer = correctAnswer;
          }
    
          dquiz.add_question(newQ, newCorrectAnswer, newList);
        }
      }
      dquiz.quiz(message, 10, 'ffb7c5');
    });
  }
}