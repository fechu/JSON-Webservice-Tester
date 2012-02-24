$(document).ready(function() {

	$('.dropdown-toggle').dropdown();
	
	$("#loading").hide();
	$("#result").hide();
	
	loadRequests();
		
});

function sendRequest()
{
	// Slide out the form
	$("#form").slideUp();
	$("#loading").slideDown();
	
	var url = $("#location").val();
	var jsonContent = $("#json").val();
	
	// Start the ajax request
	$.ajax({
		contentType: 'application/json; charset=utf-8',
		data: jsonContent,
		url: url,
		type: 'POST', 
		crossDomain: true,
		success: function(data) {
			// Show the result
			$("#loading").slideUp();
			$("#response").html('<pre>' + JSON.stringify(data, null, 2) + '</pre');
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
		    alert(message + errorThrown);
		    $("#response").html(request.responseText);
		    
		    $("#loading").slideUp();
		    $("#result").slideDown();
		}
	});
	
}


function saveRequest()
{
	var name = $("#requestName").val();
	if (name.length == 0) {
		alert("Bitte geben Sie einen Namen ein.");
		return;
	}
	
	var location = $("#location").val();
	var json = $("#json").val();
		
	var requests = JSON.parse(localStorage.getItem('requests'));
	if (requests == null) {
		requests = new Array();
	}
	
	var request = new Object();
	request['name'] = name;
	request['location'] = location;
	request['json'] = json;
	
	requests.push(request);
	
	localStorage.setItem('requests', JSON.stringify(requests));
	
	// hide the modal
	$("#saveDialog").modal('hide');
	
	// Reload the requests
	loadRequests();
}

function loadRequests()
{
	// Emtpy the menu.
	$("#requestsMenu").html("");
	$("#manageTable").html("");

	requests = JSON.parse(localStorage.getItem('requests'));
	if (requests == null || requests.length == 0) {
		$("#requestsMenu").append("<li><a href=\"#\" class=\"disabled\">No saved requests</a></li>");
	}
	else {
		// Add them 
		for (var i=0; i < requests.length; i++)
		{
			$("#requestsMenu").append("<li><a href=\"#\" onclick=\"loadRequest("+ i +");\">"+ requests[i].name +"</a></li>");
			$("#manageTable").append('<tr><td>' + requests[i].name + '</td><td><a href="#" class="btn btn-danger pull-right" onclick="removeRequest('+ i +'); loadRequests();">Remove</a></td></tr>');
		}
		
		// Add the manage button
		$("#requestsMenu").append('<li class="divider"></li>');
		$("#requestsMenu").append('<li><a data-toggle="modal" href="#manageDialog">Manage Requests</a></li>');
		
	}
}

function loadRequest(index)
{
	var requests = JSON.parse(localStorage.getItem('requests'));
	var request = requests[index];
	
	$("#location").val(request['location']);
	$("#json").val(request['json']);
	
}

function removeRequest(index)
{
	var requests = JSON.parse(localStorage.getItem('requests'));
	
	// Remove that item.
	requests.splice(index, 1);
	
	// Save
	localStorage.setItem('requests', JSON.stringify(requests));
}

function backToForm()
{
	$("#result").slideUp();
	$("#form").slideDown();
}



