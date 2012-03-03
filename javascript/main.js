$(document).ready(function() {

	// Activate the dropdowns
	$('.dropdown-toggle').dropdown();
	
	// Activate the URL field
	$("#location").focus();
	
	// validate the json on every keyup
	$("#json").keyup(function() {validateJSON();});
	
	// Hide the not needed parts
	$("#loading").hide();
	$("#result").hide();
	
	// Load the saved requests
	loadRequests();
	
	// Make the saveModal dialog save on pressing enter.
	$("#requestName").keyup(function(event){
		if (event.keyCode == 13)
		{
			// Save the request
			saveRequest();
		}
	});
		
});

function sendRequest()
{
	
	var url = $("#location").val();
	var jsonContent = $("#json").val();
	var method = $('#selectmethod').val();
	
	if (url.length == 0 || jsonContent.length == 0)
	{
		alert("Missing values. Please fill in all textfields.");
		return;
	}
	
	// Slide out the form
	$("#form").slideUp();
	$("#loading").slideDown();
	
	// Start the ajax request
	$.ajax({
		contentType: 'application/json; charset=utf-8',
		data: jsonContent,
		url: url,
		type: method, 
		crossDomain: true,
		success: function(data) {
			// Show the result
			$("#loading").slideUp();
			
			if (data instanceof Object || data instanceof Array) 
			{
				$("#response").html('<pre>' + JSON.stringify(data, null, 2) + '</pre');
				$("#alert").html('<strong>Success!</strong> Retrieved valid JSON.');
				$("#alert").addClass('alert-success');				
			}
			else 
			{
				// Turn the returned things into text
				data = data.replace(/[<]/g, '&lt;');
				data = data.replace(/[>]/g, '&gt;');
				
				//var tmp = document.createElement("div");
				//tmp.innerHTML = data;
				//data = tmp.textContent||tmp.innerText;
				$("#response").html('<pre>' + data + '</pre>');
				$("#alert").html('<strong>Warning!</strong> Retrieved invalid JSON.');
				$("#alert").removeClass('alert-success');
			}
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
		            message += "Failed to parse the retrieved JSON.";
		            break;
		        default:
		            message += " HTTP Error (" + request.status + " " + request.statusText + ").";
		    }
		    message += "\n";
		    alert(message + errorThrown);
		   	
		   	// Hide the loading div.
		    $("#loading").slideUp();
		    
		    // If there's a response text, show it.
		    if (request.responseText.length > 0) {
		    	$("#response").html(request.responseText);
		    	$("#result").slideDown();
		    }
		    else {
		    	// Show the form again. 
		    	$("#form").slideDown();
		    }
		    
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
	
	// If there are no more requests, dismiss the manageDialog
	if (requests.length == 0) {
		$("#manageDialog").modal('hide')
	}
}

function backToForm()
{
	$("#result").slideUp();
	$("#form").slideDown();
}

function validateJSON()
{
	var json = $("#json").val();
	
	try {
		JSON.parse(json);
		$("#jsonvalid").html('Valid JSON');
		$("#jsonvalid").css('color', 'green');
	}
	catch(e) {
		$("#jsonvalid").html('Invalid JSON');
		$("#jsonvalid").css('color', 'red');
	}
}



