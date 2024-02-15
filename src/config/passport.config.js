
import passport from 'passport'
import local from 'passport-local'
import userModel from '../models/schemas/users.schema.js'
import { isValidPassword } from '../utils/utils.js'
import gitHubService from 'passport-github2'
import UsersDTO from '../models/DTO/user.dto.js'

const LocalStrategy = local.Strategy

passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        try {
            const userRegisterData = req.body
            let exists = await userModel.findOne({ email: userRegisterData.email })
            if (exists) {
                console.log("User already exist.")
                return done(null, false) //Retorna null, false. Porque error en si no hay.
            }

            const newUser = await UsersDTO.createUser(userRegisterData)
            let result = await userModel.create(newUser)
            return done(null, result)
        } catch (error) {
            throw error
        }
    }
))

//login strategy
passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (userEmail, password, done) => {
    try {
        const exists = await userModel.findOne({ email: userEmail })
        if (!exists) {
            console.log("passport.config login strat : user doesnt exist")
            return done(null, false)
        }
        if (!isValidPassword(exists, password)) return done(null, false)
        return done(null, exists) //cuando esta info sale de aca, queda guardada en req.user
    } catch (error) {
        return done(error)
    }
}))

//github
passport.use('github', new gitHubService({
    clientID: "Iv1.a0d6b68b53746763",
    clientSecret: "1db1da6ebc85a08c3d42fcadacf51b986fe7ec6c",
    callbackURL: "http://localhost:8080/api/sessions/github"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // console.log('passport strat GitHubService profile is:')
        // console.log(profile)
        let exists = await userModel.findOne({ email: profile.emails[0].value })
        if (!exists) {
            let userRegisterData = {
                first_name: profile._json.login,
                last_name: '',
                age: '',
                email: profile.emails[0].value,
                password: '',
            }
            const newUser = await UsersDTO.createUser(userRegisterData)
            let result = await userModel.create(newUser)
            done(null, result)
        } else {
            done(null, user)
        }
    } catch (error) {
        return done(error)
    }
}))



passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id)
    done(null, user)
})

export const initPassport = () => {/*Quedo vacio despues de la sacar la estrategia 'register' de adentro hecha en clase*/ }