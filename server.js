const Journal = require("./models/Journal");

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.error("MongoDB Error:", err);
});

// Test route
app.get("/", (req,res)=>{
    res.send("AI Journal Server Running");
});
function detectEmotion(text){
if(!text) return "neutral";

text = text.toLowerCase();

if(text.includes("happy") || text.includes("good")) return "happy";
if(text.includes("sad") || text.includes("bad")) return "sad";
if(text.includes("angry")) return "angry";
if(text.includes("calm") || text.includes("relaxed")) return "calm";

return "neutral";
}
app.post("/api/journal", async (req, res) => {
  try {
   const { userId, ambience, text } = req.body;
   const emotion = detectEmotion(text);
     const cleanedText = text.trim();
      const keywords = cleanedText ? cleanedText.split(" ").slice(0,5) : [];

        const summary = "User expressed " + emotion + " feelings";
    const newJournal = new Journal({
      userId,
      ambience,
      text,
      emotion,
      keywords,
      summary
    });

    await newJournal.save();

    res.json({ message: "Journal saved successfully",
      emotion,
      keywords,
      summary
     });

  } catch (error) {
    res.status(500).json({ error: "Error saving journal" });
  }
});
app.get("/api/journal/:userId", async (req,res)=>{

try{

const journals = await Journal.find({
userId: req.params.userId
});

res.json(journals);

}catch(error){

res.status(500).json({error:"Error fetching user journals"});

}

});

app.delete("/deleteAll", async (req, res) => {
  try {
    await Journal.deleteMany({});
    res.json({ message: "All journals deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting journals" });
  }
});
//Insight Api
// Insights API
app.get("/api/journal/insights/:userId", async (req, res) => {

  try {

    const userId = req.params.userId;

    const journals = await Journal.find({ userId });

    const totalEntries = journals.length;

    let emotionCount = {};
    let ambienceCount = {};
    let keywordsList = [];

    journals.forEach(j => {

      emotionCount[j.emotion] = (emotionCount[j.emotion] || 0) + 1;

      if(j.ambience){
        ambienceCount[j.ambience] = (ambienceCount[j.ambience] || 0) + 1;
      }

      if(j.keywords){
        keywordsList = keywordsList.concat(j.keywords);
      }

    });

    let topEmotion = "neutral";

    for(let e in emotionCount){
      if(emotionCount[e] > (emotionCount[topEmotion] || 0)){
        topEmotion = e;
      }
    }

    let mostUsedAmbience = "none";

    for(let a in ambienceCount){
      if(ambienceCount[a] > (ambienceCount[mostUsedAmbience] || 0)){
        mostUsedAmbience = a;
      }
    }

    const recentKeywords = keywordsList.slice(-5);

    res.json({
      totalEntries,
      topEmotion,
      mostUsedAmbience,
      recentKeywords
    });

  } catch (error) {
    res.status(500).json({ error: "Error generating insights" });
  }

});
//Analyze API
app.post("/api/journal/analyze",(req,res)=>{

const { text } = req.body;

const emotion = detectEmotion(text);

const keywords = text.split(" ").slice(0,3);

const summary = "User expressed " + emotion + " feelings";

res.json({
emotion,
keywords,
summary
});

});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});