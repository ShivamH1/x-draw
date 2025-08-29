import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  createUserSchema,
  signInSchema,
  createRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

app.post("/signup", async (req: Request, res: Response) => {
  const reqBody = createUserSchema.safeParse(req.body);
  if (!reqBody.success) {
    return res.status(400).json({
      message: "Incorrect inputs",
    });
  }
  const user = await prismaClient.user.findUnique({
    where: {
      email: reqBody.data.email,
    },
  });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }
  try {
    // Hash password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(reqBody.data.password, saltRounds);
    
    const newUser = await prismaClient.user.create({
      data: {
        email: reqBody.data.email,
        password: hashedPassword,
        name: reqBody.data.name,
        photo: reqBody.data?.photo,
      },
    });
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/signin", async (req: Request, res: Response) => {
  const reqBody = signInSchema.safeParse(req.body);
  if (!reqBody.success) {
    return res.status(400).json({
      message: "Incorrect inputs",
    });
  }

  const user = await prismaClient.user.findUnique({
    where: {
      email: reqBody.data.email,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Compare hashed password
  const isPasswordValid = await bcrypt.compare(reqBody.data.password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { email: user.email, userId: user.id },
    JWT_SECRET as string,
    {
      expiresIn: "12h",
    }
  );

  res.status(200).json({ message: "User signed in successfully", token });
});

app.post("/room", middleware, async (req: Request, res: Response) => {
  const reqBody = createRoomSchema.safeParse(req.body);
  if (!reqBody.success) {
    return res.status(400).json({
      message: "Incorrect inputs",
    });
  }

  // @ts-ignore - middleware should add user to request
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const room = await prismaClient.room.create({
    data: {
      slug:
        reqBody.data.name.toLowerCase(),
      adminId: userId,
    },
  });

  res.status(201).json({
    message: "Room created successfully",
    roomId: room.id,
    slug: room.slug,
  });
});

app.get("/chats/:roomId", async (req, res) => {
  const roomId = req.params.roomId;
  const chats = await prismaClient.chat.findMany({
    where: {
      roomId: parseInt(roomId)
    },
    orderBy: {
      id: "desc",
    },
    take: 50,
  });

  res.status(200).json({ chats });
})

app.listen(8080, () => {
  console.log("HTTP Server is running on port 8080");
});
