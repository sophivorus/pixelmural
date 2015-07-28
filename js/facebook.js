$( function () {

	FB.init({
		appId: '793373170775420',
		xfbml: true,
		status: true,
		cookie: true,
		version: 'v2.4'
	});

	FB.getLoginStatus( statusChangeCallback );

	$( '#facebook-login-button' ).click( function () {
		FB.login( statusChangeCallback );
	});

	$( '#facebook-logout-button' ).click( function () {
		FB.logout( statusChangeCallback );
	});

	$( '#facebook-share-button' ).click( function () {
		FB.XFBML.parse(); // Update the URL to be shared
		FB.ui({ 'method': 'share', 'href': location.href });
	});
});

function statusChangeCallback( response ) {
	//console.log( response );

	$.get( 'Users', function ( response ) {
		//console.log( response );

		gUser = new User( response ); // Update the global user

		menu.updateButtons();

		$( '#price-tag' ).click( function () {
			FB.ui({
				method: 'pay',
				action: 'purchaseitem',
				product: 'https://pixelmural.com/brush.html',
			}, verifyPayment );
		});
	});
}

function verifyPayment( data ) {
	//console.log( data );

	if ( !data || data.error_code === 1151 ) {
		return menu.showAlert( 'You can only buy the brush from within the Facebook app. <a href="https://apps.facebook.com/pixelmural/">Click here to go to the Facebook app!</a>' );
	}

	$.post( 'FacebookPayments', data, function ( response ) {
		//console.log( response );

		if ( response === 'completed' ) {
			gUser.brush = 1;
			menu.updateButtons();
			menu.showAlert( 'Payment complete, thanks! You now have the brush.', 3000 );
		}
	});
}