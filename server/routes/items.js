import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import Item from "../models/Item.js";
import { verifyUser } from "../middleware/auth.js";
import { isManagementOrAdmin } from "../middleware/admin.js";

const router = express.Router();
const upload = multer({ 
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});

// Validation helper
const validateItemFields = (brand, price, department, category, styleNumber, count) => {
  if (!brand || !price || !department || !category || !styleNumber) {
    return "All item fields are required (brand, price, department, category, styleNumber).";
  }
  if (isNaN(price) || Number(price) <= 0) {
    return "Price must be a positive number.";
  }
  if (count !== undefined && count !== null && count !== "" && (!Number.isInteger(Number(count)) || Number(count) < 1)) {
    return "Count must be a positive integer.";
  }
  if (department.length !== 2) {
    return "Department must be 2 digits.";
  }
  if (category.length !== 4) {
    return "Category must be 4 digits.";
  }
  if (styleNumber.length !== 6) {
    return "Style number must be 6 digits.";
  }
  return null;
};

// Create item
router.post("/", verifyUser, upload.array("images", 2), async (req, res) => {
  try {
    const { brand, price, department, category, styleNumber, count } = req.body;

    const validationError = validateItemFields(brand, price, department, category, styleNumber, count);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    let imageUrl = "";
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      try {
        const uploads = await Promise.all(
          req.files.map((file) => cloudinary.uploader.upload(file.path))
        );
        imageUrls = uploads.map((result) => result.secure_url);
        imageUrl = imageUrls[0] || "";
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr);
        return res.status(500).json({ error: "Image upload failed" });
      }
    }

    const item = await Item.create({
      brand: brand.trim(),
      price: Number(price),
      count: count ? Number(count) : 1,
      department,
      category,
      styleNumber,
      imageUrl,
      imageUrls,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("Item creation error:", err);
    res.status(500).json({ error: "Failed to create item" });
  }
});

// Get items with filters
router.get("/", verifyUser, async (req, res) => {
  try {
    const { department, category, priceMin, priceMax, markdown, limit, brand, styleNumber } = req.query;

    let query = {};

    // Build query filters
    if (department) query.department = department;
    if (category) query.category = { $regex: category, $options: 'i' };
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (styleNumber) query.styleNumber = { $regex: styleNumber, $options: 'i' };

    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin && !isNaN(priceMin)) query.price.$gte = Number(priceMin);
      if (priceMax && !isNaN(priceMax)) query.price.$lte = Number(priceMax);
    }

    if (markdown === "true") {
      query.markdownPrice = { $ne: null };
    }

    // Non-admin users can only see available items
    if (req.user.role !== "admin") {
      query.status = "available";
    }

    const maxLimit = 1000;
    const pageLimit = limit ? Math.min(Number(limit), maxLimit) : maxLimit;

    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .limit(pageLimit);

    res.json(items);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// Mark item as sold
router.put("/:id/sold", verifyUser, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid item ID" });
    }

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status: "sold" },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    console.error("Mark sold error:", err);
    res.status(500).json({ error: "Failed to update item" });
  }
});

// Set markdown price (admin/management only)
router.put("/:id/markdown", verifyUser, isManagementOrAdmin, async (req, res) => {
  try {
    const { price } = req.body;

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid item ID" });
    }

    if (price === undefined || isNaN(price) || Number(price) < 0) {
      return res.status(400).json({ error: "Markdown price must be a positive number" });
    }

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { markdownPrice: Number(price) },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    console.error("Markdown error:", err);
    res.status(500).json({ error: "Failed to update markdown price" });
  }
});

export default router;