$(document).on("click", "#add", function () {

	var Id = $(this).attr("data-id");
	$("#notes" + Id).empty();
	$.ajax({
			method: "GET",
			url: "/Articles/" + Id
		})
		.then(function (data) {
			console.log(data);
			$("#notes" + data._id).append("<h2>" + data.title + "</h2>");
			$("#notes" + data._id).append("<label for='title'>Subject</label><input id='titleinput' name='title' class='form-control'>");
			$("#notes" + data._id).append("<label for='body'>Note</label><textarea id='bodyinput' name='body' class='form-control'></textarea><br/>");
			$("#notes" + data._id).append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
		});
});

$(document).on("click", "#delete", function () {
	var Id = $(this).attr("data-id");
	$("#notes" + Id).empty();
	$.ajax({
			method: "PUT",
			url: "/RemoveArticleNotes/" + Id
		})
		.then(function (data) {
			console.log(data);
		});
});

$(document).on("click", "#savenote", function () {
	var Id = $(this).attr("data-id");
	$.ajax({
			method: "POST",
			url: "/Articles/" + Id,
			data: {
				title: $("#titleinput").val(),
				body: $("#bodyinput").val()
			}
		})
		.then(function (data) {
			console.log(data);
			$("#notes" + data._id).empty();
		});
	$("#titleinput").val("");
	$("#bodyinput").val("");
});