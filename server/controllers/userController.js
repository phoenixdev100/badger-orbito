import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const registerUser = async(req, res)=>{
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.json({success:false, message: "Missing details"});
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

        // Sanitize user object for client (no password, platforms, or internal fields)
        const safeUser = {
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            platforms: Object.keys(user.platforms || {}).reduce((acc, key) => {
                const p = user.platforms[key] || {};
                acc[key] = {
                    verified: !!p.verified,
                };
                return acc;
            }, {}),
        };

        console.log(safeUser);

        res.json({success:true, token, user: safeUser});


    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message});
    }
}




const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).exec();

        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

            // Sanitize user object for client (no password, platforms, or internal fields)
            const safeUser = {
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                platforms: Object.keys(user.platforms || {}).reduce((acc, key) => {
                const p = user.platforms[key] || {};
                acc[key] = {
                    verified: !!p.verified,
                };
                return acc;
            }, {}),
            };

            console.log(safeUser);

            res.json({ success: true, token, user: safeUser });
        } else {
            return res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};




export {registerUser, loginUser}