# nodejs-microservice-sample
Almost realistic exercise using NodeJS to create a portal where to sell tickets using microservice architecture. All services are made in NodeJS and are using mongoDb to store data, with the exception of the expiration service, which is handling queues of events using redis
To simplify the demo and speed up the developments I've used NATS Streaming server, even thouh its going to be discontinued, it's a good representation of a real life stream service. 

I am using NGINX Ingress Controller to handle pod's communications with the external you can find documentation here 
https://kubernetes.github.io/ingress-nginx/

installing it on K8s its quite simple, refer to: https://kubernetes.github.io/ingress-nginx/deploy/


Before running everything don't forget to setup the secrets. nothing will work if you don't set JWT_Key. and tickets cannot get to the end of the lifecycle if you don't set a STRIPE_KEY. Stripe subscription is free (currently) and it's a good example of real life cases
In absence of your own DNS you'll need to edit the hostfile, now everything is listening to https://ticketing.dev/*

The application is mado of 6 services and one react client:

Auth service: handles user's authentication
Ticket service: handles tickets creation and management
Expiration service: handles tickets expiration time
Orders service: allows users to book a ticket
Payment service: allows users to buy a ticket

This example is not focusing on the Client, so this is quite a simple sample of a react application using NextJS. more examples about react will come on other repositories.




