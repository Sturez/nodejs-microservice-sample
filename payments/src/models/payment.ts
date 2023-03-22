import mongoose from "mongoose";

interface PaymentAttr {
    chargeId: string;
    orderId: string;
};

interface PaymentDoc extends mongoose.Document {
    chargeId: string;
    orderId: string;
};

interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attr: PaymentAttr): PaymentDoc;
}

const paymentSchema = new mongoose.Schema({
    chargeId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform: (res, doc) => {
            res.id = res._id;
            delete res._id;
        }
    }
});

paymentSchema.statics.build = (attr: PaymentAttr) => {
    return new Payment(attr);
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment };
