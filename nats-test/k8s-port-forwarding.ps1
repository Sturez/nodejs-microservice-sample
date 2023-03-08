$nats_test = kubectl get pods | Select-String '^nats-depl'
$nats_tostring = $nats_test.ToString() #<--- should be somthing like nats-depl-f59d55544-ld2c8

# copy the whole POD ID

kubectl port-forward nats-depl-f59d55544-ld2c8 4222:4222