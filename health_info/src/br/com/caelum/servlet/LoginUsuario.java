package br.com.caelum.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import defalt.Conexao;
import defalt.Login;

@WebServlet("/telalogin")
public class LoginUsuario extends HttpServlet{
	
	protected	void	service(HttpServletRequest	request, HttpServletResponse	response)throws	ServletException,	IOException	{
		
	    //Busca o writer    
	    PrintWriter out = response.getWriter();
        
	   //Buscando os parâmetros no request
		
		String email = request.getParameter("email");
		String senha= request.getParameter("senha");
		int numeroConvertido = Integer.parseInt(senha);

		Login	login	=	new	Login();
			
		login.setEmail(email);	
		login.setSenha(numeroConvertido);
		
		//Salva	o	contato	
		Conexao dao = new Conexao();
		dao.validacaologin(login);
						
		//imprime	o nome do contato que foi adicionado
		out.println("<html>");
		out.println("<body>");
		out.println("<h1>Hello</h1>");
		out.println("Contato"+login.getEmail()+"	Logado com	sucesso");
		out.println("</body>");
		out.println("</html>");
	
        

 }

}
