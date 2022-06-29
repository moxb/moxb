// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by moxb-meteor.js.
import { name as packageName } from "meteor/moxb:meteor";

// Write your tests here!
// Here is an example.
Tinytest.add('moxb:meteor - example', function (test) {
  test.equal(packageName, "moxb:meteor");
});
