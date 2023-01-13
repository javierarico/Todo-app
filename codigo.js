let taskForm = document.getElementById("tasks_form");
let taskInput = document.getElementById("tasks_input");
let sunIcon = document.getElementById("sunIcon");
let moonIcon = document.getElementById("moonIcon");
let bgImg = document.getElementById("bg-img");
let formContainer = document.getElementById("formContainer");
let circle = document.getElementById("rounded");
let footer = document.getElementById("footer");
let allBtn = document.querySelector(".all");
let activeBtn = document.querySelector(".active");
let completedBtn = document.querySelector(".completed");
let clearBtn = document.querySelector(".clear_completed");
let activeFooter = document.getElementById("active-footer");
let num = document.getElementById("num");
let todoArray = [];
let todoArrayActive = [];
let todoArrayCompleted = [];
let todoArrayClear = [];
let themeLight = false;
let themeDarkDefault = true;
var itemsLeft = 0;

//las tareas se van a agregar a tasksContainer
let tasksContainer = document.getElementById("tasksContainer");

//funcion para cambiar theme a dark/light
changeThemeLand();

taskForm.addEventListener('submit', function(e){
	//evitamos el comportamiento default de submit de form
	e.preventDefault();
});

taskInput.addEventListener('keyup', function(event){
	if (event.keyCode === 13 && taskInput.value.length > 0 && !(taskInput.value == " ")){
		//si se necesita cancela la accion de default
		event.preventDefault();
		createNewTodoItem(taskInput.value);

	}
});


function createNewTodoItem(text){
	//agrega tareas-- vamos a tomar el value de taskInput, y lo convertimos en un array para poder manipularlo
	const valueInput = taskInput.value;
	//pusheamos los elementos que se van agregando dentro de un array(todoArray)
	todoArray.push(valueInput);
	//guardamos la longitud del todoArray en la varaible itemsLeft, y luego la imprimimos en pantalla
	itemsLeft = todoArray.length;
	num.innerHTML = itemsLeft;
	//si el usuario no escribe nada y da enter, no agrega nada
	if (!valueInput) return;
	//creamos un div y un p elemento y lo guardamos en la variable taskDiv y taskEl
	let taskDiv = document.createElement('div');
	let taskEl = document.createElement('p');
	const deleteBtn = document.createElement('div');
	deleteBtn.textContent = 'X';	
	//le agregamos la clase task al div y taskEl al p segun el theme que este activo
	if((themeDarkDefault == true) && (themeLight == false)){	
		taskDiv.classList.add("task");
		taskEl.classList.add('taskEl');
		deleteBtn.classList.add("delete_btn");
	} else if(themeLight == true){
		taskDiv.classList.add("task-light");
		taskEl.classList.add('taskEl-light');
	} else if (themeLight == false){
		taskDiv.classList.add("task");
		taskEl.classList.add('taskEl');
	}
	taskDiv.classList.add("draggable");
	taskDiv.classList.add("elements");
	//hacemos que el div sea draggable
	taskDiv.setAttribute("draggable", true);
	//Este bucle forEach nos ayuda a iterar el todoArray, y cada vez agrega un atributo e indice a cada div
	todoArray.forEach(item =>{
		taskDiv.setAttribute("id", todoArray.indexOf(item)+1);
	})
	//dentro del taskEl p, agregamos el valor/texto
	taskEl.textContent = valueInput;
	//agregamos la clase toDo-Incomplete
	taskEl.classList.add("toDo-Incomplete");
	//agregamos el circle, p y delete al div
	taskDiv.prepend(addTaskCircle());
	taskDiv.append(taskEl);
	taskDiv.append(deleteBtn);
	//agregamos al tasksContainer, cada nueva task. Lo agregamos al principio de la lista con prepend
	tasksContainer.prepend(taskDiv);
	//reseteamos el valor del input para que nos quede vacio luego del enter
	taskInput.value = "";

		addDeleteButton();
		changeColorInput();
		activeBtns();
		dragAndDrop();

		//funcion para cambiar el theme de los elementos dinamicos				
		function changeColorInput(){
			sunIcon.addEventListener("click", function(){
				taskDiv.classList.remove("task");
				taskDiv.classList.add("task-light");
				taskEl.classList.add("taskEl-light");
				taskEl.classList.remove("taskEl");
				taskInput.style.color = "var(--Very-Dark-Grayish-Blue-l)";
				if(taskEl.classList.contains("done")){
					taskEl.classList.remove('done');
					taskEl.classList.add('done-light');								
				}
				deleteBtn.classList.add('delete_btn-light');
				deleteBtn.classList.remove('delete_btn');														
			});
			moonIcon.addEventListener("click", function(){
				taskDiv.classList.remove("task-light");
				taskDiv.classList.add("task");
				taskEl.classList.remove("taskEl-light");
				taskEl.classList.add("taskEl");
				taskInput.style.color = "var(--Light-Grayish-Blue)";
				if(taskEl.classList.contains('done-light')){
					taskEl.classList.add('done');
					taskEl.classList.remove('done-light');
				}	
				deleteBtn.classList.add('delete_btn');
				deleteBtn.classList.remove('delete_btn-light');														
			});
		}

		//Escucha que boton del footer esta siendo clickeado y lo colorea ++ y va filtrando.
		function activeBtns(){
			let allBtnActivated = true;
			let activeBtnActivated = false;
			let completedBtnActivated = false;
			let clearBtnActivated = false;
				
			allBtn.addEventListener('click', function(){
				if (activeBtn || completedBtn || clearBtn) {
					allBtn.id = "active-footer";
					allBtnActivated = true;
					completedBtn.id = "";
					completedBtnActivated = false;
					clearBtn.id = "";
					clearBtnActivated = false;
					activeBtn.id = "";
					activeBtnActivated = false;
					//filtra todos los elementos
					if (taskEl.classList.contains("toDo-Completed") || taskEl.classList.contains("toDo-Incomplete")){
						taskDiv.style.display = "flex";
					}
					//console.log("ALL ELEMENTS: " + todoArray);
				} 
			});

			activeBtn.addEventListener("click", function(){
				if (allBtn || completedBtn || clearBtn) {
					allBtn.id = "";
					allBtnActivated = false;
					completedBtn.id = "";
					completedBtnActivated = false;
					clearBtn.id = "";
					clearBtnActivated = false;
					activeBtn.id = "active-footer";
					activeBtnActivated = true;	
					//filtra los elementos aun activos
					if (taskEl.classList.contains("toDo-Completed")){ 
						taskDiv.style.display = "none";
					}else if (taskEl.classList.contains("toDo-Incomplete")){
						//pusheamos los elementos incompletos por ende activos, al array todoArrayActive
						taskDiv.style.display = "flex";							
						todoArrayActive.push(valueInput);
						//console.log("Active Elements: " + todoArrayActive);
					}	
																					
				}
			});

			//bug: cuando se clickea completed se borran los completas pero se pueden seguir agregando tareas y las muestra, tendria que agregarlas pero no mostrarlas
			completedBtn.addEventListener("click", function(){
				if (allBtn || activeBtn || clearBtn) {
					allBtn.id = "";
					allBtnActivated = false;
					completedBtn.id = "active-footer";
					completedBtnActivated = true;
					clearBtn.id = "";
					clearBtnActivated = false;
					activeBtn.id = "";
					activeBtnActivated = false;
					//filtra los elementos completados
					if (taskEl.classList.contains("toDo-Incomplete")){
						taskDiv.style.display = "none";							
					} else if (taskEl.classList.contains("toDo-Completed")){
						taskDiv.style.display = "flex";							
						todoArrayCompleted.push(valueInput);
						//console.log(todoArrayCompleted);
					}
				} 
			})

			clearBtn.addEventListener("click", function(){
				if (allBtn || activeBtn || completedBtn) {
					allBtn.id = "";
					allBtnActivated = false;
					completedBtn.id = "";
					completedBtnActivated = false;
					clearBtn.id = "active-footer";
					clearBtnActivated = true;
					activeBtn.id = "";
					activeBtnActivated = false;
					if (taskEl.classList.contains("toDo-Completed")){
						tasksContainer.removeChild(taskDiv);
						todoArrayClear.push(valueInput);
						//console.log(todoArrayClear);
						clearBtn.id = "";
						clearBtnActivated = false;
					} else if (taskEl.classList.contains("toDo-Incomplete")){
						clearBtn.id = "";
						clearBtnActivated = false;							
					}			
				}

			})
		}

		function addDeleteButton(){						
			//escucha cuando el mouse entra al div de cada tarea y muestra la X
			taskDiv.addEventListener("mouseenter", function(event){
				deleteBtn.style.opacity = "1";
			});
			//escucha cuando el mouse sale del div de cada task y quita la X
			taskDiv.addEventListener("mouseleave", function(event){
				deleteBtn.style.opacity = "0";					
			});
			//cuando se clickea en la X, se borra el elemento.
			deleteBtn.addEventListener('click', function(event){
				const item = event.target.parentElement;
				tasksContainer.removeChild(item);
				//si el div o el elemento no estan tachados, los resta del contador, si estan tachados, no resta el contador.
				if(taskDiv.classList.contains("task_circle") || taskEl.classList.contains("toDo-Incomplete")){
					//eliminamos el ultimo elemento del todoArray
					todoArray.pop(item);
					itemsLeft = todoArray.length;
					num.innerHTML = itemsLeft;
					//console.log(todoArray);
				}
				taskEl.classList.remove("toDo-Incomplete");
				taskEl.classList.add("toDo-Completed");
			});
			return deleteBtn;
		}

		function addTaskCircle(){
			let taskCircle = document.createElement("div");
			taskCircle.textContent = '';
			taskCircle.className = "task_circle";

			//cuando se clickea en taskCircle, se colorea el circle con el tilde y tacha el elemento
			taskCircle.addEventListener('click', function(event){
				const item = event.target.parentElement;
				if (taskCircle.classList.contains("task_circle")){
					taskCircle.classList.remove("task_circle");
					taskCircle.classList.add("task_circle-completed");
					//eliminamos el ultimo elemento del todoArray
					todoArray.pop(item);
					itemsLeft = todoArray.length;
					num.innerHTML = itemsLeft;
					//console.log(todoArray);
					//taskEl.classList.add('done');
					if((themeDarkDefault == true) && (themeLight == false)){
						taskEl.classList.add('done');
					}else if(themeLight == true){
						taskEl.classList.remove('done');
						taskEl.classList.add('done-light');								
					}else if(themeLight == false){
						taskEl.classList.add('done');
						taskEl.classList.remove('done-light');								
					}
					//removemos la clase toDo-Incomplete
					taskEl.classList.remove("toDo-Incomplete");
					//agregamos la clase toDo-Completed
					taskEl.classList.add("toDo-Completed");
				} else {
					taskCircle.classList.add("task_circle");
					taskCircle.classList.remove("task_circle-completed");
					//agregamos ultimo al elemento al todoArray
					todoArray.push(valueInput);
					itemsLeft = todoArray.length;
					num.innerHTML = itemsLeft;
					//console.log(todoArray);
					//taskEl.classList.remove('done');
					if((themeDarkDefault == true) && (themeLight == false)){
						taskEl.classList.remove('done');
					}else if(themeLight == false){
						taskEl.classList.remove('done');
					} else if (themeLight == true){
						taskEl.classList.remove('done-light');
					}
					//removemos la clase toDo-Completed
					taskEl.classList.remove("toDo-Completed");
					//agregamos la clase toDo-Incomplete
					taskEl.classList.add("toDo-Incomplete");
				}
			});

			//cuando se clickea el elemento, se colorea circle con el tilde y tacha el elemento
			taskEl.addEventListener('click', function(){
				const item = event.target.parentElement;
				if (taskCircle.classList.contains("task_circle")){
					taskCircle.classList.remove("task_circle");
					taskCircle.classList.add("task_circle-completed");
					//eliminamos el ultimo elemento del todoArray
					todoArray.pop(item);
					itemsLeft = todoArray.length;
					num.innerHTML = itemsLeft;
					//console.log(todoArray);
					//taskEl.classList.add('done');
					if((themeDarkDefault == true) && (themeLight == false)){
						taskEl.classList.add('done');
					}else if(themeLight == true){
						taskEl.classList.remove('done');
						taskEl.classList.add('done-light');
					}
					if(themeLight == false){
						taskEl.classList.add('done');
						taskEl.classList.remove('done-light');	
					}									
					//removemos la clase toDo-Incomplete
					taskEl.classList.remove("toDo-Incomplete");
					//agregamos la clase toDo-Completed
					taskEl.classList.add("toDo-Completed");
				} else {
					taskCircle.classList.add("task_circle");
					taskCircle.classList.remove("task_circle-completed");
					//agregamos ultimi al elemento al todoArray
					todoArray.push(valueInput);
					itemsLeft = todoArray.length;
					num.innerHTML = itemsLeft;
					//console.log(todoArray);				
					if((themeDarkDefault == true) && (themeLight == false)){
						taskEl.classList.remove('done');
					}else if(themeLight == false){
						taskEl.classList.remove('done');
					} else if (themeLight == true){
						taskEl.classList.remove('done-light');
					}
					//removemos la clase toDo-Completed
					taskEl.classList.remove("toDo-Completed");
					//agregamos la clase toDo-Incomplete
					taskEl.classList.add("toDo-Incomplete");
				}				
			});
			return taskCircle;
			return taskEl;
		}

}


//cambia el theme de la pagina dark/light
function changeThemeLand(){
	sunIcon.addEventListener('click', function(){
		moonIcon.style.visibility = "visible";
		sunIcon.style.visibility = "hidden";
		bgImg.style.backgroundImage = "url(./images/bg-desktop-light.jpg)";
		document.body.style.backgroundColor = "var(--Very-Light-Gray)";
		formContainer.style.backgroundColor = "var(--Very-Light-Gray)";
		footer.style.backgroundColor = "var(--Very-Light-Gray)";
		footer.style.color = "var(--Dark-Grayish-Blue)";
		tasksContainer.style.backgroundColor = "var(--Very-Light-Gray)";
		themeLight = true;
		hoverLightFooterBtns();
	});

	moonIcon.addEventListener('click', function(){
		sunIcon.style.visibility = "visible";
		moonIcon.style.visibility = "hidden";
		bgImg.style.backgroundImage = "url(./images/bg-desktop-dark.jpg)";
		document.body.style.backgroundColor = "var(--Very-Dark-Blue)";
		formContainer.style.backgroundColor = "var(--Very-Dark-Desaturated-Blue)";
		footer.style.backgroundColor = "var(--Very-Dark-Desaturated-Blue)";
		footer.style.color = "var(--Dark-Grayish-Blue)";		
		tasksContainer.style.backgroundColor = "var(--Very-Dark-Desaturated-Blue)";
		themeLight = false;
		hoverDarkFooterBtns();
	});	
}

function hoverLightFooterBtns(){
	allBtn.addEventListener('mouseenter', ()=>{allBtn.style.color = "var(--Very-Dark-Grayish-Blue-l)";});
	allBtn.addEventListener('mouseleave', ()=>{allBtn.style.color = "";});
	activeBtn.addEventListener('mouseenter', ()=>{activeBtn.style.color = "var(--Very-Dark-Grayish-Blue-l)";});
	activeBtn.addEventListener('mouseleave', ()=>{activeBtn.style.color = "";});
	completedBtn.addEventListener('mouseenter', ()=>{completedBtn.style.color = "var(--Very-Dark-Grayish-Blue-l)";});
	completedBtn.addEventListener('mouseleave', ()=>{completedBtn.style.color = "";});
	clearBtn.addEventListener('mouseenter', ()=>{clearBtn.style.color = "var(--Very-Dark-Grayish-Blue-l)";});
	clearBtn.addEventListener('mouseleave', ()=>{clearBtn.style.color = "";});
}

function hoverDarkFooterBtns(){
	allBtn.addEventListener('mouseenter', ()=>{allBtn.style.color = "var(--Light-Grayish-Blue-hover)";});
	allBtn.addEventListener('mouseleave', ()=>{allBtn.style.color = "";});	
	activeBtn.addEventListener('mouseenter', ()=>{activeBtn.style.color = "var(--Light-Grayish-Blue-hover)";});
	activeBtn.addEventListener('mouseleave', ()=>{activeBtn.style.color = "";});
	completedBtn.addEventListener('mouseenter', ()=>{completedBtn.style.color = "var(--Light-Grayish-Blue-hover)";});
	completedBtn.addEventListener('mouseleave', ()=>{completedBtn.style.color = "";});
	clearBtn.addEventListener('mouseenter', ()=>{clearBtn.style.color = "var(--Light-Grayish-Blue-hover)";});
	clearBtn.addEventListener('mouseleave', ()=>{clearBtn.style.color = "";});
}

//DRAG AND DROP
/*function dragAndDrop(){
	const draggables = document.querySelectorAll(".draggable");
	const draggableItems = document.querySelectorAll(".elements");

	draggables.forEach(draggable =>{
		draggable.addEventListener("dragstart", dragStart);
		draggable.addEventListener("dragend", dragEnd);
	});

	draggableItems.forEach(item =>{
		item.addEventListener("dragover", dragOver);
		item.addEventListener("drop", drop);
		item.addEventListener("dragenter", dragEnter);
		item.addEventListener("dragleave", dragLeave);
	});
}

function dragStart(e){
	let deleteOpacity = document.querySelector(".delete_btn");
	
	if (deleteOpacity.style.opacity = "1"){
		deleteOpacity.style.opacity = "0";
	}

	this.style.opacity = "0.4";
	console.log(this);
	dragElement = this;
	//console.log(dragElement);
	e.dataTransfer.setData("text/html", this.innerHTML);
  	e.dataTransfer.effectAllowed = "move";	
}

function dragEnd(e){
	dragElement.style.opacity = "1";

	let deleteOpacity = document.querySelector(".delete_btn");

	//mostrar delete btn en el elemento dropped en mouse enter
	dragElement.addEventListener("mouseenter", function(){
		deleteOpacity.style.opacity = "1";
		//console.log("hola dragend");
	})

	dragElement.addEventListener("mouseleave", function(){
		deleteOpacity.style.opacity = "0";
		//console.log("chau dragend");
	})

	deleteOpacity.addEventListener("click", function(){
		const item = event.target.parentElement;
		tasksContainer.removeChild(item);
		//console.log("delete element dragend");
	})

	functionalityDeleteNCompleted();
}

function dragOver(e){
	//prevenimos el comportamiento por default, para que se pueda hacer el drop
	e.preventDefault();
  	console.log("dragOver: dropEffect = " + e.dataTransfer.dropEffect + " ; effectAllowed = " + e.dataTransfer.effectAllowed);	
	e.dataTransfer.dropEffect = "move";
	//console.log("Event: ", "dragOver");
}

//ver bug, cuando se hace drop, ya no se puede tachar ni eliminar....
function drop(e){
	e.preventDefault();
  	console.log("drop: dropEffect = " + e.dataTransfer.dropEffect + " ; effectAllowed = " + e.dataTransfer.effectAllowed);

	let deleteOpacity = document.querySelector(".delete_btn");
	if (deleteOpacity.style.opacity = "1"){
		deleteOpacity.style.opacity = "0";
	}

	dropElement = this;
	console.log(this);

	if (dragElement !== dropElement) {
		console.log(dragElement.innerHTML);
		console.log(dropElement.innerHTML);
		
		dragElement.innerHTML = dropElement.innerHTML;
		dropElement.innerHTML = e.dataTransfer.getData("text/html");
	}

		//mostrar delete btn en el elemento dropped en mouse enter
		dropElement.addEventListener("mouseenter", function(){
			deleteOpacity.style.opacity = "1";
			console.log("hola drop");
		})

		dropElement.addEventListener("mouseleave", function(){
			deleteOpacity.style.opacity = "0";
			console.log("chau drop");
		})

		deleteOpacity.addEventListener("click", function(){
			const item = event.target.parentElement;
			tasksContainer.removeChild(item);
			console.log("delete element drop");
		})

		functionalityDeleteNCompleted();
}

function dragEnter(e){
	//this.style.border = "4px dashed yellow";
	//console.log("Event: ", "dragLeave");
}

function dragLeave(e){
	e.stopPropagation();
	//this.style.border = "";	
	//console.log("Event: ", "dragLeave");
}*/

function functionalityDeleteNCompleted(){
	let taskDiv = document.querySelector(".task");
	let taskEl = document.querySelector(".taskEl");
	let taskCircle = document.querySelector(".task_circle");

	//cuando se clickea en taskCircle, se colorea el circle con el tilde y tacha el elemento
	taskCircle.addEventListener('click', function(event){
		const item = event.target.parentElement;
		if (taskCircle.classList.contains("task_circle")){
			taskCircle.classList.remove("task_circle");
			taskCircle.classList.add("task_circle-completed");
			//eliminamos el ultimo elemento del todoArray
			todoArray.pop(item);
			itemsLeft = todoArray.length;
			num.innerHTML = itemsLeft;
			//console.log(todoArray);
			//taskEl.classList.add('done');
			if((themeDarkDefault == true) && (themeLight == false)){
				taskEl.classList.add('done');
			}else if(themeLight == true){
				taskEl.classList.remove('done');
				taskEl.classList.add('done-light');								
			}else if(themeLight == false){
				taskEl.classList.add('done');
				taskEl.classList.remove('done-light');								
			}
			//removemos la clase toDo-Incomplete
			taskEl.classList.remove("toDo-Incomplete");
			//agregamos la clase toDo-Completed
			taskEl.classList.add("toDo-Completed");
		} else {
			taskCircle.classList.add("task_circle");
			taskCircle.classList.remove("task_circle-completed");
			//agregamos ultimo al elemento al todoArray
			todoArray.push(item);
			itemsLeft = todoArray.length;
			num.innerHTML = itemsLeft;
			//console.log(todoArray);
			//taskEl.classList.remove('done');
			if((themeDarkDefault == true) && (themeLight == false)){
				taskEl.classList.remove('done');
			}else if(themeLight == false){
				taskEl.classList.remove('done');
			} else if (themeLight == true){
				taskEl.classList.remove('done-light');
			}
			//removemos la clase toDo-Completed
			taskEl.classList.remove("toDo-Completed");
			//agregamos la clase toDo-Incomplete
			taskEl.classList.add("toDo-Incomplete");
		}
	});

	taskEl.addEventListener("click", function(){
		const item = event.target.parentElement;
		if (taskCircle.classList.contains("task_circle")){
			taskCircle.classList.remove("task_circle");
			taskCircle.classList.add("task_circle-completed");
			//eliminamos el ultimo elemento del todoArray
			todoArray.pop(item);
			itemsLeft = todoArray.length;
			num.innerHTML = itemsLeft;
			//console.log(todoArray);
			//taskEl.classList.add('done');
			if((themeDarkDefault == true) && (themeLight == false)){
				taskEl.classList.add('done');
			}else if(themeLight == true){
				taskEl.classList.remove('done');
				taskEl.classList.add('done-light');
			}
			if(themeLight == false){
				taskEl.classList.add('done');
				taskEl.classList.remove('done-light');	
			}									
			//removemos la clase toDo-Incomplete
			taskEl.classList.remove("toDo-Incomplete");
			//agregamos la clase toDo-Completed
			taskEl.classList.add("toDo-Completed");
		} else {
			taskCircle.classList.add("task_circle");
			taskCircle.classList.remove("task_circle-completed");
			//agregamos ultimi al elemento al todoArray
			todoArray.push(item);
			itemsLeft = todoArray.length;
			num.innerHTML = itemsLeft;
			//console.log(todoArray);				
			if((themeDarkDefault == true) && (themeLight == false)){
				taskEl.classList.remove('done');
			}else if(themeLight == false){
				taskEl.classList.remove('done');
			} else if (themeLight == true){
				taskEl.classList.remove('done-light');
			}
			//removemos la clase toDo-Completed
			taskEl.classList.remove("toDo-Completed");
			//agregamos la clase toDo-Incomplete
			taskEl.classList.add("toDo-Incomplete");
		}				
	});
	return taskCircle;
	return taskEl;
}