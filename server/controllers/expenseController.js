import mongoose from "mongoose";
import Group from "../models/groups.js";
import Expense from "../models/expenses.js";
import User from "../models/users.js";

// Create Expense
export const createExpense = async (req, res) => {
  try {
    const {
      amount,
      date,
      category,
      subcategory,
      desc,
      paid,
      paymentMode,
      reccurExpense,
      occuranceDuration,
      occuranceDate,
    } = req.body;

    const expense = new Expense({
      amount,
      date,
      category,
      subcategory,
      desc,
      paid,
      paymentMode,
      reccurExpense,
      occuranceDuration,
      occuranceDate,
      userId: req.user.userId,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//add multiple expense

export const createMultipleExpenses = async (req, res) => {
  try {
    const { expenses, userId } = req.body;

    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
      return res.status(400).json({ message: "No expenses provided" });
    }

    // Add userId to each expense
    const expensesToSave = expenses.map((exp) => ({
      ...exp,
      userId,
    }));

    // Save all expenses at once using insertMany
    const savedExpenses = await Expense.insertMany(expensesToSave);

    res.status(201).json(savedExpenses);
  } catch (err) {
    console.error("Error saving expenses:", err);
    res.status(500).json({ message: err.message });
  }
};

// get all expenses of a user with pagination, filtering, and sorting(non split)

export const getExpenses = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const { categoryId, subcategoryId, paymentMode, sortField, sortOrder } =
      req.query;

    // Build match object
    const match = {
      userId: new mongoose.Types.ObjectId(userId),
      split: { $ne: true }, // only non-split expenses
    };
    if (categoryId) match.category = new mongoose.Types.ObjectId(categoryId);
    if (subcategoryId)
      match.subcategory = new mongoose.Types.ObjectId(subcategoryId);
    if (paymentMode) match.paymentMode = paymentMode;

    const totalDocs = await Expense.countDocuments(match);

    let sort = { date: -1 };
    if (sortField && sortOrder) {
      const order = sortOrder === "asc" ? 1 : -1;
      sort = { [sortField]: order };
    }

    const expenses = await Expense.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "result1",
        },
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "subcategory",
          foreignField: "_id",
          as: "result2",
        },
      },
      { $unwind: "$result1" },
      { $unwind: "$result2" },
      {
        $project: {
          _id: 1,
          amount: 1,
          category: 1,
          subcategory: 1,
          date: 1,
          paid: 1,
          paymentMode: 1,
          type: 1,
          categoryName: "$result1.name",
          subcategoryName: "$result2.name",
        },
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
    ]);

    res.json({
      expenses,
      currentPage: page,
      totalPages: Math.ceil(totalDocs / limit),
      totalExpenses: totalDocs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get all split expenses

export const getSplitExpenses = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const { categoryId, subcategoryId, paymentMode, groupId, sortField, sortOrder } =
      req.query;

    // Build match object: only split expenses where the user is a participant
    const match = {
      split: true,
      participants: {
        $elemMatch: { userId: new mongoose.Types.ObjectId(userId) },
      },
    };

    if (categoryId) match.category = new mongoose.Types.ObjectId(categoryId);
    if (subcategoryId) match.subcategory = new mongoose.Types.ObjectId(subcategoryId);
    if (paymentMode) match.paymentMode = paymentMode;
    if (groupId) match.grpId = new mongoose.Types.ObjectId(groupId);

    const totalDocs = await Expense.countDocuments(match);

    // Sorting
    let sort = { date: -1 };
    if (sortField && sortOrder) {
      const order = sortOrder === "asc" ? 1 : -1;
      sort = { [sortField]: order };
    }

    const expenses = await Expense.aggregate([
      { $match: match },

      // Lookup categories
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "result1",
        },
      },
      // Lookup subcategories
      {
        $lookup: {
          from: "subcategories",
          localField: "subcategory",
          foreignField: "_id",
          as: "result2",
        },
      },
      // Lookup groups
      {
        $lookup: {
          from: "groups",
          localField: "grpId",
          foreignField: "_id",
          as: "groupInfo",
        },
      },
      { $unwind: "$result1" },
      { $unwind: "$result2" },
      { $unwind: "$groupInfo" }, // Ensure every expense has a valid group

      // Extract user's share
      {
        $addFields: {
          userShare: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$participants",
                  cond: {
                    $eq: ["$$this.userId", new mongoose.Types.ObjectId(userId)],
                  },
                },
              },
              0,
            ],
          },
        },
      },

      // Project fields for front-end
      {
        $project: {
          _id: 1,
          amount: 1,
          userShare: "$userShare.share",
          date: 1,
          paid: 1,
          paymentMode: 1,
          categoryName: "$result1.name",
          categoryId: "$result1._id",
          subcategoryName: "$result2.name",
          subcategoryId: "$result2._id",
          grpId: "$groupInfo._id",
          groupName: "$groupInfo.grpName",
          settled: "$userShare.settled",
          settledAmount: "$userShare.settledAmount",
        },
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
    ]);

    res.json({
      expenses,
      currentPage: page,
      totalPages: Math.ceil(totalDocs / limit),
      totalExpenses: totalDocs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get Single Expense
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Expense
export const updateExpense = async (req, res) => {
  try {
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!updatedExpense)
      return res.status(404).json({ message: "Expense not found" });
    res.json(updatedExpense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Expense
export const deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!deleted) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get user expense for days(without split)

// export const getDailyExpenses = async (req, res) => {
//   const userId = req.user.userId;
//   const days = parseInt(req.query.days) || 30;

//   try {
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - days + 1);

//     const dailySummary = await Expense.aggregate([
//       {
//         $match: {
//           userId: new mongoose.Types.ObjectId(userId),
//           date: { $gte: startDate },
//         },
//       },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
//           total: { $sum: "$amount" },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     res.status(200).json(dailySummary);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch daily expenses" });
//   }
// };

export const getDailyExpenses = async (req, res) => {
  const userId = req.user.userId;
  const days = parseInt(req.query.days) || 30;

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);

    const dailySummary = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startDate },
          $or: [
            // Non-split expenses (no `split` field)
            {
              $and: [
                { split: { $exists: false } },
                { userId: new mongoose.Types.ObjectId(userId) },
              ],
            },
            // Split expenses where user is a participant
            {
              split: true,
              "participants.userId": new mongoose.Types.ObjectId(userId),
            },
          ],
        },
      },
      {
        $addFields: {
          effectiveAmount: {
            $cond: {
              if: { $eq: ["$split", true] },
              then: {
                $getField: {
                  field: "share",
                  input: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$participants",
                          as: "p",
                          cond: {
                            $eq: [
                              "$$p.userId",
                              new mongoose.Types.ObjectId(userId),
                            ],
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
              else: "$amount",
            },
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: "$effectiveAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(dailySummary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch daily expenses" });
  }
};

//get expense by category(without split)

// export const getExpensesByCategory = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const days = parseInt(req.query.days) || 30;

//     // Calculate startDate based on days
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - days + 1);

//     // Aggregate expenses by category
//     const expensesByCategory = await Expense.aggregate([
//       {
//         $match: {
//           userId: new mongoose.Types.ObjectId(userId),
//           date: { $gte: startDate }, // filter by startDate
//         },
//       },
//       {
//         $group: {
//           _id: "$category",
//           total: { $sum: "$amount" },
//         },
//       },
//       {
//         $lookup: {
//           from: "categories",
//           localField: "_id",
//           foreignField: "_id",
//           as: "categoryDetails",
//         },
//       },
//       {
//         $unwind: "$categoryDetails",
//       },
//       {
//         $project: {
//           _id: 0,
//           categoryId: "$categoryDetails._id",
//           categoryName: "$categoryDetails.name",
//           total: 1,
//         },
//       },
//     ]);

//     return res.status(200).json(expensesByCategory);
//   } catch (err) {
//     console.error("Failed to fetch expenses by category:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

export const getExpensesByCategory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const days = parseInt(req.query.days) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);

    const expensesByCategory = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startDate },
          $or: [
            // Non-split expenses (no split field or explicitly false)
            {
              $and: [
                { split: { $exists: false } },
                { userId: new mongoose.Types.ObjectId(userId) },
              ],
            },
            // Split expenses where user is a participant
            {
              split: true,
              "participants.userId": new mongoose.Types.ObjectId(userId),
            },
          ],
        },
      },
      {
        $addFields: {
          effectiveAmount: {
            $cond: {
              if: { $eq: ["$split", true] },
              then: {
                $getField: {
                  field: "share",
                  input: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$participants",
                          as: "p",
                          cond: {
                            $eq: [
                              "$$p.userId",
                              new mongoose.Types.ObjectId(userId),
                            ],
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
              else: "$amount",
            },
          },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$effectiveAmount" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $project: {
          _id: 0,
          categoryId: "$categoryDetails._id",
          categoryName: "$categoryDetails.name",
          total: 1,
        },
      },
    ]);

    return res.status(200).json(expensesByCategory);
  } catch (err) {
    console.error("Failed to fetch expenses by category:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// get expense by sub cat of a certain cat(without split)
// export const getSubcategoryExpenses = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { categoryId, days } = req.query;

//     if (!categoryId) {
//       return res.status(400).json({ message: "categoryId is required" });
//     }

//     let startDate;
//     if (days) {
//       const daysNum = Number(days);
//       startDate = new Date();
//       startDate.setDate(startDate.getDate() - daysNum);
//     }

//     const match = {
//       userId: new mongoose.Types.ObjectId(userId),
//       category: new mongoose.Types.ObjectId(categoryId),
//     };

//     if (startDate) {
//       match.date = { $gte: startDate };
//     }

//     const subcategoryData = await Expense.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: "$subcategory",
//           total: { $sum: "$amount" },
//         },
//       },
//       {
//         $lookup: {
//           from: "subcategories",
//           localField: "_id",
//           foreignField: "_id",
//           as: "subcategoryDetails",
//         },
//       },
//       { $unwind: "$subcategoryDetails" },
//       {
//         $project: {
//           _id: 0,
//           subcategoryId: "$subcategoryDetails._id",
//           subcategoryName: "$subcategoryDetails.name",
//           total: 1,
//         },
//       },
//       { $sort: { total: -1 } },
//     ]);

//     res.status(200).json(subcategoryData);
//   } catch (err) {
//     console.error("Failed to fetch subcategory expenses:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getSubcategoryExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { categoryId, days } = req.query;

    if (!categoryId) {
      return res.status(400).json({ message: "categoryId is required" });
    }

    let startDate;
    if (days) {
      const daysNum = Number(days);
      startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);
    }

    const match = {
      category: new mongoose.Types.ObjectId(categoryId),
      $or: [
        {
          $and: [
            { $or: [{ split: { $exists: false } }, { split: false }] },
            { userId: new mongoose.Types.ObjectId(userId) },
          ],
        },
        {
          split: true,
          "participants.userId": new mongoose.Types.ObjectId(userId),
        },
      ],
    };

    if (startDate) {
      match.date = { $gte: startDate };
    }

    const subcategoryData = await Expense.aggregate([
      { $match: match },
      {
        $addFields: {
          effectiveAmount: {
            $cond: {
              if: { $eq: ["$split", true] },
              then: {
                $getField: {
                  field: "share",
                  input: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$participants",
                          as: "p",
                          cond: {
                            $eq: [
                              "$$p.userId",
                              new mongoose.Types.ObjectId(userId),
                            ],
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
              else: "$amount",
            },
          },
        },
      },
      {
        $group: {
          _id: "$subcategory",
          total: { $sum: "$effectiveAmount" },
        },
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "_id",
          foreignField: "_id",
          as: "subcategoryDetails",
        },
      },
      { $unwind: "$subcategoryDetails" },
      {
        $project: {
          _id: 0,
          subcategoryId: "$subcategoryDetails._id",
          subcategoryName: "$subcategoryDetails.name",
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json(subcategoryData);
  } catch (err) {
    console.error("Failed to fetch subcategory expenses:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// splitwise controllers

//new add split controller to automatically settle payee's splits
export const createSplitwiseExpense = async (req, res) => {
  try {
    const {
      amount,
      date,
      category,
      subcategory,
      desc,
      paid,
      paymentMode,
      split,
      splitType,
      grpId,
      paidBy,
      participants,
    } = req.body;

    if (!split || !participants || participants.length === 0) {
      return res
        .status(400)
        .json({ message: "Participants required for split expense" });
    }

    // Ensure payer is marked settled in participants
    const updatedParticipants = participants.map((p) => {
      if (p.userId === paidBy) {
        return {
          ...p,
          settled: true,
          settledAmount: p.share, // fully settled for their own share
        };
      }
      return {
        ...p,
        settled: false,
        settledAmount: 0, // others still need to settle
      };
    });

    const expense = new Expense({
      amount,
      date,
      category,
      subcategory,
      desc,
      paid,
      paymentMode,
      split,
      splitType,
      grpId,
      paidBy,
      participants: updatedParticipants,
      userId: req.user.userId,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//split calculating controller

export const calculateSettlementByGrp = async (req, res) => {
  try {
    const { grpId } = req.params;

    // Fetch all expenses with participants and payer details
    const expenses = await Expense.find({ grpId })
      .lean()
      .populate("participants.userId", "_id username")
      .populate("paidBy", "_id username");

    //  Track pairwise debts: debts[from][to] = amount
    const debts = {};

    // Initialize all users in debts
    const userIdsSet = new Set();
    expenses.forEach((exp) => {
      userIdsSet.add(exp.paidBy._id.toString());
      exp.participants.forEach((p) => userIdsSet.add(p.userId._id.toString()));
    });

    userIdsSet.forEach((userId) => {
      debts[userId] = {};
      userIdsSet.forEach((otherId) => {
        if (userId !== otherId) debts[userId][otherId] = 0;
      });
    });

    // Populate debts per expense
    for (const exp of expenses) {
      const payerId = exp.paidBy._id.toString();

      for (const part of exp.participants) {
        const partId = part.userId._id.toString();
        const unsettledAmount = (part.share || 0) - (part.settledAmount || 0);

        if (unsettledAmount > 0 && partId !== payerId) {
          // Participant owes payer
          debts[partId][payerId] += unsettledAmount;
        }
      }
    }

    //  Convert debts object to settlements array directly
    const settlements = [];
    Object.entries(debts).forEach(([from, owes]) => {
      Object.entries(owes).forEach(([to, amount]) => {
        if (amount > 0) {
          settlements.push({ from, to, amount });
        }
      });
    });

    //  Compute net balances per user for display
    const balances = {};
    userIdsSet.forEach((userId) => {
      let balance = 0;
      userIdsSet.forEach((otherId) => {
        balance += debts[otherId][userId] || 0; // money owed to this user
        balance -= debts[userId][otherId] || 0; // money this user owes
      });
      balances[userId] = balance;
    });

    //  Fetch usernames
    const users = await User.find({
      _id: { $in: Array.from(userIdsSet) },
    }).select("_id username");
    const userMap = {};
    users.forEach((u) => {
      userMap[u._id.toString()] = u.username;
    });

    //  Format balances
    const balancesWithNames = Object.entries(balances).map(
      ([userId, balance]) => ({
        userId,
        username: userMap[userId] || "Unknown",
        balance,
      })
    );

    //  Format settlements
    const settlementsWithNames = settlements.map((s) => ({
      from: { userId: s.from, username: userMap[s.from] || "Unknown" },
      to: { userId: s.to, username: userMap[s.to] || "Unknown" },
      amount: s.amount,
    }));

    return res.status(200).json({
      success: true,
      grpId,
      balances: balancesWithNames,
      settlements: settlementsWithNames,
    });
  } catch (err) {
    console.error("Settlement calculation error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
// Utility function (defined inside controller file)

function calculatePairwiseSettlements(expenses) {
  const debts = {};
  const userIdsSet = new Set();

  // Collect all users
  expenses.forEach((exp) => {
    userIdsSet.add(exp.paidBy.toString());
    exp.participants.forEach((p) => userIdsSet.add(p.userId.toString()));
  });

  // Initialize debts[from][to] = 0
  userIdsSet.forEach((userId) => {
    debts[userId] = {};
    userIdsSet.forEach((otherId) => {
      if (userId !== otherId) debts[userId][otherId] = 0;
    });
  });

  // Populate debts
  for (const exp of expenses) {
    const payerId = exp.paidBy.toString();
    for (const part of exp.participants) {
      const partId = part.userId.toString();
      const unsettledAmount = (part.share || 0) - (part.settledAmount || 0);

      if (unsettledAmount > 0 && partId !== payerId) {
        debts[partId][payerId] += unsettledAmount;
      }
    }
  }

  // Compute net balances
  const balances = {};
  userIdsSet.forEach((userId) => {
    let balance = 0;
    userIdsSet.forEach((otherId) => {
      balance += debts[otherId][userId] || 0; // owed to this user
      balance -= debts[userId][otherId] || 0; // user owes others
    });
    balances[userId] = balance;
  });

  // Convert debts to settlements array
  const settlements = [];
  Object.entries(debts).forEach(([from, owes]) => {
    Object.entries(owes).forEach(([to, amount]) => {
      if (amount > 0) {
        settlements.push({ from, to, amount });
      }
    });
  });

  return { balances, settlements };
}

// Function to net out settlements between pairs
function netSettlements(settlements) {
  const netMap = {};

  settlements.forEach((s) => {
    const key = [s.from, s.to].sort().join("_"); // unordered pair
    if (!netMap[key]) netMap[key] = 0;

    // Determine direction
    if (s.from < s.to) netMap[key] += s.amount;
    else netMap[key] -= s.amount;
  });

  const result = [];
  Object.entries(netMap).forEach(([key, amount]) => {
    const [userA, userB] = key.split("_");
    if (amount > 0) {
      result.push({ from: userA, to: userB, amount });
    } else if (amount < 0) {
      result.push({ from: userB, to: userA, amount: -amount });
    }
  });

  return result;
}

// Controller to get settlement for all groups of a user

export const getUserGroupSettlements = async (req, res) => {
  try {
    const { userId } = req.params;

    //  Find groups where the user is a member
    const groups = await Group.find({ "members.userId": userId });

    if (!groups.length) {
      return res
        .status(404)
        .json({ success: false, message: "No groups found for this user" });
    }

    const results = [];

    for (const group of groups) {
      //  Fetch group expenses
      const expenses = await Expense.find({ grpId: group._id }).lean();

      if (!expenses.length) {
        results.push({
          groupId: group._id,
          groupName: group.grpName,
          balances: [],
          settlements: [],
        });
        continue;
      }

      //  Calculate pairwise settlements
      let { balances, settlements } = calculatePairwiseSettlements(expenses);

      //  Net out settlements
      settlements = netSettlements(settlements);

      // Fetch usernames
      const userIds = Object.keys(balances).map(
        (id) => new mongoose.Types.ObjectId(id)
      );
      const users = await User.find({ _id: { $in: userIds } }).select(
        "_id username"
      );

      const userMap = {};
      users.forEach((u) => {
        userMap[u._id.toString()] = u.username;
      });

      // Format balances
      const balancesWithNames = Object.entries(balances).map(([uId, bal]) => ({
        userId: uId,
        username: userMap[uId] || "Unknown",
        balance: bal,
      }));

      // Format settlements
      const settlementsWithNames = settlements.map((s) => ({
        from: { userId: s.from, username: userMap[s.from] || "Unknown" },
        to: { userId: s.to, username: userMap[s.to] || "Unknown" },
        amount: s.amount,
      }));

      results.push({
        groupId: group._id,
        groupName: group.grpName,
        balances: balancesWithNames,
        settlements: settlementsWithNames,
      });
    }

    return res.status(200).json({
      success: true,
      userId,
      groups: results,
    });
  } catch (err) {
    console.error("Error in getUserGroupSettlements:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

//settlement controller

export const settleParticipant = async (req, res) => {
  try {
    const { grpId, participantId } = req.params;
    const transactions = req.body.transactions; // [{ expenseId, settled, settledAmount, type: 'credit' | 'debit' }]
    const userId = req.user.userId;

    if (!grpId || !participantId || !transactions || !transactions.length) {
      return res.status(400).json({
        message:
          "grpId, participantId, and transactions array are required in the body",
      });
    }

    const updates = await Promise.all(
      transactions.map(async (tx) => {
        // Determine which userId to update in the DB
        const targetParticipantId =
          tx.type === "debit" ? userId : participantId; // swap if debit

        const result = await Expense.updateOne(
          {
            _id: new mongoose.Types.ObjectId(tx.expenseId),
            grpId: new mongoose.Types.ObjectId(grpId),
            "participants.userId": new mongoose.Types.ObjectId(
              targetParticipantId
            ),
          },
          [
            {
              $set: {
                participants: {
                  $map: {
                    input: "$participants",
                    as: "p",
                    in: {
                      $mergeObjects: [
                        "$$p",
                        {
                          settledAmount: {
                            $cond: [
                              {
                                $eq: [
                                  "$$p.userId",
                                  new mongoose.Types.ObjectId(
                                    targetParticipantId
                                  ),
                                ],
                              },
                              { $add: ["$$p.settledAmount", tx.settledAmount] }, // accumulate
                              "$$p.settledAmount",
                            ],
                          },
                          settled: {
                            $cond: [
                              {
                                $eq: [
                                  "$$p.userId",
                                  new mongoose.Types.ObjectId(
                                    targetParticipantId
                                  ),
                                ],
                              },
                              tx.settled,
                              "$$p.settled",
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          ]
        );

        return {
          expenseId: tx.expenseId,
          matched: result.matchedCount,
          modified: result.modifiedCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Transactions updated successfully",
      updates,
    });
  } catch (err) {
    console.error("Settlement error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getExpensesForSettlement = async (req, res) => {
  try {
    const { grpId, participantId } = req.params;
    const userId = req.user.userId;

    // Fetch all expenses where both users are participants
    const expenses = await Expense.find({
      grpId: new mongoose.Types.ObjectId(grpId),
      split: true,
      participants: {
        $all: [
          { $elemMatch: { userId: new mongoose.Types.ObjectId(userId) } },
          {
            $elemMatch: { userId: new mongoose.Types.ObjectId(participantId) },
          },
        ],
      },
    }).lean();

    const credits = [];
    const debits = [];

    for (const exp of expenses) {
      const payerId = exp.paidBy.toString();

      // Find shares for both users
      const userPart = exp.participants.find(
        (p) => p.userId.toString() === userId
      );
      const participantPart = exp.participants.find(
        (p) => p.userId.toString() === participantId
      );

      // Unsettled amounts
      const userUnsettled =
        (userPart.share || 0) - (userPart.settledAmount || 0);
      const participantUnsettled =
        (participantPart.share || 0) - (participantPart.settledAmount || 0);

      // Credit: current user paid, participant owes
      if (payerId === userId && participantUnsettled > 0) {
        credits.push({
          expenseId: exp._id,
          amount: participantUnsettled,
          paidBy: userId,
          owedBy: participantId,
        });
      }

      // Debit: participant paid, current user owes
      if (payerId === participantId && userUnsettled > 0) {
        debits.push({
          expenseId: exp._id,
          amount: userUnsettled,
          paidBy: participantId,
          owedBy: userId,
        });
      }
    }

    res.status(200).json({
      success: true,
      grpId,
      userId,
      participantId,
      credits,
      debits,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: err.message,
    });
  }
};

//generate cash inflow and outer flow

export const getUserCashFlow = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const expenses = await Expense.find({
      split: true,
      "participants.userId": new mongoose.Types.ObjectId(userId),
    });

    let inflow = 0;
    let outflow = 0;

    expenses.forEach((expense) => {
      const participant = expense.participants.find(
        (p) => p.userId.toString() === userId
      );

      if (!participant) return;

      if (expense.paidBy && expense.paidBy.toString() === userId) {
        // Others owe this user
        expense.participants.forEach((p) => {
          if (p.userId.toString() !== userId) {
            const pending = p.share - (p.settledAmount || 0);
            if (pending > 0) inflow += pending;
          }
        });
      } else {
        // User owes someone else
        const pending = participant.share - (participant.settledAmount || 0);
        if (pending > 0) outflow += pending;
      }
    });

    return res.status(200).json({
      userId,
      inflow,
      outflow,
      net: inflow - outflow,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

//get settlement of each grp(for chart)


export const getGroupSettlementForChart = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const { grpId } = req.params;

    if (!grpId) {
      return res.status(400).json({ message: "grpId is required" });
    }

    // Fetch the group and ensure user is a member
    const group = await Group.findOne({
      _id: new mongoose.Types.ObjectId(grpId),
      "members.userId": userId,
    }).lean();

    if (!group) {
      return res
        .status(404)
        .json({ message: "Group not found or user not a member" });
    }

    // Fetch all split expenses in the group where user is a participant
    const expenses = await Expense.find({
      grpId: group._id,
      split: true,
      participants: { $elemMatch: { userId } },
    }).lean();

    // Build settlement for this group
    const groupSettle = {
      groupId: group._id,
      groupName: group.grpName,
      give: [],
      get: [],
    };

    for (const exp of expenses) {
      for (const p of exp.participants) {
        if (p.userId.toString() === userId.toString()) continue;

        const participantName =
          group.members.find((m) => m.userId.toString() === p.userId.toString())
            ?.username || "Unknown";

        // Case 1: logged-in user paid, check if participant owes them
        const participantUnsettled = (p.share || 0) - (p.settledAmount || 0);
        if (exp.paidBy.toString() === userId.toString() && participantUnsettled > 0) {
          groupSettle.get.push({
            userId: p.userId,
            username: participantName,
            amount: participantUnsettled,
          });
        }

        // Case 2: participant paid, check if user owes them
        if (exp.paidBy.toString() === p.userId.toString()) {
          const self = exp.participants.find(
            (x) => x.userId.toString() === userId.toString()
          );
          const selfUnsettled = (self?.share || 0) - (self?.settledAmount || 0);

          if (selfUnsettled > 0) {
            groupSettle.give.push({
              userId: p.userId,
              username: participantName,
              amount: selfUnsettled,
            });
          }
        }
      }
    }

    // Aggregate amounts per participant
    const aggregateAmounts = (arr) =>
      Object.values(
        arr.reduce((acc, item) => {
          if (!acc[item.userId]) acc[item.userId] = { ...item };
          else acc[item.userId].amount += item.amount;
          return acc;
        }, {})
      );

    const result = {
      groupId: groupSettle.groupId,
      groupName: groupSettle.groupName,
      give: aggregateAmounts(groupSettle.give),
      get: aggregateAmounts(groupSettle.get),
    };

    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to fetch group settlement:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// expenses paid by a user in every grp(done)

export const getUserGroupExpenseSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    // Fetch groups where the user is a member
    const userGroups = await Group.find({ "members.userId": userId }).lean();
    if (!userGroups.length) return res.status(200).json([]);

    const groupIds = userGroups.map((g) => g._id);

    // Aggregate expenses per group
    const expensesSummary = await Expense.aggregate([
      {
        $match: {
          grpId: { $in: groupIds },
          split: true,
        },
      },
      {
        $group: {
          _id: "$grpId",
          totalExpense: { $sum: "$amount" },
          userPaid: {
            $sum: {
              $cond: [{ $eq: ["$paidBy", userId] }, "$amount", 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "groups",
          localField: "_id",
          foreignField: "_id",
          as: "groupDetails",
        },
      },
      { $unwind: "$groupDetails" },
      {
        $project: {
          _id: 0,
          groupId: "$groupDetails._id",
          groupName: "$groupDetails.grpName",
          totalExpense: 1,
          userPaid: 1,
        },
      },
      { $sort: { totalExpense: -1 } },
    ]);

    res.status(200).json(expensesSummary);
  } catch (err) {
    console.error("Failed to fetch group expense summary:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//get month wise expenses(done)

export const getMonthlyExpenses = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const monthlyExpenses = await Expense.aggregate([
      {
        $match: {
          $or: [
            { split: true, participants: { $elemMatch: { userId } } },
            { split: { $ne: true }, userId: userId },
          ],
        },
      },
      {
        $addFields: {
          userAmount: {
            $cond: [
              { $eq: ["$split", true] },
              {
                $getField: {
                  field: "share",
                  input: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$participants",
                          as: "p",
                          cond: { $eq: ["$$p.userId", userId] },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
              "$amount",
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$date",
              timezone: "UTC", // adjust to match your stored date
            },
          },
          total: { $sum: "$userAmount" },
        },
      },
      {
        $match: { total: { $gt: 0 } }, // only months with expenses
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          total: 1,
        },
      },
      { $sort: { month: 1 } }, 
    ]);

    res.status(200).json(monthlyExpenses);
  } catch (err) {
    console.error("Failed to fetch monthly expenses:", err);
    res.status(500).json({ message: "Server error" });
  }
};
