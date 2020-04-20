package br.com.caelum.servlet;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class PrimeiraLogica implements Logica {

	@Override
	public String executa(HttpServletRequest req, HttpServletResponse res) throws Exception {
	System.out.print("Executando a Logica....");	
	return "lista-usuario.jsp";
	}

}
