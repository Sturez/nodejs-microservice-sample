import mongoose from "mongoose";

// we're not using the ticket model defined in the ticket service, 
// because this data-model can be different than the one created there

interface TicketAttr {
    title: string;
    price: number;

};

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;

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
        transform: (doc, ref) => {
            ref.id = ref._id;
            delete ref._id;
        }
    }
});

ticketSchema.statics.build = (attrs: TicketAttr) => {
    return new Ticket(attrs);
};


const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);