const WarehouseModel = require('../models/schemas/warehouse');

async function updateWarehouses(req, res) {
    try {
        const input = req.body;

        const updates = input.map(inputItem => {
            const inputGoods = inputItem.Goods.map(i => ({ ...i, SKU: Number(i.SKU) }));

            return WarehouseModel.findOne({ Warehouse: inputItem.Warehouse }).then(existingWarehouse => {
                if (existingWarehouse) {
                    const existingGoods = existingWarehouse.Goods;
                    const updatedGoods = [...existingGoods];

                    for (const inputGood of inputGoods) {
                        const index = existingGoods.findIndex(good => good.SKU === inputGood.SKU);
                        if (index !== -1) {
                            updatedGoods[index] = inputGood;
                        } else {
                            updatedGoods.push(inputGood);
                        }
                    }

                    return WarehouseModel.updateOne(
                        { Warehouse: inputItem.Warehouse },
                        { $set: { Goods: updatedGoods } }
                    ).exec();
                } else {
                    return WarehouseModel.create({ ...inputItem, Goods: inputGoods });
                }
            });
        });

        await Promise.all(updates);

        res.status(200).json({ message: 'Дані успішно оновлено' });
    } catch (error) {
        console.error('Помилка при оновленні даних:', error);
        res.status(500).json({ error: 'Помилка при оновленні даних' });
    }
}

module.exports = updateWarehouses;
