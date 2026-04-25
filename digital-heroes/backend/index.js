const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://admin:admin%40123@cluster0.7celwbk.mongodb.net/digitalheroes?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" }
});

const User = mongoose.model("User", userSchema);

// Test route
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});


// ================= AUTH ROUTES =================
app.use("/scores", require("./routes/score"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/charity", require("./routes/charity"));
app.use("/admin", require("./routes/admin"));
const subscriptionRoutes = require("./routes/subscription");
app.use("/subscription", subscriptionRoutes);

app.use("/draw", require("./routes/draw"));
app.use("/winnings", require("./routes/winnings"));

// Signup
app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.json({ success: false, message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});


// Login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.json({ success: false });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});