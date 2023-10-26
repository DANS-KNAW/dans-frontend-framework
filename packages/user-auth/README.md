# DANS Authentication package
Uses its own Redux store for authentication management. Manages authentication and user settings.

### AuthWrapper
User this as a wrapper for your application. Needs props for OIDC authProvider.

    import { AuthWrapper } from '@dans-framework/user-auth'

    <AuthWrapper
      authProvider={
        authority: '', // URL of OIDC provider
        client_id: '', // App ID from OIDC provider
        scope: '', // Scope requested from OIDC provider
        redirect_uri: `${window.location.origin}/signin-callback`, // OIDC callback route of your app
        loadUserInfo: true // whether or not to load logged in users info
      }
    >
      // rest of your app
    </AuthWrapper>

### AuthRoute
Wrapper for routes that should be accessible only to logged in users

    import { AuthRoute } from '@dans-framework/user-auth'

    <AuthRoute>
      <Route {...} />
    </AuthRoute>

### SignInCallback
Component to be used within a Route. Return location for OIDC login attempts.

    import { SignInCallback } from '@dans-framework/user-auth'

    <Route path="signin-callback" element={<SignInCallback />} />

### UserMenu
Displays the user menu or a login button when a user is not logged in. Used by layout component `<MenuBar />`.

    import { UserMenu } from '@dans-framework/user-auth'

    <UserMenu />

### LoginButton
Displays a login button which redirects to the OIDC provider.

    import { LoginButton } from '@dans-framework/user-auth'

    <LoginButton />

### UserSubmissions
TBD. Displays a current users metadata submissions. Needs to be a child of `<AuthRoute />`.

    import { UserSubmissions } from '@dans-framework/user-auth'

    <Route path="user-submissions" element={
      <AuthRoute>
        <UserSubmissions />
      </AuthRoute>
    } />

### UserSettings
Displays a current users settings, like API keys. Needs to be a child of `<AuthRoute />`. Takes `target` as props, usually set in the form config. This is an array of target objects the component uses for form submission authentication.

    import { UserSettings } from '@dans-framework/user-auth'

    <Route path="user-settings" element={
      <AuthRoute>
        <UserSettings target={[
            name: '', // user readable name for the target repository, e.g. 'Dataverse'
            repo: '', // the destination of the submission, as configured in the submission processing server, e.g. ssh.datastations.nl
            authKey: '', // key that the app needs to pull from the keycloak user profile
            auth: '', // type of authentication that the target repository requires. Depends on config of submission processing server, usually API_KEY.
            keyUrl: '' // URL where user can get their API key for this target repo
        ]} />
      </AuthRoute>
    } />

Note: docs on setting keys in Keycloak, todo. In short: select realm -> client -> client scopes -> dedicated scope -> add mapper -> set user attribute and token claim name to be the same as the authKey.

### fetchUserProfile
Helper function to get the current users profile information. Exposes the Auth library's Redux store.

    import { fetchUserProfile } from '@dans-framework/user-auth'

    const { data } = fetchUserProfile({
        provider: '', // URL of OIDC provider/authority
        id: '' // OIDC client id
    });

### i18n
Exposes the Auth components language config. Use this in the main apps language config.

    import { i18n as i18nAuth } from '@dans-framework/user-auth'
