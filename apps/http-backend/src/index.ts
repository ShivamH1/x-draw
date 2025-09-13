import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import { middleware } from "./middleware";
import { specs, swaggerUi } from "./swagger";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  createUserSchema,
  signInSchema,
  createRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());
app.use(cors());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with email, password, and name
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignup'
 *           example:
 *             email: "user@example.com"
 *             password: "securepassword123"
 *             name: "John Doe"
 *             photo: "https://example.com/photo.jpg"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - invalid inputs or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalid_inputs:
 *                 value:
 *                   message: "Incorrect inputs"
 *               user_exists:
 *                 value:
 *                   message: "User already exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Internal server error"
 */
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

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Sign in user
 *     description: Authenticates a user with email and password, returns JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignin'
 *           example:
 *             email: "user@example.com"
 *             password: "securepassword123"
 *     responses:
 *       200:
 *         description: User signed in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User signed in successfully"
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad request - invalid inputs, user not found, or invalid password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalid_inputs:
 *                 value:
 *                   message: "Incorrect inputs"
 *               user_not_found:
 *                 value:
 *                   message: "User not found"
 *               invalid_password:
 *                 value:
 *                   message: "Invalid password"
 */
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
  const isPasswordValid = await bcrypt.compare(
    reqBody.data.password,
    user.password
  );
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

/**
 * @swagger
 * /room:
 *   post:
 *     summary: Create a new room
 *     description: Creates a new collaborative drawing room (requires authentication)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoom'
 *           example:
 *             name: "My Drawing Room"
 *     responses:
 *       201:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Room created successfully"
 *                 roomId:
 *                   type: integer
 *                   description: ID of the created room
 *                   example: 123
 *                 slug:
 *                   type: string
 *                   description: URL slug for the room
 *                   example: "my-drawing-room"
 *       400:
 *         description: Bad request - invalid inputs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Incorrect inputs"
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Unauthorized"
 */
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
      slug: reqBody.data.name.toLowerCase(),
      adminId: userId,
    },
  });

  res.status(201).json({
    message: "Room created successfully",
    roomId: room.id,
    slug: room.slug,
  });
});

/**
 * @swagger
 * /rooms/{slug}:
 *   get:
 *     summary: Get room by slug
 *     description: Retrieves a room by its URL slug
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Room URL slug
 *         example: "my-drawing-room"
 *     responses:
 *       200:
 *         description: Room found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 room:
 *                   $ref: '#/components/schemas/Room'
 *             example:
 *               room:
 *                 id: 123
 *                 name: "My Drawing Room"
 *                 slug: "my-drawing-room"
 *                 adminId: 456
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Room not found"
 */
app.get("/rooms/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug: slug,
    },
  });
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }
  res.status(200).json({ room: room });
});

/**
 * @swagger
 * /chats/{roomId}:
 *   get:
 *     summary: Get chat messages for a room
 *     description: Retrieves the latest 50 chat messages for a specific room (ordered by newest first)
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID to get chat messages for
 *         example: 123
 *     responses:
 *       200:
 *         description: Chat messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chats:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Chat'
 *             example:
 *               chats:
 *                 - id: 1
 *                   roomId: 123
 *                   message: "Hello everyone!"
 *                   userId: 456
 *                   timestamp: "2023-01-01T12:00:00.000Z"
 *                 - id: 2
 *                   roomId: 123
 *                   message: "How is everyone doing?"
 *                   userId: 789
 *                   timestamp: "2023-01-01T12:05:00.000Z"
 *       400:
 *         description: Bad request - invalid room ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Invalid room ID"
 */
app.get("/chats/:roomId", async (req, res) => {
  const roomId = req.params.roomId;
  const chats = await prismaClient.chat.findMany({
    where: {
      roomId: parseInt(roomId),
    },
    orderBy: {
      id: "desc",
    },
    take: 50,
  });

  res.status(200).json({ chats });
});

app.listen(8080, () => {
  console.log("HTTP Server is running on port 8080");
});
