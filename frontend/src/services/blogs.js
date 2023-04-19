import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
	token = `Bearer ${newToken}`
}

const getConfig = () => {
	return { headers: { Authorization: token } }
}

const addBlog = async (newBlog) => {
	const response = await axios.post(baseUrl, newBlog, getConfig())
	return response.data
}

const updateLike = async (id, blog) => {
	const response = await axios.put(`${baseUrl}/${id}`, blog, getConfig())
	return response
}

const removeBlog = async (id) => {
	const response = await axios.delete(`${baseUrl}/${id}`, getConfig())
	return response
}

const getAll = async () => {
	const response = await axios.get(baseUrl)
	return response.data
}

export default { getAll, addBlog, setToken, updateLike, removeBlog }
