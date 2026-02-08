const fs = require("fs");

const inputFile = "COREJAVA-MCQ1.txt";        // your file (same format as the example)
const outputFile = "corejava-mcq.json"; // output JSON

const raw = fs.readFileSync(inputFile, "utf8");
const text = raw.replace(/\r\n/g, "\n");
const lines = text.split("\n");

let currentTopic = "General";
let questions = [];
let id = 1;

// Simple topic detection: lines starting with emoji 📘 or 🟢 etc.
function detectTopic(line) {
  // Examples:
  // "📘 TOPIC 1: HISTORY OF JAVA"
  
  const m1 = line.match(/^[📘].*?:\s*(.+)$/);
  if (m1) return m1[1].trim();

  const m2 = line.match(/^[📘]\s*(.+)$/);
  if (m2) return m2[1].trim();

  return null;
}

// Basic state machine to parse Q / options / Ans
let i = 0;
while (i < lines.length) {
  let line = lines[i].trim();

  // Update topic
  const maybeTopic = detectTopic(line);
  if (maybeTopic) {
    currentTopic = maybeTopic;
    i++;
    continue;
  }

  // Question line: "Q1. ...." or "Q10. ...."
  const qMatch = line.match(/^Q\d+\.\s*(.+)/i);
  if (qMatch) {
    const questionText = qMatch[1].trim();
    const opts = [];
    let answerLetter = null;

    i++;

    // Expect next lines: A., B., C., D., then "Ans: X"
    while (i < lines.length) {
      const l = lines[i].trim();

      // Option lines
      const optMatch = l.match(/^([A-D])\.\s*(.+)/i);
      if (optMatch) {
        const letter = optMatch[1].toUpperCase();
        const textOpt = optMatch[2].trim();
        const idx = letter.charCodeAt(0) - "A".charCodeAt(0);
        opts[idx] = textOpt;
        i++;
        continue;
      }

      // Answer line
      const ansMatch = l.match(/^Ans:\s*([A-D])\s*$/i);
      if (ansMatch) {
        answerLetter = ansMatch[1].toUpperCase();
        i++;
        break;
      }

      // Skip empty or unrelated lines
      i++;
    }

    if (answerLetter && opts.length) {
      const idx = answerLetter.charCodeAt(0) - "A".charCodeAt(0);
      const answerText = opts[idx];

      questions.push({
        id: id++,
        topic: currentTopic,
        question: questionText,
        options: opts,
        answer: answerText
      });
    }

    continue;
  }

  i++;
}

// Write JSON
fs.writeFileSync(outputFile, JSON.stringify(questions, null, 2), "utf8");
console.log(`Generated ${questions.length} questions into ${outputFile}`);
