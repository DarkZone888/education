export const languages = {
  en: {
    startTitle: "What kind of student are you",
    startSubtitle: "Take a quick quiz to uncover your learning style.",
    startButton: "Start Quiz",
    questionOf: (step: number, total: number) => `Question ${step} of ${total}`,
    next: "Next",
    back: "Back",
    finish: "Finish",
    retake: "Retake Quiz"
  },
  th: {
    startTitle: "คุณเป็นนักเรียนประเภทไหน",
    startSubtitle: "ทำแบบทดสอบสั้น ๆ เพื่อค้นหาสไตล์การเรียนรู้ของคุณ",
    startButton: "เริ่มแบบทดสอบ",
    questionOf: (step: number, total: number) => `คำถาม ${step} จาก ${total}`,
    next: "ถัดไป",
    back: "ย้อนกลับ",
    finish: "เสร็จสิ้น",
    retake: "ทำแบบทดสอบอีกครั้ง"
  }
};
