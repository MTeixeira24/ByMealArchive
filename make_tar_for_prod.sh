touch run_remote_dev.sh
sudo chmod +x run_remote_dev.sh
echo "docker rm -f front_end_1" >> run_remote_dev.sh
echo "make rebuild ENV=remote-dev" >> run_remote_dev.sh
echo "docker run --name front_end_1 -p 80:80 -p 433:433 -d web-frontend" >> run_remote_dev.sh
tar --exclude='www/node_modules' -cvpf package.tar docker www Makefile run_remote_dev.sh SSL
rm run_remote_dev.sh
#34.212.90.12
awsmachine="34.212.90.12"
echo "AWS address in " $awsmachine
scp -i ../../andre-bymeal-accesss.pem package.tar ec2-user@$awsmachine:~
rm package.tar
ssh -i ../../andre-bymeal-accesss.pem ec2-user@$awsmachine 'tar -xvf package.tar && rm package.tar && ./run_remote_dev.sh'
ssh -i ../../andre-bymeal-accesss.pem ec2-user@$awsmachine
