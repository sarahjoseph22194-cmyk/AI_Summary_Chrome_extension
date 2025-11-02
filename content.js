import { HF_API_KEY, API_MODEL } from './config.js';


async function summarize() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // 2. Extract all visible text from the page
    const[{result}] = await chrome.scripting.executeScript({
        target : {tabId : tab.id},
        func :() => document.body.innerText,
    });

    //3.0 slice the text
    const text = result.slice(0, 2000);

    //4.0 send back the info to huggingface
    const response =await fetch(`https://api-inference.huggingface.co/models/${API_MODEL}`,
        {
            method: "POST",
        headers: {
        "Authorization": `Bearer $HF_API_KEY}`,
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

// Attach listener to popup button
document.getElementById("mybutton").addEventListener("click", summarize);

