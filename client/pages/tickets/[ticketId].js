import useRequest from "../../hooks/use-request";

const TicketDetail = ({ ticket }) => {
    const { doRequest, errors } = useRequest(
        {
            url: '/api/orders',
            method: 'post',
            data: { ticketId: ticket.id },
            onSuccess: (order) => { console.log(order); }
        }
    );

    return (<div>
        <h1>{ticket.title}</h1>
        <h4>{ticket.price}</h4>
        <button className="btn btn-primary"
            onClick={doRequest}
        >Purchase</button>
    </div>);
}

TicketDetail.getInitialProps = async (context, client) => {
    const { ticketId } = context.query;
    const { data } = await client.get(`/api/tickets/${ticketId}`);

    return ({ ticket: data });
};

export default TicketDetail;