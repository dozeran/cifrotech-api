const WarehouseModel = require('../models/schemas/warehouse');

//Working but very slowly

async function updateWarehouses(req, res) {
    try {
        const input = req.body;

        const updates = [];

        for (const inputItem of input) {
            updates.push(async () => {
                const warehouseItems = await WarehouseModel.find({
                    Warehouse: inputItem.Warehouse,
                });

                if (warehouseItems.length === 0) {
                    await WarehouseModel.create(inputItem);
                    return;
                }

                const existGoods = warehouseItems[0].Goods;

                const inputGoods = inputItem.Goods
                    .map(i => (
                        {
                            ...i, SKU: Number(i.SKU),
                        }
                    ));
                const inputGoodsSkus = inputGoods.map(i => i.SKU);

                const goodsToUpsert = existGoods.filter(i => !inputGoodsSkus.includes(i.SKU));

                for (const good of inputGoods) {
                    goodsToUpsert.push(good);
                }

                await WarehouseModel.updateOne(
                    { Warehouse: inputItem.Warehouse },
                    {
                        $set: {
                            Goods: goodsToUpsert,
                        },
                    },
                );

            });
        }

        await Promise.all(updates.map(f => f()));

        res.status(200).json({ message: 'Дані успішно оновлено' });
    } catch (error) {
        console.error('Помилка при оновленні даних:', error);
        res.status(500).json({ error: 'Помилка при оновленні даних' });
    }
}


module.exports = updateWarehouses;
