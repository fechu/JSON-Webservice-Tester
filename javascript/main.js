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
			crossDomain: true,
			success: function(data) {
				// Show the result
				$("#loading").slideUp();
				$(".result").html('<pre>' + JSON.stringify(data, null, 2) + '</pre');
				$("#result").slideDown();
			}, 
			error: function (request, type, errorThrown)
			{
			    var message = "There was an error with the AJAX request.\n";
			    switch (type) {
			        case 'timeout':
			            message += "The request timed out.";
			            break;
			        case 'notmodified':
			            message += "The request was not modified but was not retrieved from the cache.";
			            break;
			        case 'parseerror':
			            message += "XML/Json format is bad.";
			            break;
			        default:
			            message += "HTTP Error (" + request.status + " " + request.statusText + ").";
			    }
			    message += "\n";
			    alert(message);
			}
		});
		
	});
});

function backToForm()
{
	$("#result").slideUp();
	$("#form").slideDown();
}



