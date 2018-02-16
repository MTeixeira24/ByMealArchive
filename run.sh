docker rm -f front_end_1
make build ENV=dev
make launch LOCAL_PORT=1005
