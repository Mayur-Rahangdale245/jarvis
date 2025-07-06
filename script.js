const output = document.getElementById("output");

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}

function processCommand(command) {
    command = command.toLowerCase();
    if (command.includes("weather")) {
        fetch("https://wttr.in/?format=3")
            .then(res => res.text())
            .then(text => {
                output.textContent = text;
                speak(text);
            });
    } else if (command.includes("joke")) {
        const jokes = [
            "Why did the computer show up late? It had a hard drive.",
            "Why do programmers prefer dark mode? Because light attracts bugs.",
            "Why was the math book sad? It had too many problems."
        ];
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        output.textContent = joke;
        speak(joke);
    } else if (command.includes("news")) {
        fetch("https://api.allorigins.win/get?url=https://newsdata.io/api/1/news?apikey=pub_93763ff81e9c4a17b7f49ed7f1c72c8e&country=in&language=en&category=top")
            .then(response => response.json())
            .then(data => {
                const headlines = JSON.parse(data.contents).results;
                const headline = headlines[0]?.title || "Couldn't fetch news.";
                output.textContent = headline;
                speak(headline);
            });
    } else if (command.includes("who is") || command.includes("what is")) {
        const topic = command.replace("who is", "").replace("what is", "").trim();
        fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${topic}`)
            .then(res => res.json())
            .then(data => {
                const summary = data.extract || "Couldn't find anything.";
                output.textContent = summary;
                speak(summary);
            });
    } else {
        const fallback = "Sorry, I didn’t understand that.";
        output.textContent = fallback;
        speak(fallback);
    }
}

function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = function(event) {
        const command = event.results[0][0].transcript;
        output.textContent = "You said: " + command;
        processCommand(command);
    };
}