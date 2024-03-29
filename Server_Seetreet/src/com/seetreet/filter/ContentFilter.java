package com.seetreet.filter;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;

import org.json.JSONException;
import org.json.JSONObject;

import com.google.gson.JsonObject;
import com.seetreet.bean.UserBean;
import com.seetreet.bean.content.ContentBean;
import com.seetreet.dao.MongoDAO;
import com.seetreet.util.C;
import com.seetreet.util.ResBodyFactory;

/**
 * Servlet Filter implementation class ContentFilter
 */
@WebFilter("/user/content/*")
public class ContentFilter implements Filter {
	private final String PRIFIX = "/user/content/";
    /**
     * Default constructor. 
     */
    public ContentFilter() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
		// TODO Auto-generated method stub
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
		// TODO Auto-generated method stub
		// place your code here
		
		HttpServletRequest httpReq = (HttpServletRequest)req;
		res.setCharacterEncoding(C.ENCODING);
		httpReq.setCharacterEncoding(C.ENCODING);
		String uri = httpReq.getRequestURI();
		String contextPath = httpReq.getContextPath();
		String cmd = uri.substring(contextPath.length());

		String postfix = cmd.replace(PRIFIX, "");
		String[] postfixes = postfix.split("/");
		String email = postfixes[postfixes.length -1];		
		String token = httpReq.getHeader(UserBean.KEY_TOKEN);
		
		if(!MongoDAO.isUser(email, token)) {
			PrintWriter out = res.getWriter();
			try {
				out.write(ResBodyFactory.create(false, ResBodyFactory.STATE_FAIL_ABOUT_UNKNOWN_TOKEN ,new JSONObject()));
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} finally {
				out.close();
			}
			return;
		}
		httpReq.setAttribute(UserBean.KEY_EMAIL, email);
		
		// pass the request along the filter chain
		chain.doFilter(req, res);
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		// TODO Auto-generated method stub
	}
	
}
