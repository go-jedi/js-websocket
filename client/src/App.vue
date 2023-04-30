<template>
	<div>
		<div v-if="!isConnected" className="center">
			<div className="form">
				<input type="text" placeholder="Введите ваше имя" v-model.trim="username" />
				<button @click="connect">Войти</button>
			</div>
		</div>
		<div className="center">
			<div>
				<div className="form">
					<input type="text" v-model.trim="inputForm" />
					<button @click="sendMessage">Отправить</button>
				</div>
				<div v-for="msg in messages" className="messages" :key="msg.id">
					<div class="message">
						<b>От {{ msg.username }}:</b>{{ msg.message }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
 
<script lang="js">
import { defineComponent, ref, onMounted } from "vue"

export default defineComponent({
	setup() {
		let socket
		const username = ref("")
		const inputForm = ref("")
		const isConnected = ref(false)
		const messages = ref([])

		const connect = async () => {
			socket = new WebSocket('ws://localhost:5000')
			socket.onopen = () => {
				isConnected.value = true
				const message = {
					event: 'connection',
					username: username.value,
					id: Date.now()
				}
				socket.send(JSON.stringify(message))
			}
			socket.onmessage = (e) => {
				const data = JSON.parse(e.data)
				messages.value.push({
					id: data.id,
					username: data.username,
					message: data.message
				})
			}
			socket.onclose = () => {
				console.log("Socket закрыт")
			}
			socket.onerror = () => {
				console.log("Socket произошла ошибка")
			}
		}

		const sendMessage = async () => {
			const formData = {
				id: Date.now(),
				username: username.value,
				message: inputForm.value,
				event: 'message'
			}
			socket.send(JSON.stringify(formData))
			inputForm.value = ""
		}

		return {
			isConnected,
			username,
			connect,
			inputForm,
			sendMessage,
			messages,
		}
	}
})
</script>

<style lang="scss" scoped></style>