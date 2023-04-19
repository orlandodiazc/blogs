export default function LoggedIn({ name }) {
	function logoutHandler() {
		window.localStorage.removeItem('blogsUser')
		window.location.reload(false)
	}
	return (
		<>
			<p>{name} logged in</p>
			<button type="button" onClick={logoutHandler}>
				logout
			</button>
		</>
	)
}
