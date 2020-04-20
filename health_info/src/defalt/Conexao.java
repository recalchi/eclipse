package defalt;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import defalt.MyClass;
public class Conexao {
	private Connection connection;
	public Conexao () {
		try {
			this.connection = new MyClass().getConnection();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		}
    public	void	adiciona(Login   login)	{
    	
    	String	sql	= "insert into cadastro_de_usuário"	+ "(Nome,Email,Senha)"+"values(?,?,?)";
	
	try	{
	//	prepared	statement	para	inserção
	PreparedStatement	stmt = connection.prepareStatement(sql);
		
	//	seta	os	valores
	stmt.setString(1,login.getNome());
	stmt.setString(2,login.getEmail());
	stmt.setInt(3,login.getSenha());
		
	//	executa	
	stmt.execute();
	stmt.close();
	}catch	(SQLException	e)	{
		throw	new	RuntimeException(e);
		}
	}
    
public	void	validacaologin(Login login)	{
	   
	try	{
    
    String	sql	= "SELECT * FROM cadastro_de_usuário";
	
    //prepared	statement	para	inserção
	PreparedStatement stmt = this.connection.prepareStatement(sql);
	ResultSet rs = stmt.executeQuery();
	
	if (rs.next()) {
		//criando o objeto
		login = new Login();
		
		if(rs.getString("nome") == login.getNome() && rs.getString("email") == login.getEmail()){
			String nome = rs.getString("Nome");
			
			
			System.out.print("login feito com sucesso" + nome ); 
		}
		    
        } else {
        
        stmt.close();
        System.out.print("não foi feito o login");
    }
	
	//executa	
	//stmt.execute();
	stmt.close();
	
	}catch	(SQLException	e)	{
		throw	new	RuntimeException(e);
		}
	}
    
    

}
