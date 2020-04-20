package br.com.caelum.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import defalt.Conexao;
import defalt.Login;
import defalt.MyClass;


@WebServlet("/telainicial")
public class OiMundo extends HttpServlet {

/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

protected	void	service(HttpServletRequest	request, HttpServletResponse	response)throws	ServletException,	IOException	{
	
	    //Busca o writer    
	    PrintWriter out = response.getWriter();
        
	   //Buscando os parâmetros no request
		String nome = request.getParameter("nome");
		String email = request.getParameter("email");
		String senha= request.getParameter("senha");
		int numeroConvertido = Integer.parseInt(senha);

		
		Login	login	=	new	Login();
		login.setNome(nome);	
		login.setEmail(email);	
		login.setSenha(numeroConvertido);
		
		
		//Salva	o	contato	
		Conexao dao = new Conexao();
		dao.adiciona(login);
		
				
		//imprime	o nome do contato que foi adicionado
		out.println("<html>");
		out.println("<body>");
		out.println("<h1>Hello</h1>");
		out.println("Contato"+login.getNome()+"	adicionado	com	sucesso");
		out.println("</body>");
		out.println("</html>");
	
        

 }


}
