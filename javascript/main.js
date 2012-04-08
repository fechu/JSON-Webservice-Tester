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

/**
 * Checks the method. If the selected method is GET, disable the json field. 
 */
function checkMethod()
{
	if ($('#selectmethod').val() == 'GET') 
	{
		$('#json').attr('disabled', 'disabled');
	} 
	else 
	{
		$('#json').removeAttr('disabled');
	}
}

/**
 * Removes all data from the result of the last request.
 */
function resetResult()
{
	// Emtpy the alert
	$("#alert").html('');
	$("#alert").attr('class', 'alert');
	
	// Emtpy the response
	$("#response").html('');
	
	// Empty the request info
	$("#request-info").html('');
}

/**
 * Sets the content and class of the alert on the result page.
 */
function setAlert(message, cls)
{
	var al = $("#alert");
	al.html(message);
	al.addClass(cls);
}

/**
 * Sends the request. 
 */
function sendRequest()
{
	
	var url = $("#location").val();
	var method = $('#selectmethod').val();
	var jsonContent;
	// If the method is get, no body will be added.
	if (method == 'GET') 
	{
		jsonContent = "";	
	}
	else
	{
		jsonContent = $("#json").val();
	}
	
	// Check if an url was filled in.
	if (url.length == 0)
	{
		alert("Missing values. Please fill in the location of the webservice.");
		return;
	}
	
	// Slide out the form
	$("#form").slideUp();
	$("#loading").slideDown();
	
	// Reset the result so it's ready for new data.
	resetResult();
	
	// Start the ajax request
	$.ajax({
		contentType: 'application/json; charset=utf-8',
		data: jsonContent,
		url: url,
		type: method, 
		crossDomain: true,
		headers: {'X-Requested-With': 'XMLHttpRequest'},
		success: function(data) {
			// Show the result
			$("#loading").slideUp();
			
			if (data instanceof Object || data instanceof Array) 
			{
				$("#response").html('<pre>' + JSON.stringify(data, null, 2) + '</pre');
				setAlert('<strong>Success!</strong> Retrieved valid JSON.', 'alert-success');
			}
			else if (data == null) 
			{
				// Data is null. Show only the information. 
				setAlert('The request was executed successfully, but no data was received.', 'alert-info');
				$("#response").html('');
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
				setAlert('<strong>Warning!</strong> Retrieved invalid JSON.', 'alert-warning');
			}
			$("#result").slideDown();
			
		}, 
		error: function (request, type, errorThrown)
		{
			setAlert('<strong>Error!</strong> There was an error while executing this request.', "alert-error");
		
		   	// Hide the loading div.
		    $("#loading").slideUp();
		    
		    // If any data was received, show it
		    $("#response").html('<pre>' + request.responseText + '</pre>');
		    
		    // show the result
		    $("#result").slideDown();
		    
		}, 
		complete: function(request, status) 
		{
			// Get some information about the request.
			var requestinfo = $("#request-info");
			requestinfo.html('');
			
			var tags = "";
			
			tags = tags + "<dt>Status</dt><dd>" + status + "</dd>";
			tags = tags + "<dt>Statustext</dt><dd>" + request.statusText + "</dd>";
			tags = tags + "<dt>HTTP Status Code</dt><dd>" + request.status + "</dd>";
			
			tags = tags + "<dt>Headers</dt><dd><ul>";
			var responseHeaders = request.getAllResponseHeaders();
			var headers = responseHeaders.split("\n");
			for (var i = 0; i < headers.length; i++) 
			{
				var header = headers[i];
				if (header !== "") {
					tags = tags + "<li>" + header + "</li>";
				}
			}
			tags = tags + "</ul></dd>";
			
			
			requestinfo.append("<dl>" + tags + "</dl>");
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
	var method = $('#selectmethod').val();
		
	var requests = JSON.parse(localStorage.getItem('requests'));
	if (requests == null) {
		requests = new Array();
	}
	
	var request = new Object();
	request['name'] = name;
	request['location'] = location;
	request['json'] = json;
	request['method'] = method;
	
	// Check if a request with the same name already exists. 
	for (var i=0; i < requests.length; i++)
	{
		if (requests[i]['name'] == name) 
		{
			// Remove that request
			requests.splice(i, 1);
			break;
		}
	}
	
	// Add the new request. 
	requests.push(request);
	
	localStorage.setItem('requests', JSON.stringify(requests));
	
	// hide the modal
	$("#saveDialog").modal('hide');
	
	// Reload the requests
	loadRequests();
}

/**
 * Loads all the saved requests from the local storage.
 */
function loadRequests()
{
	// Emtpy the menu.
	$("#requestsMenu").html("");
	$("#manageTable").html("");

	requests = JSON.parse(localStorage.getItem('requests'));
	if (requests != null && requests.length != 0) {
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
	
	// Add the save current request option
	$("#requestsMenu").append('<li><a data-toggle="modal" href="#saveDialog">Save request</a></li>');
	
}

function loadRequest(index)
{
	var requests = JSON.parse(localStorage.getItem('requests'));
	var request = requests[index];
	
	$("#location").val(request['location']);
	$("#json").val(request['json']);
	$("#selectmethod").val(request['method']);
	
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



