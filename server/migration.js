// import mongoose from "mongoose";
// import Expense from "./models/expenses.js" 


// const MONGO_URI = "mongodb://127.0.0.1:27017/ExpenseTracker";

//fn to add ...
// const migrateSplitExpenses = async () => {
//   try {
//     await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//     console.log(" Connected to MongoDB");

//     // Only update expenses where split = true and participants are missing settledAmount
//     const result = await Expense.updateMany(
//       { split: true, "participants.settledAmount": { $exists: false } },
//       { $set: { "participants.$[].settledAmount": 0, "participants.$[].settled": false } }
//     );

//     console.log(`🎉 Migration complete. Modified ${result.modifiedCount} split-expense documents.`);
//     await mongoose.disconnect();
//   } catch (err) {
//     console.error(" Migration failed:", err);
//     process.exit(1);
//   }
// };

// migrateSplitExpenses();

//delete expense when grp is deleted fn
// const deleteInvalidGrpExpenses = async () => {
//   try {
//     await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//     console.log(" Connected to MongoDB");

//     const validGrpIds = [
//       new mongoose.Types.ObjectId("68b52ab556794ec0d54cbbae"),
//       new mongoose.Types.ObjectId("68b52b7156794ec0d54cbbd9"),
//       new mongoose.Types.ObjectId("68b52c2756794ec0d54cbc55")
//     ];

//     const result = await Expense.deleteMany({
//       grpId: { $exists: true, $nin: validGrpIds }
//     });

//     console.log(` Deleted ${result.deletedCount} expense documents with invalid grpId.`);

//     await mongoose.disconnect();
//   } catch (err) {
//     console.error(" Migration failed:", err);
//     process.exit(1);
//   }
// };

deleteInvalidGrpExpenses();