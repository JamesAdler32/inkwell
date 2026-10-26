import { Router } from "express";
import { PostService } from "../services/post.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/posts", requireAuth, async (req, res, next) => {
    try {
        // Never trust client-supplied identity fields — derive
        // authorId from the authenticated request, not the request body.
        const post = await PostService.publish({
            ...req.body,
            authorId: req.user.id, // set by requireAuth middleware from the verified JWT
        });
        res.status(201).json(post);
    } catch (err) {
        next(err);
    }
});

router.get("/posts", async (req, res, next) => {
    try {
        const { page = "1", search, pageSize = "10" } = req.query;

        const parsedPageSize = Number.parseInt(String(pageSize), 10);
        const safePageSize = Number.isFinite(parsedPageSize)
            ? Math.max(1, Math.min(25, parsedPageSize))
            : 10;

        const result = search
            ? await PostService.search({ query: search, page: Number(page), pageSize: safePageSize })
            : await PostService.listPublished({ page: Number(page), pageSize: safePageSize });
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

export default router;