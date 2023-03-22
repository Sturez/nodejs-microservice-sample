import React from "react";
import { ReactPropTypes } from "react";
import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from "../../hooks/use-request";
import Router from 'next/router'

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [mstimeLeft, setMsTimeLeft] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        data: {
            orderId: order.id
        },
        onSuccess: () => {
            Router.push('/orders');
        }
    })

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            var minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((msLeft % (1000 * 60)) / 1000);
            setTimeLeft(`${minutes}:${seconds}`);
            setMsTimeLeft(msLeft / 1000);
        }

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);
        return () => {
            clearInterval(timerId);
        }
    }, [order]);

    return (<div>
        <h1>{order.ticket.title}</h1>
        {mstimeLeft > 0 ?
            (<div>
                <span>{timeLeft} seconds until order expires</span>
                <StripeCheckout
                    token={({ id }) => { doRequest({ token: id }); }}
                    amount={order.ticket.price * 100}
                    email={currentUser.email}
                    // should move this key as conf. variable
                    stripeKey={'pk_test_51MoNLsGabg23HxPFoGubJjcOEC56DP9waxX1napABAxRUkkVvzrBYxi7OiwQGkadcB99A5djAAhBBB2HOMbglCFi00U92KduYR'}

                />
            </div>) :
            <div>Sorry, your order has expired</div>
        }
        {errors}
    </div>);
};

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
}

export default OrderShow;