const mongoose = require("mongoose");
var Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId,
  Mixed = Schema.Types.Mixed;

const coffeeSchema = new mongoose.Schema(
  {
    sku_code: String, // the sku code
    product_type: String, // coffee/ espresso machine or pods
    water_line_compatible: Boolean, // compatiblity with water_line
    coffee_flavor: String, // 
    pack_size: Number,
    model: String
  },
  { timestamps: false }
);

const Coffee = mongoose.model("Coffee", coffeeSchema);

module.exports = Coffee;
