import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [promptInput, setPromptInput] = useState("");
  const [result, setResult] = useState();
  let showdeploy = false;

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
      setResult2(data.result);
      setPromptInput2("");
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
    const apiKey = "56c4416636d5458ba37a66cac8cf1fea";
    
    var requestBody;
    if(promptInput.startsWith("How many devices are non-compliant")) {
      console.log("how many");
      requestBody = {
        "prompt": "Count devices by OS in the following JSON schema, filter by ComplianceState_loc is \"Not compliant\"  and Generate output as [{\"OS\": \"os\", \"count\": 2 }]\\ ### {\"TotalRowCount\":30,\"Schema\":[{\"Column\":\"ComplianceState\",\"PropertyType\":\"String\"},{\"Column\":\"ComplianceState_loc\",\"PropertyType\":\"String\"},{\"Column\":\"DeviceName\",\"PropertyType\":\"String\"},{\"Column\":\"LastContact\",\"PropertyType\":\"DateTime\"},{\"Column\":\"OS\",\"PropertyType\":\"String\"},{\"Column\":\"OS_loc\",\"PropertyType\":\"String\"},{\"Column\":\"OSVersion\",\"PropertyType\":\"String\"},{\"Column\":\"OwnerType\",\"PropertyType\":\"Int32\"},{\"Column\":\"OwnerType_loc\",\"PropertyType\":\"String\"},{\"Column\":\"UPN\",\"PropertyType\":\"String\"}],\"Values\":[[\"2\",\"Not compliant\",\"ANKUSHVM\",\"2022-12-01T18:09:01\",\"Windows\",\"Windows\",\"10.0.19044.2251\",2,\"Personal\",\"IWUser1@JerryOneDF.ccsctp.net\"],[\"2\",\"Not compliant\",\"DESKTOP-CLM4LI3\",\"2022-08-29T17:09:09\",\"Windows\",\"Windows\",\"10.0.19044.1889\",2,\"Personal\",\"IWUser1@JerryOneDF.ccsctp.net\"],[\"2\",\"Not compliant\",\"DESKTOP-EP3MAB9\",\"2022-09-29T14:03:08\",\"Windows\",\"Windows\",\"10.0.19043.2182\",2,\"Personal\",\"admin@JerryOneDF.ccsctp.net\"],[\"2\",\"Not compliant\",\"DESKTOP-GLLEB0B\",\"2023-03-20T15:36:04\",\"Windows\",\"Windows\",\"10.0.19043.2364\",1,\"Company\",\"admin@JerryOneDF.ccsctp.net\"],[\"1\",\"Compliant\",\"DESKTOP-ORUQ035\",\"2023-02-14T18:03:28\",\"Windows\",\"Windows\",\"10.0.19043.2364\",1,\"Company\",\"admin@JerryOneDF.ccsctp.net\"],[\"1\",\"Compliant\",\"DESKTOP-U4SIIQB\",\"2023-03-20T13:54:03\",\"Windows\",\"Windows\",\"10.0.17763.30346\",2,\"Personal\",\"admin@JerryOneDF.ccsctp.net\"],[\"2\",\"Not compliant\",\"DESKTOP-V32KT9D\",\"2022-08-25T22:56:30\",\"Windows\",\"Windows\",\"10.0.19043.1805\",2,\"Personal\",\"IWUser1@JerryOneDF.ccsctp.net\"],[\"2\",\"Not compliant\",\"DESKTOP-V32KT9D\",\"2022-09-07T16:38:01\",\"Windows\",\"Windows\",\"10.0.19044.1889\",2,\"Personal\",\"IWUser1@JerryOneDF.ccsctp.net\"],[\"2\",\"Not compliant\",\"DESKTOP-V32KT9D\",\"2022-09-09T00:32:05\",\"Windows\",\"Windows\",\"10.0.19044.1889\",2,\"Personal\",\"IWUser1@JerryOneDF.ccsctp.net\"],[\"2\",\"Not compliant\",\"DESKTOP-V32KT9D\",\"2022-09-08T06:29:07\",\"Windows\",\"Windows\",\"10.0.19044.1889\",2,\"Personal\",\"IWUser1@JerryOneDF.ccsctp.net\"],[\"1\",\"Compliant\",\"DESKTOP-VD89VM2\",\"2023-03-20T15:34:02\",\"Windows\",\"Windows\",\"10.0.19045.2728\",2,\"Personal\",\"admin@JerryOneDF.ccsctp.net\"],[\"2\",\"Not compliant\",\"DHANNO\",\"2022-09-06T23:52:08\",\"Windows\",\"Windows\",\"10.0.19044.1889\",2,\"Personal\",\"IWUser1@JerryOneDF.ccsctp.net\"],[\"2\",\"Not compliant\",\"DHANNOTOO\",\"2022-09-08T02:27:06\",\"Windows\",\"Windows\",\"10.0.19044.1889\",2,\"Personal\",\"IWUser1@JerryOneDF.ccsctp.net\"],[\"2\",\"Not compliant\",\"DHANNOTOO\",\"2022-09-09T00:33:05\",\"Windows\",\"Windows\",\"10.0.19044.1889\",2,\"Personal\",\"IWUser1@JerryOneDF.ccsctp.net\"],[\"1\",\"Compliant\",\"Jerry-TestWin10\",\"2023-01-30T15:13:03\",\"Windows\",\"Windows\",\"10.0.19044.2486\",2,\"Personal\",\"admin@JerryOneDF.ccsctp.net\"],[\"1\",\"Compliant\",\"KTESTVM\",\"2022-12-14T22:02:19\",\"Windows\",\"Windows\",\"10.0.19044.2364\",1,\"Company\",\"admin@JerryOneDF.ccsctp.net\"],[\"2\",\"Not compliant\",\"LinuxNrVm\",\"2022-07-13T21:12:40\",\"Linux\",\"Linux\",\"20.04\",1,\"Company\",\"admin@JerryOneDF.ccsctp.net\"],[\"2\",\"Not compliant\",\"PREMCHOPRA\",\"2022-09-08T06:29:05\",\"Windows\",\"Windows\",\"10.0.19044.1889\",2,\"Personal\",\"IWUser1@JerryOneDF.ccsctp.net\"],[\"2\",\"Not compliant\",\"PREMCHOPRA\",\"2022-09-07T16:52:05\",\"Windows\",\"Windows\",\"10.0.19044.1889\",2,\"Personal\",\"IWUser1@JerryOneDF.ccsctp.net\"],[\"2\",\"Not compliant\",\"PREMCHOPRA\",\"2022-09-09T00:33:05\",\"Windows\",\"Windows\",\"10.0.19044.1889\",2,\"Personal\",\"IWUser1@JerryOneDF.ccsctp.net\"],[\"2\",\"Not compliant\",\"SOPHIAVM\",\"2022-11-07T21:39:10\",\"Windows\",\"Windows\",\"10.0.19044.2130\",2,\"Personal\",\"IWUser0@JerryOneDF.ccsctp.net\"],[\"1\",\"Compliant\",\"Zahra-Azure-VM\",\"2023-02-07T14:36:59\",\"Windows\",\"Windows\",\"10.0.22621.963\",1,\"Company\",\"admin@JerryOneDF.ccsctp.net\"],[\"2\",\"Not compliant\",\"Zahra-GracePeriod\",\"2022-09-28T18:54:19\",\"Windows\",\"Windows\",\"10.0.19043.2182\",2,\"Personal\",\"IWUser0@JerryOneDF.ccsctp.net\"],[\"0\",\"Not evaluated\",\"[AnkushVM]\",\"2022-11-21T23:54:21\",\"Linux\",\"Linux\",\"\",1,\"Company\",\"IWUser1@JerryOneDF.ccsctp.net\"],[\"1\",\"Compliant\",\"admin_Windows10X_9/10/2020_11:23 PM\",\"2020-09-11T17:42:26\",\"Other\",\"Other\",\"10.0.20201.0\",2,\"Personal\",\"admin@JerryOneDF.ccsctp.net\"],[\"1\",\"Compliant\",\"ankvm2\",\"2023-03-20T15:16:01\",\"Windows\",\"Windows\",\"10.0.19044.2728\",2,\"Personal\",\"IWUser1@JerryOneDF.ccsctp.net\"],[\"1\",\"Compliant\",\"iPhone\",\"2023-03-20T17:13:46\",\"IOS\",\"iOS\",\"16.1.1\",2,\"Personal\",\"admin@JerryOneDF.ccsctp.net\"],[\"2\",\"Not compliant\",\"linux ReportVM non compliant with aad id\",\"2022-09-22T05:25:18\",\"Linux\",\"Linux\",\"20.04\",1,\"Company\",\"admin@JerryOneDF.ccsctp.net\"],[\"2\",\"Not compliant\",\"linux ReportVM2 compliant with aad id\",\"2022-09-22T05:44:05\",\"Linux\",\"Linux\",\"20.04\",1,\"Company\",\"admin@JerryOneDF.ccsctp.net\"],[\"2\",\"Not compliant\",\"linux without policy\",\"2022-11-15T20:34:00\",\"Linux\",\"Linux\",\"20.04\",1,\"Company\",\"admin@JerryOneDF.ccsctp.net\"]]}###",
        "temperature": 1,
        "top_p": 0.5,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "max_tokens": 2000,
        "best_of": 1,
        "stop": null
      }
    }
    if(promptInput.startsWith("Show me the reasons for non-compliance")) {
      console.log("show me");
      requestBody = {
        "prompt": "Count devices by SettingName in the following JSON schema and text below and output count for each SettingName.\\ Generate output as [{\"SettingName\": \"status\", \"NumberOfCompliantDevices\": 2, \"NumberOfNonCompliantDevices\": 2 }]\\ ### {\"TotalRowCount\":16,\"Schema\":[{\"Column\":\"SettingId\",\"PropertyType\":\"String\"},{\"Column\":\"SettingName\",\"PropertyType\":\"String\"},{\"Column\":\"PolicyPlatformType\",\"PropertyType\":\"Int32\"},{\"Column\":\"PolicyPlatform\",\"PropertyType\":\"String\"},{\"Column\":\"NumberOfCompliantDevices\",\"PropertyType\":\"Int64\"},{\"Column\":\"NumberOfNonCompliantDevices\",\"PropertyType\":\"Int64\"},{\"Column\":\"NumberOfNotEvaluatedDevices\",\"PropertyType\":\"Int64\"},{\"Column\":\"NumberOfNotApplicableDevices\",\"PropertyType\":\"Int64\"},{\"Column\":\"NumberOfConflictDevices\",\"PropertyType\":\"Int64\"}],\"Values\":[[\"b8dd9ebb-7a40-3761-a343-8faf9f6664ac\",\"BiosVersion\",6,\"Windows10AndLater\",0,1,0,0,0],[\"f1e75c22-9a6c-5b14-870f-030bc5d53511\",\"ControlledFolderAccessEnabled\",6,\"Windows10AndLater\",0,1,0,0,0],[\"a9dc6455-165f-dc3f-b884-634cf2eee92f\",\"DefaultDeviceCompliancePolicy.AdminConfiguredCompliance\",100,\"All\",29,0,0,0,0],[\"f6b5f8fd-2057-664c-f5a3-049cd9a4e66d\",\"DefaultDeviceCompliancePolicy.OSVersion\",100,\"All\",29,0,0,0,0],[\"277f9230-81f7-ffc3-af78-4662ec3dca09\",\"DefaultDeviceCompliancePolicy.RequireDeviceCompliancePolicyAssigned\",100,\"All\",28,1,0,0,0],[\"6daebdcd-622b-2574-be19-aefcb152ee31\",\"DefaultDeviceCompliancePolicy.RequireRemainContact\",100,\"All\",12,17,0,0,0],[\"cc221d02-d83f-ff08-46a8-024638ed0f8e\",\"DefaultDeviceCompliancePolicy.RequireUserExistence\",100,\"All\",29,0,0,0,0],[\"5d4245cb-9e64-8ef7-31c8-9c789ccc14da\",\"EdgeInstalled\",6,\"Windows10AndLater\",0,1,0,0,0],[\"4c2ca748-7550-9b63-299b-efb44c6e5d5c\",\"IOSCompliancePolicy.DeviceThreatProtectionRequiredSecurityLevel\",2,\"iOS\",4,1,0,0,0],[\"81e85e43-c73b-7b71-d973-22706f6ee5f7\",\"ModelName\",6,\"Windows10AndLater\",0,1,0,0,0],[\"0dffcb88-38df-3002-501c-d084994d6b11\",\"PaintInstalled\",6,\"Windows10AndLater\",0,1,0,0,0],[\"3e5efda7-4a00-3110-3e5b-4d9b67fa950b\",\"ScanExclusionsSet\",6,\"Windows10AndLater\",0,1,0,0,0],[\"df67c0a4-949b-c724-7f20-3a80524b8c72\",\"TPMChipPresent\",6,\"Windows10AndLater\",0,1,0,0,0],[\"b592199d-be2f-45dd-b4da-baa7345dcac5\",\"Windows10CompliancePolicy.BitLockerEnabled\",6,\"Windows10AndLater\",0,0,0,1,0],[\"fb3adfee-7fac-cdb5-23c4-eeb8efb67578\",\"Windows10CompliancePolicy.DeviceThreatProtectionRequiredSecurityLevel\",6,\"Windows10AndLater\",3,1,0,0,0],[\"703c9045-8646-f541-378e-9bd4e73a7118\",\"Windows10CompliancePolicy.OsMinimumVersion\",6,\"Windows10AndLater\",0,1,0,0,0]]}###",
        "temperature": 1,
        "top_p": 0.5,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "max_tokens": 2000,
        "best_of": 1,
        "stop": null
      }
    }
      if(promptInput.startsWith("What is the top reason for non-compliance")) {
        console.log("what is")
      
        requestBody = {
          "prompt": "In the following JSON schema,Order by NumberOfNonCompliantDevices descending and get only top 1 value.\\ Generate output as {\"NumberOfNonCompliantDevices\": 2, \"NumberOfCompliantDevices\": 1, \"SettingName\": \"name\" } \\###\\{\"TotalRowCount\":16,\"Schema\":[{\"Column\":\"SettingId\",\"PropertyType\":\"String\"},{\"Column\":\"SettingName\",\"PropertyType\":\"String\"},{\"Column\":\"PolicyPlatformType\",\"PropertyType\":\"Int32\"},{\"Column\":\"PolicyPlatform\",\"PropertyType\":\"String\"},{\"Column\":\"NumberOfCompliantDevices\",\"PropertyType\":\"Int64\"},{\"Column\":\"NumberOfNonCompliantDevices\",\"PropertyType\":\"Int64\"},{\"Column\":\"NumberOfNotEvaluatedDevices\",\"PropertyType\":\"Int64\"},{\"Column\":\"NumberOfNotApplicableDevices\",\"PropertyType\":\"Int64\"},{\"Column\":\"NumberOfConflictDevices\",\"PropertyType\":\"Int64\"}],\"Values\":[[\"b592199d-be2f-45dd-b4da-baa7345dcac5\",\"Windows10CompliancePolicy.BitLockerEnabled\",6,\"Windows10AndLater\",0,10,0,1,0],[\"fb3adfee-7fac-cdb5-23c4-eeb8efb67578\",\"Windows10CompliancePolicy.DeviceThreatProtectionRequiredSecurityLevel\",6,\"Windows10AndLater\",3,1,0,0,0],[\"703c9045-8646-f541-378e-9bd4e73a7118\",\"Windows10CompliancePolicy.OsMinimumVersion\",6,\"Windows10AndLater\",0,1,0,0,0]]}###\\",
          "temperature": 1,
          "top_p": 0.5,
          "frequency_penalty": 0,
          "presence_penalty": 0,
          "max_tokens": 2000,
          "best_of": 1,
          "stop": null
        }
      }
      if(promptInput.startsWith("Give me a well formed powershell script to enable Bitlocker on a device")) {
        requestBody = {
          "prompt": promptInput,
          "temperature": 1,
          "top_p": 0.5,
          "frequency_penalty": 0,
          "presence_penalty": 0,
          "max_tokens": 2000,
          "best_of": 1,
          "stop": null
        }
        //set the show deploy button to true
        showdeploy = true;
        //document.getElementById('deploy').style.visibility = 'visible';
      }
      
    
    


    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': `${apiKey}`
      },
      body: JSON.stringify(requestBody)
    };
    console.log(requestOptions.body);
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

  //TODO:I created a button with id deploy, onclick will call the following function, it is displayed when showDeploy is true

  async function deploy_click(event){
    //Harsh, add the graph call here
  }
  
  return (
    <div>
      <Head>
        <title>Intune Whisperer</title>
      </Head>
      <main className={styles.main}>
        <h3>Intune Whisperer</h3>

        <form id="form2" onSubmit={onSubmit2}>
        <textarea
          rows={20}
          cols={200}
          name="prompt"
          placeholder="How can I help you?"
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}>
          </textarea>
          <input id="submit2" type="submit"/>
        </form>
        <textarea
          rows={20}
          cols={200}
          readOnly= {true}
          name="result"
          placeholder="Result from Intune Whisperer"
          value={result}
          onChange={(e) => setPromptInput(e.target.value)}>
          </textarea>
        {/* <button id="deploy" onClick="deploy_click()"></button> */}

      </main>
    </div>
  );
}
