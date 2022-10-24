// CLIENT-SIDE JS

fetch('/getItems')
	.then(response => response.json())
	.then(data => {
        function showTasks(tasks) {
         // JQUERY PORTION BELOW 
            const $template = $('.todo-template').contents().clone(); //make copy of original
            $template.find('.text').text(task.text);
            if (task.checked) {
                $template.find('input').attr('checked', true);
                // $template.addClass('is-done'); // adds line-thru. would have to go back to frontend part 1 to add this since i skipped it.
            
            $('#todos').append($template);
            }
        }
    });

// SHOW PRE-EXISTING TASKS
// function showTasks(data){
//     tasks.forEach(task => {
//     // JQUERY PORTION BELOW 
//     const $template = $('.todo-template').contents().clone(); //make copy of original
//     $template.find('.text').text(task.text);
//     if (task.checked) {
//         $template.find('input').attr('checked', true);
//         // $template.addClass('is-done'); // adds line-thru. would have to go back to frontend part 1 to add this since i skipped it.
//     } 
//     $('#todos').append($template);
//     });
// };

// showTasks();

// ADD TASK
document.querySelector('#add-task').addEventListener('submit', (e) => {
    e.preventDefault(); // prevents refresh when you submit form (default behavior of forms)
    const task = document.querySelector('#task').value;

    // JQUERY PORTION BELOW 
    const $template = $('.todo-template').contents().clone();//make copy of original
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
        $('#todos').append($template);
    });

    document.querySelector("#task").value = "" // resets input field to empty, because input value was staying there after hitting add button
    });

// EDIT TASK
// onclick added to edit btn in html
// function editTask(){
//     let item = document.querySelector('#task').value;
//     console.log(item);
// };

// DELETE TASK
// onclick added to del btn in html
function deleteTask(){
    const task = document.activeElement.parentNode;
    const id = task.data('id');
    task.remove(); // selects the parent element of the active element (in this case, the X button) and removes it

    fetch('/deleteItem/'+ id,{
        method: 'delete',
    }); 
};

fetch('/getItems')
.then(response => response.json())
.then(data => {
    console.log(data);
});




// on page load, create new instance of Todo class
// window.addEventListener('load', () => {
//     new Todo(); 
// });