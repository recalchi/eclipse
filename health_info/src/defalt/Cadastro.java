package defalt;
import java.sql.Connection;

public class Cadastro {
	public static void main(String[] args) throws ClassNotFoundException {
		
				//	pronto	para	gravar	
		Login	login	=	new	Login();
		login.setNome("renan1");	
		login.setEmail("renan.recalchi.adm@gmail.com");	
		login.setSenha(123456);	
		
		//	grave	Nessa	conex�o!!!	
		Conexao	dao	=	new	Conexao();
		//	m�todo	elegante
		dao.adiciona(login);
		System.out.println("Gravado!");
		System.out.print("este dispositivo esta gravado");
		
	}
}
