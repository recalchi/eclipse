package defalt;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class MyClass {

	public	Connection	getConnection() throws ClassNotFoundException	{
		
		try	{
			Class.forName (" com.mysql.jdbc.Driver ");
			//?useTimezone=true&serverTimezone=America/Sao_Paulo
			return	(Connection) DriverManager.getConnection(	
					"jdbc:mysql://localhost:3306/bd_app?useTimezone=true&serverTimezone=America/Sao_Paulo", "root", "");

		}	catch	(SQLException	e)	{					
				throw	new	RuntimeException(e);				
			}
    }
}
