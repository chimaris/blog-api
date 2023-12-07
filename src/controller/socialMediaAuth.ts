import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
// import { Strategy as FacebookStrategy } from "passport-facebook";
import { UserInstance } from "../model/userModel";
import { v4 as uuidv4 } from "uuid";

export interface Google {
	id: string;
	given_name: string;
	family_name: string;
	email: string;
	verified: boolean;
	picture: string;
}

// PassportJS setup

// Google Strategy
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			callbackURL: "http://localhost:5000/google/callback",
			passReqToCallback: true,
		},
		async (request: any, accessToken: string, refreshToken: string, profile: Google, done: any) => {
			console.log("Google Auth ", profile);
			try {
				console.log("Helloouuuu");
				const user = await UserInstance.findOne({
					where: { email: profile.email },
				});
				console.log("User::", user);
				if (user) {
					if (user?.dataValues.googleId == profile.id) {
						done(null, user);
						return;
					} else if (user?.dataValues.googleId != profile.id) {
						done(null, "The email already exists, login with your password");
						return;
					}
				}

				const id = uuidv4();

				const savedUser = new UserInstance({
					id,
					email: profile.email,
					username: profile.given_name,
					googleId: profile.id,
					password: "",
					resetPasswordToken: "",
					facebookId: "",
					twitterId: "",
				});

				await savedUser.save();
				done(null, savedUser);
				return;
			} catch (error) {
				console.error(error);
				throw new Error(`${error}`);
			}
		}
	)
);

// Twitter Strategy
passport.use(
	new TwitterStrategy(
		{
			consumerKey: process.env.TWITTER_CONSUMER_KEY!,
			consumerSecret: process.env.TWITTER_CONSUMER_SECRET!,
			callbackURL: "http://localhost:5000/social-login/twitter/callback",
			passReqToCallback: true,
			includeEmail: true, // Request email address
		},
		async (token, tokenSecret, profile, done) => {
			console.log("Twitter Auth", profile);

			// Handle user creation and token generation here
		}
	)
);

// I counld not get the facebook clientId and clientSecret because I was having issue with my facebook account

// Facebook Strategy
// passport.use(
// 	new FacebookStrategy(
// 		{
// 			clientID: "your-facebook-app-id",
// 			clientSecret: "your-facebook-app-secret",
// 			callbackURL: "http://localhost:5000/facebook/callback",
// 			passReqToCallback: true,
// 		},
// 		(accessToken, refreshToken, profile, done) => {
// 			// Handle user creation and token generation here
// 		}
// 	)
// );

// Serialize and deserialize user for session support
passport.serializeUser((user: Express.User, done) => {
	done(null, user);
});

passport.deserializeUser((obj: any, done) => {
	done(null, obj);
});
