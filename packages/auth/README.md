# DANS Authentication package
Uses its own Redux store for authentication management. Manages authentication and user settings.

### AuthWrapper
User this as a wrapper for your application. Needs props for OIDC authProvider.

    import { AuthWrapper } from '@dans-framework/auth'

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

    import { AuthRoute } from '@dans-framework/auth'

    <AuthRoute>
      <Route {...} />
    </AuthRoute>

### SignInCallback
Component to be used within a Route. Return location for OIDC login attempts.

    import { SignInCallback } from '@dans-framework/auth'

    <Route path="signin-callback" element={<SignInCallback />} />

### UserMenu
Displays the user menu or a login button when a user is not logged in. Used by layout component `<MenuBar />`.

    import { UserMenu } from '@dans-framework/auth'

    <UserMenu />

### LoginButton
Displays a login button which redirects to the OIDC provider.

    import { LoginButton } from '@dans-framework/auth'

    <LoginButton />

### UserSubmissions
TBD. Displays a current users metadata submissions. Needs to be a child of `<AuthRoute />`.

    import { UserSubmissions } from '@dans-framework/auth'

    <Route path="user-submissions" element={
      <AuthRoute>
        <UserSubmissions />
      </AuthRoute>
    } />

### UserSettings
Displays a current users settings, like API keys. Needs to be a child of `<AuthRoute />`. Takes `targetKeyIdentifiers` as props, usually set in the form config. This is an array of strings the component uses as keys to pull data from a user profile.

    import { UserSettings } from '@dans-framework/auth'

    <Route path="user-settings" element={
      <AuthRoute>
        <UserSettings targetKeyIdentifiers={['']} />
      </AuthRoute>
    } />

### getUserProfile
Helper function to get the current users profile information.

    import { getUserProfile } from '@dans-framework/auth'

    const { data } = getUserProfile();

### i18n
Exposes the Auth components language config. Use this in the main apps language config.

    import { i18n as i18nAuth } from '@dans-framework/auth'
