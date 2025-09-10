import mongoose, { mongo } from "mongoose";

const expense = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    desc: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    paid: {
      type: Boolean,
      required: true,
      default: true,
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Other"],
      required: true,
    },
    //for expense planner
    reccurExpense: {
      type: Boolean,
      default: false,
    },
    occuranceDuration: {
      type: Number,
      default: 0,
    },
    occuranceDate: {
      type: Date,
    },
    //for splitwise
    split: {
      type: Boolean,
    },
    splitType: {
      type: String,
      enum: ["pct", "amnt", "eql"],
    },
    grpId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        share: {
          type: Number,
        },
        settled: {
          type: Boolean,
        },
        settledAmount: {
          type: Number,
        },
      },
    ],
    status: {
      type: String,
      enum: ["settled", "pending"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expense);
