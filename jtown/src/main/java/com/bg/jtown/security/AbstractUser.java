package com.bg.jtown.security;

import java.io.Serializable;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

import org.springframework.security.core.CredentialsContainer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.SpringSecurityCoreVersion;
import org.springframework.util.Assert;

/**
 * <h1>{@link org.springframework.security.core.userdetails.User}<code>User</code> - Copy and Paste</h1> 
 *
 * <pre>
 * 바뀐점 {@link org.springframework.security.core.userdetails.UserDetails }<code>UserDetails</code> 을 구현 하는 것 대신에
 * {@link com.bg.jtown.security.JtownDetails }<code>JtownDetails</code> 를 구현 해서 session을 통해 몇가지 받을 데이터를 추가 시킨다.
 * </pre>
 * 
 * 추가된 변수
 * <ul>
 * 	<li>Pn[proper number] : 사용자 고유번호 auto-increment value</li>
 * 	<li>Name[shop or user] : 사용자 성명 또는 판매자 쇼핑몰 명</li>
 * 	<li>GroupName[group name] : 권한에 따른 명칭 'Customer', 'Seller', 'Administartor'</li>
 * 	<li>ConfirmEmail[confrim email ] : 사용자 이메일 인증 여부 ( false : x , true : o )</li>
 * </ul>
 * 
 * @author Francis
 *
 */
public class AbstractUser implements JtownDetails, CredentialsContainer {
	
	private static final long serialVersionUID = SpringSecurityCoreVersion.SERIAL_VERSION_UID;

    //~ Instance fields ================================================================================================
    private String password = "";
    private String salt = "";
    private Integer pn = 0;
    private String username = "";
    private String groupName = "";
    private String name = "";
    private Boolean confirmEmail = true;
    private Set<GrantedAuthority> authorities = new TreeSet<GrantedAuthority>();;
    private final boolean accountNonExpired;
    private final boolean accountNonLocked;
    private final boolean credentialsNonExpired;
    private boolean enabled = true;

    //~ Constructors ===================================================================================================

    public AbstractUser() {
    	this.accountNonExpired = true;
    	this.accountNonLocked = true;
    	this.credentialsNonExpired = true;
	}    
    
    /**
     * Calls the more complex constructor with all boolean arguments set to {@code true}.
     */
    public AbstractUser(Integer pn, String username, String password, String salt, String name, String groupName, Boolean confirmEmail, boolean enabled, Collection<? extends GrantedAuthority> authorities) {
        this(pn, username, password, salt, name, groupName, enabled, true, true, true, true, authorities);
    }

	/**
     * Construct the <code>User</code> with the details required by
     * {@link org.springframework.security.authentication.dao.DaoAuthenticationProvider}.
     *
     * @param username the username presented to the
     *        <code>DaoAuthenticationProvider</code>
     * @param password the password that should be presented to the
     *        <code>DaoAuthenticationProvider</code>
     * @param enabled set to <code>true</code> if the user is enabled
     * @param accountNonExpired set to <code>true</code> if the account has not
     *        expired
     * @param credentialsNonExpired set to <code>true</code> if the credentials
     *        have not expired
     * @param accountNonLocked set to <code>true</code> if the account is not
     *        locked
     * @param authorities the authorities that should be granted to the caller
     *        if they presented the correct username and password and the user
     *        is enabled. Not null.
     *
     * @throws IllegalArgumentException if a <code>null</code> value was passed
     *         either as a parameter or as an element in the
     *         <code>GrantedAuthority</code> collection
     */
    public AbstractUser(Integer pn, String username, String password, String salt, String name, String groupName, Boolean confirmEmail, boolean enabled, boolean accountNonExpired,
            boolean credentialsNonExpired, boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {

        if (	((username == null) || "".equals(username)) || (password == null) || 
        		((salt == null) || "".equals(salt)) || 
        		((name == null) || ("".equals(name))) || ((groupName == null) || ("".equals(groupName))) ||
        		((pn == null) || (new Integer(0).equals(pn))) || (confirmEmail == null) ) {
            throw new IllegalArgumentException("Cannot pass null or empty values to constructor");
        }
        this.pn = pn;
        this.name = name;
        this.groupName = groupName;
        this.confirmEmail =confirmEmail;
        this.username = username;
        this.password = password;
        this.salt = salt;
        this.enabled = enabled;
        this.accountNonExpired = accountNonExpired;
        this.credentialsNonExpired = credentialsNonExpired;
        this.accountNonLocked = accountNonLocked;
        this.authorities = Collections.unmodifiableSet(sortAuthorities(authorities));
    }

    //~ Methods ========================================================================================================

    public void setPn(Integer pn) {
		this.pn = pn;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setConfirmEmail(Boolean confirmEmail) {
		this.confirmEmail = confirmEmail;
	}

	public void setAuthorities(Set<GrantedAuthority> authorities) {
		this.authorities = authorities;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}
    
    public Collection<GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public String getPassword() {
        return password;
    }

    public String getSalt(){
    	return salt;
    }
    
    public String getUsername() {
        return username;
    }

	public Integer getPn() {
		return pn;
	}

	public String getGroupName() {
		return groupName;
	}

	public String getName() {
		return name;
	}

	public Boolean getConfirmEmail() {
		return confirmEmail;
	}
    
    public void setPassword(String password) {
		this.password = password;
	}

	public void setSalt(String salt) {
		this.salt = salt;
	}

	public boolean isEnabled() {
        return enabled;
    }

    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }

    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    public void eraseCredentials() {
        password = null;
    }

    private static SortedSet<GrantedAuthority> sortAuthorities(Collection<? extends GrantedAuthority> authorities) {
        Assert.notNull(authorities, "Cannot pass a null GrantedAuthority collection");
        // Ensure array iteration order is predictable (as per UserDetails.getAuthorities() contract and SEC-717)
        SortedSet<GrantedAuthority> sortedAuthorities =
            new TreeSet<GrantedAuthority>(new AuthorityComparator());

        for (GrantedAuthority grantedAuthority : authorities) {
            Assert.notNull(grantedAuthority, "GrantedAuthority list cannot contain any null elements");
            sortedAuthorities.add(grantedAuthority);
        }

        return sortedAuthorities;
    }

    private static class AuthorityComparator implements Comparator<GrantedAuthority>, Serializable {
        private static final long serialVersionUID = SpringSecurityCoreVersion.SERIAL_VERSION_UID;

        public int compare(GrantedAuthority g1, GrantedAuthority g2) {
            // Neither should ever be null as each entry is checked before adding it to the set.
            // If the authority is null, it is a custom authority and should precede others.
            if (g2.getAuthority() == null) {
                return -1;
            }

            if (g1.getAuthority() == null) {
                return 1;
            }

            return g1.getAuthority().compareTo(g2.getAuthority());
        }
    }

    /**
     * Returns {@code true} if the supplied object is a {@code User} instance with the
     * same {@code username} value.
     * <p>
     * In other words, the objects are equal if they have the same username, representing the
     * same principal.
     */
    @Override
    public boolean equals(Object rhs) {
        if (rhs instanceof AbstractUser) {
            return username.equals(((AbstractUser) rhs).username);
        }
        return false;
    }

    /**
     * Returns the hashcode of the {@code username}.
     */
    @Override
    public int hashCode() {
        return username.hashCode();
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("ProperNumber: ").append(this.pn).append("; ");
        sb.append("Username: ").append(this.username).append("; ");
        sb.append("Password: [PROTECTED]; ");
        sb.append("Salt: ").append(this.salt).append("; ");
        sb.append("Name: ").append(this.name).append("; ");
        sb.append("GroupName: ").append(this.groupName).append("; "	);
        sb.append("ConfrimEmail: ").append(this.confirmEmail).append("; ");
        sb.append("Enabled: ").append(this.enabled).append("; ");
        sb.append("AccountNonExpired: ").append(this.accountNonExpired).append("; ");
        sb.append("credentialsNonExpired: ").append(this.credentialsNonExpired).append("; ");
        sb.append("AccountNonLocked: ").append(this.accountNonLocked).append("; ");

        if (!authorities.isEmpty()) {
            sb.append("Granted Authorities: ");

            boolean first = true;
            for (GrantedAuthority auth : authorities) {
                if (!first) {
                    sb.append(",");
                }
                first = false;

                sb.append(auth);
            }
        } else {
            sb.append("Not granted any authorities");
        }

        return sb.toString();
    }
    
}
