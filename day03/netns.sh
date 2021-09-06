#!/usr/bin/env bash

# create the switch
sudo ip link add my-vnet0 type bridge
sudo ip addr add 192.168.0.1/24 dev my-vnet0
sudo ip link set dev my-vnet0 up

# create a namespace
sudo ip netns add red

# create a pipe
sudo ip link add red-veth type veth peer name red-veth-br

# attach ends to the namespace and the bridge
sudo ip link set dev red-veth netns red
sudo ip link set dev red-veth-br master my-vnet0

# assign ip address to red-veth
sudo ip netns exec red ip addr add 192.168.0.100/24 dev red-veth
sudo ip netns exec red ip link set dev red-veth up

# bring up the link on the switch
sudo ip link set dev red-veth-br up

# add default route to red
sudo ip netns exec red ip route add default via 192.168.0.1 
