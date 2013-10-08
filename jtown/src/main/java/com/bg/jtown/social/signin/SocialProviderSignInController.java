package com.bg.jtown.social.signin;

import java.util.Collections;
import java.util.List;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.GenericTypeResolver;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.ConnectionFactory;
import org.springframework.social.connect.ConnectionFactoryLocator;
import org.springframework.social.connect.UsersConnectionRepository;
import org.springframework.social.connect.support.OAuth1ConnectionFactory;
import org.springframework.social.connect.support.OAuth2ConnectionFactory;
import org.springframework.social.connect.web.ConnectInterceptor;
import org.springframework.social.connect.web.ConnectSupport;
import org.springframework.social.connect.web.ProviderSignInAttempt;
import org.springframework.social.connect.web.ProviderSignInController;
import org.springframework.social.connect.web.ProviderSignInUtils;
import org.springframework.social.connect.web.SignInAdapter;
import org.springframework.social.support.URIBuilder;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.view.RedirectView;

@Controller
@RequestMapping("/signin")
public class SocialProviderSignInController {

	private final static Logger logger = LoggerFactory.getLogger(ProviderSignInController.class);

	private final MultiValueMap<Class<?>, ConnectInterceptor<?>> interceptors = new LinkedMultiValueMap<Class<?>, ConnectInterceptor<?>>();
	
	private final ConnectionFactoryLocator connectionFactoryLocator;

	private final UsersConnectionRepository usersConnectionRepository;
	
	private final SignInAdapter signInAdapter;

	private String signInUrl = "/signin";
	
	private String signUpUrl = "/signup";

	private String postSignInUrl = "/";

	private final ConnectSupport webSupport = new ConnectSupport();

	/**
	 * Creates a new provider sign-in controller.
	 * @param connectionFactoryLocator the locator of {@link ConnectionFactory connection factories} used to support provider sign-in.
	 * Note: this reference should be a serializable proxy to a singleton-scoped target instance.
	 * This is because {@link ProviderSignInAttempt} are session-scoped objects that hold ConnectionFactoryLocator references.
	 * If these references cannot be serialized, NotSerializableExceptions can occur at runtime.
	 * @param usersConnectionRepository the global store for service provider connections across all users.
	 * Note: this reference should be a serializable proxy to a singleton-scoped target instance.
	 * @param signInAdapter handles user sign-in
	 */
	@Inject
	public SocialProviderSignInController(ConnectionFactoryLocator connectionFactoryLocator, UsersConnectionRepository usersConnectionRepository, SignInAdapter signInAdapter) {
		this.connectionFactoryLocator = connectionFactoryLocator;
		this.usersConnectionRepository = usersConnectionRepository;
		this.signInAdapter = signInAdapter;
		this.webSupport.setUseAuthenticateUrl(true);
	}
	/**
	 * Configure the list of interceptors that should receive callbacks during
	 * the connection process. Convenient when an instance of this class is
	 * configured using a tool that supports JavaBeans-based configuration.
	 * 
	 * @param interceptors
	 *            the connect interceptors to add
	 */
	public void setInterceptors(List<ConnectInterceptor<?>> interceptors) {
		for (ConnectInterceptor<?> interceptor : interceptors) {
			addInterceptor(interceptor);
		}
	}

	/**
	 * Adds a ConnectInterceptor to receive callbacks during the connection
	 * process. Useful for programmatic configuration.
	 * 
	 * @param interceptor
	 *            the connect interceptor to add
	 */
	public void addInterceptor(ConnectInterceptor<?> interceptor) {
		Class<?> serviceApiType = GenericTypeResolver.resolveTypeArgument(interceptor.getClass(), ConnectInterceptor.class);
		interceptors.add(serviceApiType, interceptor);
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	private void preConnect(ConnectionFactory<?> connectionFactory,
			MultiValueMap<String, String> parameters, WebRequest request) {
		for (ConnectInterceptor interceptor : interceptingConnectionsTo(connectionFactory)) {
			interceptor.preConnect(connectionFactory, parameters, request);
		}
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	private void postConnect(ConnectionFactory<?> connectionFactory,
			Connection<?> connection, WebRequest request) {
		for (ConnectInterceptor interceptor : interceptingConnectionsTo(connectionFactory)) {
			interceptor.postConnect(connection, request);
		}
	}

	private List<ConnectInterceptor<?>> interceptingConnectionsTo(ConnectionFactory<?> connectionFactory) {
		Class<?> serviceType = GenericTypeResolver.resolveTypeArgument(connectionFactory.getClass(), ConnectionFactory.class);
		List<ConnectInterceptor<?>> typedInterceptors = interceptors.get(serviceType);
		if (typedInterceptors == null) {
			typedInterceptors = Collections.emptyList();
		}
		return typedInterceptors;
	}
	


	/**
	 * Sets the URL of the application's sign in page.
	 * Defaults to "/signin".
	 * @param signInUrl the signIn URL
	 */
	public void setSignInUrl(String signInUrl) {
		this.signInUrl = signInUrl;
	}
	
	/**
	 * Sets the URL to redirect the user to if no local user account can be mapped when signing in using a provider.
	 * Defaults to "/signup". 
	 * @param signUpUrl the signUp URL
	 */
	public void setSignUpUrl(String signUpUrl) {
		this.signUpUrl = signUpUrl; 
	}

	/**
 	 * Sets the default URL to redirect the user to after signing in using a provider.
 	 * Defaults to "/".
	 * @param postSignInUrl the postSignIn URL
	 */
	public void setPostSignInUrl(String postSignInUrl) {
		this.postSignInUrl = postSignInUrl;
	}

	/**
	 * Configures the base secure URL for the application this controller is being used in e.g. <code>https://myapp.com</code>. Defaults to null.
	 * If specified, will be used to generate OAuth callback URLs.
	 * If not specified, OAuth callback URLs are generated from web request info.
	 * You may wish to set this property if requests into your application flow through a proxy to your application server.
	 * In this case, the request URI may contain a scheme, host, and/or port value that points to an internal server not appropriate for an external callback URL.
	 * If you have this problem, you can set this property to the base external URL for your application and it will be used to construct the callback URL instead.
	 * @param applicationUrl the application URL value
	 */
	public void setApplicationUrl(String applicationUrl) {
		webSupport.setApplicationUrl(applicationUrl);
	}

	/**
	 * Process a sign-in form submission by commencing the process of establishing a connection to the provider on behalf of the user.
	 * For OAuth1, fetches a new request token from the provider, temporarily stores it in the session, then redirects the user to the provider's site for authentication authorization.
	 * For OAuth2, redirects the user to the provider's site for authentication authorization.
	 */
	@RequestMapping(value="/{providerId}", method=RequestMethod.POST)
	public RedirectView signIn(@PathVariable String providerId, NativeWebRequest request) {
		ConnectionFactory<?> connectionFactory = connectionFactoryLocator.getConnectionFactory(providerId);
		MultiValueMap<String, String> parameters = new LinkedMultiValueMap<String, String>(); 
		preConnect(connectionFactory, parameters, request);
		try {
			return new RedirectView(webSupport.buildOAuthUrl(connectionFactory, request));
		} catch (Exception e) {
			return redirect(URIBuilder.fromUri(signInUrl).queryParam("error", "provider").build().toString());
		}
	}

	/**
	 * Process the authentication callback from an OAuth 1 service provider.
	 * Called after the member authorizes the authentication, generally done once by having he or she click "Allow" in their web browser at the provider's site.
	 * Handles the provider sign-in callback by first determining if a local user account is associated with the connected provider account.
	 * If so, signs the local user in by delegating to {@link SignInAdapter#signIn(String, Connection, NativeWebRequest)}
	 * If not, redirects the user to a signup page to create a new account with {@link ProviderSignInAttempt} context exposed in the HttpSession.
	 * @see ProviderSignInAttempt
	 * @see ProviderSignInUtils 
	 */
	@RequestMapping(value="/{providerId}", method=RequestMethod.GET, params="oauth_token")
	public RedirectView oauth1Callback(@PathVariable String providerId, NativeWebRequest request) {
		try {
			OAuth1ConnectionFactory<?> connectionFactory = (OAuth1ConnectionFactory<?>) connectionFactoryLocator.getConnectionFactory(providerId);
			Connection<?> connection = webSupport.completeConnection(connectionFactory, request);
			postConnect(connectionFactory, connection, request);
			return handleSignIn(connection, request);
		} catch (Exception e) {
			return redirect(URIBuilder.fromUri(signInUrl).queryParam("error", "provider").build().toString());
		}
	}

	/**
	 * Process the authentication callback from an OAuth 2 service provider.
	 * Called after the user authorizes the authentication, generally done once by having he or she click "Allow" in their web browser at the provider's site.
	 * Handles the provider sign-in callback by first determining if a local user account is associated with the connected provider account.
	 * If so, signs the local user in by delegating to {@link SignInAdapter#signIn(String, Connection, NativeWebRequest)}.
	 * If not, redirects the user to a signup page to create a new account with {@link ProviderSignInAttempt} context exposed in the HttpSession.
	 * @see ProviderSignInAttempt
	 * @see ProviderSignInUtils 
	 */
	@RequestMapping(value="/{providerId}", method=RequestMethod.GET, params="code")
	public RedirectView oauth2Callback(@PathVariable String providerId, @RequestParam("code") String code, NativeWebRequest request) {
		try {
			OAuth2ConnectionFactory<?> connectionFactory = (OAuth2ConnectionFactory<?>) connectionFactoryLocator.getConnectionFactory(providerId);
			Connection<?> connection = webSupport.completeConnection(connectionFactory, request);
			postConnect(connectionFactory, connection, request);
			return handleSignIn(connection, request);
		} catch (Exception e) {
			logger.warn("Exception while handling OAuth2 callback (" + e.getMessage() + "). Redirecting to " + signInUrl);
			return redirect(URIBuilder.fromUri(signInUrl).queryParam("error", "provider").build().toString());
		}
	}
	
	/**
	 * Process the authentication callback when neither the oauth_token or code parameter is given, likely indicating that the user denied authorization with the provider.
	 * Redirects to application's sign in URL, as set in the signInUrl property.
	 */
	@RequestMapping(value="/{providerId}", method=RequestMethod.GET)
	public RedirectView canceledAuthorizationCallback() {
		return redirect(signInUrl);
	}

	// internal helpers

	private RedirectView handleSignIn(Connection<?> connection, NativeWebRequest request) {
		List<String> userIds = usersConnectionRepository.findUserIdsWithConnection(connection);
		if (userIds.size() == 0) {
			ProviderSignInAttempt signInAttempt = new ProviderSignInAttempt(connection, connectionFactoryLocator, usersConnectionRepository);
			request.setAttribute(ProviderSignInAttempt.class.getName(), signInAttempt, RequestAttributes.SCOPE_SESSION);
			return redirect(signUpUrl);
		} else if (userIds.size() == 1) {
			usersConnectionRepository.createConnectionRepository(userIds.get(0)).updateConnection(connection);
			String originalUrl = signInAdapter.signIn(userIds.get(0), connection, request);
			return originalUrl != null ? redirect(originalUrl) : redirect(postSignInUrl);
		} else {
			return redirect(URIBuilder.fromUri(signInUrl).queryParam("error", "multiple_users").build().toString());
		}
	}

	private RedirectView redirect(String url) {
		return new RedirectView(url, true);
	}
	
}
