const WarehouseModel = require("../models/schemas/warehouse");

//Working but very slowly

async function updateWarehouses(req, res) {
  try {
    const newWarehousesData = req.body;

    const allWarehouses = await WarehouseModel.find({});

    for (const newWarehouseData of newWarehousesData) {
      const existingWarehouse = allWarehouses.find(warehouse => warehouse.Warehouse === newWarehouseData.Warehouse);

      if (existingWarehouse) {
        for (const newGood of newWarehouseData.Goods) {
          const existingGood = existingWarehouse.Goods.find(good => good.SKU === newGood.SKU);
        
          if (existingGood) {
            for (const salesAndRemains of newGood.SalesAndRemains) {
              await WarehouseModel.findOneAndUpdate(
                { "Warehouse": newWarehouseData.Warehouse, "Goods.SKU": newGood.SKU },
                { $push: { "Goods.$.SalesAndRemains": salesAndRemains } }
              );
            }
          } else {
            const existingGoodInDB = await WarehouseModel.findOne({ "Goods.SKU": newGood.SKU });
            if (!existingGoodInDB) {
              existingWarehouse.Goods.push(newGood);
              await existingWarehouse.save();
            } else {
              for (const salesAndRemains of newGood.SalesAndRemains) {
                await WarehouseModel.findOneAndUpdate(
                  { "Warehouse": newWarehouseData.Warehouse, "Goods.SKU": newGood.SKU },
                  { $push: { "Goods.$.SalesAndRemains": salesAndRemains } }
                );
              }
            }
          }
        }
        

        await existingWarehouse.save();
      } else {
        await WarehouseModel.create(newWarehouseData);
      }
    }

    res.status(200).json({ message: "Дані успішно оновлено" });
  } catch (error) {
    console.error("Помилка при оновленні даних:", error);
    res.status(500).json({ error: "Помилка при оновленні даних" });
  }
}


module.exports = updateWarehouses;
