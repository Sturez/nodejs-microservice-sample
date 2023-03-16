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
    /**
     * @description finds a ticket by Id and version
     * @param {string} id id of the ticket you're looking for
     * @param {number} version version number coming from the TicketUpdatedEvent
     */
    findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>;
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

ticketSchema.statics.findByEvent = async (event: { id: string, version: number }) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1
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