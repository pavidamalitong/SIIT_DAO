const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3001;

require("dotenv").config();
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

app.use(cors());
app.use(express.json());

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    // Make a request to Thammasat API
    const response = await axios.post(
      "https://restapi.tu.ac.th/api/v1/auth/Ad/verify",
      { UserName: username, PassWord: password },
      {
        headers: {
          "Application-Key": ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the API response is successful
    if (response.status === 200) {
      return res.json({ message: "Login successful", data: response.data });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
