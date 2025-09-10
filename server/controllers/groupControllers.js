import mongoose from "mongoose";
import Group from "../models/groups.js";
import User from "../models/users.js";


//create group

export const createGroup = async (req, res) => {
  try {
    const { grpName, desc, members } = req.body;
    const createdBy = req.user?.userId;

    if (!createdBy) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!grpName) {
      return res.status(400).json({ error: "Group name is required" });
    }

    const existingGrp = await Group.findOne({ grpName });
    if (existingGrp) {
      return res.status(409).json({ message: "Group name already exists" });
    }

    // Lookup usernames for each userId
    const formattedMembers = await Promise.all(
      (members || []).map(async (m) => {
        const user = await User.findById(m.userId).select("username");
        if (!user) {
          throw new Error(`User not found: ${m.userId}`);
        }
        return {
          userId: new mongoose.Types.ObjectId(m.userId),
          username: user.username,
          joinedAt: m.joinedAt || Date.now(),
        };
      })
    );

    const newGroup = new Group({
      grpName,
      desc,
      createdBy: new mongoose.Types.ObjectId(createdBy),
      members: formattedMembers,
    });

    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create group", message: err.message });
  }
};


//delete grp 

export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedGroup = await Group.findByIdAndDelete(id);

    if (!deletedGroup) return res.status(404).json({ error: "Group not found" });

    res.json({ message: "Group deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete group" });
  }
};

//get grps of the user

export const getGroupsByUser = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const groups = await Group.find({
      "members.userId": userId,
    }).sort({ createdAt: -1 });

    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

//edit - grp

export const editGroup = async (req, res) => {
  try {
    const { groupId, grpName, desc, members } = req.body;
    const updatedBy = req.user?.userId;

    if (!updatedBy) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!groupId) {
      return res.status(400).json({ message: "Group ID is required" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Optional: check if new grpName already exists (and is not the current group)
    if (grpName && grpName !== group.grpName) {
      const existingGrp = await Group.findOne({ grpName });
      if (existingGrp) {
        return res.status(409).json({ message: "Group name already exists" });
      }
      group.grpName = grpName;
    }

    if (desc !== undefined) group.desc = desc;

    if (members && Array.isArray(members)) {
      const formattedMembers = await Promise.all(
        members.map(async (m) => {
          const user = await User.findById(m.userId).select("username");
          if (!user) {
            throw new Error(`User not found: ${m.userId}`);
          }
          return {
            userId: new mongoose.Types.ObjectId(m.userId),
            username: user.username,
            joinedAt: m.joinedAt || Date.now(),
          };
        })
      );
      group.members = formattedMembers;
    }

    group.updatedAt = Date.now();

    await group.save();

    res.status(200).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to edit group", message: err.message });
  }
};


