import express from "express";
import { verifyAccessToken } from "../middleware/authMiddleware.js";
import { createUser, getUsers } from "../controllers/userControllers.js";
import { createGroup, deleteGroup, editGroup, getGroupsByUser } from "../controllers/groupControllers.js";
import { calculateSettlementByGrp, createSplitwiseExpense, getGroupSettlementForChart, getUserCashFlow, getUserGroupExpenseSummary, getUserGroupSettlements, settleParticipant } from "../controllers/expenseController.js";

const router = express.Router();

router.post("/create-user",verifyAccessToken,createUser);
router.post("/create-group",verifyAccessToken,createGroup);
router.delete("/delete-group/:id",verifyAccessToken,deleteGroup);
router.put("/edit-group",verifyAccessToken,editGroup);
router.get("/get-users",verifyAccessToken,getUsers);
router.get("/get-user-groups",verifyAccessToken,getGroupsByUser);
router.post("/add-expense",verifyAccessToken,createSplitwiseExpense);
router.get("/settlement/:grpId",verifyAccessToken,calculateSettlementByGrp);
router.get("/settlements/:userId",verifyAccessToken,getUserGroupSettlements);
router.post("/settlements/:grpId/:participantId",verifyAccessToken,settleParticipant);
router.get("/cashflow",verifyAccessToken,getUserCashFlow);
router.get("/get-user-group-expense-summary",verifyAccessToken,getUserGroupExpenseSummary);
router.get("/get-share/:grpId",verifyAccessToken,getGroupSettlementForChart)

export default router;