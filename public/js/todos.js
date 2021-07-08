// Check Off Specific Todos By Clicking
// $("ul").on("click", "li", function(){
// 	$(this).toggleClass("completed");
// });

// //Click on X to delete Todo
// $("ul").on("click", "span", function(event){
// 	$(this).parent().fadeOut(500,function(){
// 		$(this).remove();
// 	});
// 	event.stopPropagation();
// });



$(".fa-plus").click(function () {
	$("div[class='newform']").fadeToggle();
});

