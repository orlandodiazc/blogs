export default function Notification({ message }) {
	if (!message) return <></>
	const notificationStyle = {
		padding: '0.8rem 0.5rem',
		backgroundColor: 'aliceblue',
		color: 'green',
		border: '1px solid green',
		borderRadius: '0.2rem',
		marginBottom: '1rem',
	}
	return (
		<div
			style={
				!message.error
					? notificationStyle
					: { ...notificationStyle, color: 'red', border: '1px solid red' }
			}
		>
			<span>{message.description}</span>
		</div>
	)
}
