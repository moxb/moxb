// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by shards-process-manager.js.
import { name as packageName } from "meteor/moxb:shards-process-manager";

// Write your tests here!
// Here is an example.
Tinytest.add('moxb:shards-process-manager - example', function (test) {
  test.equal(packageName, "moxb:shards-process-manager");
});
