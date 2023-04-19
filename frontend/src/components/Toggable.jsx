import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Toggable = forwardRef(({ children, buttonLabel }, refs) => {
	const [visible, setVisible] = useState(false)

	const toggleVisibility = () => {
		setVisible(!visible)
	}

	useImperativeHandle(refs, () => {
		return {
			toggleVisibility,
		}
	})

	return (
		<div>
			{!visible ? (
				<div>
					<button onClick={toggleVisibility}>{buttonLabel}</button>
				</div>
			) : (
				<div>
					{children}
					<button onClick={toggleVisibility}>cancel</button>
				</div>
			)}
		</div>
	)
})

Toggable.displayName = 'Toggable'
Toggable.propTypes = { buttonLabel: PropTypes.string.isRequired }

export default Toggable
