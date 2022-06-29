# Shards: process manager

This package provides a method for managing background processes.
The basic idea is the following:
 - You run more instances of your meteor application, potentially on different nodes.
 - All nodes are connected to the same Mongo database.
 - One of the nodes is called the controller; all others are workers.
 - The role is determined by setting an ENV variable to `controller` or `worker`.
 - All the nodes can run the same code.
 - The master node requests the execution of the jobs, by inserting commands to the database. The worker nodes pick up the requests, and run the jobs accordingly.
 - The worker nodes don't run any UI.
 - The controller runs the UI for the web application, and it might include an actual task manager UI.

## Usage

TODO
