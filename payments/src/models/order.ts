import { OrderStatus } from "@sturez-org/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttr {
    id: string;
    status: OrderStatus;
    version: number;
    userId: string;
    price: number;
}

interface OrderDoc extends mongoose.Document {
    status: OrderStatus;
    version: number;
    userId: string;
    price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(order: OrderAttr): void;
}


const orderSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true

    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.set('versionKey','version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttr) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        price: attrs.price,
        userId: attrs.userId,
        status: attrs.status
    })
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };