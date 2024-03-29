package com.bg.jtown.security;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.jdbc.core.support.JdbcDaoSupport;
import org.springframework.security.authentication.dao.SaltSource;
import org.springframework.security.authentication.encoding.PasswordEncoder;

/**
 * 데이터 베이스에 입력되 있는 Password를
 * 
 * passwordEncoder를 통해 Encode 시켜주는 역할을 하는 Bean
 * 
 * @author Francis
 * 
 */
public class TempDatabasePasswordSecurerBean extends JdbcDaoSupport {

	private PasswordEncoder passwordEncoder;
	private SaltSource saltSource;
	private CustomJdbcUserDetailManager userDetailsService;

	@Autowired
	public void config(PasswordEncoder passwordEncoder, SaltSource saltSource,
			CustomJdbcUserDetailManager userDetailsService) {
		this.passwordEncoder = passwordEncoder;
		this.saltSource = saltSource;
		this.userDetailsService = userDetailsService;
	}

	public void secureDatabase() {
		getJdbcTemplate().query("select id, password, DATE_FORMAT(salt, '%Y-%m-%d %H:%i:%s') AS salt from users",
				new RowCallbackHandler() {
					public void processRow(ResultSet rs) throws SQLException {
						String username = rs.getString(1);
						String password = rs.getString(2);
						JtownUser user = (JtownUser) userDetailsService.loadUsersByUsername(username).get(0);
						
						user.setSalt(rs.getString(3));
						
						String encodedPassword = passwordEncoder.encodePassword(password, saltSource.getSalt(user));
						getJdbcTemplate()
								.update("update users set password = ? where id = ?",
										encodedPassword, username);
						logger.debug("Updating password for username : "
								+ username + " to : " + encodedPassword);
					}
				});
	}
}
