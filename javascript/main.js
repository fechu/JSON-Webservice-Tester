$(document).ready(function() {
	
	// The send funciton
	$("input[name=submit]").click(function() {
		
		// Block ui
		/*$.blockUI({
			css: {
				border: 		'none',
				padding: 		'15px',
				backgroundColor:'#000',
				'-webkit-border-radius': '10px',
				'moz-border-radius': '10px',
				opacity: .5,
				color: '#fff'	
			}, 
			
			message: '<h1><img src="img/loading.gif"> Loading...</h1>'
		
		});*/
		
		
		var url = $("input[name=url]").val();
		var jsonContent = $("textarea").val();
		
		// Slide out the form
		$("#content").slideUp('normal', function() {
			$("#content").html('<center><h2><img src="img/loading.gif"> Loading...</h2></center>');	
		});
		$("#content").slideDown('fast');
		
		// Start the ajax request
		$.ajax({
			contentType: 'application/json',
			data: jsonContent,
			url: url,
			type: 'POST', 
			success: function(data) {
				// Show the result
				$("#content").slideUp('normal', function(){
					showResult(data);
				})
			}, 
			error: function(jqXHR, textStatus, errorThrown) {
				// Show the error
				alert("Failed: " + textStatus);
				$.unblockUI();
			}
		});
		
	});
});

// Clears the content div and adds the result.
function showResult(data) 
{
	$("#content").html('<h2>Result</h2><div class="result"><pre>' + JSON.stringify(data, null, 2) + '</pre></div>');
	
	$("#content").slideDown();
}