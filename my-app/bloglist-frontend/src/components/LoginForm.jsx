const LoginForm = ({
  handleSubmit,
  username,
  handleUsernameChange,
  handlePasswordChange,
  password
}) => {
  return (
    <div>
      <h2>Log in to application</h2>

      <form onSubmit={handleSubmit}>
        <div>
                    username
          <input
            data-testid='username'
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
                    password
          <input
            data-testid='password'
            value={password}
            type="password"
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">login</button>
      </form>

    </div>
  )
}

export default LoginForm