import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password

        const hashdPassword = await bcrypt.hash(password, 10);

        // Create a new user and save to DB
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashdPassword,
            },
        })

        console.log(newUser);

        res.status(201).json({ message: "User connected successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create user!" });
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists

        const user = await prisma.user.findUnique({
            where: { username }
        })

        if (!user) return res.status(401).json({ message: "Invalid Credentials!" });

        // If the password is correct

        const isPassword = await bcrypt.compare(password, user.password);

        if (!isPassword) return res.status(401).json({ message: "Invalid Credentials!" });

        // Generate cookie token and send to the user

        // res.setHeader("Set-Cookie", "test=" + "myValue").json({message: "success!"});

        const age = 1000 * 60 * 60 * 24 * 7;

        const token = jwt.sign(
            {
                id: user.id,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: age },
        );

        res
            .cookie("token", token, {
                httpOnly: true,
                // secure: true, --> only used for the production purpose
                maxAge: age,
            })
            .status(200)
            .json({ message: "Login Successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to login!" });
    }
}

export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({message: "Logout Successfully"});
}