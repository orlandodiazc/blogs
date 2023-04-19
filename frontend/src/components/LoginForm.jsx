import { useState } from 'react'
import PropTypes from 'prop-types'

export default function LoginForm({ handleLogin }) {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	function handleSubmit(ev) {
		ev.preventDefault()
		handleLogin(username, password)
		setUsername('')
		setPassword('')
	}
	return (
		<form onSubmit={handleSubmit} method="post">
			<div>
				<label>
					username:{' '}
					<input
						onChange={(ev) => setUsername(ev.target.value)}
						value={username}
						name="Username"
						type="text"
					/>
				</label>
			</div>
			<div>
				<label>
					password:{' '}
					<input
						onChange={(ev) => setPassword(ev.target.value)}
						value={password}
						name="Password"
						type="password"
					/>
				</label>
			</div>

			<button type="submit">Login</button>
		</form>
	)
}

LoginForm.propTypes = { handleLogin: PropTypes.func.isRequired }
