const fs = require("fs");

// Savol banka matnlari (example to start)
// Siz bu yerga haqiqiy prava test mavzularini qo'shishingiz mumkin
const baseQuestions = [
  "Svetofor qizil chiroqni yoqganda haydovchi nima qilishi kerak?",
  "Yo‘l belgilari qaysi vaziyatda ogohlantiradi?",
  "Yo‘lni kesib o‘tishda piyodaga ustunlik beriladimi?",
  "Aylanma yo‘l belgisi nimani bildiradi?",
  "Chapga burilish taqiqlangan yo‘l belgisi nimani bildiradi?",
  "Harakat tezligi shahar ichida maksimal qancha bo‘ladi?",
  "Yo‘l-transport hodisasi sodir bo‘lsa nima qilinadi?",
  "Piyodalar o‘tish joyiga kelib to‘xtash kerakmi?",
  "Avtomagistralda tezlik cheklovi qancha?",
  "Transport vositasida xavfsizlik kamarini taqish majburiymi?"
];

function generateRandomQuestion(i) {
  const text = baseQuestions[i % baseQuestions.length] + ` (${i + 1})?`;
  const options = [
    "A variant",
    "B variant",
    "C variant",
    "D variant"
  ];
  const correct = Math.floor(Math.random() * 4);
  return { question: text, options, correct };
}

// 1200 ta savol hosil qilish
const allQuestions = [];
for (let i = 0; i < 1200; i++) {
  allQuestions.push(generateRandomQuestion(i));
}

// Faylga yozish
const output = `
const questions = ${JSON.stringify(allQuestions, null, 2)};

module.exports = questions;
`;

fs.writeFileSync("questions.js", output, "utf-8");
console.log("questions.js tayyor bo‘ldi — 1200 ta savol yaratildi!");
