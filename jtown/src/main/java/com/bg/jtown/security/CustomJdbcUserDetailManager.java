package com.bg.jtown.security;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.PreparedStatementSetter;
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
import org.springframework.util.Assert;

import com.bg.jtown.business.LoginService;

public class CustomJdbcUserDetailManager extends JdbcUserDetailsManager  {

	protected final Logger logger = LoggerFactory.getLogger(getClass());

	private AuthenticationManager authenticationManager;
	private PasswordEncoder passwordEncoder;
	private SaltSource saltSource;
	private LoginService loginService;

	private boolean enableAuthorities;
	private boolean enableGroups;

	@Autowired
	private void config(PasswordEncoder passwordEncoder, SaltSource saltSource, LoginService loginService) {
		this.passwordEncoder = passwordEncoder;
		this.saltSource = saltSource;
		this.loginService = loginService;
	}

	public void setAuthenticationManager(
			AuthenticationManager authenticationManager) {
		this.authenticationManager = authenticationManager;
	}

	protected UserDetails createUserDetails(String id,
			JtownDetails userFromUserQuery,
			List<GrantedAuthority> combinedAuthorities) {

		String returnUserid = userFromUserQuery.getUsername();
		if (!isUsernameBasedPrimaryKey()) {
			returnUserid = id;
		}

		return new JtownUser(userFromUserQuery.getPn() ,returnUserid, userFromUserQuery.getPassword(),
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

		JtownDetails user = (JtownDetails) users.get(0); // contains no GrantedAuthority[]

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
				"SELECT id, password, enable, DATE_FORMAT(salt, '%Y-%m-%d %H:%i:%s') AS salt, pn FROM users WHERE id = ?",
				new String[] { id }, new RowMapper<UserDetails>() {
					@Override
					public UserDetails mapRow(ResultSet rs, int rowNum)
							throws SQLException {
						String id = rs.getString(1);
						String password = rs.getString(2);
						boolean enable = rs.getBoolean(3);
						String salt = rs.getString(4);
						Integer pn = rs.getInt(5);

						return new JtownUser(pn, id, password, enable, true, true,
								true, AuthorityUtils.NO_AUTHORITIES, salt);
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
	
	public Integer createUserSellerAndAuthority(JtownUser jtownUser) {
		Integer pn = createUserSeller(jtownUser);
		
		addUserToGroup(jtownUser.getPn(), "Seller");
		
		return pn;
	}

	public void createUserCustomAndAuthority(JtownUser jtownUser) {
		creatUserCustomer(jtownUser);
		
		addUserToGroup(jtownUser.getPn(), "Customer");
	}

	private void creatUserCustomer(JtownUser jtownUser) {
		validateUserDetails(jtownUser);

		// PasswordEncoder SaltSource
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss",
				Locale.KOREA);
		Date date = new Date();
		String salt = sdf.format(date);
		jtownUser.setSalt(salt);
		
		logger.debug(jtownUser.toString());
		
		String encodedPassword = passwordEncoder.encodePassword(jtownUser.getPassword(), saltSource.getSalt(jtownUser));
		jtownUser.setPassword(encodedPassword);
		
		loginService.creatUserCustomer(jtownUser);
	}
	
	private Integer createUserSeller(JtownUser jtownUser){
		// PasswordEncoder SaltSource
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss",
				Locale.KOREA);
		Date date = new Date();
		String salt = sdf.format(date);
		jtownUser.setSalt(salt);
		
		jtownUser.setUsername(jtownUser.getShopUrl());
		jtownUser.setPassword("admin" + salt);
		
		logger.debug(jtownUser.toString());
		
		String encodedPassword = passwordEncoder.encodePassword(jtownUser.getPassword(), saltSource.getSalt(jtownUser));
		jtownUser.setPassword(encodedPassword);
		
		return loginService.createUserSeller(jtownUser);
		
	}
	
	private void addUserToGroup(Integer userPn, String groupName) {
        logger.debug("Adding user '" + userPn + "' to group '" + groupName + "'");
        Assert.hasText(userPn.toString());
        Assert.hasText(groupName);

        final int id = findGroupId(groupName);
        
        Map<String, Integer> groupMap = new HashMap<String, Integer>();
        groupMap.put("groupId", id);
        groupMap.put("userPn", userPn);
        
        loginService.addUserToGroup(groupMap);
	}
	
	private int findGroupId(String group) {
		return loginService.findGroupdId(group);
	}

	// /**
	// * Optionally sets the UserCache if one is in use in the application.
	// * This allows the user to be removed from the cache after updates have
	// taken place to avoid stale data.
	// *
	// * @param userCache the cache used by the AuthenticationManager.
	// */
	// public void setUserCache(UserCache userCache) {
	// Assert.notNull(userCache, "userCache cannot be null");
	// this.userCache = userCache;
	// }

	private void validateUserDetails(UserDetails user) {
		Assert.hasText(user.getUsername(), "Username may not be empty or null");
		validateAuthorities(user.getAuthorities());
	}

	private void validateAuthorities(
			Collection<? extends GrantedAuthority> authorities) {
		Assert.notNull(authorities, "Authorities list must not be null");

		for (GrantedAuthority authority : authorities) {
			Assert.notNull(authority, "Authorities list contains a null entry");
			Assert.hasText(authority.getAuthority(),
					"getAuthority() method must return a non-empty string");
		}
	}
}
