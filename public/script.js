// CLIENT-SIDE JS


class TaskTracker {
    constructor() {
		this.initial(); // calls this upon the creation of a new instance of the TaskTracker class, which we do at the bottom of the file
	}

	initial() { // Call event handlers here

		// Add Task ("vanilla" js)
			// document.querySelector('#add-task').addEventListener('submit', (e) => {
			// 	this.addTask(e); 
			// });

		// jQuery // JS library with simplified syntax -- basically abbreviations for JS that can allow you to do more
			// document.querySelector('htmlElement') === $('htmlElement')
		$('#add-task').on('submit', (e) => {this.addTask(e)} ); 
		$('#todos').on('click', '.js-delete', (e) => {this.deleteTask(e)} ); // event, selector, do something
		$('#todos').on('click', '.js-check', (e) => {this.toggleDone(e)} );

		// This fetch and the showTasks method pull in any pre-existing data from the JSON file on load
		fetch('/getItems')
			.then(response => response.json())
			.then(data => {
				this.showTasks(data);
			});
			
	}
	// Show Pre-existing Tasks
	showTasks(tasks){
		tasks.forEach(task => {
			// $ is another jQuery convention
			const $template = $('.todo-template').contents().clone();
			$template.find('.text').text(task.text);
			$template.attr('data-id',task.id);
			console.log($template);
			if (task.checked) {
				$template.find('input').attr('checked', true);
				$template.addClass('is-done')
			}
			$('#todos').append($template);
		});
	}
	// Add New Tasks
	addTask(e){
		e.preventDefault(); // prevent auto page refresh
		let task = $('#task').val();
		const $template = $('.todo-template').contents().clone();
		$template.find('.text').text(task);
		// fetch with the same routes as the post method on the backend; what sends to JSON
		fetch('/saveItem', {
			method: 'post',
			body: JSON.stringify({"text": task, "checked":false}),
			headers: {
				'Content-type': 'application/json'
			}
		})
		.then(response => response.json())
		.then(data => {
			console.log(data.id);
			$template.attr('data-id', data.id);
			$('#todos').append($template);
		});
	}
	// Deleting Completed Tasks
	deleteTask(e){
		const task = $(e.currentTarget).parent('.todo'); // current target for dynamically added elements
		const id = task.data('id');
		task.remove();
		// Our fetch connect to the delete route in server.js
		fetch('/deleteItem/'+ id,{
			method: 'delete',
		}); 
	}
	// Checkmark Toggle
	toggleDone(e){
		e.preventDefault();
		const id = $(e.currentTarget)
			.parent('.todo')
			.toggleClass('is-done')
			.data('id');
			
			const isChecked = $(e.currentTarget).find('input').prop('checked');
			$(e.currentTarget).find('input').prop('checked', !isChecked);
			// Another fetch connected to a post (update) route on the backend
			fetch('/updateItem/'+id, {
				method: 'post',
				body: JSON.stringify({"prop": "checked", "value":!isChecked }),
				headers: {
					'Content-type': 'application/json'
				}
			});
	}
};

// Calling new instance of the object which sets off everything above
new TaskTracker(); 
