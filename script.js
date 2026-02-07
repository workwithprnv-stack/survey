const questions = [
    {
        id: "q1",
        text: "What best describes you?",
        type: "options",
        options: [
            "Professor",
            "Student",
            "Other"
        ]
    },
    {
        id: "q2",
        text: "How often do you use Moodle in a typical week?",
        type: "options",
        options: [
            "Less than once a week",
            "1–2 times a week",
            "3–4 times a week",
            "Almost every day",
            "Multiple times daily"
        ]
    },
    {
        id: "q3",
        text: "Which option best describes your internet usage on campus?",
        type: "options",
        options: [
            "Rely entirely on campus Wi-Fi",
            "Mostly campus Wi-Fi, sometimes mobile data",
            "Mobile data more than campus Wi-Fi",
            "Almost entirely mobile data"
        ]
    },
    {
        id: "q4",
        text: "How would you rate the speed and reliability of campus Wi-Fi?",
        type: "scale",
        options: ["1", "2", "3", "4", "5"]
    },
    {
        id: "q5",
        text: "Moodle works reliably for critical academic tasks.",
        type: "options",
        options: [
            "Strongly agree",
            "Agree",
            "Neutral",
            "Disagree",
            "Strongly disagree"
        ]
    },
    {
        id: "q6",
        text: "How easy is it to navigate and use Moodle?",
        type: "options",
        options: [
            "Very easy",
            "Easy",
            "Neutral",
            "Difficult",
            "Very difficult"
        ]
    },
    {
        id: "q7",
        text: "How easy was it to get your issue resolved through IT support?",
        type: "options",
        options: [
            "Very easy",
            "Easy",
            "Neutral",
            "Difficult",
            "Very difficult",
            "I have never contacted IT support"
        ],
        skipIf: "I have never contacted IT support"
    },
    {
        id: "q8",
        text: "How helpful was the FLAME IT team?",
        type: "options",
        options: [
            "Extremely helpful",
            "Very helpful",
            "Moderately helpful",
            "Slightly helpful",
            "Not helpful at all"
        ],
        conditional: true
    },
    {
        id: "q9",
        text: "Campus IT systems work reliably during exams and deadlines.",
        type: "options",
        options: [
            "Strongly agree",
            "Agree",
            "Neutral",
            "Disagree",
            "Strongly disagree"
        ]
    },
    {
        id: "q10",
        text: "Overall, how satisfied are you with FLAME's IT services?",
        type: "scale",
        options: ["1", "2", "3", "4", "5"]
    },
    {
        id: "q11",
        text: "How likely are you to recommend FLAME IT services to another student?",
        type: "scale",
        options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
    }
];

let current = 0;
let sessionId = localStorage.getItem("surveySessionId");
let responses = {};
let skipNext = false;
let surveyStarted = false;

if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("surveySessionId", sessionId);
}

document.getElementById("sessionId").innerText = sessionId.slice(0, 6);

const stored = localStorage.getItem(`survey_${sessionId}`);
if (stored) {
    responses = JSON.parse(stored).responses;
}

function startSurvey() {
    surveyStarted = true;

    // Resume Logic: Find the first unanswered mandatory question
    // If no responses yet, start at 0. Otherwise, continue.
    if (Object.keys(responses).length > 0) {
        let lastAnsweredIndex = -1;
        questions.forEach((q, idx) => {
            if (responses[q.id]) lastAnsweredIndex = idx;
        });
        current = lastAnsweredIndex + 1;
    } else {
        current = 0;
    }

    document.getElementById("landingScreen").style.display = "none";
    document.getElementById("surveyScreen").style.display = "block";
    render();
    // If survey just completed, submit to server
    if (current >= questions.length) {
        // send final payload to server (server will update all_responses.json)
        if (window.fetch) {
            fetch('/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(res => res.json())
              .then(j => console.log('Server response:', j))
              .catch(err => console.warn('Failed to submit to server:', err.message));
        }
    }
}

function render() {
    if (!surveyStarted) {
        return;
    }

    if (current >= questions.length) {
        document.getElementById("question").innerText = "✅ Thank you for completing the survey!";
        
        const answersDiv = document.getElementById("answers");
        answersDiv.innerHTML = `
            <button class="option" onclick="exportSurveyData()">📥 Download My Responses</button>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
                Session ID: <code>${sessionId.slice(0, 6)}</code>
            </p>
        `;
        document.getElementById("progressBar").style.width = "100%";
        return;
    }

    const q = questions[current];
    const progress = ((current) / questions.length) * 100;
    document.getElementById("progressBar").style.width = `${progress}%`;

    document.getElementById("stepCounter").innerText =
        `Step ${current + 1} / ${questions.length}`;
    document.getElementById("question").innerText = q.text;

    const answers = document.getElementById("answers");
    answers.innerHTML = "";

    if (q.type === "options") {
        q.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "option";
            btn.innerText = opt;
            btn.onclick = () => saveAnswer(q.id, opt);
            answers.appendChild(btn);
        });
    } else if (q.type === "scale") {
        const scaleContainer = document.createElement("div");
        scaleContainer.className = "scale";

        q.options.forEach(val => {
            const btn = document.createElement("button");
            btn.className = "scale-option";
            btn.innerText = val;
            btn.onclick = () => saveAnswer(q.id, val);
            scaleContainer.appendChild(btn);
        });

        answers.appendChild(scaleContainer);
    }
}

function saveAnswer(id, value) {
    responses[id] = value;

    const data = {
        sessionId,
        timestamp: new Date().toISOString(),
        responses
    };

    // Save to localStorage
    localStorage.setItem(`survey_${sessionId}`, JSON.stringify(data));

    // Handle skip logic
    const currentQuestion = questions[current];
    if (currentQuestion.skipIf === value) {
        skipNext = true;
    }

    current++;

    if (skipNext && questions[current]?.conditional) {
        current++;
        skipNext = false;
    }

    render();
}

// Export survey data as JSON file
function exportSurveyData() {
    const surveyData = {
        sessionId,
        timestamp: new Date().toISOString(),
        responses
    };

    const dataStr = JSON.stringify(surveyData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `survey_${sessionId.slice(0, 6)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    console.log('✅ Survey data exported');
}

// Auto-render if we are already in a session to avoid getting stuck on landing
if (Object.keys(responses).length > 0) {
    surveyStarted = true;
    document.getElementById("landingScreen").style.display = "none";
    document.getElementById("surveyScreen").style.display = "block";
    render();
}
