const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    if (!password || typeof password !== 'string') {
        throw new Error('Le mot de passe doit être une chaîne de caractères non vide.');
    }
    return await bcrypt.hash(password, 10);
};

module.exports = { hashPassword };