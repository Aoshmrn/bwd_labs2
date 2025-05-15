'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const passport_jwt_1 = require('passport-jwt');
const passport_1 = __importDefault(require('passport'));
const user_1 = __importDefault(require('@models/user'));
const dotenv_1 = __importDefault(require('dotenv'));
dotenv_1.default.config({ path: '../.env' });
const options = {
  jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
passport_1.default.use(
  'jwt',
  new passport_jwt_1.Strategy(options, async (payload, done) => {
    try {
      const user = await user_1.default.findByPk(payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }),
);
exports.default = passport_1.default;
