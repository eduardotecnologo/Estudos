requirejs(['firebase-config'], function(config){
	var firebaseApp = firebase.initializeApp(config);
	var db = firebaseApp.database();
	var chatComponent = Vue.extend({
		template: `
		<div class="panel panel-success">
		<div class="panel-heading">Chat com VueJS e FireBase</div>
		<div class="panel-body">
		<ul class="chat list-unstyled">
		<li class="clearfix" v-bind:class="{left: !isUser(o.email), right: isUser(o.email)}" v-for="o in messages">
		<span v-bind:class="{'pull-left': !isUser(o.email), 'pull-right': isUser(o.email)}">
		<img v-bind:src="o.photo" class="img-circle"/>
		</span>
		<div class="chat-body">
		<strong>{{ o.name }}</strong>
		<p>{{ o.text }}</p>
		</div>
		</li>
		</ul>
		</div>
		<div class="panel-footer">
		<div class="input-group">
		<input type="text" class="form-control input-md" placeholder="Digite sua mensagem" v-model="message" @keyup.enter="sendMessage"/>
		<span class="input-group-btn">
		<button class="btn btn-success btn-md" @click="sendMessage">Enviar</button>
		</span>
		</div>
		</div>
		</div>
		`,

		created: function() {
			var roomRef = 'chat/rooms/' + this.$route.params.room;
			this.$bindAsArray('messages', db.ref(roomRef + '/messages'));
		},
		data: function(){
			return{
				user: {
					email: localStorage.getItem('email'),
					name: localStorage.getItem('name'),
					photo: localStorage.getItem('photo')
				},
				message: ''
			};
		},
		methods: {
			isUser: function(email){
				return this.user.email == email;
			},
			sendMessage: function(){
				this.$firebaseRefs.messages.push({
					name: this.user.name,
					email: this.user.email,
					text: this.message,
					photo: this.user.photo
				});
			}
		}
	});	

	var roomsComponent = Vue.extend({
		template: `
		<div class="col-md-4" v-for="o in rooms">
		<div id="rooms" class="panel panel-success">
		<div class="panel-heading">
		{{ o.name }}
		</div>
		<div class="panel-body">
		{{ o.description }}
		</br>
		<a href="javascript:void(0)" @click="openModal(o)">Entrar</a>
		</div>
		</div>
		</div>



		<div class="modal fade" id="modalLoginEmail" tabindex="-1" role="dialog" arial-labelledby="modalLoginEmail">
		<div class="modal-dialog" role="document">
		<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" arial-label="Close"><span arial-hidden="true">&times;</span></button>
		<h4 class="modal-title" id="exampleModalLabel">Entre com as informações</h4>
		</div>
		<div class="modal-body">
		<form>
		<div class="form-group">
		<input type="text" class="form-control" name="email" v-model="email" placeholder="E-mail"/>	
		</div>
		<div class="form-group">
		<input type="text" class="form-control" name="name" v-model="name" placeholder="Nome"/>
		</div>
		</form>
		</div>
		<div class="modal-footer">
		<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
		<button type="button" class="btn btn-success" @click="login">Login</button>
		</div>
		</div>
		</div>
		</div>

		`,

		firebase: {
			rooms: db.ref('chat/rooms')
		},

		data: function(){
			return{
				rooms: [
				{id: "001", name: "PHP", description: "Manolo do PHP"},
				{id: "002", name: "Javascript", description: "Manolo do Javascript"},
				{id: "003", name: "Java", description: "Manolo do Java"},
				{id: "004", name: "Xamarin", description: "Manolo do Xamarin"},
				{id: "005", name: "Ruby", description: "Manolo do Ruby"},
				{id: "006", name: "C#", description: "Manolo do C#"},
				],
				name: '',
				email: '',
				room: null
			};
			
		},
		methods: {
			login: function(){
				localStorage.setItem('name', this.name);
				localStorage.setItem('email', this.email);
				localStorage.setItem('photo','http://www.gravatar.com/avatar/'+md5(this.email)+'.jpg');
				$('#modalLoginEmail').modal('hide');
				this.$route.router.go('/chat/'+this.room.id);
			},
			openModal: function(room){
				this.room = room;
				$('#modalLoginEmail').modal('show');
			}
		}
	});

	var rooms = [
	{id: "001", name: "PHP", description: "Manolo do PHP"},
	{id: "002", name: "Javascript", description: "Manolo do Javascript"},
	{id: "003", name: "Java", description: "Manolo do Java"},
	{id: "004", name: "Xamarin", description: "Manolo do Xamarin"},
	{id: "005", name: "Ruby", description: "Manolo do Ruby"},
	{id: "006", name: "C#", description: "Manolo do C#"},
	];

	var roomsCreateComponent = Vue.extend({
		template: `<ul>
		<li v-for="o in rooms">
		{{o.name}}
		</li>
		</ul>
		`,

		firebase: {
			rooms: db.ref('chat/rooms')
		},
		ready: function(){
			var chatRef = db.ref('chat')
			var roomsChildren = chatRef.child('rooms');
			rooms.forEach(function(room){
				roomsChildren.child(room.id).set({
					name: room.name,
					description: room.description
				});
			})

		}
	});

	var appComponent = Vue.extend({});

	var router = new VueRouter();

	router.map({
		'/chat/:room': {
			component: chatComponent
		},
		'/rooms': {
			component: roomsComponent
		},
		'/rooms-create': {
			component: roomsCreateComponent
		}
	});

	router.start(appComponent, "#app");
});
