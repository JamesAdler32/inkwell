// This file's resulting content wasn't actually shown above — only
// described in prose ("index.js now only handles process startup"). It
// now only imports app.js and starts the listener.

import "dotenv/config";
import { app } from "./app.js";
const PORT = process.env.PORT || 4000;

app.get("/api/version", (req, res) => {
    res.status(200).json({ version: "0.1.0" });
});

app.listen(PORT, () => {
    console.log(`Inkwell API listening on port ${PORT}`);
});