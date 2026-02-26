const questions = [
    {
        question: "Qizil svetofor chirog‘ida nima qilinadi?",
        image: "./images/svetofor.png", // local rasm
        options: ["To‘xtash", "Davom etish", "Signal berish", "Chapga burilish"],
        correct: "To‘xtash"
    },
    {
        question: "Bu yo‘l belgisi nimani anglatadi?",
        image: "./images/stop_sign.png", // local rasm
        options: ["Stop", "Tezlik 60", "Ogohlantirish", "Burilish"],
        correct: "Stop"
    },
    {
        question: "Yo‘lni kesib o‘tishda piyodaga ustunlik beriladimi?",
        image: null,
        options: ["Ha", "Yo‘q", "Faqat kechasi", "Faqat svetofor bo‘lsa"],
        correct: "Ha"
    }
];

module.exports = questions;
