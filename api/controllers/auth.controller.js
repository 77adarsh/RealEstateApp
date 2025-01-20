import bcrypt from "bcrypt";

export const register = async (req, res) => {
    const { user, email, password } = req.body;

    // Hash the password

    const hashdPassword = await bcrypt.hash(password, 10);
    console.log(hashdPassword);

    // Create a new user and save to DB
}

export const login = (req, res) => {

}

export const logout = (req, res) => {

}