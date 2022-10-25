// CLIENT-SIDE JS


class TaskTracker {
    constructor() {
		this.init(); // calls this upon the creation of a new instance of the TaskTracker class, which we do all the way at the bottom of the file
	}

	init() {
		// add event handlers using jQuery // JS library with simplified syntax -- basically abbreviations for JS
		// document.querySelector() === $()
		// $('#add-task').on('submit',(e)=>{this.addTask(e)}); 
		// $('#todos').on('click','.js-delete', (e)=>{this.deleteTask(e)} ); // event, selector, do something
		// $('#todos').on('click','.js-check', (e)=>{this.toggleDone(e)} );

		// add - OK
		document.querySelector('#add-task').addEventListener('submit', (e) => {
			this.addTask(e); // works
		});

		// delete
		document.querySelector("#todos").addEventListener('click', (e) => {
			if (e.target && e.target.classList.contains == 'js-delete'){
				console.log('delete success'); // works
				this.deleteTask(e); // doesn't
			} else if (e.target && e.target.classList.contains == 'js-check'){
				console.log('check success');
				this.toggleDone(e);
			} else {
				console.log('idk what you want')
			}



		})

		// toggle checkmark
		// document.querySelector('#todos').addEventListener('click', (e) => {
		// 	if (e.target && e.target.id == '.js-check'){
		// 		console.log('check success');
		// 		this.toggleDone(e)
		// 	}
		// })


	
		
		// This fetch and the showTasks method pull in any pre-existing data from the JSON file
		fetch('/getItems')
			.then(response => response.json())
			.then(data => {
				this.showTasks(data);
			});
			
	}

	showTasks(tasks){
		tasks.forEach(task => {
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

	addTask(e){
		e.preventDefault();
		const task = $('#task').val();
		const $template = $('.todo-template').contents().clone();
		$template.find('.text').text(task);

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

	deleteTask(e){
		const task = $(e.currentTarget).parent('.todo');
		const id = task.data('id');
		task.remove();
		fetch('/deleteItem/'+ id,{
			method: 'delete',
		}); 
	}

	toggleDone(e){
		e.preventDefault();
		const id = $(e.currentTarget)
			.parent('.todo')
			.toggleClass('is-done')
			.data('id');
			
			const isChecked = $(e.currentTarget).find('input').prop('checked');
			$(e.currentTarget).find('input').prop('checked', !isChecked);

			fetch('/updateItem/'+id, {
				method: 'post',
				body: JSON.stringify({"prop": "checked", "value":!isChecked }),
				headers: {
					'Content-type': 'application/json'
				}
			});
	}
};

new TaskTracker(); 
