import { Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import connectToDatabase from "../database/mongodb";

const recipeController = {
  getAllRecipes: async (req: Request, res: Response) => {
    const { sort, filters } = req.query;
    const sortVar = sort?.toString() || "dateCreated";
    const filtersJSON = filters ? JSON.parse(filters as string) : {};
    const filtersObjectIds = Object.keys(filtersJSON).reduce(
      (acc: any, category: any) => {
        if (filtersJSON[category].length > 0)
          return {
            ...acc,
            [category]: {
              $all: filtersJSON[category].map((el: string) => new ObjectId(el)),
            },
          };
        return acc;
      },
      {}
    );

    try {
      const db = await connectToDatabase();
      const recipes = await db
        .collection("Recipes")
        .find({ ...filtersObjectIds })
        .project({
          title: 1,
          subtitle: 1,
          titleId: 1,
          imageUrl: 1,
          _id: 1,
          saves: 1,
          averageRating: 1,
          ratings: 1,
        })
        .sort({ [sortVar]: -1 })
        .toArray();
      return res.status(200).json(recipes);
    } catch (error) {
      console.error(`Error fetching recipes in getAllRecipes: ${error}`);
      throw error;
    }
  },
  getRecipesByTag: async (req: Request, res: Response) => {
    const tag = req.params.tag;
    try {
      const db = await connectToDatabase();
      const recipeIds = await db
        .collection("Tags")
        .findOne({ value: tag })
        .then((tag) => tag?.recipes);
      if (!recipeIds) {
        return res.status(500).json({ message: "Internal server error" });
      }
      return res.status(200).json(recipeIds);
    } catch (error) {
      console.error(`Error fetching recipes in getRecipesByTag: ${error}`);
      throw error;
    }
  },
  getRecipeById: async (req: Request, res: Response) => {
    const recipeId = req.params.recipeId;
    const { shortened } = req.query;
    try {
      const db = await connectToDatabase();
      let recipe;
      if (shortened == "true") {
        recipe = await db
          .collection("Recipes")
          .findOne(
            { _id: new ObjectId(recipeId) },
            { projection: { title: 1, titleId: 1, imageUrl: 1, _id: 1 } }
          );
      } else {
        recipe = await db
          .collection("Recipes")
          .findOne({ _id: new ObjectId(recipeId) });
      }
      return res.status(200).json(recipe);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getRecipeByTitleId: async (req: Request, res: Response) => {
    try {
      const db = await connectToDatabase();
      const recipe = await db
        .collection("Recipes")
        .findOne({ titleId: req.params.titleId });
      if (!recipe) {
        return res.status(500).json({ message: "Internal server error" });
      }

      return res.status(200).json(recipe);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  createRecipe: async (req: Request, res: Response) => {
    const tags = req.body.tags?.map((tag: any) => new ObjectId(tag)) || [];
    let recipe = {
      ...req.body,
      tags: tags,
      body: req.body.body.map((step: any) => JSON.parse(step)),
      featured: -1,
    };
    if (recipe.cuisines)
      recipe = {
        ...recipe,
        cuisines: JSON.parse(req.body.cuisines)?.map(
          (cuisine: any) => new ObjectId(cuisine)
        ),
      };

    if (recipe.ingredients)
      recipe = {
        ...recipe,
        ingredients: JSON.parse(req.body.ingredients).map(
          (ingredient: any) => new ObjectId(ingredient)
        ),
      };
    if (recipe.meals)
      recipe = {
        ...recipe,
        meals: JSON.parse(req.body.meals).map(
          (meal: any) => new ObjectId(meal)
        ),
      };
    if (recipe.diets)
      recipe = {
        ...recipe,
        diets: JSON.parse(req.body.diets).map(
          (diet: any) => new ObjectId(diet)
        ),
      };

    try {
      const db = await connectToDatabase();
      const result = await db
        .collection("Recipes")
        .findOneAndUpdate(
          { ...recipe, comments: [], ratings: [], averageRating: 0 },
          { $set: {} },
          { upsert: true, returnDocument: "after" }
        );
      if (result && result.value) {
        await db.collection("Tags").updateOne(
          { _id: new ObjectId("64921eb1bd1b50d757f00170") },
          {
            $push: {
              recipes: {
                $each: [new ObjectId(result?.value?._id)],
                $position: 0,
              },
            },
          }
        );
      }
      return res.status(200).json(result);
    } catch (error) {
      console.error(`Error creating recipe in createRecipe: ${error}`);
      throw error;
    }
  },
  updateRecipe: async (req: Request, res: Response) => {
    const recipeId = req.params.recipeId;
    var {
      prepTimeHours,
      prepTimeMinutes,
      cookTimeHours,
      cookTimeMinutes,
      totalTimeMinutes,
      totalTimeHours,
      servingsQty,
      servingsUnit,
      datePublished,
      ...recipe
    } = req.body;
    if (recipe.body)
      recipe = {
        ...recipe,
        body: req.body.body?.map((step: any) => JSON.parse(step)),
      };

    recipe = {
      ...recipe,
      cuisines: JSON.parse(req.body.cuisines)?.map(
        (cuisine: any) => new ObjectId(cuisine)
      ),
      ingredients: JSON.parse(req.body.ingredients).map(
        (ingredient: any) => new ObjectId(ingredient)
      ),
      meals: JSON.parse(req.body.meals).map((meal: any) => new ObjectId(meal)),
      diets: JSON.parse(req.body.diets).map((diet: any) => new ObjectId(diet)),
    };

    try {
      const db = await connectToDatabase();
      const result = await db
        .collection("Recipes")
        .findOneAndUpdate(
          { _id: new ObjectId(recipeId) },
          { $set: { ...recipe } },
          { returnDocument: "after" }
        );
      return res.status(200).json(result);
    } catch (error) {
      console.error(`Error fetching recipe in updateRecipe: ${error}`);
      throw error;
    }
  },
  deleteRecipe: async (req: Request, res: Response) => {
    try {
      const db = await connectToDatabase();
      const result = await db
        .collection("Recipes")
        .deleteOne({ _id: new ObjectId(req.params.recipeId) });

      if (result) {
        await db
          .collection("Tags")
          .updateOne(
            { _id: new ObjectId("64921eb1bd1b50d757f00170") },
            { $pull: { recipes: new ObjectId(req.params.recipeId) } }
          );
      }

      return res.status(200).json({ message: "Recipe deleted successfully" });
    } catch (error) {
      console.error(`Error fetching recipe in deleteRecipe: ${error}`);
      throw error;
    }
  },
  rateRecipe: async (req: Request, res: Response) => {
    const { userId, recipeId, rating, date } = req.body;
    try {
      const db = await connectToDatabase();
      const result = await db
        .collection("Recipes")
        .updateOne({ _id: new ObjectId(recipeId) }, [
          {
            $set: {
              ratings: {
                $map: {
                  input: "$ratings",
                  in: {
                    $cond: {
                      if: { $eq: ["$$this.userId", new ObjectId(userId)] },
                      then: {
                        rating,
                        userId: new ObjectId(userId),
                        date: new Date(date),
                      },
                      else: "$$this",
                    },
                  },
                },
              },
            },
          },
          {
            $set: {
              averageRating: {
                $avg: "$ratings.rating",
              },
            },
          },
        ]);
      const result2 = await db.collection("Profiles").updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            "ratings.$[element]": {
              rating,
              recipeId: new ObjectId(recipeId),
              date,
            },
          },
        },
        { arrayFilters: [{ "element.recipeId": new ObjectId(recipeId) }] }
      );
      if (result.modifiedCount === 0) {
        const result = await db.collection("Recipes").updateOne(
          { _id: new ObjectId(recipeId) },
          {
            $push: {
              ratings: {
                rating,
                userId: new ObjectId(userId),
                date: new Date(date),
              },
            },

            $set: {
              averageRating: { $avg: "ratings.rating" },
            },
          }
        );
        const result2 = await db.collection("Profiles").updateOne(
          { _id: new ObjectId(userId) },
          {
            $push: {
              ratings: {
                rating,
                recipeId: new ObjectId(recipeId),
                date: new Date(date),
              },
            },
          }
        );
        // console.log(result2);
      }
    } catch (error: any) {
      console.log(error);
    }
  },
  postComment: async (req: Request, res: Response) => {
    const comment = req.body.comment;
    const reply = req.body.reply;
    const recipeId = req.body.comment.recipeId;
    const commentId = req.body.commentId;
    // console.log(comment);
    try {
      const db = await connectToDatabase();
      if (!reply) {
        const result = await db.collection("Recipes").updateOne(
          { _id: new ObjectId(recipeId) },
          {
            $push: {
              comments: {
                _id: new ObjectId(),
                ...comment,
                replies: [],
                profileId: new ObjectId(comment.profileId),
              },
            },
          }
        );
      } else {
        const result = await db.collection("Recipes").updateOne(
          {
            _id: new ObjectId(recipeId),
            "comments._id": new ObjectId(commentId),
          },
          {
            $push: {
              "comments.$[comment].replies": {
                _id: new ObjectId(),
                ...comment,
                profileId: new ObjectId(comment.profileId),
              },
            },
          },
          {
            arrayFilters: [
              {
                "comment._id": new ObjectId(commentId),
              },
            ],
          }
        );
      }
      return res.sendStatus(200);
    } catch (error) {
      console.error(`Error creating comment in postComment: ${error}`);
      throw error;
    }
  },
  getComments: async (req: Request, res: Response) => {
    try {
      const db = await connectToDatabase();
      const result = await db
        .collection("Recipes")
        .findOne({ _id: new ObjectId(req.params.recipeId) });
      const commentIds = result?.comments;
      const comments = await Promise.all(
        commentIds.map(async (commentId: ObjectId) => {
          const comment = await db
            .collection("Comments")
            .findOne({ _id: commentId });

          const replies = await Promise.all(
            comment?.replies.map(async (replyId: ObjectId) => {
              const reply = await db
                .collection("Comments")
                .findOne({ _id: replyId });
              return reply;
            })
          );
          return { comment, replies };
        })
      );
      return res.json(comments);
    } catch (error) {
      console.error(`Error fetching comments in getComments: ${error}`);
      throw error;
    }
  },

  async searchRecipes(req: Request, res: Response) {
    try {
      const db = await connectToDatabase();
      // const result = await db
      //   .collection("Recipes")
      //   .find({"title": {$regex : regex, $options: 'i'}}, { projection: { title: 1, titleId: 1, description: 1, imageUrl: 1} }).toArray();
      const result = await db
        .collection("Recipes")
        .aggregate([
          {
            $search: {
              index: "default",
              autocomplete: {
                query: req.query.query,
                path: "title",
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 3,
                },
              },
            },
          },
          {
            $project: {
              title: 1,
              titleId: 1,
              description: 1,
              imageUrl: 1,
              highlights: { $meta: "searchHighlights" },
            },
          },
        ])
        .toArray();
      return res.status(200).json(result);
    } catch (err) {
      console.log(err);
    }
  },
};

export default recipeController;
