const jwt = require("jsonwebtoken")

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRETKEY, {expiresIn: "1d"})
}

// const generateRefreshToken = () => {
//     return jwt.sign({}, process.env.JWT_SECRETKEY, { expiresIn: "3d" });
// }

module.exports = { generateToken };
