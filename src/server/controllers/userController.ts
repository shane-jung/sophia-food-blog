import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import connectToDatabase from "../database/mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { EmptyProfile } from "../../client/types";

const userController = {
  findUser: async (req: Request, res: Response) => {
    const email = req.body.email;
    const db = await connectToDatabase();
    const user = await db.collection("Profiles").findOne({ email: email });
    if (user) return res.sendStatus(409);
    else return res.sendStatus(200);
  },
  handleLogin: async (req: Request, res: Response, next: any) => {
    const user = req.body;
    const db = await connectToDatabase();
    const DBUser = await db
      .collection("Profiles")
      .findOne({ email: user.email });
    if (!DBUser)
      return res
        .status(401)
        .json({ errMessage: "No user associated with that email address" });
    const match = await bcrypt.compare(user.password, DBUser.password);
    console.log(match);
    if (match) {
      console.log("\nLogging in User. Generating Access and Refresh Token\n");
      const accessToken = jwt.sign(
        {
          user: {
            roles: DBUser.roles,
            _id: DBUser._id,
            username: DBUser.username,
          },
        },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        {
          user: {
            roles: DBUser.roles,
            _id: DBUser._id,
            username: DBUser.username,
          },
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
          expiresIn: "1d",
        }
      );
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });
      DBUser["refresh-token"] = refreshToken;
      req.headers["Authorization"] = `Bearer ${accessToken}`;
      saveUser(DBUser);
      res.json({ isAuthenticated: true, user: DBUser });
    } else {
      return res
        .status(401)
        .json({ errMessage: "Incorrect username or password." });
    }
  },
  handleLogout: async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const jwt = cookies.jwt;
    res.clearCookie("jwt", { httpOnly: true });

    try {
      const db = await connectToDatabase();
      const result = await db
        .collection("Profiles")
        .updateOne({ "refresh-token": jwt }, { $set: { "refresh-token": "" } });
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
    }
  },

  createUser: async (req: Request, res: Response) => {
    const { values: user } = req.body;
    try {
      const db = await connectToDatabase();
      const DBuser = { ...EmptyProfile, roles: [1000], ...user };
      const result = await db.collection("Profiles").insertOne(DBuser);
      return res.json({ user: { ...DBuser, _id: result.insertedId } });
    } catch (error) {
      console.error(`Error creating user in createUser: ${error}`);
      throw error;
    }
  },
  getUser: async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const db = await connectToDatabase();
      const user = await db
        .collection("Profiles")
        .findOne({ _id: new ObjectId(id) });
      if (user)
        return res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          likedComments: user.likedComments,
          savedRecipes: user.savedRecipes,
          comments: user.comments,
        });
      else return res.sendStatus(404);
    } catch (error) {
      console.error(`Error getting user in getUser: ${error}`);
      throw error;
    }
  },
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const db = await connectToDatabase();
      const users = await db.collection("Profiles").find().toArray();
      // console.log(users);
      return res.json(users);
    } catch (error) {
      console.error(`Error getting users in getAllUsers: ${error}`);
      throw error;
    }
  },
  saveRecipe: async (req: Request, res: Response) => {
    const { push, recipeId } = req.body;
    const id = req.params.id as string;
    console.log(req.body, id);
    try {
      const db = await connectToDatabase();
      let userUpdate, recipeUpdate;
      if (push) {
        userUpdate = {
          $push: {
            savedRecipes: { $each: [new ObjectId(recipeId)], $position: 0 },
          },
        };
        recipeUpdate = { $inc: { saves: 1 } };
      } else {
        userUpdate = { $pull: { savedRecipes: new ObjectId(recipeId) } };
        recipeUpdate = { $inc: { saves: -1 } };
      }
      const userResult = await db
        .collection("Profiles")
        .updateOne({ _id: new ObjectId(id) }, userUpdate);
      const recipeResult = await db
        .collection("Recipes")
        .updateOne({ _id: new ObjectId(recipeId) }, recipeUpdate);

      console.log(userResult);
      return res.sendStatus(200);
    } catch (error) {
      console.error(`Error saving recipe in saveRecipe: ${error}`);
      throw error;
    }
  },
};
async function saveUser(user: any) {
  try {
    const db = await connectToDatabase();
    const result = await db
      .collection("Profiles")
      .updateOne({ email: user.email }, { $set: user }, { upsert: true });
  } catch (error: any) {
    console.error(`Error editing user in saveUser: ${error}`);
    throw error;
  }
}

saveUser({ ...EmptyProfile, email: "sampleuser@gmail.com" });
export default userController;
