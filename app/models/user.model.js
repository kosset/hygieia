import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    psid: {
        type: String,
        required: true
    }, // Platform Scoped ID
    name: {
      first: String,
      last: String
    },
    lastMessage: String
  },
  {
    timestamps: {
      createdAt: "firstInteractionAt",
      updatedAt: "lastInteractionAt"
    },
    minimize: false
  }
);

// New property for user
userSchema
  .virtual("name.full")
  .get(function() {
      return this.name.first + " " + this.name.last
  })
  .set(function(v) {
    this.name.first = v.substr(0, v.indexOf(" "));
    this.name.last = v.substr(v.indexOf(" ") + 1);
  });

// Statics
// Do not declare statics using ES6 arrow functions (=>).
// Arrow functions explicitly prevent binding this,
// so the above examples will not work because of the value of this.
userSchema.statics.findByPSID = function (psid) {
  return this.findOne({ psid: psid }).exec();
};

// Create the model
const UserModel = model("User", userSchema);

// Make it available
module.exports = UserModel;
