import './App.css';
import { useState } from "react";

function App() {

const [text,setText] = useState("");
const [journals,setJournals] = useState([]);
const [analysis,setAnalysis] = useState({});
const [insights,setInsights] = useState({});

const saveJournal = async () => {

const res = await fetch("http://localhost:5000/api/journal",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
userId:"1",
ambience:"forest",
text:text,
emotion:"neutral"
})
});

const data = await res.json();
alert(data.message);

};

const loadJournals = async () => {

const res = await fetch("http://localhost:5000/journals");
const data = await res.json();

setJournals(data);

};

const analyzeJournal = async () => {

const res = await fetch("http://localhost:5000/api/journal/analyze",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({ text })
});

const data = await res.json();

setAnalysis(data);

};

const showInsights = async () => {

const res = await fetch("http://localhost:5000/api/journal/insights/1");

const data = await res.json();

setInsights(data);

};
return (

<div style={{textAlign:"center",marginTop:"50px"}}>

<h1>AI Journal</h1>

<textarea
placeholder="Write your thoughts"
value={text}
onChange={(e)=>setText(e.target.value)}
style={{width:"300px",height:"100px"}}
/>

<br/><br/>

<button onClick={saveJournal}>Save Journal</button>

<button onClick={loadJournals}>Show Journals</button>

<button onClick={analyzeJournal}>Analyze Journal</button>

<button onClick={showInsights}>Show Insights</button>
<div>

<p>Emotion: {analysis.emotion}</p>
<p>Keywords: {analysis.keywords?.join(", ")}</p>
<p>Summary: {analysis.summary}</p>

</div>

<div>

<h3>Insights</h3>

<p>Total Entries: {insights.totalEntries}</p>
<p>Top Emotion: {insights.topEmotion}</p>
<p>Most Used Ambience: {insights.mostUsedAmbience}</p>

</div>
<ul>

{journals.map((j,i)=>(
<li key={i}>
{j.text} ({j.emotion})
</li>
))}

</ul>

</div>

);

}

export default App;