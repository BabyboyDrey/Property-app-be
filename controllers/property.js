const { default: mongoose } = require("mongoose");
const asyncErrCatcher = require("../middlewares/asyncErrCatcher");
const property = require("../models/property");

const router = require("express").Router();

router.post(
  "/insert-properties",
  asyncErrCatcher(async (req, res, next) => {
    try {
      const { properties } = req.body;
      console.log("properties:", properties);
      if (!Array.isArray(properties) || properties.length === 0) {
        return res.status(400).json({
          message: "Please provide data to insert!",
        });
      }

      const newProperties = await property.insertMany(properties);

      console.log("newProperties:", newProperties);
      return res.json({
        newProperties,
      });
    } catch (err) {
      console.error(err);
      next(err.message);
    }
  })
);

// router.get(
//   "/properties",
//   asyncErrCatcher(async (req, res, next) => {
//     try {
//       const allProperties = await property.find({});
//       if (allProperties.length === 0) {
//         return res.status(400).json({
//           message: "No data to return!",
//         });
//       }
//       res.json({
//         allProperties,
//       });
//     } catch (err) {
//       console.error(err);
//       next(err.message);
//     }
//   })
// );

router.get(
  "/properties",
  asyncErrCatcher(async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;

      const allProperties = await property.find({}).skip(skip).limit(limit);

      if (allProperties.length === 0) {
        return res.status(400).json({
          message: "No data to return!",
        });
      }

      const totalProperties = await property.countDocuments({});

      const totalPages = Math.ceil(totalProperties / limit);

      res.json({
        allProperties,
        currentPage: page,
        totalPages,
        totalProperties,
      });
    } catch (err) {
      console.error(err);
      next(err.message);
    }
  })
);

router.get(
  "/properties/:id",
  asyncErrCatcher(async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          message: "Please provide id!",
        });
      }
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          message: "Please provide valid id!",
        });
      }
      const foundProperty = await property.findById(id);
      if (!foundProperty) {
        return res.status(400).json({
          message: "No property found with this id!",
        });
      }
      res.json({
        foundProperty,
      });
    } catch (err) {
      console.error(err);
      next(err.message);
    }
  })
);

module.exports = router;
