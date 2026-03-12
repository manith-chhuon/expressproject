import db from '../config/db.js';

class User {
    static fetchAll() {
        return db.execute('SELECT * FROM users');
    }
    static save(first_name,last_name,email,password,gender,province) {
        return db.execute('INSERT INTO users (first_name,last_name,email,password,gender,province) VALUES (?,?,?,?,?,?)', [first_name,last_name,email,password,gender,province]);
    }
    static loginUser(email, password) {
        return db.execute('SELECT * FROM users WHERE email = ?', [email]);
    }
    static findUser(firstName) {
        // return db.execute('SELECT * FROM users WHERE first_name LIKE ?', [`%${firstName}%`]);
        return db.execute('SELECT * FROM users WHERE first_name LIKE "'+firstName+'"');
    }
}
export default User;