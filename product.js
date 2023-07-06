const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counterSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1 },
});

const Counter = mongoose.model('counter', counterSchema);

const productSchema = new Schema(
    {
        _id: { type: Number },
        pbrand: { type: String, required: true},//marca
        pname: { type: String, required: true },
        pcode: { type: String, required: true},//codigo
        pprice: { type: String, required: true },
        pdesc: { type: String, required: true },
        pimage_default: { type: String, required: true },
        pimage_front: { type: String, required: true },
        deleted: { type: Boolean, default: false },
    },
    { collection: 'market_lym' }
);

productSchema.pre('save', async function (next) {
    const doc = this;
    if (!doc._id) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { _id: 'productId' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
            doc._id = counter.seq;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Restringir las consultas para excluir los productos eliminados
productSchema.pre(/^find/, function (next) {
    // Incluye esta línea para mostrar todos los productos, incluyendo los eliminados
    this.find();

    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
