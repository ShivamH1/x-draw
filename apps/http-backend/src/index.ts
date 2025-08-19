import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";

const app = express();

app.post("/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // const user = await User.findOne({ email });
  const userId = 1;
  if (userId) {
    return res.status(400).json({ message: "User already exists" });
  }
  // const newUser = new User({ email, password });
  // await newUser.save();
  res.status(201).json({ message: "User created successfully" });
});

app.post("/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // const user = await User.findOne({ email });
  const user = {password}
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  if (user.password !== password) {
    return res.status(400).json({ message: "Invalid password" });
  }
  const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
    expiresIn: "12h",
  });
  res.status(200).json({ message: "User signed in successfully", token });
});

app.post("/room", middleware, async (req: Request, res: Response) => {});

app.listen(8080, () => {
  console.log("HTTP Server is running on port 8080");
});
