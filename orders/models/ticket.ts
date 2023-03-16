import { OrderStatus } from "@sturez-org/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order } from "./order";

// we're not using the ticket model defined in the ticket service,
// because this data-model can be different than the one created there

interface TicketAttr {
    id: string;
    title: string;
    price: number;
    version: number;
};

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttr): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }

}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttr) => {
    return new Ticket({
        _id: attrs.id,
        ...attrs
        // title: attrs.title,
        // price: attrs.price
    });
};


ticketSchema.methods.isReserved = async function () {
    // we're using dunction because we need the this context
    // look for orders for the previously found ticket with status different than cancelled
    const prevReservation = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Completed
            ]
        }
    });

    return !!prevReservation;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };