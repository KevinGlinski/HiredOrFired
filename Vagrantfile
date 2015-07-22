# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.

Vagrant.configure("2") do |config|

# There is an issue with OsX 10.10 and VirtualBox. This is the workaround
  config.vm.provider :virtualbox do |vb|
    vb.auto_nat_dns_proxy = false
    vb.customize ["modifyvm", :id, "--natdnsproxy1", "off" ]
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "off" ]
end
# End workaround

# Defining the VM
  config.vm.define "boot2docker"

# Using a third party vm because the default image was slow to load
  config.vm.box = "yungsang/boot2docker"

# need to copy our folder to the vm so that we can build and test our changes
  config.vm.synced_folder ".", "/hiredorfired"

# Need to add this because the base image is using port 2375 for something else
  config.vm.network :forwarded_port, guest: 2376, host: 2375, auto_correct: true

# Set up the mongo db first so that we can link to it later
  config.vm.provision :docker do |d|
    d.run "mongodb",
      image: "mongo",
      args: "-d -p 27017:27017"
  end

# Build our image then run the container
  config.vm.provision :docker do |d|
    d.build_image "/hiredorfired",
      args: "-t deathrowe/hiredorfired:v1"
    d.run "hiredorfired",
      image: "deathrowe/hiredorfired:v1",
      args: "-d -p 5000:5000 --link mongodb:db"
  end

# Open the following ports on the vm
  config.vm.network :forwarded_port, guest: 27017, host: 27017
  config.vm.network :forwarded_port, guest: 5000, host: 5000
end
