import bcrypt from "bcrypt";


export const hashPassword = (password: string) => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds)
}


export const comparePassword = (passwrod: string, hashPass: string) => {
    return bcrypt.compare(passwrod, hashPass);
}
