// Load ALL questions, group by topic, and run topic-wise quiz

let allQuestions = [];
let currentTopicQuestions = [];
let currentIndex = 0;
let score = 0;
let selectedTopic = "";

const topicSelect = document.getElementById("topicSelect");
const startBtn = document.getElementById("startBtn");
const quizContainer = document.getElementById("quizContainer");
const resultContainer = document.getElementById("resultContainer");
const questionText = document.getElementById("questionText");
const optionsList = document.getElementById("optionsList");
const nextBtn = document.getElementById("nextBtn");
const qCounter = document.getElementById("qCounter");
const topicLabel = document.getElementById("topicLabel");
const scoreText = document.getElementById("scoreText");
const restartBtn = document.getElementById("restartBtn");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");


// 1. Fetch ALL questions from JSON (this must contain every MCQ from your TXT)
fetch("corejava-mcq.json")
  .then((res) => res.json())
  .then((data) => {
    allQuestions = data; // full set, no question skipped
    populateTopics();
  })
  .catch((err) => {
    console.error("Error loading questions:", err);
  });

// 2. Fill topic dropdown from data
function populateTopics() {
  const topics = Array.from(new Set(allQuestions.map((q) => q.topic))).sort();

  const allOption = document.createElement("option");
  allOption.value = "ALL";
  allOption.textContent = "All Topics";
  topicSelect.appendChild(allOption);

  topics.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    topicSelect.appendChild(opt);
  });
}

// 3. Start quiz
startBtn.addEventListener("click", () => {
  selectedTopic = topicSelect.value;
  if (!selectedTopic) return;

  if (selectedTopic === "ALL") {
    currentTopicQuestions = [...allQuestions];
  } else {
    currentTopicQuestions = allQuestions.filter((q) => q.topic === selectedTopic);
  }

  // Simple shuffle so order changes each time
  currentTopicQuestions.sort(() => Math.random() - 0.5);

  currentIndex = 0;
  score = 0;

  quizContainer.classList.remove("hidden");
  resultContainer.classList.add("hidden");
  renderQuestion();
});

// 4. Render current question
function renderQuestion() {
  nextBtn.disabled = true;
  optionsList.innerHTML = "";

  const qObj = currentTopicQuestions[currentIndex];
  qCounter.textContent = `Question ${currentIndex + 1} of ${currentTopicQuestions.length}`;
  topicLabel.textContent = selectedTopic === "ALL" ? `Topic: ${qObj.topic}` : `Topic: ${selectedTopic}`;
  questionText.textContent = qObj.question;

  qObj.options.forEach((optText) => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = optText;
    div.addEventListener("click", () => handleOptionClick(div, qObj.answer));
    optionsList.appendChild(div);
  });
}
function renderQuestion() {
  nextBtn.disabled = true;
  optionsList.innerHTML = "";

  const qObj = currentTopicQuestions[currentIndex];

  qCounter.textContent = `Question ${currentIndex + 1} of ${currentTopicQuestions.length}`;
  topicLabel.textContent =
    selectedTopic === "ALL" ? `Topic: ${qObj.topic}` : `Topic: ${selectedTopic}`;
  questionText.textContent = qObj.question;

  qObj.options.forEach((optText) => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = optText;
    div.addEventListener("click", () => handleOptionClick(div, qObj.answer));
    optionsList.appendChild(div);
  });

  // progress update
  const progress =
    ((currentIndex) / currentTopicQuestions.length) * 100; // currentIndex-based
  progressFill.style.width = `${progress}%`;
  progressPercent.textContent = `${Math.round(progress)}%`;
}

// 5. Handle option selection
function handleOptionClick(optionDiv, correctAnswer) {
  if (!nextBtn.disabled) return; // already answered

  const selectedText = optionDiv.textContent.trim();

  // Mark selected
  if (selectedText === correctAnswer.trim()) {
    optionDiv.classList.add("correct");
    score++;
  } else {
    optionDiv.classList.add("wrong");
    // highlight the correct one
    Array.from(optionsList.children).forEach((child) => {
      if (child.textContent.trim() === correctAnswer.trim()) {
        child.classList.add("correct");
      }
    });
  }

  // Disable further clicks
  Array.from(optionsList.children).forEach((child) => {
    child.style.pointerEvents = "none";
  });

  nextBtn.disabled = false;
}

// 6. Next question or show result
nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < currentTopicQuestions.length) {
    renderQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  quizContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  scoreText.textContent = `You scored ${score} out of ${currentTopicQuestions.length}`;
}

// 7. Restart
restartBtn.addEventListener("click", () => {
  quizContainer.classList.add("hidden");
  resultContainer.classList.add("hidden");
});
