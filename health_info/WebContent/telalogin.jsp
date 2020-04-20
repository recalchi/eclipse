<%@ page import="defalt.*, java.util.*, java.sql.*"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
<%@	taglib	uri="http://java.sun.com/jsp/jstl/core"	prefix="c"	%>
<%@	taglib	uri="http://java.sun.com/jsp/jstl/fmt"	prefix="fmt"%>

<table>
		<!--percorre	contatos	montando	as	linhas	da	tabela-->	
		<c:forEach	var="contato"	items="${contatos}">
		<tr>
			<td>${contato.nome}</td>
			<td>
			<c:if	test="${not	empty	contato.email}">
			<a	href="mailto:${contato.email}">${contato.email}</a>
			</c:if>
			<c:if	test="${empty	contato.email}">
			E-mail	não	informado
			</c:if>	
			</td>
			<td>${contato.senha}</td>
				
			<td>
				<a	href="mvc8?logica=Remove8ContatoLogic&id=${contato.cod}">Remover</a>
			</td>
		</tr>
		</c:forEach>
</table>
</body>
</html>