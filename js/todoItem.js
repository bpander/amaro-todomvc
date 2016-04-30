/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global Amaro */
var app = app || {};

(function () {
	'use strict';

	var ESCAPE_KEY = 27;
	var ENTER_KEY = 13;

	app.TodoItem = function TodoItem (element) {
		Amaro.Component.call(this, element);
	}
	app.TodoItem.prototype = Object.create(Amaro.Component.prototype);
	app.TodoItem.prototype.constructor = app.TodoItem;

	app.TodoItem.defaults = {
		editText: ''
	};

	Object.assign(app.TodoItem.prototype, {
		handleSubmit: function (event) {
			var val = this.state.editText.trim();
			if (val) {
				this.state.onSave(val);
				this.setState({editText: val});
			} else {
				this.state.onDestroy();
			}
		},

		handleEdit: function () {
			this.state.onEdit();
			this.setState({editText: this.state.todo.title});
		},

		handleKeyDown: function (event) {
			if (event.which === ESCAPE_KEY) {
				this.setState({editText: this.state.todo.title});
				this.state.onCancel(event);
			} else if (event.which === ENTER_KEY) {
				this.handleSubmit(event);
			}
		},

		handleChange: function (event) {
			if (this.state.editing) {
				this.setState({editText: event.target.value});
			}
		},

		getInitialState: function () {
			return {editText: this.state.todo.title};
		},

		/**
		 * This is a completely optional performance enhancement that you can
		 * implement on any Amaro component. If you were to delete this method
		 * the app would still work correctly (and still be very performant!), we
		 * just use it as an example of how little code it takes to get an order
		 * of magnitude performance improvement.
		 */
		shouldComponentUpdate: function (nextState) {
			return (
				nextState.todo !== this.state.todo ||
				nextState.editing !== this.state.editing ||
				nextState.editText !== this.state.editText
			);
		},

		/**
		 * Safely manipulate the DOM after updating the state when invoking
		 * `this.state.onEdit()` in the `handleEdit` method above.
		 * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
		 * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
		 */
		componentDidUpdate: function (prevState) {
			if (!prevState.editing && this.state.editing) {
				var node = this.element.querySelector('[data-ref="editField"]');
				node.focus();
				node.setSelectionRange(node.value.length, node.value.length);
			}
		}
	});
})();
