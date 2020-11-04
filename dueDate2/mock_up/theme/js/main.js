function switchTo (id) {
	$(".container").hide();
	$("#" + id).show();
}


$(function () {
	switchTo("demo");
	$("#participants .piece").each(function () {
		if (!$(this).hasClass("empty")) {
			$(this).css("transform", "rotate(" + (Math.random() * 30 - 15) + "deg)");
		}
	});
});