import { OrderStatus } from "@sturez-org/common";
import mongoose from "mongoose";
import { Order } from "./order";

// we're not using the ticket model defined in the ticket service, 
// because this data-model can be different than the one created there

interface TicketAttr {
    title: string;
    price: number;

};

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
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

ticketSchema.statics.build = (attrs: TicketAttr) => {
    return new Ticket(attrs);
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