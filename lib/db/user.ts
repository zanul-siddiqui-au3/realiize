import * as mongoose from 'mongoose';
import autoPopulateAllFields from './plugins/populateAll';
export const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    first: {
      type: String,
      required: true
    },
    last: {
      type: String,
      required: true
    }
  },
  subscribedToNewsletter: {
    type: Boolean,
    default: true
  },
  password: {
    type: String,
    required: isPasswordRequired
  },
  oauth: {
    type: String,
    enum: ['FACEBOOK', 'GOOGLE', 'LINKEDIN'],
    required: function () { return !this.password; }
  },
  roles: {
    type: String,
    enum : ['User', 'Admin'],
    default: 'User'
  },
  stripeCustomerId: {
    type: String
  },
  defaultCardToken: {
    type: String
  },
  cardTokens: [String],
  renewalDate: {
    type: Date,
    required: false,
  },
  subscribedOn: {
    type: Number,
    required: false,
  },
  subscriptionActiveUntil: {
    type: Number,
    default: 1578883746, // Use 1578883746 for 13th Jan 2020 & use 1607827746 for dec 2020
    set: (d) => d * 1000,
  },
  subscriptionId: {
    type: String,
    required: false,
  },
  subscriptionCancellationRequested: {
    type: Boolean,
    default: false,
  },
},  {
  timestamps: true,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

function isPasswordRequired() { return !this.oauth; }
UserSchema.pre('save', function (next) {
  const email = this.get('profile.email');
  if (email) {
    this.profile.email = this.profile.email.toLowerCase();
  }

  const firstName = this.firstName;
  if (firstName) {
    this.set('profile.name.first', firstName.trim());
  }

  const lastName = this.get('profile.name.last');
  if (lastName) {
    this.set('profile.name.last', lastName.trim());
  }
  if (this.roles.length == 0) {
    this.roles.push('user');
  }

  next();
});

UserSchema.virtual('fullName').get(function () {
  return `${this.name.first} ${this.name.last}`;
});

UserSchema.virtual('isAdmin').get(function () {
  return this.roles.includes('Admin');
});

UserSchema.virtual("isPaidUser").get(function () {
  const dateDifference = this.subscriptionActiveUntil - Date.now();
  return dateDifference / 1000 / 60 / 60 / 24 > 0 ? true : false;
});

UserSchema.index({
  email: "text",
  "name.first": "text",
  "name.last": "text",
});

UserSchema.plugin(autoPopulateAllFields);