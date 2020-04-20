package defalt;
import java.sql.Connection;

public class Cadastro {
	public static void main(String[] args) throws ClassNotFoundException {
		
				//	pronto	para	gravar	
		Login	login	=	new	Login();
		login.setNome("renan1");	
		login.setEmail("renan.recalchi.adm@gmail.com");	
		login.setSenha(123456);	
		
		//	grave	Nessa	conexão!!!	
		Conexao	dao	=	new	Conexao();
		//	método	elegante
		dao.adiciona(login);
		System.out.println("Gravado!");
		System.out.print("este dispositivo esta gravado");
		
	}
}
