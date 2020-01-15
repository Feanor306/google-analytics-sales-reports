// Set authorized scope.
var SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];

function authorize(event) {
  // Handles the authorization flow.
  // `immediate` should be false when invoked from the button click.
  var useImmdiate = event ? false : true;
  var authData = {
    client_id: CLIENT_ID,
    scope: SCOPES,
    immediate: useImmdiate
  };
  
  if(useImmdiate == true) //prevent auto call on load
	  return;
	  
  gapi.auth.authorize(authData, function(response) {

    var authButton = document.getElementById('auth-button');
    if (response.error) {
      authButton.hidden = false;
    }
    else {
      authButton.hidden = false;
      queryAccounts();
    }
  });
}

function queryAccounts() {
  // Load the Google Analytics client library.
  gapi.client.load('analytics', 'v3').then(function() {

    // Get a list of all Google Analytics accounts for this user
    gapi.client.analytics.management.accounts.list().then(handleAccounts);
  });
}


function handleAccounts(response) {
  // Handles the response from the accounts list method.
  if (response.result.items && response.result.items.length) {
    //Get the first Google Analytics account.
    //var firstAccountId = response.result.items[0].id;
	//Query for properties.
    //queryProperties(firstAccountId);
	
	//LIST ALL ACCOUNTS
	//console.log("ACCOUNTS: ");
	//console.log(response.result.items);
	
	var selAcc = $("#selAcc").val();
	if(selAcc)
	{
		for(var i = 0; i < response.result.items.length; i++)
		{
			if(response.result.items[i].name == selAcc)
				queryProperties(response.result.items[i].id);
		}
	}

  } else {
    console.log('No accounts found for this user.');
  }
}


function queryProperties(accountId) {
  // Get a list of all the properties for the account.
  gapi.client.analytics.management.webproperties.list(
      {'accountId': accountId})
    .then(handleProperties)
    .then(null, function(err) {
      // Log any errors.
      console.log(err);
  });
}


function handleProperties(response) {
  // Handles the response from the webproperties list method.
  if (response.result.items && response.result.items.length) {
	// Get the first Google Analytics account
    var firstAccountId = response.result.items[0].accountId;
	// Get the first property ID
    var firstPropertyId = response.result.items[0].id;
	
	//LIST ALL PROPERTIES
	//console.log("PROPERTIES: ");
	//console.log(response.result.items);

    // We have only 1 property per account so returning first works for us

    // Query for Views (Profiles).
    queryProfiles(firstAccountId, firstPropertyId);
  } else {
    console.log('No properties found for this user.');
  }
}


function queryProfiles(accountId, propertyId) {
  // Get a list of all Views (Profiles) for the first property
  // of the first Account.
  gapi.client.analytics.management.profiles.list({
      'accountId': accountId,
      'webPropertyId': propertyId
  })
  .then(handleProfiles)
  .then(null, function(err) {
      // Log any errors.
      console.log(err);
  });
}


function handleProfiles(response) {
  // Handles the response from the profiles list method.
  if (response.result.items && response.result.items.length) {
    // Get the first View (Profile) ID.
    //var firstProfileId = response.result.items[0].id;
	
	//LIST ALL PROFILES
	//console.log("PROFILES: ");
	//console.log(response.result.items);
	
	//profiles have same name ass account for us
	var selAcc = $("#selAcc").val();
	if(selAcc)
	{
		for(var i = 0; i < response.result.items.length; i++)
		{
			if(response.result.items[i].name == selAcc)
				GenerateReport(response.result.items[i].id);
		}
	}
	
  } else {
    console.log('No views (profiles) found for this user.');
  }
}

function GenerateReport(profileId)
{
	$(".pRow").remove();
	var month = $("#selMonth").val();
	var year = $("#selYear").val();
	var acc = $("#selAcc").val();
	
	//Set The Title
	$("#ptAcc").html(acc);
	$("#ptMonth").html(month + "-" + year);
	
	//Add a row for each metric
	//Analytics API has a maximum of 10 queries per user per second
	//Meaning we can generate a maximum of 3 rows (3 calls on each row) per second
	//Therefore, we neeed to time the calls to AVOID exceeding 10 calls per second
	
	var addRow1 = function(){
		var row1 = GenerateReportRow(mName1, mCode1, profileId, month, year);
		$('#printableCon').append(row1);
	};
	
	var addRow2 = function(){
		var row2 = GenerateReportRow(mName2, mCode2, profileId, month, year);
		$('#printableCon').append(row2);
	};
	
	var addRow3 = function(){
		var row3 = GenerateReportRow(mName3, mCode3, profileId, month, year);
		$('#printableCon').append(row3);
	};
	
	var addRow4 = function(){
		var row4 = GenerateReportRow(mName4, mCode4, profileId, month, year, true);
		$('#printableCon').append(row4);
	};
	
	var addRow5 = function(){
		var row5 = GenerateReportRow(mName5, mCode5, profileId, month, year, true);
		$('#printableCon').append(row5);
	};
	
	var addRow6 = function(){
		var row6 = GenerateReportRow(mName6, mCode6, profileId, month, year);
		$('#printableCon').append(row6);
	};
	
	var addRow7 = function(){
		var row7 = GenerateReportRow(mName7, mCode7, profileId, month, year, true);
		$('#printableCon').append(row7);
	};
	
	var addRow8 = function(){
		var row8 = GenerateReportRow(mName8, mCode8, profileId, month, year, true);
		$('#printableCon').append(row8);
	};
	
	var addRow9 = function(){
		var row9 = GenerateReportRow(mName9, mCode9, profileId, month, year, true);
		$('#printableCon').append(row9);
	};
	
	timedQueue.add(addRow1,1000);
	timedQueue.add(addRow2,1000);
	timedQueue.add(addRow3,1000);
	timedQueue.add(addRow4,1000);
	timedQueue.add(addRow5,1000);
	timedQueue.add(addRow6,1000);
	timedQueue.add(addRow7,1000);
	timedQueue.add(addRow8,1000);
	timedQueue.add(addRow9,1000);
	timedQueue.start();
}

function GenerateReportRow(rowName, metric, profileId, month, year, pctVal)
{
	var lastMonth = GetPreviousMonth(month);
	var lastYear = year - 1;
	var lmy = lastMonth == 12 ? lastYear : year;
	
	var rowHTML = '<div class="pRow">';
	rowHTML += '<div class="prTitle">' + rowName + '</div>';
	rowHTML += GenerateReportValueCon(month,year,metric,false);
	rowHTML += GenerateReportValueCon(lastMonth,lmy,metric,false);
	rowHTML += GenerateReportValueCon(lastMonth,lmy,metric,true);
	rowHTML += GenerateReportValueCon(month,lastYear,metric,false);
	rowHTML += GenerateReportValueCon(month,lastYear,metric,true);
	rowHTML += '</div>';
	
	queryCoreReportingApi(profileId, month, year, metric, month, year, pctVal);
	queryCoreReportingApi(profileId, lastMonth, lmy, metric, month, year, pctVal);
	queryCoreReportingApi(profileId, month, lastYear, metric, month, year, pctVal);
	
	return rowHTML;
}

function GenerateReportValueCon(month, year, metric, diffVal)
{
	var vHTML = "";
	if(!diffVal)
	{
		var dateText = GetMonthShortName(month) + " " + year;
		var eid = GetElementIdFromMetric(metric, month, year);
		vHTML += '<div class="prVal">';
		vHTML += '<div class="prvDate">' + dateText + '</div>';
		vHTML += '<div class="prvVal" id="' + eid + '"></div>';
	}
	else
	{
		var lText = "DIFF:";
		var eid = "diff-" + GetElementIdFromMetric(metric, month, year);
		vHTML += '<div class="prDiff">';
		vHTML += '<div class="prvDate">' + lText + '</div>';
		vHTML += '<div class="prvVal" id="' + eid + '"></div>';
	}
	vHTML += '</div>';
	return vHTML;
}

function queryCoreReportingApi(profileId, month, year, metric, oMonth, oYear, pctVal) {
  // Query the Core Reporting API 
  var eid = GetElementIdFromMetric(metric, month, year);
  
  gapi.client.analytics.data.ga.get({
    'ids': 'ga:' + profileId,
    'start-date': GetStartDateFormatted(month, year),
    'end-date': GetEndDateFormatted(month, year),
    'metrics': metric
  })
  .then(function(response) {
    //var formattedJson = JSON.stringify(response.result, null, 2);
    //document.getElementById('query-output').value = formattedJson;
	//console.log(response.result.totalsForAllResults[0]);
	var trTemp = response.result.totalsForAllResults;
	for(var i in trTemp)
	{
		var teid = "#" + eid;
		if($(teid))
		{
			var result = trTemp[i];
			if(pctVal)
				result = parseFloat(result).toFixed(1);
			
			$(teid).html(result);
		}
		HandleRowDiff(metric, oMonth, oYear);
		break;
	}
  })
  .then(null, function(err) {
      // Log any errors.
      console.log(err);
  });
}

//CUSTOM FUNCTIONS
//Requires JQuery
function InitApp()
{
	InitAccDropdown();
	InitMonthDropdown();
	InitYearDropdown();
}
function InitAccDropdown()
{
	var o1 = '<option value="' + account1 + '" selected>' + account1 + '</option>';
	var o2 = '<option value="' + account2 + '">' + account2 + '</option>';
	var o3 = '<option value="' + account3+ '">' + account3 + '</option>';
	$("#selAcc").append(o1);
	$("#selAcc").append(o2);
	$("#selAcc").append(o3);
}
function InitMonthDropdown()
{
	var currentTime = new Date();
	var month = currentTime.getMonth() + 1; //0-11
	
	var selMonth = month == 1 ? 12 : month - 1; // we choose the last whole month
	
	for(var i = 1; i <= 12 ; i++)
	{
		var sel = i == selMonth ? "selected" : "";
		var co = '<option value="' + i + '" ' + sel + '>' + i + '</option>';
		$("#selMonth").append(co);
	}
}  
function InitYearDropdown()
{
	var currentTime = new Date();
	var month = currentTime.getMonth() + 1; //0-11
	var year = currentTime.getFullYear();
	
	var cy = month == 1 ? year-1 : year; //only years where at least 1 month passed, starting with current, going 5 back
	
	for(var i = cy; i > cy - 5; i--)
	{
		var sel = i == cy ? "selected" : "";
		var yo = '<option value="' + i + '" ' + sel + '>' + i + '</option>';
		$("#selYear").append(yo);
	}
}

function HandleRowDiff(metric, month, year)
{
	var lastMonth = GetPreviousMonth(month);
	var lmy = lastMonth == 12 ? year - 1 : year;
	
	var idCurrMonth = GetElementIdFromMetric(metric, month, year);
	var idLastMonth = GetElementIdFromMetric(metric, GetPreviousMonth(month), lmy);
	var idLastYear = GetElementIdFromMetric(metric, month, year-1);
	
	var cmVal = $("#" + idCurrMonth).html();
	var lmVal = $("#" + idLastMonth).html();
	var lyVal = $("#" + idLastYear).html();
	
	//console.log(cmVal);
	//console.log(lmVal);
	//console.log(lyVal);
	
	if(cmVal > 0 && lmVal > 0 && lyVal > 0)
	{
		var monthDiff = cmVal - lmVal;
		var mdpct = (monthDiff / lmVal) * 100;
		mdpct = parseFloat(mdpct).toFixed(1);
		
		var yearDiff = cmVal - lyVal;
		var ydpct = (yearDiff / lyVal) * 100;
		ydpct = parseFloat(ydpct).toFixed(1);
		
		var idMdiff = "diff-" + idLastMonth;
		$("#" + idMdiff).html(mdpct + " %");
		
		var idYdiff = "diff-" + idLastYear;
		$("#" + idYdiff).html(ydpct + " %");
	}
}

function daysInMonth (month, year) {
    var dim = new Date(year, month, 0).getDate();
	if(dim.length == 1)
		dim = "0" + dim;
	return dim;
}

function GetStartDateFormatted(month, year)
{
	var m = month.toString().length == 1 ? "0" + month : month;
	return year + "-" + m + "-01";
}
function GetEndDateFormatted(month, year)
{
	var m = month.toString().length == 1 ? "0" + month : month;
	return year + "-" + m + "-" + daysInMonth(month,year);
}
function GetPreviousMonth(month)
{
	return month == 1 ? 12 : month - 1;
}
function GetMonthShortName(month)
{
	if(month == 1)
		return "JAN";
	if(month == 2)
		return "FEB";
	if(month == 3)
		return "MAR";
	if(month == 4)
		return "APR";
	if(month == 5)
		return "MAY";
	if(month == 6)
		return "JUN";
	if(month == 7)
		return "JUL";
	if(month == 8)
		return "AUG";
	if(month == 9)
		return "SEP";
	if(month == 10)
		return "OCT";
	if(month == 11)
		return "NOV";
	if(month == 12)
		return "DEC";
}
function GetElementIdFromMetric(metric, month, year)
{
	var met = metric.substring(3);
	return met + "-" + month + "-" + year;
}
