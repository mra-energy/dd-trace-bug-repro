import OpenAI from "openai";
import express from "express";

const app = express();
app.get("/", (req, res) => {
  res.send(`Hello ${req.query.name}!`);
});

if (false) {
  const client = new OpenAI();
  client.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: "Hello, who won the world series in 2020?",
      },
    ],
  });
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
