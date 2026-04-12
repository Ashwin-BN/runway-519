import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import Item from "../models/Item.js";
import { verifyUser } from "../middleware/auth.js";
import { isManagementOrAdmin } from "../middleware/admin.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", verifyUser, upload.array("images", 2), async (req, res) => {
  try {
    const { brand, price, department, category, styleNumber } = req.body;

    if (!brand || !price || !department || !category || !styleNumber) {
      return res.status(400).json({ error: "All item fields are required." });
    }

    let imageUrl = "";
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((file) => cloudinary.uploader.upload(file.path))
      );
      imageUrls = uploads.map((result) => result.secure_url);
      imageUrl = imageUrls[0] || "";
    }

    const item = await Item.create({
      brand,
      price: Number(price),
      department,
      category,
      styleNumber,
      imageUrl,
      imageUrls,
    });

    res.json(item);
  } catch (err) {
    console.error("Item creation error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", verifyUser, async (req, res) => {
  try {
    const { department, priceMin, priceMax, markdown, limit, brand, styleNumber } = req.query;

    console.log("Search query received:", req.query);

    let query = {};

    if (department) query.department = department;
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
      console.log("Brand filter applied:", query.brand);
    }
    if (styleNumber) query.styleNumber = { $regex: styleNumber, $options: 'i' };

    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    if (markdown === "true") {
      query.markdownPrice = { $ne: null };
    }

    if (req.user.role !== "admin") {
      query.status = "available";
    }

    console.log("Final MongoDB query:", query);

    let itemQuery = Item.find(query).sort({ createdAt: -1 });
    if (limit) itemQuery = itemQuery.limit(Number(limit));

    const items = await itemQuery;
    console.log(`Found ${items.length} items`);

    res.json(items);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id/sold", verifyUser, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status: "sold" },
      { new: true }
    );

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id/markdown", verifyUser, isManagementOrAdmin, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { markdownPrice: req.body.price },
      { new: true }
    );

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;