import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [promptInput, setPromptInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: promptInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setPromptInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  async function onSubmit2(event){
    event.preventDefault();
    console.log("running");
    // Replace the values with your own keys and endpoint
    const apiUrl = "https://intuneremoteassistanceopenaitest.openai.azure.com/openai/deployments/TestDavinciDeployment/completions?api-version=2022-12-01";
    const apiKey = "";

    const requestBody = {
      "prompt": promptInput,
      "temperature": 0.75,
      "top_p": 0.5,
      "frequency_penalty": 0,
      "presence_penalty": 0,
      "max_tokens": 100,
      "best_of": 1,
      "stop": null
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': `${apiKey}`
      },
      body: JSON.stringify(requestBody)
    };

    await fetch(apiUrl, requestOptions)
      .then(async response =>
        {
          var res =  await response.json();
          setResult(res.choices[0].text);
          console.log(res);
        })
      .catch(error => console.error(error));
    console.log("done..");
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>
      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Azure OpenAI</h3>

        <form id="form2" onSubmit={onSubmit2}>
        <textarea
          rows={20}
          cols={200}
          name="prompt"
          placeholder="Enter prompt"
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}>
          </textarea>
          <input id="submit2" type="submit" value="AzureAI" />
        </form>
        <textarea
          rows={20}
          cols={200}
          readOnly= {true}
          name="result"
          placeholder="Result from Azure AI"
          value={result}
          onChange={(e) => setPromptInput(e.target.value)}>
          </textarea>
      </main>
    </div>
  );
}
