const quizData = [
  {
    question: {
      en: "Do you feel at a disadvantage compared to other students who have access to modern tools like ipads and laptops?",
      th: "คุณรู้สึกเสียเปรียบเมื่อเทียบกับนักเรียนคนอื่นที่มีเครื่องมือทันสมัยอย่าง iPad และแล็ปท็อปใช้หรือไม่?"
    },
    options: [
      {
        text: {
          en: "Yes, it affects my performance.",
          th: "ใช่ มันส่งผลต่อผลการเรียนของฉัน"
        },
        points: { achiever: 2, fighter: 1 }
      },
      {
        text: {
          en: "No, I can manage without them.",
          th: "ไม่ ฉันสามารถจัดการได้โดยไม่ต้องใช้มัน"
        },
        points: { slacker: 1, achiever: 2 }
      },
      {
        text: {
          en: "Sometimes, but I try to overcome it.",
          th: "บางครั้ง แต่นั่นไม่ใช่ปัญหาใหญ่ เพราะฉันพยายามเอาชนะมัน"
        },
        points: { fighter: 2 }
      }
    ]
  },
  {
    question: {
      en: "Can iPads, laptops, or other modern devices be replaced by mobile phones for educational purposes?",
      th: "อุปกรณ์ทันสมัย เช่น iPad หรือแล็ปท็อป สามารถถูกแทนที่ด้วยโทรศัพท์มือถือในการเรียนรู้ได้หรือไม่?"
    },
    options: [
      {
        text: {
          en: "Yes, mobile phones are enough.",
          th: "ได้ โทรศัพท์มือถือก็เพียงพอแล้ว"
        },
        points: { slacker: 2 }
      },
      {
        text: {
          en: "No, they offer more capabilities.",
          th: "ไม่ อุปกรณ์เหล่านั้นมีความสามารถมากกว่า"
        },
        points: { achiever: 2, fighter: 1 }
      },
      {
        text: {
          en: "It depends on the type of work.",
          th: "ขึ้นอยู่กับประเภทของงานที่ทำ"
        },
        points: { fighter: 2, slacker: 1 }
      }
    ]
  },
  {
    question: {
      en: "What motivates you to perform well in school?",
      th: "อะไรเป็นแรงจูงใจให้คุณทำได้ดีในการเรียน?"
    },
    options: [
      {
        text: {
          en: "Personal growth and goals.",
          th: "การเติบโตและบรรลุเป้าหมายส่วนตัว"
        },
        points: { achiever: 2 }
      },
      {
        text: {
          en: "Avoiding punishment or pressure.",
          th: "หลีกเลี่ยงการลงโทษหรือความกดดัน"
        },
        points: { slacker: 2 }
      },
      {
        text: {
          en: "Proving I can overcome challenges.",
          th: "พิสูจน์ว่าฉันสามารถเอาชนะอุปสรรคได้"
        },
        points: { fighter: 2 }
      }
    ]
  },
  {
    question: {
      en: "What style of class presentation would you give?",
      th: "คุณจะนำเสนอในชั้นเรียนในรูปแบบใด?"
    },
    options: [
      {
        text: {
          en: "A structured and well-prepared speech.",
          th: "การนำเสนอที่มีโครงสร้างและเตรียมพร้อมมาอย่างดี"
        },
        points: { achiever: 2 }
      },
      {
        text: {
          en: "Something minimal—just enough to pass.",
          th: "การนำเสนอที่เรียบง่าย แค่พอผ่านไปได้"
        },
        points: { slacker: 2 }
      },
      {
        text: {
          en: "A passionate discussion with effort.",
          th: "การพูดคุยที่มีความตั้งใจและความพยายาม"
        },
        points: { fighter: 2 }
      }
    ]
  },
  {
    question: {
      en: "How do you usually prepare for an exam?",
      th: "คุณเตรียมตัวสำหรับการสอบอย่างไร?"
    },
    options: [
      {
        text: {
          en: "Consistent study and planning.",
          th: "การศึกษาทบทวนอย่างสม่ำเสมอและวางแผนล่วงหน้า"
        },
        points: { achiever: 2, fighter: 1 }
      },
      {
        text: {
          en: "Cramming the night before.",
          th: "อ่านหนังสือแบบเร่งด่วนในคืนก่อนสอบ"
        },
        points: { slacker: 2 }
      },
      {
        text: {
          en: "Struggling but giving my best.",
          th: "พยายามเต็มที่แม้จะลำบาก"
        },
        points: { fighter: 2 }
      }
    ]
  }
];

export default quizData;
