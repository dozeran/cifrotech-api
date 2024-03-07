const WarehouseModel = require("../models/schemas/warehouse");

async function updateWarehouses(req, res) {
  try {
    await WarehouseModel.deleteMany({});

    const newWarehouses = req.body;

    await WarehouseModel.insertMany(newWarehouses);

    res.status(200).json({ message: "Дані успішно оновлено" });
  } catch (error) {
    console.error("Помилка при оновленні даних:", error);
    res.status(500).json({ error: "Помилка при оновленні даних" });
  }
}

module.exports = updateWarehouses;
