const express = require("express");
const {
    registerUser,
    loginUser,
    getDashboard,
    getProgress,
    saveProgress,
    getImcCategories,
    getDietAndObstacles,
    getObjectivesAndSuccess,
    getQuickHistory,
    getUserData,
    getLastProgressDate
  } = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/dashboard", authenticate, getDashboard);
router.get("/progress", authenticate, getProgress);
router.post("/progress", authenticate, saveProgress);
router.get("/imc-categories", authenticate, getImcCategories);
router.get("/diet-obstacles", authenticate, getDietAndObstacles); // Nova Rota
router.get("/objectives-success", authenticate, getObjectivesAndSuccess); 
router.get("/quick-history", authenticate, getQuickHistory);
router.get("/user", authenticate, getUserData);
router.get("/last-progress-date", authenticate, getLastProgressDate);


module.exports = router;
