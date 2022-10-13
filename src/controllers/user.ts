import { prisma } from "../config/database";

interface typeUser{
  name: string;
  email: string;
  password: string;
  role: string;
  card: string;
}

export default class UserController {

  async create(user: any){
    const {name, email, password, role, card} = user;
    try{
      const createUser = await prisma.user.create({
        data: {
          name,
          email,
          password,
          role,
          card
        }
      })
      return createUser;
    } catch(error) {
      throw new Error("Não foi possível criar usuário.")
    }
  }

  async searchByEmail(email: string){
    const emailUsed = await prisma.user.findUnique({
      where: {
        email
      }
    })
    return emailUsed;
  }

  async searchByCardId(card: string){
    const cardIdUsed = await prisma.user.findUnique({
      where: {
        card
      }
    })
    return cardIdUsed;
  }
}