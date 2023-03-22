import Link from "next/link";
import { Fragment } from "react";

const LandingPage = ({ currentUser, tickets: tickets }) => {
  if (!currentUser)
    return <h1>You are not signed in Sign Up!</h1>

  const ticketList = tickets.map(ticket => {
    return (
      ticket.orderId ?
        <Fragment key={ticket.id}></Fragment> :
        <tr key={ticket.id}>
          <td>{ticket.title}</td>
          <td>{ticket.price}</td>
          <td>
            <Link href={"/tickets/[ticketId]"} as={`/tickets/${ticket.id}`}>
              Open
            </Link>
          </td>
        </tr >);
  });

  return (
    <div>
      <h1>Welcome {currentUser.email}</h1>

      <div>
        <h1>Tickets</h1>
        <table className="table">
          <thead>
            <tr><th>Title</th>
              <th>Price</th>
              <th>Link</th></tr>
          </thead>
          <tbody>
            {ticketList}
          </tbody>
        </table>
      </div>

    </div>

  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');
  return { tickets: data };
};

export default LandingPage;
