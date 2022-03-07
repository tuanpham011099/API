const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getUser = (req, res) => {
    let limit = req.query.limit || 0;
    User.find({}).limit(limit)
        .then(users => {
            res.status(200).json(users.map(user => {
                return {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    avatar: user.avatar,
                    email: user.email,
                    address: user.address
                }
            }))
        }).catch(error => res.status(500).json(error))
};

exports.login = async(req, res) => {
    let { email, password } = req.body;
    let userFind = await User.findOne({ email });
    if (!userFind)
        return res.status(400).json({ msg: "Invalid email" });
    bcrypt.compare(password, userFind.password, (err) => {
        if (err)
            return res.status(400).json(err);
        let token = jwt.sign({ user_id: userFind._id, email }, process.env.SECRET, { expiresIn: "24h" });
        res.status(200).json({ id: userFind._id, email: userFind.email, firstname: userFind.firstname, address: userFind.address, token });
    });
};

exports.create = async(req, res) => {
    let { email, password, firstname, lastname } = req.body;
    if (!email ||
        !password ||
        !firstname ||
        !lastname)
        return res.status(400).json({ msg: "Invalid provided data" })
    try {
        let userFind = await User.findOne({ email })
        if (userFind)
            return res.status(400).json({ msg: "User already exist" })
    } catch (error) {
        return res.status(500).json(error)
    }
    let hash = await bcrypt.hash(password, 13);
    let user = new User({ email, password: hash, firstname, lastname })
    try {
        user.save();
    } catch (error) {
        res.status(500).json(error)
    }
    res.status(201).json(user)

}