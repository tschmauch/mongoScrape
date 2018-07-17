$(document).on("click", "#add-notes", function () {



	var thisId = $(this).attr("data-id");

	$("#notes" + thisId).empty();

	$.ajax({
		method: "GET",
		url: "/Games/" + thisId
	})
		.then(function (data) {
			console.log(data);
			$("#notes" + data._id).append("<h2>" + data.title + "</h2>");
			$("#notes" + data._id).append("<label for='title'>Subject</label><input id='titleinput' name='title' class='form-control'>");
			$("#notes" + data._id).append("<label for='body'>Note</label><textarea id='bodyinput' name='body' class='form-control'></textarea><br/>");
			$("#notes" + data._id).append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

			if (data.note) {
				$("#titleinput").val(data.note.title);
				$("#bodyinput").val(data.note.body);
			}
		});
});

$(document).on("click", "#delete-notes", function () {


	var thisId = $(this).attr("data-id");
	$("#notes" + thisId).empty();
	$.ajax({
		method: "PUT",
		url: "/RemoveGameNotes/" + thisId
	})
		.then(function (data) {
			console.log(data);
		});
});

$(document).on("click", "#savenote", function () {
	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "POST",
		url: "/Games/" + thisId,
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