package com.bg.jtown.security;

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
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.SaltSource;
import org.springframework.security.authentication.encoding.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserCache;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.cache.NullUserCache;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.util.Assert;

import com.bg.jtown.util.RandomUtil;

/**
 * @author 박광열
 * 
 */
public class CustomJdbcUserDetailManager extends JdbcUserDetailsManager {

	protected final Logger logger = LoggerFactory.getLogger(getClass());

	// ~ Variable
	private boolean enableAuthorities;
	private boolean enableGroups;
	private UserCache userCache = new NullUserCache();

	// ~ Dynamic Injection

	@SuppressWarnings("unused")
	private AuthenticationManager authenticationManager;
	private PasswordEncoder passwordEncoder;
	private SaltSource saltSource;
	private LoginService loginService;

	@Autowired
	private void config(PasswordEncoder passwordEncoder, SaltSource saltSource,
			LoginService loginService) {
		this.passwordEncoder = passwordEncoder;
		this.saltSource = saltSource;
		this.loginService = loginService;
	}

	public void setAuthenticationManager(
			AuthenticationManager authenticationManager) {
		this.authenticationManager = authenticationManager;
	}

	// ~ Set,Get Method

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

	// ~ Method

	protected UserDetails createUserDetails(String id,
			JtownDetails userFromUserQuery,
			List<GrantedAuthority> combinedAuthorities) {

		String returnUserid = userFromUserQuery.getUsername();
		if (!isUsernameBasedPrimaryKey()) {
			returnUserid = id;
		}

		return new JtownUser(userFromUserQuery.getPn(), returnUserid,
				userFromUserQuery.getPassword(),
				((JtownUser) userFromUserQuery).getSalt(),
				userFromUserQuery.getName(), userFromUserQuery.getGroupName(),
				userFromUserQuery.getConfirmEmail(), userFromUserQuery.getFacebookFeed(),
				userFromUserQuery.isEnabled(), combinedAuthorities);
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

		JtownDetails user = (JtownDetails) users.get(0); // contains no
															// GrantedAuthority[]

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
		return getJdbcTemplate()
				.query("SELECT u.id, u.password, u.enable, DATE_FORMAT(u.salt, '%Y-%m-%d %H:%i:%s') AS salt, u.pn, gmn.group_name, u.name, u.confirm_email, u.facebook_feed "
						+ "FROM users u, group_members_name gmn "
						+ "WHERE u.id = ? AND u.pn = gmn.user_pn",
						new String[] { id }, new RowMapper<UserDetails>() {
							@Override
							public UserDetails mapRow(ResultSet rs, int rowNum)
									throws SQLException {
								String id = rs.getString(1);
								String password = rs.getString(2);
								boolean enabled = rs.getBoolean(3);
								String salt = rs.getString(4);
								Integer pn = rs.getInt(5);
								String groupName = rs.getString(6);
								String name = rs.getString(7);
								boolean confirmEmail = rs.getBoolean(8);
								boolean facebookFeed = rs.getBoolean(9);

								return new JtownUser(pn, id, password, salt,
										name, groupName, confirmEmail, facebookFeed, enabled,
										AuthorityUtils.NO_AUTHORITIES);
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

	public void createUserSellerAndAuthority(JtownUser jtownUser) {
		createUserSeller(jtownUser);
		addUserToGroup(jtownUser.getPn(), "Seller");
	}

	public void createUserCustomAndAuthority(JtownUser jtownUser) {
		jtownUser.setConfirmEmail(false);
		creatUserCustomer(jtownUser);
		addUserToGroup(jtownUser.getPn(), "Customer");
		loginService.confirmingEmailAddress(jtownUser);
	}

	public void createUserAdminAndAuthority(JtownUser jtownUser) {
		createUserAdmin(jtownUser);
		addUserToGroup(jtownUser.getPn(), "Administartor");
	}

	public void createUserSocialAndAuthority(JtownUser jtownUser) {
		String username = jtownUser.getUsername();
		boolean exist = loginService.selectCheckExistEmail(username);
		if (!exist) {
			jtownUser.setPassword(RandomUtil.randomPassword(12));
			jtownUser.setConfirmEmail(true);
			creatUserCustomer(jtownUser);
			addUserToGroup(jtownUser.getPn(), "Customer");
		} else {
			JtownUser getJtownUser = (JtownUser) loadUserByUsername(username);
			jtownUser.setPn(getJtownUser.getPn());
		}
	}

	@Override
	public void changePassword(String oldPassword, String newPassword)
			throws AuthenticationException {
		Authentication currentUser = SecurityContextHolder.getContext()
				.getAuthentication();

		if (currentUser == null) {
			// This would indicate bad coding somewhere
			throw new AccessDeniedException(
					"Can't change password as no Authentication object found in context "
							+ "for current user.");
		}

		String username = currentUser.getName();

		JtownUser jtownUser = (JtownUser) loadUserByUsername(username);

		// PasswordEncoder SaltSource
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss",
				Locale.KOREA);
		Date date = new Date();
		String salt = sdf.format(date);
		jtownUser.setSalt(salt);

		String encodedPassword = passwordEncoder.encodePassword(newPassword,
				saltSource.getSalt(jtownUser));
		jtownUser.setNewPassword(encodedPassword);

		loginService.updateChangePassword(jtownUser);

		SecurityContextHolder.getContext().setAuthentication(
				createNewAuthentication(currentUser, newPassword));

		userCache.removeUserFromCache(username);
	}

	public String changeTempPassword(String username) {
		String tempPassword = RandomUtil.randomPassword(8);

		JtownUser jtownUser = (JtownUser) loadUserByUsername(username);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss",
				Locale.KOREA);
		Date date = new Date();
		String salt = sdf.format(date);
		jtownUser.setSalt(salt);

		String encodedPassword = passwordEncoder.encodePassword(tempPassword,
				saltSource.getSalt(jtownUser));
		jtownUser.setNewPassword(encodedPassword);

		loginService.updateChangePassword(jtownUser);

		return tempPassword;
	}

	public boolean confirmPassword(JtownUser jtownUser) {
		Authentication currentUser = SecurityContextHolder.getContext()
				.getAuthentication();

		String username = currentUser.getName();
		String oldPassword = jtownUser.getPassword();

		JtownUser confirmUserInfo = (JtownUser) loadUserByUsername(username);

		String encodedPassword = passwordEncoder.encodePassword(oldPassword,
				saltSource.getSalt(confirmUserInfo));

		if (encodedPassword.equals(confirmUserInfo.getPassword())) {
			return false;
		} else {
			return true;
		}
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

		String encodedPassword = passwordEncoder.encodePassword(
				jtownUser.getPassword(), saltSource.getSalt(jtownUser));
		jtownUser.setPassword(encodedPassword);

		loginService.insertCreatUserCustomer(jtownUser);
	}

	private void createUserSeller(JtownUser jtownUser) {
		// PasswordEncoder SaltSource
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss",
				Locale.KOREA);
		Date date = new Date();
		String salt = sdf.format(date);
		jtownUser.setSalt(salt);

		String ran = new SimpleDateFormat("yyyyMMddHHmmss", Locale.KOREA)
				.format(date);
		jtownUser.setUsername("seller" + ran);
		jtownUser.setPassword("seller" + ran);

		logger.debug(jtownUser.toString());

		String encodedPassword = passwordEncoder.encodePassword(
				jtownUser.getPassword(), saltSource.getSalt(jtownUser));
		jtownUser.setPassword(encodedPassword);

		loginService.insertCreateUserSeller(jtownUser);
	}

	private void createUserAdmin(JtownUser jtownUser) {
		// validateUserDetails(jtownUser);

		// PasswordEncoder SaltSource
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss",
				Locale.KOREA);
		Date date = new Date();
		String salt = sdf.format(date);
		jtownUser.setSalt(salt);

		String ran = new SimpleDateFormat("yyyyMMddHHmmss", Locale.KOREA)
				.format(date);
		jtownUser.setUsername("admin" + ran);
		jtownUser.setPassword("admin" + ran);

		logger.debug(jtownUser.toString());

		String encodedPassword = passwordEncoder.encodePassword(
				jtownUser.getPassword(), saltSource.getSalt(jtownUser));
		jtownUser.setPassword(encodedPassword);

		loginService.insertCreatUserAdmin(jtownUser);
	}

	private void addUserToGroup(Integer userPn, String groupName) {
		logger.debug("Adding user '" + userPn + "' to group '" + groupName
				+ "'");
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

	public void deleteUserCustomer(JtownUser jtownUser) {
		Integer pn = jtownUser.getPn();
		String username = jtownUser.getUsername();
		getJdbcTemplate().update("DELETE FROM users WHERE pn = ?", pn);
		userCache.removeUserFromCache(username);
	}

}
