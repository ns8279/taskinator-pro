var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);

  //CHECK DUE DATE
  auditTask(taskLi);
 
  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [
         {
         text: "Sample text to do",
         date: "04/07/2020"
        }
      ],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    console.log(list, arr);
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};


//new code here from the lesson


$(".card .list-group").sortable( {
  connectWith: $(".card .list-group"),
  scroll: false,
  tolerance: "pointer",
  helper: "clone",
  activate: function(event) {
    console.log("activate", this);
  },
  deactivate: function(event) {
    console.log("deactivate", this);
  },
  over: function(event) {
    console.log("over", event.target);
  },
  out: function(event) {
    console.log("out", event.target);
  },
  update: function(event) {
    // console.log($(this).children());
    // console.log("update", this);
    // }
    // loop over current set of children in sortable list

    //array to store task data in
    var tempArr = [];

    //loop over current set of children in sortable list

  $(this).children().each(function() {
    console.log($(this));
    var text = $(this)
      .find("p")
      .text()
      .trim();

    var date = $(this)
      .find("span")
      .text()
      .trim();

    //add task data to the temp array as an object
    tempArr.push({
      text: text,
      date: date
    })
    // console.log(text, date);
  });


  //trim down list's ID to match object property
  var arrName = $(this)
  .attr("id")
  .replace("list-", "");

  //update array on tasks object and save
  tasks[arrName] = tempArr;
  saveTasks();


  }

});


$(".list-group").on("click", "p", function() {
  //get the textarea's current value/text
  var text = $(this)
    .text()
    .trim();

    var textInput = $("<textarea>")
    .addClass("form-control")
    .val(text);

  console.log(text);
  console.log(textInput);

  $(this).replaceWith(textInput);
  textInput.trigger("focus");
});


$(".list-group").on("blur", "textarea", function() {
    // get the textarea's current value/text
    var text = $(this)
    .val()
    .trim();

    // get the parent ul's id attribute
    var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");

    // get the task's position in the list of other li elements
    var index = $(this)
    .closest(".list-group-item")
    .index();

    //this part was added after working with JOHN
    console.log(tasks);
    console.log(status);

    if(tasks[status].length == 0) {
      tasks[status].push({text: text, date: "04072020"}
      
      )
    }
    else {
      console.log(status);
      console.log(index);
      console.log(text);
      console.log(tasks);
  
      // tasks[status][index].text = text;
      tasks[status][index].text = text;
    }

    saveTasks();


    //recreate p element
    var taskP = $("<p>")
    .addClass("m-1")
    .text(text);

    //replace text area with p element
    $(this).replaceWith(taskP);


});



// due date was clicked
$(".list-group").on("click", "span", function() {
  //get the current text
  var date = $(this)
  .text()
  .trim();

  //create new input element
  var dateInput = $("<input>")
  .attr("type", "text")
  .addClass("form-control")
  .val(date);

  //swap out elements
  $(this).replaceWith(dateInput);

  //ENABLE JQUERY UI DATEPICKER
  dateInput.datepicker({
    minDate: 1,
    onClose: function(){
      //when calender is closed, force a change event on the dateinput 
      $(this).trigger("change");
    }
  })

  //automatically bring up the calender
  dateInput.trigger("focus");
})


//value of due date was changed
//CHANGED THE BLUR TO CHANGE TO ACCOMODATE DATE PICKER EDIT MODE
$(".list-group").on("change", "input[type='text']", function() {
  //get current text
  var date = $(this)
  .val()
  .trim();

  //get the parent ul's id attribute
  var status = $(this)
  .closest(".list-group")
  .attr("id")
  .replace("list-", "");

  //get the task's position in the list of other li items
  var index = $(this)
  .closest(".list-group-item")
  .index();

  //update task in array and re-save to localstorage
  tasks[status][index].date = date;
  saveTasks();

  //recreate span element with boostrap classes
  var taskSpan = $("<span>")
  .addClass("badge badge-primary badge-pill")
  .text(date);

  //replace input with span element
  $(this).replaceWith(taskSpan);

  //PASS TASK'S <LI> ELEMENT INYO AUDITTASK() TO CHECK NEW DUE DATE
  auditTask($(taskSpan).closest(".list-group-item"));
  
})


//this is the DATEPICKER CODE
$("#modalDueDate").datepicker({
  minDate: 1
});






// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();


  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});



// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});



//functionality to remove tasks via drag and drop to trash

$("#trash").droppable({
  accept: ".card .list-group-item",
  tolerance: "touch",
  drop: function(event, ui) {
    console.log("drop");
    ui.draggable.remove();
  },
  over: function(event, ui) {
    console.log("over");
  },
  out: function(event, ui) {
    console.log("out");
  }
})


//functionality to highlight the dates area when overdue

var auditTask = function(taskEl) {
  //ensure element is getting to the function
    //console.log(taskEl);
  
  //get date from the task element
  var date = $(taskEl).find("span").text().trim();
  //ensure it worked
  console.log(date);

  //convert to moment object at 5:00pm
  var time = moment(date, "L").set("hour", 17);
  //this should print out an object for the value of the date varibale but at 5:00pm of that date
      //console.log(time);

  //remove any old classes from element
  $(taskEl).removeClass("list-group-item-warning list-group-item-danger");

  //add new class if task is near/over due date
  if(moment().isAfter(time)) {
    $(taskEl).addClass("list-group-item-danger");
  }else if (Math.abs(moment().diff(time, "days")) <= 2) {
    $(taskEl).addClass("list-group-item-warning");
  }

}





// load tasks for the first time
loadTasks();
