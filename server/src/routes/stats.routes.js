import { Router } from "express";
import { postCount } from "../events/listeners/count-published-posts";

const router = Router();

router.get("/api/stats", (req, res) => {
    res.status(200).json({ postCount: postCount });
});

export default router;