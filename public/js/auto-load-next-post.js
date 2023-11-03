// Variables
// var version             = auto_load_next_post_params.alnp_version,
    // content_container   = auto_load_next_post_params.alnp_content_container,
    // post_title_selector = auto_load_next_post_params.alnp_title_selector,
    // nav_container       = auto_load_next_post_params.alnp_navigation_container,
    // comments_container  = auto_load_next_post_params.alnp_comments_container,
    // remove_comments     = auto_load_next_post_params.alnp_remove_comments,
    // track_pageviews     = auto_load_next_post_params.alnp_google_analytics,
    // is_customizer       = auto_load_next_post_params.alnp_is_customizer,
    // is_mobile           = auto_load_next_post_params.alnp_is_mobile,
    // event_on_load       = auto_load_next_post_params.alnp_event_on_load,
    // event_on_entering   = auto_load_next_post_params.alnp_event_on_entering,
var content_container   = '#loop-container',
    nav_container       = '.post-content',
    post_title_selector = '.post-title',
    is_customizer       = 'no',
	  track_pageviews     = 'yes',
    event_on_load       = '',
    event_on_entering   = '',
    post_title          = window.document.title,
    curr_url            = window.location.href,
    orig_curr_url       = window.location.href,
    remove_comments		= 'no',
    post_count          = 0,
    post_url            = curr_url,
    overridden_post_url = '',
    stop_reading        = false,
    scroll_up           = false,
    article_container   = 'article',
    post_list           = [],
    current_post_index  = 0;
    current_search_page = 1;
    // ready               = auto_load_next_post_params.alnp_load_in_footer,
    // disable_mobile      = auto_load_next_post_params.alnp_disable_mobile;

function get_search_results ($) {
  // TODO: try to get an "al-" tag
  var search_term;
  try {
    search_term = $($("[data-article-tags]")[0]).attr('data-article-tags').split(', ')[0];
    if (search_term === "ARTICLE_TOPIC1") {
      search_term = location.host === "thehardtimes.net" ? "punk" : "gaming";
    }
  } catch (err) {
    console.error('Failed to get article tags, falling back');
    search_term = location.host === "thehardtimes.net" ? "punk" : "gaming";
  }

  console.log('search-term=', search_term);
  $.get(location.origin + `/page/${current_search_page}/?s=${search_term}` , function( data ) {
    const posts = $(data).find('h2.post-title').find('a');
    for (let post of posts) {
      var href = $(post).attr('href');
      console.log('post to load=', href);
      post_list.push(href);
    }

    current_search_page++;
  });
}

(function($) {

	// Ensure auto_load_next_post_params exists to continue.
	// if ( typeof auto_load_next_post_params === 'undefined' ) {
	// 	return false;
	// }

	// TODO: reinstate?
	// Stop Auto Load Next Post from running if disabled for mobile devices.
	// if ( is_mobile == 'yes' && disable_mobile ) {
	// 	return false;
	// }

	/**
	 * Ensure the main required selectors are set before continuing.
	 *
	 * 1. Content Container
	 * 2. Post Title
	 * 3. Post Navigation
	 */
	if ( content_container.length <= 0 ) {
		return false;
	}

	if ( post_title_selector.length <= 0 ) {
		return false;
	}

	if ( nav_container.length <= 0 ) {
		return false;
	}

	// Do we load right away or wait until the page has finished loading?
	$( document ).ready(function () {
		run_alnp();
	});

	// Run Auto Load Next Post.
	// if ( ready ) {
	// 	run_alnp();
	// }

	// This function runs the Auto Load Next Post script.
	function run_alnp() {
		console.log('running alnp script');
		if ( $( 'article' ).length <= 0 ) {
			article_container = 'div';
		}

		// Don't do anything if post was loaded looking for comments.
		if ( orig_curr_url.indexOf( '#comments' ) > -1 || orig_curr_url.match(/#comment-*([0-9]+)/) ) {
			return;
		}

		// Don't do anything if post was loaded to post a comment.
		if ( orig_curr_url.indexOf( '#respond' ) > -1 ) {
			return;
		}

		// Add a post divider.
		$( content_container ).prepend( '<hr style="height:0px;margin:0px;padding:0px;border:none;" data-powered-by="alnp" data-initial-post="true" data-title="' + post_title + '" data-url="' + orig_curr_url + '"/>' );
		// $( '#loop-container' ).prepend( '<hr style="height:0px;margin:0px;padding:0px;border:none;" data-powered-by="alnp" data-initial-post="true" data-title="' + post_title + '" data-url="' + orig_curr_url + '"/>' );

		// Mark the first article as the initial post.
		$( content_container ).find( article_container ).attr( 'data-initial-post', true );
		// $( '#loop-container' ).find( article_container ).attr( 'data-initial-post', true );

		// Find the post ID of the initial loaded article.
		var initial_post_id = $( content_container ).find( article_container ).attr( 'id' );
		// var initial_post_id = $( '#loop-container' ).find( article_container ).attr( 'id' );
		// var initial_post_id = initial_post_classes.find(el => el.includes('post-'));

		// Apply post ID to the first post divider if found.
		if ( typeof initial_post_id !== 'undefined' && initial_post_id.length > 0 ) {
			initial_post_id = initial_post_id.replace( 'post-', '' ); // Make sure that only the post ID remains.
			$( content_container ).find( 'article[data-initial-post]' ).prev().attr( 'data-post-id', initial_post_id );
		}

		// Remove Comments.
		if ( remove_comments === 'yes' ) {
			$( comments_container ).remove();

			// Remove Disqus comments if found.
			if ( $( '#disqus_thread' ).length > 0 ) {
				$( '#disqus_thread' ).remove();
			}
		}

		// Get list of posts to load
		// TODO: try to get tags (for prod), then try to get a search
		get_search_results($)

		// Initialise scrollSpy
		console.log('initializing scrollspy');
		scrollspy();

		/**
		 * Track pageviews with Google Analytics.
		 *
		 * It will first detect if Google Analytics is installed before
		 * attempting to send a pageview.
		 *
		 * The tracker detects both classic and universal tracking methods.
		 *
		 * Also supports Google Analytics by Monster Insights should it be used.
		 */
		$( 'body' ).on( 'alnp-post-changed', function( e, post_title, post_url, post_id, post_count, stop_reading ) {
			if ( track_pageviews != 'yes' ) {
				return;
			}

			// If we are previewing in the customizer then dont track.
			if ( is_customizer == 'yes' ) {
				return;
			}

			if ( typeof _gaq === 'undefined' && typeof ga === 'undefined' && typeof __gaTracker === 'undefined' ) {
				return;
			}

			// Clean Post URL before tracking.
			post_url = post_url.replace(/https?:\/\/[^\/]+/i, '');

			// This uses Google's classic Google Analytics tracking method.
			if ( typeof _gaq !== 'undefined' && _gaq !== null ) {
				_gaq.push(['_trackPageview', post_url]);
			}

			// This uses Google Analytics Universal Analytics tracking method.
			if ( typeof ga !== 'undefined' && ga !== null ) {
				ga( 'send', 'pageview', post_url );
			}

			// This uses Monster Insights method of tracking Google Analytics.
			if ( typeof __gaTracker !== 'undefined' && __gaTracker !== null ) {
				__gaTracker( 'send', 'pageview', post_url );
			}
		});

		// If the browser back button is pressed or the user scrolled up then change history state.
		$( 'body' ).on( 'mousewheel', function( e ) {
			scroll_up = e.originalEvent.wheelDelta > 0;
		});

		// Update the History ONLY if we are NOT in the customizer.
		if ( ! is_customizer ) {
			// Note: We are using statechange instead of popstate
			History.Adapter.bind( window, 'statechange', function() {
				var state = History.getState(); // Note: We are using History.getState() instead of event.state

				// If they returned back to the first post, then when you click the back button go to the url from which they came.
				if ( scroll_up ) {
					var states = History.savedStates;
					var prev_state_index = states.length - 2;
					var prev_state = states[prev_state_index];

					if ( prev_state.url === orig_curr_url ) {
						window.location = document.referrer;
						return;
					}
				}

				// If the previous URL does not match the current URL then go back.
				if ( state.url != curr_url ) {
					var previous_post = $( 'hr[data-url="' + state.url + '"]' ).next( article_container ).find( post_title_selector );

					// Is there a previous post?
					if ( previous_post.length > 0 ) {
						var previous_post_title = previous_post[0].dataset.title;

						History.pushState(null, previous_post_title, state.url);

						// Scroll to the top of the previous article.
						$( 'html, body' ).animate({ scrollTop: (previous_post.offset().top - 100) }, 1000, function() {
							$( 'body' ).trigger( 'alnp-previous-post', [ previous_post ] );
						});
					}
				}
			});
		}
	} // END run_alnp()

	/**
	 * ScrollSpy.
	 *
	 * 1. Load a new post once the post comes near the end.
	 * 2. If a new post has loaded and comes into view, change the URL in the browser
	 *    address bar and the post title for history.
	 *
	 * This is done by looking for the post divider.
	 */
	function scrollspy() {
		console.log('call scrollspy');
		// Do not enter once the initial post has loaded.
		if ( post_count > 0 ) {
			$( 'hr[data-powered-by="alnp"]' ).on( 'scrollSpy:enter', alnp_enter );
		}

		$( 'hr[data-powered-by="alnp"]' ).on( 'scrollSpy:exit', alnp_leave ); // Loads next post.
		$( 'hr[data-powered-by="alnp"]' ).scrollSpy();
		console.log('scrollspy called');
	} // END scrollspy()

	// Trigger multiple events
	function triggerEvents(events, params) {
		if (typeof events !== 'string') return;

		var body = jQuery( 'body' );

		events = events.split(',');

		for (var i = 0; i < events.length; i++) {
			//support all browsers, "replace" instead of "trim"
			events[i] = events[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
			body.trigger(events[i], params);
		}

		return this;
	}

	// Entering a post
	function alnp_enter() {
		console.log('alnp_enter triggered');
		var divider = $(this);

		$( 'body' ).trigger( 'alnp-enter', [ divider ] );

		triggerEvents(event_on_entering, [ divider ]);

		changePost( divider, 'enter' );
	} // END alnp_enter()

	// Leaving a post
	function alnp_leave() {
		console.log('alnp_leave triggered');
		var divider = $(this);

		$( 'body' ).trigger( 'alnp-leave', [ divider ] );

		changePost( divider, 'leave' );
	} // END alnp_leave()

	// Change Post
	function changePost( divider, $direction ) {
		console.log('changepost running');
		var el           = $(divider);
		var this_url     = el.attr( 'data-url' );
		var this_title   = el.attr( 'data-title' );
		var this_post_id = el.attr( 'data-post-id' );
		var initial_post = el.attr( 'data-initial-post' );
		var offset       = el.offset();
		var scrollTop    = $( document ).scrollTop();

		// If exiting or entering from the top, then change the URL.
		if ( ( offset.top - scrollTop ) <= 200 && curr_url != this_url ) {
			curr_url = this_url;

			// Update the History ONLY if we are NOT in the customizer.
			if ( ! is_customizer ) {
				History.pushState(null, this_title, this_url);
			}

			$( 'body' ).trigger( 'alnp-post-changed', [ this_title, this_url, this_post_id, post_count, stop_reading, initial_post ] );
		}

		// Look for the next post to load if any when leaving previous post.
		if ( $direction == 'leave' ) {
			console.log('leaving post');
			auto_load_next_post();
		}
	} // END changePost()

	/**
	 * This is the main function.
	 */
	function auto_load_next_post() {
    post_url = post_list[current_post_index];

		// If the user can not read any more then stop looking for new posts.
		if ( stop_reading ) {
			console.log('stop reading');
			return;
		}

		// This helps prevent causing an undefined URL.
		if ( $( nav_container ).length <= 0 ) {
			console.log('nav_container length 0');
			return;
		}

		console.log('post-url=', post_url);
		// Override the post url via a trigger.
		$( 'body' ).trigger( 'alnp-post-url', [ post_count, post_url ] );

		// If the post navigation is not found then dont continue.
		if ( !post_url ) return;

		// Define next post URL to load.
		var np_url = '';
		console.log('np_url=', np_url);

		$.get( post_url , function( data ) {
			var postData = $(data).find(content_container);
			var post = $( "<div>" + postData.html() + "</div>" );

			// Allows the post data to be modified before being appended.
			$( 'body' ).trigger( 'alnp-post-data', [ post ] );
			data = post.html(); // Returns the HTML data of the next post that was loaded.

      // Increment post index. Reset if list is out of bounds.
      if (current_post_index >= post_list.length - 1) {
        current_post_index = 0;
        get_search_results($);
      } else {
        current_post_index++;
      }

			var post_divider = '<hr style="height:0px;margin:0px;padding:0px;border:none;" data-powered-by="alnp" data-initial-post="false" data-url="' + post_url + '"/>';
			var post_html    = $( post_divider + data );
			var post_title   = post_html.find( post_title_selector ); // Find the post title of the loaded article.
			var post_ID      = $( post ).find( article_container ).attr( 'id' ); // Find the post ID of the loaded article.
			var triggerParams = [ post_title.text(), post_url, post_ID, post_count ];

			if ( typeof post_ID !== typeof undefined && post_ID !== "" ) {
				post_ID = post_ID.replace( 'post-', '' ); // Make sure that only the post ID remains.
			}

			$( content_container ).append( post_html ); // Add next post.

			$( article_container + '[id="post-' + post_ID + '"]' ).attr( 'data-initial-post', false ); // Set article as not the initial post.

			// Remove Comments.
			if ( remove_comments === 'yes' ) {
				$( comments_container ).remove();

				// Remove Disqus comments if found.
				if ( $( '#disqus_thread' ).length > 0 ) {
					$( '#disqus_thread' ).remove();
				}
			}

			// Get the hidden "HR" element and add the missing post title and post id attributes.
			$( 'hr[data-url="' + post_url + '"]').attr( 'data-title', post_title.text() ).attr( 'data-post-id', post_ID );

			scrollspy(); // Need to set up ScrollSpy now that the new content has loaded.

			post_count = post_count+1; // Updates the post count.

			// Run an event once the post has loaded.
			$( 'body' ).trigger( 'alnp-post-loaded', triggerParams );

			// Trigger user defined events
			triggerEvents(event_on_load, triggerParams);
		});

	} // END auto_load_next_post()

})(jQuery);
