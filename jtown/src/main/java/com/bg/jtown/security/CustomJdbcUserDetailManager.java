package com.bg.jtown.security;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.SaltSource;
import org.springframework.security.authentication.encoding.PasswordEncoder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserCache;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.cache.NullUserCache;
import org.springframework.security.provisioning.JdbcUserDetailsManager;

public class CustomJdbcUserDetailManager extends JdbcUserDetailsManager {

	protected final Logger logger = LoggerFactory.getLogger(getClass());

	private AuthenticationManager authenticationManager;
	private PasswordEncoder passwordEncoder;
	private SaltSource saltSource;

	private boolean enableAuthorities;
	private boolean enableGroups;

	@Autowired
	private void config(PasswordEncoder passwordEncoder, SaltSource saltSource) {
		this.passwordEncoder = passwordEncoder;
		this.saltSource = saltSource;
	}

	public void setAuthenticationManager(
			AuthenticationManager authenticationManager) {
		this.authenticationManager = authenticationManager;
	}

	@Override
	protected UserDetails createUserDetails(String id,
			UserDetails userFromUserQuery,
			List<GrantedAuthority> combinedAuthorities) {

		String returnUserid = userFromUserQuery.getUsername();
		if (!isUsernameBasedPrimaryKey()) {
			returnUserid = id;
		}

		return new JtownUser(returnUserid, userFromUserQuery.getPassword(),
				userFromUserQuery.isEnabled(), true, true, true,
				combinedAuthorities, ((JtownUser) userFromUserQuery).getSalt());
	}

	@SuppressWarnings("deprecation")
	@Override
	public UserDetails loadUserByUsername(String username)
			throws UsernameNotFoundException {
		List<UserDetails> users = loadUsersByUsername(username);

		if (users.size() == 0) {
			logger.debug("Query returned no results for user '" + username
					+ "'");

			throw new UsernameNotFoundException(messages.getMessage(
					"JdbcDaoImpl.notFound", new Object[] { username },
					"Username {0} not found"), username);
		}

		UserDetails user = users.get(0); // contains no GrantedAuthority[]

		Set<GrantedAuthority> dbAuthsSet = new HashSet<GrantedAuthority>();

		if (enableAuthorities) {
			dbAuthsSet.addAll(loadUserAuthorities(user.getUsername()));
		}

		if (enableGroups) {
			dbAuthsSet.addAll(loadGroupAuthorities(user.getUsername()));
		}

		List<GrantedAuthority> dbAuths = new ArrayList<GrantedAuthority>(
				dbAuthsSet);

		addCustomAuthorities(user.getUsername(), dbAuths);
		if (dbAuths.size() == 0) {
			logger.debug("User '" + username
					+ "' has no authorities and will be treated as 'not found'");

			throw new UsernameNotFoundException(messages.getMessage(
					"JdbcDaoImpl.noAuthority", new Object[] { username },
					"User {0} has no GrantedAuthority"), username);
		}

		return createUserDetails(username, user, dbAuths);
	}

	@Override
	protected List<UserDetails> loadUsersByUsername(String id) {
		return getJdbcTemplate().query(
				"SELECT id, password, enable FROM users WHERE id = ?",
				new String[] { id }, new RowMapper<UserDetails>() {
					@Override
					public UserDetails mapRow(ResultSet rs, int rowNum)
							throws SQLException {
						String id = rs.getString(1);
						String password = rs.getString(2);
						boolean enable = rs.getBoolean(3);

						return new JtownUser(id, password, enable, true, true,
								true, AuthorityUtils.NO_AUTHORITIES);
					}
				});
	}

	@Override
	protected List<GrantedAuthority> loadGroupAuthorities(String id) {

		StringBuffer groupAuthoritiesByUsernameQuery = new StringBuffer();
		groupAuthoritiesByUsernameQuery
				.append("SELECT g.id, g.group_name, ga.authority ");
		groupAuthoritiesByUsernameQuery
				.append("FROM groups g, group_members gm, group_authorities ga ");
		groupAuthoritiesByUsernameQuery
				.append("WHERE gm.user_pn = (select pn from users where id = ?) AND g.id = ga.group_id AND g.id = gm.group_id");

		return getJdbcTemplate().query(
				groupAuthoritiesByUsernameQuery.toString(),
				new String[] { id }, new RowMapper<GrantedAuthority>() {
					public GrantedAuthority mapRow(ResultSet rs, int rowNum)
							throws SQLException {
						String roleName = getRolePrefix() + rs.getString(3);

						return new SimpleGrantedAuthority(roleName);
					}
				});
	}

	public boolean isEnableAuthorities() {
		return enableAuthorities;
	}

	public void setEnableAuthorities(boolean enableAuthorities) {
		this.enableAuthorities = enableAuthorities;
	}

	public boolean isEnableGroups() {
		return enableGroups;
	}

	public void setEnableGroups(boolean enableGroups) {
		this.enableGroups = enableGroups;
	}

}
