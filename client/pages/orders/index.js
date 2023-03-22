

const OrderIndex = ({ orders }) => {
    console.log(orders);
    return (<div>
        <h1>My Orders</h1>
        <ul>
            {orders.map((order) => {
                return (
                    <li key={order.id}>
                        <span>
                            {order.ticket.title} - {order.status}
                        </span>
                    </li>
                )
            })}
        </ul>
    </div>
    );

};

OrderIndex.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/orders');

    return { orders: data }
};

export default OrderIndex;