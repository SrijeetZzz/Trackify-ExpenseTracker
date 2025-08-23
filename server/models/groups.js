import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    grpName: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    desc: {
      type: String,
    },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        joinedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("groups", groupSchema);
