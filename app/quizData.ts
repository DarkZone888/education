const quizData = [
  {
    question: {
      en: "Feeling at a disadvantage compared to other students who have access to these tools?",
      th: "คุณรู้สึกเสียเปรียบเมื่อเทียบกับนักเรียนคนอื่นที่เข้าถึงอุปกรณ์เหล่านี้หรือไม่?"
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
          th: "บางครั้ง แต่ฉันพยายามเอาชนะมัน"
        },
        points: { fighter: 2 }
      }
    ]
  },
  {
    question: {
      en: "Can iPads, laptops, or any other modern devices be replaced by mobile phones for educational purposes?",
      th: "อุปกรณ์ทันสมัยอย่าง iPad หรือแล็ปท็อป สามารถแทนที่โทรศัพท์มือถือในการเรียนรู้ได้หรือไม่?"
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
          th: "ไม่ได้ อุปกรณ์เหล่านั้นมีความสามารถมากกว่า"
        },
        points: { achiever: 2, fighter: 1 }
      },
      {
        text: {
          en: "Depends on the type of work.",
          th: "ขึ้นอยู่กับประเภทของงาน"
        },
        points: { fighter: 2, slacker: 1 }
      }
    ]
  },
  {
    question: {
      en: "What motivates you to do well in school?",
      th: "อะไรเป็นแรงจูงใจให้คุณทำได้ดีในการเรียน?"
    },
    options: [
      {
        text: {
          en: "Personal growth and goals.",
          th: "การเติบโตและเป้าหมายส่วนตัว"
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
      th: "คุณจะนำเสนอหน้าชั้นเรียนในรูปแบบใด?"
    },
    options: [
      {
        text: {
          en: "A structured and well-prepared speech.",
          th: "สุนทรพจน์ที่มีโครงสร้างและเตรียมมาอย่างดี"
        },
        points: { achiever: 2 }
      },
      {
        text: {
          en: "Something minimal—just enough to pass.",
          th: "แค่พอผ่าน พูดสั้น ๆ เท่าที่จำเป็น"
        },
        points: { slacker: 2 }
      },
      {
        text: {
          en: "A passionate discussion with effort.",
          th: "การพูดที่แสดงความพยายามและความตั้งใจ"
        },
        points: { fighter: 2 }
      }
    ]
  },
  {
    question: {
      en: "How do you usually prepare for an exam?",
      th: "คุณเตรียมตัวสอบอย่างไร?"
    },
    options: [
      {
        text: {
          en: "Consistent study and planning.",
          th: "อ่านหนังสืออย่างสม่ำเสมอและวางแผนล่วงหน้า"
        },
        points: { achiever: 2, fighter: 1 }
      },
      {
        text: {
          en: "Cramming the night before.",
          th: "อ่านหนังสือแบบเร่งด่วนคืนก่อนสอบ"
        },
        points: { slacker: 2 }
      },
      {
        text: {
          en: "Struggling but giving my best.",
          th: "พยายามอย่างเต็มที่แม้จะลำบาก"
        },
        points: { fighter: 2 }
      }
    ]
  }
];

export default quizData;
