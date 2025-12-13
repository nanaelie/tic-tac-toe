import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    const data = ``;
    return res.render("infos", { data });
})

export default router;
