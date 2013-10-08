package com.bg.jtown.security;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.authentication.dao.SaltSource;
import org.springframework.security.authentication.encoding.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.util.Assert;

import com.bg.jtown.util.DateUtil;
import com.bg.jtown.util.RandomUtil;

/**
 * @author 박광열, Francis
 * 
 */
public class CustomJdbcUserDetailManager extends JdbcUserDetailsManager {

	protected final Logger logger = LoggerFactory.getLogger(getClass());

	// ~ Query

	private static final String LOAD_USERS_BY_USERNAME_QUERY = ""
			+ "SELECT "
			+ "	u.id, u.password, u.enable, DATE_FORMAT(u.salt, '%Y-%m-%d %H:%i:%s') AS salt, "
			+ "	u.pn, gmn.group_name, u.name, u.confirm_email, u.facebook_feed FROM users u, group_members_name gmn "
			+ "WHERE u.id = ? AND u.pn = gmn.user_pn";

	private static final String LOAD_GROUP_AUTHORITIES_QUERY = ""
			+ "SELECT g.id, g.group_name, ga.authority "
			+ "FROM groups g, group_members gm, group_authorities ga "
			+ "WHERE gm.user_pn = (select pn from users where id = ?) AND g.id = ga.group_id AND g.id = gm.group_id";

	// ~ Variable

	private static final String CUSTOMER = "Customer";
	private static final String SELLER = "Seller";
	private static final String ADMIN = "Administrator";
	private static final Integer RANDOM_PASSWORD_LENGTH = 12;

	// ~ Dynamic Injection

	private PasswordEncoder passwordEncoder;
	private SaltSource saltSource;
	private LoginService loginService;

	@Inject
	private void config(PasswordEncoder passwordEncoder, SaltSource saltSource,
			LoginService loginService) {
		this.passwordEncoder = passwordEncoder;
		this.saltSource = saltSource;
		this.loginService = loginService;
	}

	// ~ Login

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
				userFromUserQuery.getConfirmEmail(),
				userFromUserQuery.getFacebookFeed(),
				userFromUserQuery.isEnabled(), combinedAuthorities);
	}

	@SuppressWarnings("deprecation")
	@Override
	public UserDetails loadUserByUsername(String username)
			throws UsernameNotFoundException {
		List<UserDetails> users = loadUsersByUsername(username);

		if (users.size() == 0) {
			logger.debug("Query returned no results for user " + username);

			throw new UsernameNotFoundException(messages.getMessage(
					"JdbcDaoImpl.notFound", new Object[] { username },
					"Username {0} not found"), username);
		}

		JtownDetails user = (JtownDetails) users.get(0);

		Set<GrantedAuthority> dbAuthsSet = new HashSet<GrantedAuthority>();
		dbAuthsSet.addAll(loadGroupAuthorities(user.getUsername()));
		List<GrantedAuthority> dbAuths = new ArrayList<GrantedAuthority>(
				dbAuthsSet);
		addCustomAuthorities(user.getUsername(), dbAuths);

		if (dbAuths.size() == 0) {
			logger.debug("User " + username + " has no authorities");

			throw new UsernameNotFoundException(messages.getMessage(
					"JdbcDaoImpl.noAuthority", new Object[] { username },
					"User {0} has no GrantedAuthority"), username);
		}

		return createUserDetails(username, user, dbAuths);
	}

	@Override
	protected List<UserDetails> loadUsersByUsername(String username) {
		return getJdbcTemplate().query(LOAD_USERS_BY_USERNAME_QUERY,
				new String[] { username }, new RowMapper<UserDetails>() {
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

						return new JtownUser(pn, id, password, salt, name,
								groupName, confirmEmail, facebookFeed, enabled,
								AuthorityUtils.NO_AUTHORITIES);
					}
				});
	}

	@Override
	protected List<GrantedAuthority> loadGroupAuthorities(String username) {
		return getJdbcTemplate().query(LOAD_GROUP_AUTHORITIES_QUERY,
				new String[] { username }, new RowMapper<GrantedAuthority>() {
					public GrantedAuthority mapRow(ResultSet rs, int rowNum)
							throws SQLException {
						String roleName = getRolePrefix() + rs.getString(3);

						return new SimpleGrantedAuthority(roleName);
					}
				});
	}

	// ~ Customer

	public void createUserCustomAndAuthority(final JtownUser jtownUser) {
		jtownUser.setConfirmEmail(false);
		jtownUser.setFacebookFeed(true);
		setEncodedPassword(jtownUser, jtownUser.getPassword());
		loginService.insertCreatUserCustomer(jtownUser);

		addUserToGroup(jtownUser.getPn(), CUSTOMER);

		loginService.confirmingEmailAddress(jtownUser);
	}

	public void createUserSocialAndAuthority(JtownUser jtownUser) {
		String username = jtownUser.getUsername();
		boolean exist = loginService.selectCheckExistEmail(username);
		if (!exist) {
			String password = RandomUtil.randomPassword(RANDOM_PASSWORD_LENGTH);
			jtownUser.setConfirmEmail(true);
			jtownUser.setFacebookFeed(true);
			setEncodedPassword(jtownUser, password);
			loginService.insertCreatUserCustomer(jtownUser);
			addUserToGroup(jtownUser.getPn(), CUSTOMER);
		} else {
			JtownUser getJtownUser = (JtownUser) loadUserByUsername(username);
			jtownUser.setPn(getJtownUser.getPn());
		}
	}

	// ~ Seller

	public void createUserSellerAndAuthority(JtownUser jtownUser) {
		String name = "seller" + DateUtil.getSysdate("yyyyMMddHHmmss");
		jtownUser.setFacebookFeed(false);
		jtownUser.setUsername(name);
		setEncodedPassword(jtownUser, name);
		loginService.insertCreateUserSeller(jtownUser);

		addUserToGroup(jtownUser.getPn(), SELLER);
	}

	// ~ Administrator

	public void createUserAdminAndAuthority(JtownUser jtownUser) {
		jtownUser.setFacebookFeed(false);
		setEncodedPassword(jtownUser, jtownUser.getPassword());
		loginService.insertCreatUserAdmin(jtownUser);
		addUserToGroup(jtownUser.getPn(), ADMIN);
	}

	// ~ Common

	public void changePassword(JtownUser jtownUser) {
		setEncodedPassword(jtownUser, jtownUser.getNewPassword());
		loginService.updateChangePassword(jtownUser);
	}

	public String changeTempPassword(String username) {
		JtownUser jtownUser = new JtownUser();
		jtownUser.setUsername(username);
		String tempPassword = RandomUtil.randomPassword(RANDOM_PASSWORD_LENGTH);

		setEncodedPassword(jtownUser, tempPassword);
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

	private void setEncodedPassword(JtownUser jtownUser, String password) {
		jtownUser.setSalt(DateUtil.getSysdate("yyyy-MM-dd HH:mm:ss"));

		String encodedPassword = passwordEncoder.encodePassword(password,
				saltSource.getSalt(jtownUser));
		jtownUser.setPassword(encodedPassword);
	}

	private void addUserToGroup(Integer userPn, String groupName) {
		Assert.hasText(userPn.toString());
		Assert.hasText(groupName);

		final int id = findGroupId(groupName);

		Map<String, Integer> groupMap = new HashMap<String, Integer>();
		groupMap.put("groupId", id);
		groupMap.put("userPn", userPn);

		loginService.addUserToGroup(groupMap);
	}

	private int findGroupId(String group) {
		return loginService.findGroupId(group);
	}

}
