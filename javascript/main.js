$(document).ready(function() {
	
	$("#loading").hide();
	$("#result").hide();
	
	// The send funciton
	$("input[name=submit]").click(function() {
		
		// Slide out the form
		$("#form").slideUp();
		$("#loading").slideDown();
		
		var url = $("input[name=url]").val();
		var jsonContent = $("textarea").val();
		
		// Start the ajax request
		$.ajax({
			contentType: 'application/json',
			data: jsonContent,
			url: url,
			type: 'POST', 
			success: function(data) {
				// Show the result
				$("#loading").slideUp();
				$(".result").html('<pre>' + JSON.stringify(data, null, 2) + '</pre');
				$("#result").slideDown();
			}, 
			error: function(jqXHR, textStatus, errorThrown) {
				// Show the error
				alert("Failed: " + textStatus);
				$.unblockUI();
			}
		});
		
	});
});

function backToForm()
{
	$("#result").slideUp();
	$("#form").slideDown();
}



