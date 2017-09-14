# Docker Presentation Suite

## Data API

This is a simple loopback API for a notes project which saves data in MongoDb.

### Local Installation


1. `docker-machine rm docker-data-api; ssh-keygen -R 192.168.99.100`
2. `docker-machine create -d virtualbox --virtualbox-hostonly-cidr 192.168.99.1/24 --virtualbox-memory '2048' --virtualbox-boot2docker-url https://releases.rancher.com/os/latest/rancheros.iso --engine-install-url https://raw.githubusercontent.com/SvenDowideit/install-docker/5896b863698967df0738976d6ee98efc5d4637ae/1.12.6.sh docker-data-api`
3. `docker-machine ls`
4. `eval $(docker-machine env docker-data-api)`
5. `docker-compose up -d`


### Docker EE Installation

1. `vagrant up`
2. `vagrant ssh`
3. `sudo docker run --rm -it --name ucp \
  -v /var/run/docker.sock:/var/run/docker.sock \
  docker/ucp:2.1.0 install --force-insecure-tcp \
  --host-address 192.168.88.10 \
  --interactive`
4. Login to UCP at [https://192.168.88.10:443](https://192.168.88.10:443)
5. Deploy services `sudo docker stack deploy --compose-file docker-compose.yml docker-demo`

#### Setup Docker registry
1. `docker run -d -p 5000:5000 --restart=always --name registry registry:2`
2. `curl 192.168.88.10:5000/v2/_catalog`

Expose the registry (development only insecure)

3. Create file `/etc/docker/daemon.json`

```
{
  "insecure-registries" : ["192.168.88.10:5000"]
}
```

4. `sudo cat /etc/docker/daemon.json`
5. `sudo service docker restart`

Secure registry docs at  [https://docs.docker.com/registry/deploying/](https://docs.docker.com/registry/deploying/)

Push to the Registry via command line

6. `docker build -t viseo/data_api:1.0.1 data_api/`
7. `docker tag viseo/data_api:1.0.1 192.168.88.10:5000/viseo/data_api:1.0.1`
8. `docker push 192.168.88.10:5000/viseo/data_api:1.0.1`
