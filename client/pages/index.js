const LandingPage = ({ currenUser: currentUser }) => {
  return (
    currentUser ?
      <h1>Welcome {currentUser.email}</h1>
      :
      <h1>You are not signed in Sign Up!</h1>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default LandingPage;
