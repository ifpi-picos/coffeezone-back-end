import UserController from '../controllers/user';
import validator from 'validator';

interface TypeBody {
  name: string;
  email: string;
  password: string;
  role: string;
  card?: string
}

export async function verifyInfosUser(body: TypeBody){

  const userController = new UserController();
  const {name, email, password, role, card} = body;
  
  if(!name || name.length < 3) return 'Preencha o campo de nome corretamente';
  if(!password || password.length < 8) return 'Preencha o campo de senha corretamente';
  if(!email || !validator.isEmail(email)) return 'Preencha o campo de email corretamente';
  if(role !== "Visitor" && role !== "Member" && role !== "Coordinator") return 'Utilize o tipo de usuário correto';
  if(await userController.searchByEmail(email)) return 'Esse email já está sendo usado';
  if(card && await userController.searchByCardId(card)) return 'Esse id de cartão já está sendo usado';
}