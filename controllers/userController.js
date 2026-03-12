import User from "../models/userModel.js";
import bcrypt from 'bcrypt';

export async function getCreateUser(req, res) {
    try {
        res.render('users/userIndex', {
            layout: 'templates/mains',
            title: 'Users'});
    } catch (error) {
        console.error(error);   
        res.status(500).send('Internal Server Error');
    }
}
export async function createUser(req, res) {
    const { firstName, lastName, email, password, confirmPassword, gender, province } = req.body;   
    if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match.");
    }
    try {
        console.log("Received Data:", { firstName, lastName, email, gender, province,password }); // Debugging line
        // 3. Hash the password (Never store plain text!)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Hashed Password:", hashedPassword); // Debugging line
        await User.save(firstName, lastName, email, hashedPassword, gender, province);
        res.redirect('/create');
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).send("Email already exists.");
        }
        res.status(500).send("Server Error");
    }
}

export async function login(req, res) {
    try {
        res.render('users/login', {
            layout: 'templates/mains',
            title: 'Login'});
    } catch (error) {
        console.error(error);   
        res.status(500).send('Internal Server Error');
    }
}

export async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        const [rows] = await User.loginUser(email, password);
        if (rows.length === 0) return res.send("User not found");
        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.session.userId = user.id;
            req.session.userName = user.first_name;
            return res.redirect('/dashboard');
        }
        res.send("Wrong password");
    } catch (err) { res.status(500).send(err.message); }
};

export async function listUser(req, res) {
    try {
        const [rows] = await User.fetchAll();
        res.render('users/list', {
            layout: 'templates/mains',
            title: 'Users', users: rows, userName: req.session.userName });
    } catch (error) {
        console.error(error);   
        res.status(500).send('Internal Server Error');
    }
}


export async function findUser(req, res) {
    try {
        const { firstName } = req.body;
        const [rows] = await User.findUser(firstName);
        console.log("Search Result:", rows); // Debugging line
        res.render('users/list', {
            layout: 'templates/mains',
            title: 'Find User', users: rows });
    } catch (error) {
        console.error(error);   
        res.status(500).send('Internal Server Error');
    }
}