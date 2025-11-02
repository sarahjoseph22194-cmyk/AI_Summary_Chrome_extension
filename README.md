🧠 AI Webpage Summarizer – Chrome Extension

A Chrome extension that extracts text from the current webpage and summarizes it using Hugging Face’s facebook/bart-large-cnn model. It helps users quickly understand long articles, blogs, news, or research content.

🚀 Features

✅ Summarizes any webpage with one click
✅ Uses Hugging Face Inference API
✅ Extracts visible text from the active tab
✅ Lightweight & easy to install
✅ Works locally in your browser (no backend required)

📁 Project Structure
ai-summarizer-extension/
│── manifest.json
│── popup.html
│── popup.js
│── config.js        ← Contains API key (not for public GitHub)
│── icon32.png

⚙️ Installation & Setup
1️⃣ Clone or Download the Project
git clone <your-repo-url>

2️⃣ Create a config.js File

This file is not included in GitHub for security reasons.

// config.js
export const HF_API_KEY = "your_huggingface_api_key_here";
export const API_MODEL = "facebook/bart-large-cnn";


Make sure to add this to .gitignore if you are pushing to GitHub.

config.js

3️⃣ Load the Extension in Chrome

Open Chrome → go to chrome://extensions/

Enable Developer mode (top-right corner)

Click Load unpacked

Select your project folder

The extension should appear in your toolbar ✅

🧩 How It Works
📌 popup.js
import { HF_API_KEY, API_MODEL } from './config.js';

async function summarize() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.body.innerText,
    });

    const text = result.slice(0, 2000); // Limit text for processing

    const response = await fetch(`https://api-inference.huggingface.co/models/${API_MODEL}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${HF_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text }),
    });

    const data = await response.json();

    if (data.error) {
        alert("Error: " + data.error);
    } else if (Array.isArray(data) && data[0].summary_text) {
        alert("Summary:\n\n" + data[0].summary_text);
    } else {
        alert("Unexpected response:\n" + JSON.stringify(data, null, 2));
    }
}

document.getElementById("mybutton").addEventListener("click", summarize);

💡 Usage

Open any webpage you want to summarize

Click the extension icon

Hit the "Summarize" button

A popup will display the summary instantly!

🔐 API Key Security Notice

⚠ Chrome extensions run in the browser, meaning you cannot fully hide API keys.
To improve security:

Store API key in config.js and exclude from GitHub

Use a backend server + .env file if you want full protection

✅ To-Do / Future Improvements

 Display summary inside the extension popup instead of alert()

 Add loading animation while fetching summary

 Support multiple languages

 Allow user to choose summarization model

📜 License

This project is open-source and free to use.
