import express, { Request, Response } from "express";
import userController from "../controllers/userController";
import bcrypt from "bcryptjs";
import checkAuth from "../middleware/checkAuth";
import recipeController from "../controllers/recipeController";

const router = express.Router();

router.route("/login").post(userController.handleLogin);

router.route("/logout").post(userController.handleLogout);

router.route("/create").post(hashPassword, userController.createUser);

router.route("/:id/saveRecipe").post(userController.saveRecipe);
router.route("/:id").get(userController.getUser);

router.route("/").post(userController.findUser).get(userController.getAllUsers);

async function hashPassword(req: Request, res: Response, next: any) {
  let password = req.body.values.password;
  hashedPassword(password)
    .then((hash) => {
      req.body.values["dateCreated"] = new Date().toISOString();
      req.body.values.password = hash;
      delete req.body.values.confirmPassword;
      next();
    })
    .catch((err) => {
      console.log("ERROR HASHING PASSWORD: ", err);
      res.status(500).json({ message: "Error hashing password" });
    });
}

async function hashedPassword(password: string) {
  const saltRounds = 10;
  // console.log("PASSWORD: ", password);

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });
}

export default router;
