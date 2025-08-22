import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  createUserSchema,
  signInSchema,
  createRoomSchema,
} from "@repo/common/types";

const app = express();

app.post("/signup", async (req: Request, res: Response) => {
  const data = createUserSchema.safeParse(req.body);
  if (!data.success) {
    return res.json({
      message: "Incorrect Inputs",
    });
  }
  const { username, password } = req.body;
  // const user = await User.findOne({ email });
  const userId = 1;
  if (userId) {
    return res.status(400).json({ message: "User already exists" });
  }
  // const newUser = new User({ username, password });
  // await newUser.save();
  res.status(201).json({ message: "User created successfully" });
});

app.post("/signin", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  // const user = await User.findOne({ email });
  const user = { password };
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  if (user.password !== password) {
    return res.status(400).json({ message: "Invalid password" });
  }
  const token = jwt.sign({ username }, JWT_SECRET as string, {
    expiresIn: "12h",
  });
  res.status(200).json({ message: "User signed in successfully", token });
});

app.post("/room", middleware, async (req: Request, res: Response) => {});

app.listen(8080, () => {
  console.log("HTTP Server is running on port 8080");
});
