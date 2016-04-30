/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global Amaro, Router*/
var app = app || {};

(function () {
	'use strict';

	app.ALL_TODOS = 'all';
	app.ACTIVE_TODOS = 'active';
	app.COMPLETED_TODOS = 'completed';

	var ENTER_KEY = 13;

	function TodoApp (element) {
		Amaro.Component.call(this, element);

		this.activeTodoCount = 0;

		this.completedCount = 0;

		this.shownTodos = [];

	}
	TodoApp.prototype = Object.create(Amaro.Component.prototype);
	TodoApp.prototype.constructor = TodoApp;

	TodoApp.defaults = {
		nowShowing: app.ALL_TODOS,
		editing: null,
		newTodo: ''
	};

	Object.assign(TodoApp.prototype, {

		componentDidMount: function () {
			var setState = this.setState;
			var router = Router({
				'/': setState.bind(this, {nowShowing: app.ALL_TODOS}),
				'/active': setState.bind(this, {nowShowing: app.ACTIVE_TODOS}),
				'/completed': setState.bind(this, {nowShowing: app.COMPLETED_TODOS})
			});
			router.init('/');
		},

		componentWillUpdate: function (nextState) {
			var todos = nextState.model.todos;
			this.activeTodoCount = todos.reduce(function (accum, todo) {
				return todo.completed ? accum : accum + 1;
			}, 0);
			this.completedCount = todos.length - this.activeTodoCount;
			this.shownTodos = todos.filter(function (todo) {
				switch (this.state.nowShowing) {
				case app.ACTIVE_TODOS:
					return !todo.completed;
				case app.COMPLETED_TODOS:
					return todo.completed;
				default:
					return true;
				}
			}, this);
		},

		handleChange: function (event) {
			this.setState({newTodo: event.target.value});
		},

		handleNewTodoKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}

			event.preventDefault();

			var val = this.state.newTodo.trim();

			if (val) {
				this.state.model.addTodo(val);
				this.setState({newTodo: ''});
			}
		},

		toggleAll: function (event) {
			var checked = event.target.checked;
			this.state.model.toggleAll(checked);
		},

		toggle: function (todoToToggle) {
			this.state.model.toggle(todoToToggle);
		},

		destroy: function (todo) {
			this.state.model.destroy(todo);
		},

		edit: function (todo) {
			this.setState({editing: todo.id});
		},

		save: function (todoToSave, text) {
			this.state.model.save(todoToSave, text);
			this.setState({editing: null});
		},

		cancel: function () {
			this.setState({editing: null});
		},

		clearCompleted: function () {
			this.state.model.clearCompleted();
		}

	});

	var model = new app.TodoModel('amaro-todos');
	var element = document.getElementsByClassName('todoapp')[0];

	Amaro.components({ TodoItem: app.TodoItem });
	app.todoApp = Amaro.mount(element, TodoApp, { model: model });

	function render() {
		app.todoApp.setState();
	}

	model.subscribe(render);
})();
