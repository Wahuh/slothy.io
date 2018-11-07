const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const extractJWT = require("passport-jwt").ExtractJwt;

const User = require("./models/user.model");

passport.use(
	"signup", 
	new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    session: false,
}, async (email, password, done) => {
    try {
        const user = await User.create({email, password});
        return done(null, user);
    } catch (error) {
        done(error);
    }
}));

//Create a passport middleware to handle User login
passport.use('login', new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
  }, async (email, password, done) => {
    try {
      //Find the user associated with the email provided by the user
      const user = await User.findOne({ email });
      if( !user ){
        //If the user isn't found in the database, return a message
        return done(null, false, { message : 'User not found'});
      }
      //Validate password and make sure it matches with the corresponding hash stored in the database
      //If the passwords match, it returns a value of true.
      const validate = await user.isValidPassword(password);
      if( !validate ){
        return done(null, false, { message : 'Wrong Password'});
      }
      //Send the user information to the next middleware
      return done(null, user, { message : 'Logged in Successfully'});
    } catch (error) {
      return done(error);
    }
}));

passport.use("login", new LocalStrategy({
	usernameField: "email",
	passwordField: "password",
},
function(email, password, done) {

	}
));

passport.use(new jwtStrategy({
	secretOrKey: "top_secret",
	jwtFromRequest: extractJwt.fromUrlQueryParameter("secret_token")
}, async (token, done) => {
	try {
		return done(null, token.user);
	} catch (error) {
		done(error);
	}
}));