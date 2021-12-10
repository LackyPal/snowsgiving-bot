const { model, Schema, models } = require("mongoose");

const snowSchema = new Schema({
  guild_id: { type: String, required: true },
  user_id: { type: String, required: true },
  available: { type: Number, default: 0 },
  hits: { type: Number, default: 0 },
  misses: { type: Number, default: 0 },
  kos: { type: Number, default: 0 }
});

module.exports = models.Snow || model("Snow", snowSchema);