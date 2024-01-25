<?php
/**
 * Hello World
 *
 * @package     HardTimesAutoLoadNextPost
 * @author      Nathan Lie
 *
 * @wordpress-plugin
 * Plugin Name: Hard Autoloader
 * Description: Automatically loads posts for Hard Drive & associated sites.
 * Version:     1.0.0
 * Author:      Nathan Lie
 * Author URI:  https://github.com/njlie
 */

define( 'HT_ALNP_URL', plugins_url( '/', __FILE__ ) );

class Hard_Times_ALNP {
	// Refers to a single instance of this class
	private static $instance = null;

	/**
	 * Creates or returns a single instance of this class
	 * 
	 * @return HT_ALNP a single instance of this class
	 */
	public static function get_instance() {
		if ( null == self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * Initialize plugin functionalities
	 */
	private function __construct() {
		add_action( 'wp_enqueue_scripts', [ $this, 'public_scripts']);
	}

	/**
	 * Enqueue public scripts
	 */
	public function public_scripts() {
		wp_enqueue_script( 'ht-alnp-scroll-spy', HT_ALNP_URL . 'public/js/scrollspy.min.js', array('jquery') );
		wp_enqueue_script( 'ht-alnp', HT_ALNP_URL . 'public/js/auto-load-next-post.js', array('jquery') );

	}
}

Hard_Times_ALNP::get_instance();
