require("shelljs/global");
const spawn = require("child_process").spawn;
function wSLEEP( ms ) { return new Promise( function( resolve ) { setTimeout( resolve , ms ) } ); }
function wEXEC( wCMD ) {
	var r1 = exec( wCMD , { silent: true , async: false } );
	if ( r1.stderr.length > 1 ) { return r1.stderr; }
	return r1.stdout.trim();
}

// FUNCTIONS
// =================================================================================================
// =================================================================================================
const s1 = "ps aux | grep firefox";
const c1 = "/usr/lib/firefox/firefox";
const c2 = "/bin/sh -c firefox";
function isFirefoxOpen() {
	var r1 = wEXEC( s1 );
	r1 = r1.split("\n").slice( 0 , -2 );
	var rL = r1.length;
	for ( var i = 0; i < rL; ++i ) {
		var rT = r1[i].split(" ");
		var rF = rT[ rT.length - 1 ];
		if ( rF === c1 || rF === c2 ) { return true; }
	}
	return false;
}

const s2 = "sudo pkill -9 firefox";
function killFirefox() { return wEXEC( s2 ); }

const s3 = 'require("shelljs/global"),exec("firefox &",{silent:!0,async:!1});';
function launchFirefox() {
	return new Promise( async function( resolve , reject ) {
		try {
			if ( isFirefoxOpen() ) { killFirefox(); await wSLEEP( 1000 ); }
			var wPROC = spawn( "node" , [ "-e" , s3 ] , { stdio: "ignore" , detatched: true } );
			wPROC.unref();
			resolve();
		}
		catch( error ) { console.log( error ); reject( error ); }
	});	
}

const s4 = "firefox -new-tab ";
function openNewTab( wURL ) {
	return new Promise( async function( resolve , reject ) {
		try {
			if ( !isFirefoxOpen() ) { await launchFirefox(); await wSLEEP( 3000 ); }
			var r1 = wEXEC( s4 + wURL ); 
			resolve( r1 );
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}
// =================================================================================================
// =================================================================================================


module.exports.open = openNewTab;