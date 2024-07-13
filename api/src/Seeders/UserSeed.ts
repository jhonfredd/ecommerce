import bcrypt from "bcrypt";
import UserSchema from "../Schemas/userSchema";


const UserSeed = async () => {
  try {
    // Check if data already exists
    const user = await UserSchema.find();
    if (user.length === 0) {
      const hashedPassword = await bcrypt.hash('123', 10);

      const items = [
        {
            first_name: 'Super', last_name: 'Administrador', telephone: 3214560918,
            email: 'jhonr.turri@gmail.com', password: hashedPassword
        },
      ];

      await UserSchema.create(items);
    }
  } catch (error) {
    console.log('error al registrar un usuario');
  }
};

export default module.exports = UserSeed;
