import db from './db.js';
import session from 'express-session';
import MySQLStoreFactory from 'express-mysql-session';

const MySQLStore = MySQLStoreFactory(session);


// 3. Configure the Session Store
const sessionStore = new MySQLStore({
    clearExpired: true,
    checkExpirationInterval: 900000, // 15 mins
    expiration: 3600000,             // 1 hour
    createDatabaseTable: true
}, db);

// 4. Export the configured middleware
export const sessionConfig = session({
    key: 'session_cookie_name',
    secret: process.env.SESSION_SECRET || 'cadt_cyber_default_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000,
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        sameSite: 'lax'
    }
});